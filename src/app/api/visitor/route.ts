import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// Constants for milestone detection
const MILESTONES = [10, 20, 30, 50, 100, 200, 500, 1000];

// GET handler to retrieve current visitor count
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Get the visitor counter document
    const counterDoc = await db.collection('stats').findOne({ key: 'visitor_counter' });
    
    // If counter doesn't exist yet, return 0
    if (!counterDoc) {
      return NextResponse.json({ count: 0, isMilestone: false });
    }
    
    return NextResponse.json({
      count: counterDoc.count,
      isMilestone: false
    });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor count' },
      { status: 500 }
    );
  }
}

// POST handler to increment the visitor count
export async function POST() {
  try {
    const { db } = await connectToDatabase();
    
    // Find and update the counter, or create if it doesn't exist
    const result = await db.collection('stats').findOneAndUpdate(
      { key: 'visitor_counter' },
      { $inc: { count: 1 } },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to update visitor count' },
        { status: 500 }
      );
    }
    
    const count = result.count;
    const isMilestone = MILESTONES.includes(count);
    
    return NextResponse.json({
      count,
      isMilestone
    });
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return NextResponse.json(
      { error: 'Failed to increment visitor count' },
      { status: 500 }
    );
  }
} 