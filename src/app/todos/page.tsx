'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';


interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt');
  
  const { user, logout } = useAuth();
  
  // Fetch todos on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchTodos();
    }
  }, []);
  
  // Effect to update existing todos with priority if needed
  useEffect(() => {
    const updateTodosWithMissingFields = async () => {
      try {
        // Find todos without priority and update them
        const todosToUpdate = todos.filter(todo => !todo.priority);
        
        if (todosToUpdate.length > 0) {
          console.log(`Updating ${todosToUpdate.length} todos with default priority`);
          
          for (const todo of todosToUpdate) {
            await axios.put(`/api/todos/${todo._id}`, {
              priority: 'medium'
            });
          }
          
          // Refresh todos after updates
          await fetchTodos();
        }
      } catch (err) {
        console.error('Error updating todos with default priority:', err);
      }
    };
    
    if (todos.length > 0) {
      updateTodosWithMissingFields();
    }
  }, [todos.length]); // Only run when todos length changes
  
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/todos');
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to fetch todos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setIsAdding(true);
      setError('');
      
      const response = await axios.post('/api/todos', {
        title,
        description: description || undefined,
        priority,
        dueDate: dueDate || undefined,
      });
      
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        completed: !completed,
      });
      
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, completed: !completed } : todo))
      );
    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: 'low' | 'medium' | 'high') => {
    try {
      const response = await axios.put(`/api/todos/${id}`, {
        priority: newPriority,
      });
      
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, priority: newPriority } : todo))
      );
    } catch (err) {
      console.error('Error updating todo priority:', err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'priority') {
      const priorityValues = { low: 1, medium: 2, high: 3 };
      const aPriority = a.priority || 'medium';
      const bPriority = b.priority || 'medium';
      return priorityValues[bPriority] - priorityValues[aPriority];
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hello, {user.name}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow text-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Todo</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleAddTodo}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                placeholder="Enter todo title"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                rows={3}
                placeholder="Enter todo description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dueDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isAdding}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isAdding && 'opacity-70 cursor-not-allowed'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add Todo'}
            </button>
          </form>
        </div>
        
        <div className="bg-white shadow text-zinc-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold mb-2 md:mb-0">Your Todos</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div>
                <label htmlFor="filter" className="text-sm text-gray-600 mr-2">Filter:</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                  className="border rounded p-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="sortBy" className="text-sm text-gray-600 mr-2">Sort by:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'priority' | 'dueDate')}
                  className="border rounded p-1 text-sm"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="priority">Priority</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : sortedTodos.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">No todos match your filter. Add one above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedTodos.map((todo) => (
                <li key={todo._id} className="py-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex items-start space-x-3 mb-2 md:mb-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo._id, todo.completed)}
                        className="h-5 w-5 mt-1 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`text-lg font-medium ${
                              todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                            }`}
                          >
                            {todo.title || 'Untitled Todo'}
                          </h3>
                          {todo && (
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(todo.priority || 'medium')}`}>
                              {todo.priority ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1) : 'Medium'}
                            </span>
                          )}
                        </div>
                        
                        {todo.description && (
                          <p
                            className={`text-sm mt-1 ${
                              todo.completed ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap mt-2 space-x-2 text-xs text-gray-500">
                          <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                          {todo.dueDate && (
                            <span className={`${
                              new Date(todo.dueDate) < new Date() && !todo.completed 
                                ? 'text-red-600 font-bold' 
                                : ''
                            }`}>
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2 md:mt-0">
                      <div className="relative group">
                        <button className="px-2 py-1 text-sm border rounded hover:bg-gray-50">
                          Priority
                        </button>
                        <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg hidden group-hover:block z-10">
                          <button
                            onClick={() => handleUpdatePriority(todo._id, 'low')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Low
                          </button>
                          <button
                            onClick={() => handleUpdatePriority(todo._id, 'medium')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Medium
                          </button>
                          <button
                            onClick={() => handleUpdatePriority(todo._id, 'high')}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            High
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="px-2 py-1 text-sm border border-red-300 rounded text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
