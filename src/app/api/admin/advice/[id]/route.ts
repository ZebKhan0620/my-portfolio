import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdminKey } from '@/lib/adminAuth';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || !verifyAdminKey(adminKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid advice ID' },
        { status: 400 }
      );
    }

    // Convert string ID to MongoDB ObjectId
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid advice ID format' },
        { status: 400 }
      );
    }

    // Delete the advice entry
    const result = await db.collection('advice').deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Advice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting advice:', error);
    return NextResponse.json(
      { error: 'Failed to delete advice' },
      { status: 500 }
    );
  }
} 