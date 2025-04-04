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
import XIcon from "@/assets/icons/x.svg";
import GrainImage from "@/assets/images/grain.jpg";
import AchievementImage from "@/assets/images/HAL東京進級制作展 企画力賞受賞.png";
import CafeDeParisScreenshot from "@/assets/images/Cafe-de-Paris.png";
import MayuScreenshot from "@/assets/images/MAYU.png";
import CarMarketplaceScreenshot from "@/assets/images/Car-Marketplace.png";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from "@/components/SectionHeader";

interface ProjectResult {
  title: string;
}

interface ProjectAchievement {
  title: string;
  image: StaticImageData;
}

interface Project {
  company: string;
  year: string;
  title: string;
  results: ProjectResult[];
  link: string;
  image: StaticImageData | string;
  repoLink?: string;
  achievement?: ProjectAchievement;
  description?: string;
}

const DesktopPreview = ({ project }: { project: Project }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasValidUrl = project.link && project.link !== "#";
  const { t } = useLanguage();
  
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
                      {t('projects.hoverToView')}
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center justify-center">
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1 sm:mr-1.5"></span>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-300">
                        {hasValidUrl ? t('projects.projectContent.websitePreview') : t('projects.projectContent.projectShowcase')}
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
            {t('projects.liveWebsite')}
          </span>
        </div>
      ) : (
        <div className="absolute -bottom-1 right-1.5 sm:right-3 md:right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-0.5 md:py-1 rounded-full shadow-lg transform -rotate-2">
          <span className="flex items-center">
            <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-white rounded-full mr-0.5 sm:mr-1"></span>
            {t('projects.demoComingSoon')}
          </span>
        </div>
      )}
    </div>
  );
};

export default function ProjectsSection() {
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  
  const portfolioProjects: Project[] = [
    {
      company: t('projects.projectContent.companies.halTokyo'),
      year: "2025",
      title: t('projects.projectContent.carMarketplace.title'),
      results: [
        { title: t('projects.projectContent.carMarketplace.results.0') },
        { title: t('projects.projectContent.carMarketplace.results.1') },
        { title: t('projects.projectContent.carMarketplace.results.2') },
        { title: t('projects.projectContent.carMarketplace.results.3') },
      ],
      description: t('projects.projectContent.carMarketplace.description'),
      link: "#", // Replace with demo link if available
      repoLink: "#", // Replace with repo link if available
      image: CarMarketplaceScreenshot, // Using the new full screenshot
      achievement: {
        title: t('projects.projectContent.carMarketplace.achievement'),
        image: AchievementImage
      }
    },
    {
      company: t('projects.projectContent.companies.personalProject'),
      year: "2024",
      title: t('projects.projectContent.cafeDeParis.title'),
      results: [
        { title: t('projects.projectContent.cafeDeParis.results.0') },
        { title: t('projects.projectContent.cafeDeParis.results.1') },
        { title: t('projects.projectContent.cafeDeParis.results.2') },
        { title: t('projects.projectContent.cafeDeParis.results.3') },
      ],
      description: t('projects.projectContent.cafeDeParis.description'),
      link: "https://zebkhan0620.github.io/cafe-de-paris/",
      repoLink: "https://github.com/ZebKhan0620/cafe-de-paris",
      image: CafeDeParisScreenshot,
    },
    {
      company: t('projects.projectContent.companies.teamProject'),
      year: "2024",
      title: t('projects.projectContent.mayu.title'),
      results: [
        { title: t('projects.projectContent.mayu.results.0') },
        { title: t('projects.projectContent.mayu.results.1') },
        { title: t('projects.projectContent.mayu.results.2') },
        { title: t('projects.projectContent.mayu.results.3') },
      ],
      description: t('projects.projectContent.mayu.description'),
      link: "https://deep-shinjuku.github.io/Mayu",
      repoLink: "https://github.com/Deep-Shinjuku/Mayu",
      image: MayuScreenshot,
    },
  ];
  
  const [projects, setProjects] = useState<Project[]>(portfolioProjects);
  
  // Helper function to get localized project field
  const getLocalizedProjectField = (project: Project, field: keyof Project, jaField?: string): string => {
    const value = project[field];
    return typeof value === 'string' ? value : '';
  };

  // Helper function to get localized project results
  const getLocalizedProjectResults = (project: Project): ProjectResult[] => {
    return project.results;
  };
  
  // Change project selection
  const selectProject = (index: number) => {
    setSelectedProjectIndex(index);
  };
  
  // Handle scroll for mobile version
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollPosition = scrollLeft / (scrollWidth - clientWidth);
      
      // Calculate which project is in view based on scroll position
      const projectIndex = Math.min(
        Math.floor(scrollPosition * projects.length),
        projects.length - 1
      );
      
      if (projectIndex !== selectedProjectIndex) {
        setSelectedProjectIndex(projectIndex);
      }
    }
  };
  
  return (
    <section className="pb-10 sm:pb-14 md:pb-20 lg:pb-24 pt-6 sm:pt-8 md:pt-12 lg:pt-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[1400px]">
        <SectionHeader
          title={t('projects.title')}
          eyebrow={t('projects.title')}
          description={t('projects.subtitle')}
        />

        {/* Projects list */}
        <div className="flex flex-col mt-4 xs:mt-5 sm:mt-6 md:mt-10 lg:mt-16 gap-10 xs:gap-12 sm:gap-16 md:gap-20 lg:gap-32 relative">
          {portfolioProjects.map((project, projectIndex) => (
            <div
              key={project.title}
              className="bg-gray-800/90 backdrop-blur-sm rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl z-0 overflow-hidden after:content-[''] after:z-10 after:absolute after:inset-0 after:outline-1 sm:after:outline-2 after:outline after:-outline-offset-1 sm:after:-outline-offset-2 after:rounded-lg xs:after:rounded-xl sm:after:rounded-2xl md:after:rounded-3xl after:outline-white/20 px-2 xs:px-3 sm:px-5 md:px-6 lg:px-8 xl:px-10 pt-2.5 xs:pt-3.5 sm:pt-5 md:pt-6 lg:pt-8 xl:pt-10 pb-3 xs:pb-4 sm:pb-5 md:pb-6 lg:pb-8 xl:pb-10 after:pointer-events-none sticky w-full max-w-full"
              style={{
                top: `calc(64px + ${projectIndex * 38}px)`
              }}
            >
              {/* Project content */}
              <div className="relative z-20">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10">
                  {/* Project preview */}
                  <div className="lg:w-1/2">
                    <DesktopPreview project={project} />
                  </div>

                  {/* Project details */}
                  <div className="lg:w-1/2">
                    <div className="flex flex-col h-full">
                      <div className="mb-4 sm:mb-6">
                        <h3 className={`text-xl sm:text-2xl md:text-3xl font-[var(--font-serif)] font-medium ${
                          language === 'ja' ? 'font-[var(--font-jp)]' : ''
                        }`}>
                          {getLocalizedProjectField(project, 'title')}
                        </h3>
                        <p className={`mt-2 text-white/70 ${
                          language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                        }`}>
                          {getLocalizedProjectField(project, 'description')}
                        </p>
                      </div>

                      {/* Project results */}
                      <div className="mt-auto">
                        <h4 className={`text-lg sm:text-xl font-[var(--font-serif)] font-medium ${
                          language === 'ja' ? 'font-[var(--font-jp)]' : ''
                        }`}>
                          {t('projects.results')}
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {getLocalizedProjectResults(project).map((result, index) => (
                            <li key={index} className={`flex items-start gap-2 ${
                              language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
                            }`}>
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{result.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for mobile/tablet screens */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div 
            ref={modalRef}
            className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto" 
          >
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-3 sm:p-4 flex justify-between items-center z-10">
              <h3 id="project-modal-title" className="text-base sm:text-lg font-serif">{selectedProject.title}</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full focus-indicator"
                aria-label="Close Project Details"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 text-xs mb-3">
                <span className="bg-gray-700 px-2 py-0.5 rounded text-white/70">{getLocalizedProjectField(selectedProject, 'company', 'companyJa')}</span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">{selectedProject.year}</span>
                {selectedProject.achievement && (
                  <div className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
                    <svg className="size-3 text-amber-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 8.999c0 1.902.765 3.627 2 4.89V21a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-7.111a6.973 6.973 0 0 0 2-4.89V5.5A1.5 1.5 0 0 0 17.5 4h-11A1.5 1.5 0 0 0 5 5.5v3.499zM9.75 14.063a.5.5 0 0 1 .5.5V19.5h-2v-7.893a7.019 7.019 0 0 0 1.5.456zm4.755-.063a.5.5 0 0 0-.5.5V19.5h2v-7.893a6.946 6.946 0 0 1-1.5.393zM7 8.999V5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v3.499A5 5 0 1 1 7 8.999z"/>
                    </svg>
                    <span>{t('projects.awardWinner')}</span>
                  </div>
                )}
              </div>
              
              {selectedProject.achievement && (
                <div className="mb-4">
                  <div className="bg-white/5 rounded-lg p-2 mb-3">
                    <Image 
                      src={selectedProject.achievement.image} 
                      alt={selectedProject.achievement.title}
                      width={320}
                      height={400}
                      className="w-full max-h-[200px] object-contain" 
                      priority={true}
                      quality={90}
                    />
                  </div>
                </div>
              )}
              
              {selectedProject.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white/90 mb-1">{t('projects.projectDescription')}</h4>
                  <p className="text-xs sm:text-sm text-white/70">{getLocalizedProjectField(selectedProject, 'description', 'descriptionJa')}</p>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="uppercase tracking-wider text-xs text-emerald-400 font-bold mb-2">{t('projects.keyResults')}</h4>
                <ul className="grid gap-3">
                  {getLocalizedProjectResults(selectedProject).map((result, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <div className="bg-emerald-500/10 text-emerald-400 rounded-full p-1 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-white/80">{result.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t('projects.viewLiveDemoFor')} ${selectedProject.title}`}
                  className={`${selectedProject.link === "#" ? "bg-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"} text-gray-950 h-9 px-4 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 transition`}
                >
                  <span>{selectedProject.link === "#" ? t('projects.demoComingSoon') : t('projects.viewLiveDemo')}</span> 
                  {selectedProject.link !== "#" && <ArrowRightIcon aria-hidden="true" className="size-4" />}
                </Link>
                
                {selectedProject.repoLink && selectedProject.repoLink !== "#" ? (
                  <Link
                    href={selectedProject.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('projects.viewCodeFor')} ${selectedProject.title}`}
                    className="border border-white/15 text-white h-9 px-4 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <span>{t('projects.viewCode')}</span> 
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </Link>
                ) : selectedProject.repoLink === "#" ? (
                  <div className="border border-white/15 text-white/50 h-9 px-4 rounded-lg font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-not-allowed">
                    <span>{t('projects.codePrivate')}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}