import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Get the admin key from the cookie
    const adminKey = request.cookies.get('adminKey')?.value;

    if (!adminKey) {
      return NextResponse.json(
        { error: 'No admin key found' },
        { status: 401 }
      );
    }

    // Verify the admin key
    const isValid = verifyAdminKey(adminKey);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 401 }
      );
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error during auth check' },
      { status: 500 }
    );
  }
} 