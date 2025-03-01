# Next.js Todo App

A full-stack todo application built with Next.js, MongoDB, and JWT authentication. This app helps you manage your tasks with a clean, modern interface and powerful features.

## Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication with HTTP-only cookies
  - Protected routes and API endpoints

- **Todo Management**
  - Create, view, update, and delete todos
  - Mark todos as complete/incomplete
  - Set priority levels (low, medium, high)
  - Add due dates to track deadlines
  - Add descriptions for detailed task information

- **Advanced Organization**
  - Filter todos by status (all, active, completed)
  - Sort by creation date, priority, or due date
  - Visual indicators for priority levels
  - Overdue task highlighting

- **Responsive Design**
  - Mobile-friendly interface
  - Clean, modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Axios
- **Backend**: Next.js API Routes (Alternative of Express)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs, HTTP-only cookies
- **Styling**: Tailwind CSS for responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas connection)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/bhaveshbishnoi/todo-app-nextjs.git
   cd todo-app-nextjs
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Register or Login**: Create a new account or login with existing credentials
2. **Create Todos**: Add new tasks with optional descriptions, priority levels, and due dates
3. **Manage Todos**: Mark tasks as complete, update priority, or delete them
4. **Organize**: Filter and sort your todos to focus on what matters

## Project Structure

- **/src/app**: Next.js app directory with page components and API routes
- **/src/context**: React context for authentication state management
- **/src/lib**: Utility functions for database connection and JWT handling
- **/src/models**: Mongoose models for User and Todo schemas


