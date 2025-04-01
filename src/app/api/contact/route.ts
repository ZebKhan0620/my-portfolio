import { NextRequest, NextResponse } from 'next/server';

// POST handler for contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

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

    // In a real application, you would send an email here
    // For now we'll just simulate a successful submission
    console.log('Contact form submission:', { name, email, message });

    // Return success response
    return NextResponse.json({
      status: 'success',
      message: 'Thank you for your message! I will get back to you soon.',
      data: {
        id: Date.now().toString(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process your message. Please try again later.',
    }, { status: 500 });
  }
} 