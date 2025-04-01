"use client"
import darkSaasLandingPage from "@/assets/images/car01.jpg";
import lightSaasLandingPage from "@/assets/images/car02.jpg";
import aiStartupLandingPage from "@/assets/images/car03.jpg";
// Using existing images for now - these will need to be replaced with actual project screenshots
// import cafeDeParis from "@/assets/images/cafe-de-paris.jpg"; 
// import carMarketplace from "@/assets/images/car-marketplace.jpg";
// import mayuProject from "@/assets/images/mayu-project.jpg";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import ArrowRightIcon from "@/assets/icons/arrow-up-right.svg";
import GrainImage from "@/assets/images/grain.jpg";
import AchievementImage from "@/assets/images/HAL東京進級制作展 企画力賞受賞.png";
import CafeDeParisScreenshot from "@/assets/images/Cafe-de-Paris.png";
import MayuScreenshot from "@/assets/images/MAYU.png";
import CarMarketplaceScreenshot from "@/assets/images/Car-Marketplace.png";
import { useState, useRef, useEffect } from "react";
import projectService from '@/services/projectService';
import { Project as ApiProject } from '@/services/projectService';

interface ProjectResult {
  title: string;
}

interface Project {
  company: string;
  year: string;
  title: string;
  results: ProjectResult[];
  link: string;
  image: StaticImageData | string;
  repoLink?: string;
  achievement?: {
    title: string;
    image: StaticImageData;
  };
  description?: string;
}

const portfolioProjects: Project[] = [
  {
    company: "HAL Tokyo",
    year: "2025",
    title: "Car Marketplace",
    results: [
      { title: "Complete user registration with email confirmation and 2FA security" },
      { title: "Advanced AJAX filters and detailed car listings system" },
      { title: "Meeting scheduling with favorites/bookmarking features" },
      { title: "Presentation-ready mode with guided tour for demonstrations" },
    ],
    description: "A comprehensive automotive marketplace with advanced filtering, secure user authentication, and intuitive booking system. This full-stack application combines modern frontend technologies with robust backend services for a seamless car shopping experience.",
    link: "#", // Replace with demo link if available
    repoLink: "#", // Replace with repo link if available
    image: CarMarketplaceScreenshot, // Using the new full screenshot
    achievement: {
      title: "HAL東京進級制作展 企画力賞受賞",
      image: AchievementImage
    }
  },
  {
    company: "Personal Project",
    year: "2024",
    title: "Cafe de Paris",
    results: [
      { title: "WebGL-powered dynamic mesh gradient backgrounds with custom shaders" },
      { title: "Advanced GSAP animations with parallax scrolling and ScrollTrigger" },
      { title: "Interactive UI with physics-based spring animations and element tracking" },
      { title: "Bilingual Japanese/French menu with 3D card hover effects and marquee animations" },
    ],
    description: "An immersive digital experience for a French-Japanese fusion café featuring cutting-edge WebGL effects and advanced animations. The site combines artistic design with technical excellence to create a memorable, interactive showcase of the café's unique atmosphere.",
    link: "https://zebkhan0620.github.io/cafe-de-paris/",
    repoLink: "https://github.com/ZebKhan0620/cafe-de-paris",
    image: CafeDeParisScreenshot,
  },
  {
    company: "Team Project",
    year: "2024",
    title: "Mayu",
    results: [
      { title: "Interactive web magazine with slideshow featuring preloading, autoplay, and touch gestures" },
      { title: "Advanced scroll-based UI with IntersectionObserver for dynamic header transforms" },
      { title: "Context-aware menu system with animated transitions and accessibility support" },
      { title: "Modular JavaScript architecture with specialized controllers for UI components" },
    ],
    description: "A modern, interactive digital magazine with smooth transitions, dynamic hover effects, and sophisticated navigation systems. Features article carousels, scroll-based content switching, touch gestures, and carefully crafted accessibility considerations.",
    link: "https://deep-shinjuku.github.io/Mayu",
    repoLink: "https://github.com/Deep-Shinjuku/Mayu",
    image: MayuScreenshot,
  },
  
];

// Convert API project data to our UI project format
const convertApiProject = (apiProject: ApiProject): Project => {
  return {
    company: "Project",
    year: apiProject.createdAt ? new Date(apiProject.createdAt).getFullYear().toString() : "2023",
    title: apiProject.title,
    description: apiProject.description,
    results: apiProject.technologies.map(tech => ({ title: tech })),
    link: apiProject.projectUrl,
    image: apiProject.imageUrl,
    repoLink: apiProject.projectUrl.includes('github.com') ? apiProject.projectUrl : undefined,
  };
};

const DesktopPreview = ({ project }: { project: Project }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasValidUrl = project.link && project.link !== "#";
  
  // Handle transition states to delay showing the overlay
  useEffect(() => {
    if (isHovering) {
      setIsTransitioning(true);
    } else {
      // After mouse leaves, wait for animation to complete before showing overlay
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 5000); // Match this to your animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isHovering]);
  
  return (
    <div 
      className="desktop-preview relative w-full h-full group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Realistic desktop mockup with proper aspect ratio and shadow */}
      <div className="desktop-mockup w-full mx-auto transition-all duration-300 hover:scale-[1.02] relative">
        {/* More realistic desktop monitor frame */}
        <div className="monitor-bezel bg-gray-950 rounded-t-xl sm:rounded-t-2xl p-1 sm:p-1.5 md:p-2 lg:p-3 shadow-2xl border border-gray-800 overflow-hidden relative">
          {/* Browser window with proper desktop proportions */}
          <div className="browser-window bg-gray-900 rounded-lg overflow-hidden border border-gray-700 shadow-inner">
            {/* Browser top bar with realistic controls */}
            <div className="browser-bar bg-gray-800 h-5 sm:h-6 md:h-8 lg:h-10 flex items-center px-1.5 sm:px-2 md:px-3 border-b border-gray-700">
              <div className="flex space-x-1 sm:space-x-1.5">
                <div className="w-1.5 sm:w-2 md:w-2.5 lg:w-3 h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full bg-red-500"></div>
                <div className="w-1.5 sm:w-2 md:w-2.5 lg:w-3 h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full bg-yellow-500"></div>
                <div className="w-1.5 sm:w-2 md:w-2.5 lg:w-3 h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex mx-2 sm:mx-3 md:mx-4 bg-gray-700 rounded-md h-3 sm:h-4 md:h-5 flex-grow px-1 sm:px-1.5 md:px-2 items-center">
                <div className="w-1.5 sm:w-2 md:w-3 h-1.5 sm:h-2 md:h-3 rounded-full bg-blue-400 mr-1 sm:mr-1.5"></div>
                <span className="text-gray-400 text-[8px] sm:text-[10px] md:text-xs truncate">{hasValidUrl ? project.link : project.title}</span>
              </div>
              <div className="flex space-x-1 sm:space-x-1.5 md:space-x-2 ml-1 sm:ml-1.5 md:ml-2">
                <div className="w-1.5 sm:w-2 md:w-3 h-1.5 sm:h-2 md:h-3 rounded-full bg-gray-600"></div>
                <div className="w-1.5 sm:w-2 md:w-3 h-1.5 sm:h-2 md:h-3 rounded-full bg-gray-600"></div>
              </div>
            </div>
            
            {/* Website content area with proper aspect ratio */}
            <div className="browser-content relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <div 
                className="h-full w-full relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 transition-transform duration-[6s] ease-linear`}
                  style={{ 
                    transform: isHovering ? 'translateY(calc(-100% + 300px))' : 'translateY(0)',
                    willChange: 'transform'
                  }}
                >
                  {typeof project.image === 'string' ? (
                    <img 
                      src={project.image}
                      alt={`Preview of ${project.title}`}
                      className="w-full"
                      style={{ 
                        objectFit: 'contain', 
                        maxWidth: '100%',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <Image
                      src={project.image}
                      alt={`Preview of ${project.title}`}
                      width={1600}
                      height={6000}
                      className="w-full"
                      quality={90}
                      priority={true}
                      style={{ 
                        objectFit: 'contain', 
                        maxWidth: '100%',
                        display: 'block'
                      }}
                    />
                  )}
                </div>
              </div>
              
              {/* Top layer: Hover instructions (elegant design) */}
              <div 
                className={`absolute inset-0 z-10 transition-all duration-300 ${
                  isHovering || isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100 bg-gradient-to-b from-gray-900/80 to-gray-900/95'
                }`}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center transform transition-transform duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-1.5 sm:mb-2 md:mb-3 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                    <p className="text-white font-medium text-sm sm:text-base md:text-lg lg:text-xl bg-gradient-to-r from-emerald-300 to-sky-400 bg-clip-text text-transparent">
                      Hover to explore
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center justify-center">
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1 sm:mr-1.5"></span>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">
                        {hasValidUrl ? 'Website preview' : 'Project showcase'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Browser UI elements */}
              <div className={`absolute bottom-1.5 sm:bottom-2 md:bottom-3 right-1.5 sm:right-2 md:right-3 z-20 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-full p-0.5 sm:p-1 md:p-1.5 shadow-lg flex space-x-1 sm:space-x-1.5 md:space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gray-700 flex items-center justify-center">
                    <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop stand/base with more realistic design */}
        <div className="mx-auto w-2/5 h-1 sm:h-1.5 md:h-2 lg:h-3 xl:h-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-b-lg"></div>
        <div className="mx-auto w-1/4 h-3 sm:h-4 md:h-6 lg:h-8 xl:h-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-b-lg"></div>
        
        {/* Mouse cursor effect */}
        <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-5 md:-right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="relative">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 21L15.5 6.5L18 12.5L23 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 h-1 w-1 sm:h-1.5 sm:w-1.5 md:h-2 md:w-2 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
      
      {/* Status badges */}
      {hasValidUrl ? (
        <div className="absolute -bottom-1 right-1.5 sm:right-3 md:right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-0.5 md:py-1 rounded-full shadow-lg transform -rotate-2">
          <span className="flex items-center">
            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white rounded-full mr-0.5 sm:mr-1 animate-pulse"></span>
            Live Website
          </span>
        </div>
      ) : (
        <div className="absolute -bottom-1 right-1.5 sm:right-3 md:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-0.5 md:py-1 rounded-full shadow-lg transform -rotate-2">
          <span className="flex items-center">
            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white rounded-full mr-0.5 sm:mr-1"></span>
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(portfolioProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiProjects = await projectService.getAllProjects();
        if (apiProjects && apiProjects.length > 0) {
          // Convert API projects to our format
          const formattedProjects = apiProjects.map(convertApiProject);
          setProjects(formattedProjects);
        } else {
          // Keep using the static projects as fallback
          console.log('No projects found from API, using static data');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Using backup data instead.');
        // Keep using the static projects as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="pb-10 sm:pb-14 md:pb-20 lg:pb-24 pt-6 sm:pt-8 md:pt-12 lg:pt-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium">Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Projects</span></h2>
          <p className="mt-3 sm:mt-4 md:mt-6 text-white/70 text-base sm:text-lg">
            A showcase of my recent work and the solutions I've developed
          </p>
          
          {/* Error message display */}
          {error && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 mx-auto max-w-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          )}
        </div>

        {/* Projects list - only show if we have projects or are done loading */}
        {!loading && projects.length > 0 && (
          <div className="flex flex-col mt-6 sm:mt-8 md:mt-12 lg:mt-20 gap-20 sm:gap-24 md:gap-32 lg:gap-40 relative">
            {projects.map((project, projectIndex) => (
              <div
                key={project.title}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl z-0 overflow-hidden after:content-[''] after:z-10 after:absolute after:inset-0 after:outline-1 sm:after:outline-2 after:outline after:-outline-offset-1 sm:after:-outline-offset-2 after:rounded-xl sm:after:rounded-2xl md:after:rounded-3xl after:outline-white/20 px-3 sm:px-5 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-8 lg:pt-12 pb-5 sm:pb-7 md:pb-9 lg:pb-12 after:pointer-events-none sticky w-full max-w-full"
                style={{
                  top: `calc(64px + ${projectIndex * 70}px)`
                }}
              >
                <div
                  className="absolute inset-0 -z-10 opacity-5"
                  style={{
                    backgroundImage: `url(${GrainImage.src})`,
                  }}
                ></div>

                <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-12 lg:items-start">
                  {/* Left side: Project preview */}
                  <div className="lg:w-[55%] xl:w-3/5 order-2 lg:order-1 mb-6 sm:mb-8 lg:mb-0">
                    <DesktopPreview project={project} />
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center">
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View live demo - ${project.title}`}
                        className={`${project.link === "#" ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"} text-gray-950 h-8 sm:h-9 md:h-10 lg:h-11 px-3 sm:px-4 md:px-6 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 transition`}
                      >
                        <span>{project.link === "#" ? "Demo Coming Soon" : "View Live Demo"}</span> 
                        {project.link !== "#" && <ArrowRightIcon aria-hidden="true" className="size-3.5 sm:size-4" />}
                      </Link>
                      
                      {project.repoLink && project.repoLink !== "#" ? (
                        <Link
                          href={project.repoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View code - ${project.title}`}
                          className="border border-white/15 text-white h-8 sm:h-9 md:h-10 lg:h-11 px-3 sm:px-4 md:px-6 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-white/10 transition-colors"
                        >
                          <span>View Code</span> 
                          <ArrowRightIcon aria-hidden="true" className="size-3.5 sm:size-4" />
                        </Link>
                      ) : project.repoLink === "#" ? (
                        <div className="border border-white/15 text-white/50 h-8 sm:h-9 md:h-10 lg:h-11 px-3 sm:px-4 md:px-6 rounded-md sm:rounded-lg font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 sm:gap-2 cursor-not-allowed">
                          <span>Code Private</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Right side: Project details */}
                  <div className="lg:w-[45%] xl:w-2/5 flex flex-col order-1 lg:order-2 min-h-0">
                    <div className="bg-gradient-to-r from-emerald-300 to-sky-400 inline-flex flex-wrap gap-1.5 sm:gap-2 font-bold uppercase tracking-widest text-[10px] sm:text-xs md:text-sm text-transparent bg-clip-text">
                      <span className="text-white/60">{project.company}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400">{project.year}</span>
                      {project.achievement && (
                        <span className="relative group ml-0 sm:ml-2">
                          <span className="inline-flex items-center text-emerald-400 cursor-pointer whitespace-nowrap hover:text-white transition-colors duration-300">
                            <div className="mr-1.5 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow">
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-900" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 8.999c0 1.902.765 3.627 2 4.89V21a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7.111a6.973 6.973 0 0 0 2-4.89V5.5A1.5 1.5 0 0 0 17.5 4h-11A1.5 1.5 0 0 0 5 5.5v3.499zM9.75 14.063a.5.5 0 0 1 .5.5V19.5h-2v-7.893a7.019 7.019 0 0 0 1.5.456zm4.755-.063a.5.5 0 0 0-.5.5V19.5h2v-7.893a6.946 6.946 0 0 1-1.5.393zM7 8.999V5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v3.499A5 5 0 1 1 7 8.999z"/>
                              </svg>
                            </div>
                            <div className="flex flex-col">
                              <span>Award Winner</span>
                              <span className="text-[8px] sm:text-[10px] opacity-70 tracking-normal font-normal">(hover to view certificate)</span>
                            </div>
                          </span>
                          
                          {/* Simple tooltip that just shows the image clearly */}
                          <div className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 
                                        top-full left-0 mt-2 sm:mt-3
                                        transition-all duration-300 ease-in-out">
                            <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-2xl">
                              <Image 
                                src={project.achievement.image} 
                                alt={project.achievement.title}
                                width={320}
                                height={400}
                                className="w-[200px] sm:w-[280px] md:w-[320px] object-contain"
                                priority={true}
                                quality={90}
                              />
                            </div>
                            <div className="absolute top-0 left-5 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white transform rotate-45 -translate-y-1.5"></div>
                          </div>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif mt-1.5 sm:mt-2 md:mt-4">
                      {project.title}
                    </h3>
                    
                    {/* Optional project description */}
                    {project.description && (
                      <div className="mt-2 sm:mt-3 md:mt-4">
                        <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-prose border-l-2 border-emerald-500/20 pl-3 sm:pl-4 py-1.5 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-r">
                          {project.description}
                        </p>
                      </div>
                    )}
                    
                    <hr className="border-t border-white/5 mt-3 sm:mt-4 md:mt-5" />
                    <ul className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 mt-3 sm:mt-4 md:mt-5">
                      {project.results.map((result) => (
                        <li
                          key={result.title}
                          className="flex gap-2 sm:gap-3 text-xs sm:text-sm md:text-base text-white/80"
                        >
                          <CheckCircleIcon className="size-4 sm:size-5 flex-shrink-0 text-emerald-400 mt-0.5" />
                          <span className="line-clamp-2 max-w-full leading-normal">{result.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}