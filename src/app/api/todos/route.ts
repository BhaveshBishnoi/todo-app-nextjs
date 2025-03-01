import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Todo from '@/models/Todo';
import { verifyJwtToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// Helper function to get user ID from token
const getUserId = () => {
  const token = cookies().get('token')?.value || '';
  const decoded: any = verifyJwtToken(token);
  return decoded?.userId;
};

// Get all todos for a user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const todos = await Todo.find({ user: userId }).sort({ createdAt: -1 });
    
    return NextResponse.json(todos);
  } catch (error: any) {
    console.error('Get todos error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Create a new todo
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, priority, dueDate } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const todo = await Todo.create({
      title,
      description: description || undefined,
      priority: priority || 'medium',
      dueDate: dueDate || undefined,
      user: userId,
    });
    
    return NextResponse.json(todo, { status: 201 });
  } catch (error: any) {
    console.error('Create todo error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
