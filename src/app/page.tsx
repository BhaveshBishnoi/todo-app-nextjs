import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <main className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </Link>
          
          <Link
            href="/register"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create an Account
          </Link>
        </div>
        
        <div className="text-center text-sm">
          <p className="text-gray-500">
            A full-stack Next.js application with MongoDB and JWT authentication
          </p>
        </div>
      </main>
    </div>
  );
}
