import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createLogger } from '@/lib/logging';

// Create a logger for contact form
const logger = createLogger('contact-api');

// POST handler for contact form
export async function POST(request: NextRequest) {
  try {
    logger.info('Contact form submission received');
    const body = await request.json();
    const { name, email, message } = body;
    
    // Don't log personal data in production
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Form data received', { name, email: email.slice(0, 3) + '***' });
    }

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
      logger.info('Connecting to MongoDB...');
      const client = await clientPromise;
      
      const db = client.db("portfolio");
      logger.info('Saving contact form data');
      
      const contact = await db.collection("contacts").insertOne({
        name,
        email,
        message,
        createdAt: new Date(),
      });
      logger.info('Contact saved successfully');

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
      logger.error('MongoDB Error', { error: dbError.message });
      throw new Error(`MongoDB operation failed: ${dbError.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    logger.error('Contact form error', { error: error.message });
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process your message. Please try again later.',
    }, { status: 500 });
  }
} 