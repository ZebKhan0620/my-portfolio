import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Document, WithId } from 'mongodb';

// Use the admin password from environment variables
const ADMIN_KEY = process.env.ADMIN_PASSWORD || 'Khanzeb@@122';

export async function GET(request: NextRequest) {
  // Check for admin key in headers
  const adminKey = request.headers.get('x-admin-key');
  
  if (!adminKey || adminKey !== ADMIN_KEY) {
    console.error('Unauthorized admin access attempt');
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }
  
  try {
    console.log('Admin contacts API: Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Admin contacts API: MongoDB connection successful');
    
    const db = client.db('portfolio');
    console.log('Admin contacts API: Fetching contacts...');
    
    // Get all contacts sorted by newest first
    const contacts = await db
      .collection('contacts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`Admin contacts API: Found ${contacts.length} contacts`);
    
    // Map MongoDB _id to id for consistency
    const formattedContacts = contacts.map((contact: WithId<Document>) => ({
      id: contact._id.toString(),
      name: contact.name as string,
      email: contact.email as string,
      message: contact.message as string,
      createdAt: contact.createdAt as string | Date
    }));
    
    return NextResponse.json({ 
      success: true, 
      data: formattedContacts 
    });
    
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch contacts',
        message: error.message || 'Unknown database error'
      }, 
      { status: 500 }
    );
  }
} 