import { NextRequest, NextResponse } from 'next/server';

// Sample data for advice
const adviceData = [
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

// In-memory storage since we can't rely on a database in serverless
let advice = [...adviceData];

// GET handler to retrieve all advice
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'success',
    data: advice,
  });
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

    const newAdvice = {
      id: Date.now().toString(),
      name,
      message,
      role: role || '',
      timestamp: Date.now(),
    };

    // Add to in-memory storage
    advice = [newAdvice, ...advice];

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