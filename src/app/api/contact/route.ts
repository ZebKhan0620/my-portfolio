import { NextRequest, NextResponse } from 'next/server';

// POST handler for contact form - forwards to real backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get the API base URL for server-side
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002/api';
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response from the backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    
    // Return error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process your message. Is the backend server running?',
    }, { status: 500 });
  }
} 