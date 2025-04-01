import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// POST handler for contact form
export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission received');
    const body = await request.json();
    const { name, email, message } = body;
    console.log('Form data:', { name, email, message });

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({
        status: 'error',
        message: 'Name, email, and message are required',
      }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid email format',
      }, { status: 400 });
    }

    // Store in MongoDB
    try {
      console.log('Connecting to MongoDB...');
      const client = await clientPromise;
      console.log('MongoDB connection successful');
      
      const db = client.db("portfolio");
      console.log('Attempting to insert into contacts collection');
      
      const contact = await db.collection("contacts").insertOne({
        name,
        email,
        message,
        createdAt: new Date(),
      });
      console.log('Contact saved successfully with ID:', contact.insertedId.toString());

      // Return success response
      return NextResponse.json({
        status: 'success',
        message: 'Thank you for your message! I will get back to you soon.',
        data: {
          id: contact.insertedId.toString(),
          name,
          email,
          message,
          createdAt: new Date().toISOString(),
        }
      }, { status: 201 });
    } catch (dbError: any) {
      console.error('MongoDB Error:', dbError);
      throw new Error(`MongoDB operation failed: ${dbError.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process your message. Please try again later.',
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 