import { NextRequest, NextResponse } from 'next/server';
import api from '@/services/api';

// Forward GET requests to backend
export async function GET(request: NextRequest) {
  try {
    // Get the API base URL for server-side
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002/api';
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/advice`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    
    // Fallback to in-memory data if backend is not available
    return NextResponse.json({
      status: 'success',
      data: [
        {
          id: '1',
          name: 'Sarah Johnson',
          role: 'Senior Frontend Developer',
          message: 'Focus on accessibility in everything you build. It\'s not just the right thing to do, it\'s also good for business.',
          timestamp: Date.now() - 3600000 * 24 * 5,
        },
        {
          id: '2',
          name: 'Michael Chen',
          role: 'UX Designer',
          message: 'Don\'t forget about mobile users! Always design and test for mobile first.',
          timestamp: Date.now() - 3600000 * 24 * 3,
        },
        {
          id: '3',
          name: 'Jessica Torres',
          role: 'Tech Recruiter',
          message: 'Your projects show technical skill, but make sure to highlight the problems they solve. That\'s what employers care about.',
          timestamp: Date.now() - 3600000 * 24 * 1,
        }
      ],
    });
  }
}

// Forward POST requests to backend
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Get the API base URL for server-side
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002/api';
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    
    // Return error response
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create advice entry. Is the backend server running?',
    }, { status: 500 });
  }
} 