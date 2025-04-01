import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    const client = await clientPromise;
    console.log('MongoDB client initialized');
    
    // Test the connection by getting server info
    const admin = client.db().admin();
    console.log('Got database admin');
    
    const result = await admin.serverStatus();
    console.log('Server status retrieved');
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      version: result.version,
      uptime: result.uptime,
      connections: result.connections?.current || 0
    });
  } catch (error: any) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 