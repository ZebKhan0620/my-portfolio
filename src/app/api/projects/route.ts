import { NextRequest, NextResponse } from 'next/server';

// Forward GET requests to backend
export async function GET(request: NextRequest) {
  try {
    // Get the API base URL for server-side
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002/api';
    
    // Forward the request to the backend
    const response = await fetch(`${backendUrl}/projects`, {
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
    
    // Fallback to sample data if backend is not available
    return NextResponse.json({
      status: 'success',
      data: [
        {
          id: 1,
          title: "Car Marketplace",
          description: "A comprehensive automotive marketplace with advanced filtering, secure user authentication, and intuitive booking system. This full-stack application combines modern frontend technologies with robust backend services for a seamless car shopping experience.",
          technologies: [
            "Next.js", 
            "TypeScript", 
            "TailwindCSS", 
            "Node.js", 
            "Express", 
            "MySQL"
          ],
          projectUrl: "#",
          imageUrl: "/images/car-marketplace.jpg",
          createdAt: "2024-03-10T00:00:00.000Z",
          updatedAt: "2024-03-15T00:00:00.000Z"
        },
        {
          id: 2,
          title: "Cafe de Paris",
          description: "An immersive digital experience for a French-Japanese fusion café featuring cutting-edge WebGL effects and advanced animations. The site combines artistic design with technical excellence to create a memorable, interactive showcase of the café's unique atmosphere.",
          technologies: [
            "React", 
            "WebGL", 
            "GSAP", 
            "Three.js", 
            "Framer Motion"
          ],
          projectUrl: "https://example.com/cafe-de-paris",
          imageUrl: "/images/cafe-de-paris.jpg",
          createdAt: "2024-01-20T00:00:00.000Z",
          updatedAt: "2024-02-05T00:00:00.000Z"
        },
        {
          id: 3,
          title: "Mayu",
          description: "A modern, interactive digital magazine with smooth transitions, dynamic hover effects, and sophisticated navigation systems. Features article carousels, scroll-based content switching, touch gestures, and carefully crafted accessibility considerations.",
          technologies: [
            "JavaScript", 
            "CSS3", 
            "HTML5", 
            "IntersectionObserver API", 
            "Responsive Design"
          ],
          projectUrl: "https://example.com/mayu",
          imageUrl: "/images/mayu.jpg",
          createdAt: "2023-11-15T00:00:00.000Z",
          updatedAt: "2023-12-10T00:00:00.000Z"
        }
      ]
    });
  }
} 