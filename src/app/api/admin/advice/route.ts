import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdminKey } from '@/lib/adminAuth';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication using the correct method
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || !verifyAdminKey(adminKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const adviceEntries = await db.collection('advice').find({}).sort({ timestamp: -1 }).toArray();
    
    // Transform field names to match what frontend expects
    const transformedEntries = adviceEntries.map(entry => ({
      _id: entry._id.toString(),                // Ensure _id is a string
      name: entry.name || '',                   // Keep name as is
      advice: entry.message || '',              // Transform message to advice
      timestamp: entry.timestamp || entry.createdAt, // Use timestamp or fall back to createdAt
      role: entry.role || ''                    // Include role field for reference
    }));
    
    return NextResponse.json(transformedEntries);
  } catch (error) {
    console.error('Error fetching advice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advice entries' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication using the correct method
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || !verifyAdminKey(adminKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the ID from the URL search params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection('advice').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Advice entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Advice entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting advice:', error);
    return NextResponse.json(
      { error: 'Failed to delete advice entry' },
      { status: 500 }
    );
  }
} 