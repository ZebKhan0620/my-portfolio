import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/adminAuth';

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminKey = cookieStore.get('adminKey')?.value;
    
    if (!adminKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    // Verify the admin key
    const isValid = verifyAdminKey(adminKey);
    
    if (!isValid) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 