import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET handler to retrieve all advice
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Get advice entries from MongoDB, sorted by timestamp descending (newest first)
    const advice = await db.collection("advice")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    // If no advice entries found, return sample data
    if (advice.length === 0) {
      // Sample data for initial display
      const sampleAdvice = [
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
        },
      ];
      
      return NextResponse.json({
        status: 'success',
        data: sampleAdvice,
      });
    }
    
    // Map MongoDB _id to id for consistent client-side interface
    const mappedAdvice = advice.map(entry => ({
      id: entry._id.toString(),
      name: entry.name,
      role: entry.role || '',
      message: entry.message,
      timestamp: entry.timestamp,
    }));
    
    return NextResponse.json({
      status: 'success',
      data: mappedAdvice,
    });
  } catch (error) {
    console.error('Error fetching advice:', error);
    // Return sample data as fallback
    return NextResponse.json({
      status: 'success',
      data: getSampleAdvice(),
    });
  }
}

// POST handler to create new advice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, role } = body;

    if (!name || !message) {
      return NextResponse.json({
        status: 'error',
        message: 'Name and message are required',
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    // Store advice in MongoDB
    const result = await db.collection("advice").insertOne({
      name,
      message,
      role: role || '',
      timestamp: Date.now(),
    });

    const newAdvice = {
      id: result.insertedId.toString(),
      name,
      message,
      role: role || '',
      timestamp: Date.now(),
    };

    return NextResponse.json({
      status: 'success',
      data: newAdvice,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating advice:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create advice entry',
    }, { status: 500 });
  }
}

// Helper function for sample advice data
function getSampleAdvice() {
  return [
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
    },
  ];
} 