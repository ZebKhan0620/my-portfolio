import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/adminAuth';

// Simple rate limiting implementation for admin login
const RATE_LIMIT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number, timestamp: number }>();

// Helper to clean up expired rate limit entries
function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.timestamp > RATE_LIMIT_DURATION) {
      loginAttempts.delete(ip);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Clean up expired rate limits
    cleanupRateLimits();
    
    // Check for rate limiting
    const attempts = loginAttempts.get(ip);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeLeft = Math.ceil((RATE_LIMIT_DURATION - (Date.now() - attempts.timestamp)) / 60000);
      
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${timeLeft} minutes.` },
        { status: 429 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify the password
    const isValid = verifyAdminKey(password);
    
    // Update login attempts
    if (!loginAttempts.has(ip)) {
      loginAttempts.set(ip, { count: 1, timestamp: Date.now() });
    } else {
      const current = loginAttempts.get(ip)!;
      loginAttempts.set(ip, { 
        count: current.count + 1, 
        timestamp: Date.now() 
      });
    }
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Reset attempts on successful login
    loginAttempts.delete(ip);
    
    // Create a successful response
    const response = NextResponse.json(
      { success: true, message: 'Login successful' }, 
      { status: 200 }
    );
    
    // Set the admin cookie with secure options
    response.cookies.set('adminKey', password, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
      sameSite: 'strict', // Protects against CSRF attacks
      path: '/',
      maxAge: 60 * 60 * 8 // 8 hours (reduced from 24 for better security)
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the admin cookie
  response.cookies.set('adminKey', '', {
    expires: new Date(0),
    path: '/',
  });
  
  return response;
} 