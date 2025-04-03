import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export interface AdviceEntry {
  _id: string;
  name: string;
  message: string;
  role: string;
  timestamp: number;
}

// Professional sample advice entries
const sampleAdvice: AdviceEntry[] = [
  {
    _id: uuidv4(),
    name: 'Alexandra Chen',
    message: 'Prioritize learning system architecture fundamentals over chasing the latest frameworks. A solid understanding of core principles will serve you throughout your career regardless of evolving technologies.',
    role: 'Senior Software Architect',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    _id: uuidv4(),
    name: 'Dr. Marcus Williams',
    message: 'Documentation is not an afterthought but a critical component of development. Clear, comprehensive documentation enhances collaboration, accelerates onboarding, and serves as a valuable resource during maintenance phases.',
    role: 'Engineering Director',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
  },
  {
    _id: uuidv4(),
    name: 'Sophia Rodriguez',
    message: 'Invest time in mastering version control workflows early in your career. Understanding branching strategies, conflict resolution, and collaborative development practices will distinguish you as a professional developer.',
    role: 'DevOps Engineer',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    _id: uuidv4(),
    name: 'Hiroshi Tanaka',
    message: 'Develop a comprehensive testing methodology that includes unit, integration, and end-to-end tests. Quality assurance processes implemented early save exponential time during later development stages.',
    role: 'QA Lead',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
  },
  {
    _id: uuidv4(),
    name: 'Priya Patel',
    message: 'Focus on creating accessible digital experiences from the start of your projects. Universal design principles ensure your applications serve all users equitably and often improve the overall user experience.',
    role: 'UX Research Director',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
  },
  {
    _id: uuidv4(),
    name: 'James Morrison',
    message: 'When entering the industry, identify mentors who can provide context-specific guidance rather than generic advice. Domain knowledge and practical wisdom accelerate professional growth far beyond theoretical learning.',
    role: 'Technical Mentor',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14, // 14 days ago
  },
  {
    _id: uuidv4(),
    name: 'Emma Johnson',
    message: 'Cultivate strong communication skills alongside technical expertise. Your ability to articulate complex concepts clearly to diverse stakeholders often determines project success more than technical prowess alone.',
    role: 'Product Manager',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
  },
  {
    _id: uuidv4(),
    name: 'Ravi Kapoor',
    message: 'Understand the business context of your technical decisions. Engineers who align solutions with organizational objectives provide exponentially more value than those focused solely on technical elegance.',
    role: 'CTO',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
  }
];

// In-memory storage for development
let adviceStore: AdviceEntry[] = [...sampleAdvice];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, data: adviceStore });
  } 
  
  if (req.method === 'POST') {
    try {
      const { name, message, role = '' } = req.body;
      
      if (!name || !message) {
        return res.status(400).json({ success: false, error: 'Name and message are required' });
      }
      
      const newAdvice: AdviceEntry = {
        _id: uuidv4(),
        name,
        message,
        role,
        timestamp: Date.now(),
      };
      
      adviceStore.unshift(newAdvice); // Add to beginning of array
      
      return res.status(201).json({ success: true, data: newAdvice });
    } catch (error) {
      console.error('Error creating advice:', error);
      return res.status(500).json({ success: false, error: 'Error processing request' });
    }
  }
  
  return res.status(405).json({ success: false, error: 'Method not allowed' });
} 