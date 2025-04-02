import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// GET handler to retrieve all advice
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const advice = await db.collection('advice')
      .find({})
      .sort({ timestamp: -1 }) // Sort by newest first
      .toArray();
    
    return NextResponse.json({ data: advice });
  } catch (error) {
    console.error('Error fetching advice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advice' },
      { status: 500 }
    );
  }
}

// POST handler to create new advice
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { name, message, role } = body;
    
    // Validate required fields
    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }
    
    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      );
    }
    
    if (message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be less than 1000 characters' },
        { status: 400 }
      );
    }
    
    const timestamp = Date.now();
    const advice = {
      name: name.trim(),
      message: message.trim(),
      role: role?.trim() || '',
      timestamp,
      createdAt: new Date()
    };
    
    const result = await db.collection('advice').insertOne(advice);
    
    return NextResponse.json({
      data: {
        _id: result.insertedId,
        ...advice
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating advice:', error);
    return NextResponse.json(
      { error: 'Failed to create advice' },
      { status: 500 }
    );
  }
} 