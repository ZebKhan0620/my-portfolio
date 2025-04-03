import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { createLogger } from '@/lib/logging';

// Create a logger for advice API
const logger = createLogger('advice-api');

// GET handler to retrieve all advice
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const advice = await db.collection('advice')
      .find({})
      .sort({ timestamp: -1 }) // Sort by newest first
      .toArray();
    
    logger.info('Successfully retrieved advice entries');
    return NextResponse.json({ data: advice });
  } catch (error) {
    logger.error('Error fetching advice', error);
    return NextResponse.json(
      { error: 'Failed to fetch advice' },
      { status: 500 }
    );
  }
}

// POST handler to create new advice
export async function POST(request: Request) {
  try {
    logger.info('Processing new advice submission');
    const { db } = await connectToDatabase();
    const body = await request.json();
    
    const { name, message, role } = body;
    
    // Validate required fields
    if (!name?.trim() || !message?.trim()) {
      logger.warn('Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }
    
    // Validate field lengths
    if (name.length > 100) {
      logger.warn('Validation failed: Name too long');
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      );
    }
    
    if (message.length > 1000) {
      logger.warn('Validation failed: Message too long');
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
    logger.info('Successfully created new advice entry');
    
    return NextResponse.json({
      data: {
        _id: result.insertedId,
        ...advice
      }
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating advice', error);
    return NextResponse.json(
      { error: 'Failed to create advice' },
      { status: 500 }
    );
  }
} 