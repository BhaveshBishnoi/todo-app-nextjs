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

// Get a single todo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const todo = await Todo.findOne({ _id: params.id, user: userId });
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error: any) {
    console.error('Get todo error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Update a todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, completed, priority, dueDate } = body;
    
    // Prepare the update object with only defined fields
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    
    const todo = await Todo.findOneAndUpdate(
      { _id: params.id, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error: any) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// Delete a todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const userId = getUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const todo = await Todo.findOneAndDelete({ _id: params.id, user: userId });
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error: any) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
