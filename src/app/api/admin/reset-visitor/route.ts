import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdminKey } from '@/lib/adminAuth';

// POST handler to reset visitor count
export async function POST(request: NextRequest) {
  // Check admin authentication
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || !verifyAdminKey(adminKey)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    
    // Update the counter to zero (or delete and recreate if preferred)
    await db.collection('stats').updateOne(
      { key: 'visitor_counter' },
      { $set: { count: 0 } },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Visitor counter reset successfully'
    });
  } catch (error) {
    console.error('Error resetting visitor count:', error);
    return NextResponse.json(
      { error: 'Failed to reset visitor count' },
      { status: 500 }
    );
  }
} 