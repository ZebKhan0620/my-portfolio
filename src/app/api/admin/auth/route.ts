import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify the password
    const isValid = verifyAdminKey(password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Create a successful response
    const response = NextResponse.json(
      { success: true, message: 'Login successful' }, 
      { status: 200 }
    );
    
    // Set the admin cookie
    response.cookies.set('adminKey', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Set cookie with empty value and immediate expiry to clear it
    response.cookies.set('adminKey', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Setting max age to 0 effectively deletes the cookie
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error during logout' },
      { status: 500 }
    );
  }
} 