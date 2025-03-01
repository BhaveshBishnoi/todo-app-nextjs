'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    if (typeof window !== 'undefined') {
      const checkAuth = async () => {
        try {
          // For client-side compatibility, first check localStorage
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Try to get current user from the server
            try {
              const response = await axios.get('/api/auth/me');
              if (response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user));
              }
            } catch (error) {
              // If server check fails, user is not authenticated
              console.log('User not authenticated');
            }
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    } else {
      // On server side, just set loading to false
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.user) {
        // Store user data in localStorage for client-side access
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setUser(response.data.user);
        router.push('/todos');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', { name, email, password });
      
      if (response.data.user) {
        // Store user data in localStorage for client-side access
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        setUser(response.data.user);
        router.push('/todos');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Call the logout API to clear the HTTP cookie
      await axios.get('/api/auth/logout');
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
