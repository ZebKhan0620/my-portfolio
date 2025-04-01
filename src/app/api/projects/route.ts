import { NextRequest, NextResponse } from 'next/server';

// Sample projects data
const projectsData = [
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
];

// GET handler to retrieve all projects
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'success',
    data: projectsData,
  });
} 