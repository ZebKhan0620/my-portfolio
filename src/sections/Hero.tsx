'use client';

import { useEffect, useRef, useState } from 'react';
import memojiImage from "@/assets/images/memoji-computer.png";
import Image from "next/image";
import ArrowDown from "@/assets/icons/arrow-down.svg";
import grainImage from "@/assets/images/grain.jpg";
import StarIcon from "@/assets/icons/star.svg";
import { HeroOrbit } from "@/components/HeroOrbit";
import SparkleIcon from "@/assets/icons/sparkle.svg";
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  OrbitConfig,
  getResponsiveOrbitConfigs
} from '@/config/animations';
import { useWindowSize } from '@/hooks/useWindowSize';

// Define the skills to be displayed in the typing animation
const SKILLS = [
  "Frontend Development",
  "PHP Backend",
  "Responsive Design",
  "UI/UX Implementation",
  "Full-stack Solutions",
];

export const HeroSection = () => {
  const [currentSkill, setCurrentSkill] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // State for visibility-based lazy loading
  const [isVisible, setIsVisible] = useState(false);
  const [largeElementsLoaded, setLargeElementsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);
  
  // Get window size for responsive calculations
  const { width } = useWindowSize();
  // Determine if we're on mobile
  const isMobile = width ? width < 768 : false;
  // Calculate a scale factor based on screen width
  const scaleFactor = width ? Math.min(1, Math.max(0.4, width / 1200)) : 0.7;
  
  // Get orbit configurations - this helps with responsive designs
  const orbitConfigs = getResponsiveOrbitConfigs();
  
  // IntersectionObserver for lazy loading orbits
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start loading large elements 1 second after orbits are first visible
          setTimeout(() => {
            setLargeElementsLoaded(true);
          }, 1000);
          
          // Capture the current ref value
          const currentRef = orbitContainerRef.current;
          
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        rootMargin: '200px', // Start loading before element is visible
        threshold: 0.01 // Trigger when even a small portion is visible
      }
    );
    
    // Capture the current ref value
    const currentRef = orbitContainerRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  // Scroll animation effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Typing animation effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(SKILLS[currentSkill]);
      return;
    }
    
    let timeout: NodeJS.Timeout;
    const skill = SKILLS[currentSkill];
    
    if (isTyping) {
      if (displayedText.length < skill.length) {
        timeout = setTimeout(() => {
          setDisplayedText(skill.substring(0, displayedText.length + 1));
        }, 100); // typing speed
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 1500); // longer pause at the end of typing
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, 50); // deleting speed (faster than typing)
      } else {
        setIsTyping(true);
        setCurrentSkill((currentSkill + 1) % SKILLS.length);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentSkill, prefersReducedMotion]);

  // Smooth scrolling function for navigation
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };
  
  // Function to generate responsive orbits based on screen size - with smooth continuous animation
  const getResponsiveOrbits = () => {
    // Only render orbits once they should be visible
    if (!isVisible) {
      return null;
    }
    
    // Calculate responsive sizes based on screen width
    const getResponsiveSize = (baseSize: number) => {
      if (width && width < 480) { // sm breakpoint
        return Math.round(baseSize * 0.5); // Smaller for mobile
      } else if (width && width < 768) { // md breakpoint
        return Math.round(baseSize * 0.65);
      } else if (width && width < 1024) { // lg breakpoint
        return Math.round(baseSize * 0.8);
      } else if (width && width < 1280) { // xl breakpoint
        return Math.round(baseSize * 0.9);
      } else {
        return Math.round(baseSize);
      }
    };
    
    // Base orbits that will always be shown (with responsive sizing)
    const baseOrbits = [
      <HeroOrbit 
        key="orbit-1" 
        size={getResponsiveSize(550)} 
        rotation={20} 
        shouldOrbit 
        orbitDuration="38s" 
        shouldSpin 
        spinDuration="6s"
        animationDirection="clockwise"
        pauseOnHover
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <StarIcon className={`${isMobile ? 'size-6' : 'size-8 sm:size-10 md:size-12'} text-emerald-300`} />
      </HeroOrbit>,
      <HeroOrbit 
        key="orbit-2" 
        size={getResponsiveSize(430)} 
        rotation={-14} 
        shouldOrbit 
        orbitDuration="30s" 
        shouldSpin 
        spinDuration="3s"
        animationDirection="counter-clockwise"
        interactive
        onClick={() => console.log('Sparkle clicked!')}
        isDecorative={false}
        description="Decorative sparkle element"
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <SparkleIcon className={`${isMobile ? 'size-6' : 'size-8'} text-emerald-300/20`} />
      </HeroOrbit>
    ];
    
    // Medium screen orbits - only load after base orbits
    const mediumOrbits = largeElementsLoaded ? [
      <HeroOrbit
        key="orbit-3" 
        size={getResponsiveSize(650)} 
        rotation={-5} 
        shouldOrbit 
        orbitDuration="42s"
        path="elliptical"
        horizontalStretch={1.2}
        verticalStretch={0.8}
        easing="linear"
        animateOnVisible
      >
        <StarIcon className="size-2 rounded-full bg-emerald-300/20" />
      </HeroOrbit>,
      <HeroOrbit 
        key="orbit-4" 
        size={getResponsiveSize(590)} 
        rotation={98} 
        shouldOrbit 
        orbitDuration="40s" 
        shouldSpin 
        spinDuration="6s"
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <StarIcon className="size-8 text-emerald-300/20" />
      </HeroOrbit>
    ] : [];
    
    // Large screen orbits - only load after base orbits
    const largeOrbits = largeElementsLoaded ? [
      <HeroOrbit 
        key="orbit-5" 
        size={getResponsiveSize(800)} 
        rotation={-72} 
        shouldOrbit 
        orbitDuration="48s" 
        shouldSpin 
        spinDuration="6s"
        opacity={0.7}
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <StarIcon className={`${isMobile ? 'size-16' : 'size-28'} text-emerald-300`} />
      </HeroOrbit>,
      <HeroOrbit 
        key="orbit-6" 
        size={getResponsiveSize(720)} 
        rotation={144} 
        shouldOrbit 
        orbitDuration="46s"
        easing="linear"
        animateOnVisible
      >
        <SparkleIcon className={`${isMobile ? 'size-10' : 'size-14'} text-emerald-300/20`} />
      </HeroOrbit>,
      <HeroOrbit 
        key="orbit-7" 
        size={getResponsiveSize(520)} 
        rotation={-41} 
        shouldOrbit 
        orbitDuration="36s" 
        shouldSpin 
        spinDuration="3s"
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <SparkleIcon className="size-2 rounded-full bg-emerald-300/20" />
      </HeroOrbit>,
      <HeroOrbit 
        key="orbit-8" 
        size={getResponsiveSize(710)} 
        rotation={90} 
        shouldOrbit 
        orbitDuration="44s"
        easing="linear"
        animateOnVisible
      >
        <SparkleIcon className="size-3 rounded-full text-emerald-300/20" />
      </HeroOrbit>
    ] : [];
    
    // Combine orbits based on need - using a hidden class with media queries
    return (
      <>
        {baseOrbits}
        <div className="hidden md:block">
          {mediumOrbits}
        </div>
        <div className="hidden lg:block">
          {largeOrbits}
        </div>
      </>
    );
  };

  return (
    <motion.div 
      ref={heroRef}
      className="py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 relative z-0 overflow-hidden w-full"
      style={{ opacity, scale, y }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Skip link for accessibility */}
      <a 
        href="#content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-gray-900 px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
      
      {/* Background elements */}
      <div
        className="absolute inset-0 -z-30 opacity-5"
        style={{ backgroundImage: `url(${grainImage.src})` }}
        aria-hidden="true"
      ></div>
      
      {/* Hero rings - positioned centrally */}
      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center -z-20">
        <div className="relative">
          <div className="size-[240px] sm:size-[340px] md:size-[480px] lg:size-[580px] xl:size-[620px] hero-ring"></div>
          <div className="size-[320px] sm:size-[440px] md:size-[620px] lg:size-[760px] xl:size-[820px] hero-ring"></div>
          <div className="size-[420px] sm:size-[580px] md:size-[750px] lg:size-[940px] xl:size-[1020px] hero-ring hidden sm:block"></div>
          <div className="size-[550px] sm:size-[720px] md:size-[900px] lg:size-[1120px] xl:size-[1220px] hero-ring hidden md:block"></div>
        </div>
      </div>
      
      {/* Orbit elements */}
      <div 
        ref={orbitContainerRef} 
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
      >
        {getResponsiveOrbits()}
      </div>
      
      {/* Main content */}
      <div id="content" className="container relative z-10 px-4 sm:px-0 mx-auto">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              className="size-[70px] sm:size-[80px] md:size-[90px] lg:size-[100px] animate-float"
              src={memojiImage}
              alt="Memoji of Zeb Khan on a computer"
              priority
            />
          </motion.div>
          
          <motion.div 
            className="bg-gray-950 border border-gray-800 px-2 sm:px-2.5 md:px-3.5 py-1.5 inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-lg mt-4 text-xs sm:text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-green-500 size-1.5 sm:size-2 md:size-2.5 rounded-full relative">
              <div className="bg-green-500 absolute rounded-full inset-0 animate-ping-large"></div>
            </div>
            <div className="font-medium">
              Available for new opportunities
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h1 className="font-serif text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center mt-4 sm:mt-6 md:mt-8 tracking-wide">
            ZEB KHAN
          </h1>
          <h2 className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center mt-2 tracking-wide text-gradient">
            Full-stack Developer
          </h2>
          
          {/* Typing animation */}
          <div className="h-6 sm:h-7 md:h-8 lg:h-10 flex justify-center items-center mt-2">
            <p className="font-mono text-center text-white/80 text-xs sm:text-sm md:text-base">
              <span className="inline-block">Specializing in&nbsp; </span>
              <span className="inline-block text-emerald-300 font-semibold">
                {displayedText}
                <span className={`typing-cursor ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
              </span>
            </p>
          </div>
          
          <p className="text-center mt-3 md:mt-4 text-white/60 text-xs sm:text-sm md:text-base px-4 sm:px-0">
            I specialize in building responsive web applications with modern frontend technologies
            and robust backend systems. Currently studying at HAL Tokyo.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center mt-5 sm:mt-6 md:mt-8 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link 
            href="#projects" 
            onClick={(e) => handleScroll(e, 'projects')}
            aria-label="View my projects"
            className="btn-hover-effect group w-full sm:w-auto flex justify-center items-center gap-2 border border-white/15 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          >
            <span className="font-semibold">View My Projects</span>
            <ArrowDown className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-y-1" />
          </Link>
          <Link 
            href="#contact"
            onClick={(e) => handleScroll(e, 'contact')}
            aria-label="Contact me"
            className="btn-hover-effect w-full sm:w-auto flex justify-center items-center gap-2 border border-white bg-white text-gray-900 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white text-sm shadow-sm"
          >
            <span role="img" aria-label="wave emoji" className="text-base sm:text-lg">🙌</span>
            <span className="font-semibold">Let's Connect</span>
          </Link>
        </motion.div>
      </div>
        
      {/* Scroll indicator - moved outside content div */}
      <motion.div 
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 sm:opacity-100 opacity-80 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span className="text-white/60 text-sm tracking-wide font-medium mb-2 flex items-center gap-2">
          <ArrowDown className="size-3 text-emerald-300" />
          <span className="hidden sm:inline">Scroll to explore</span>
        </span>
        <div className="w-0.5 sm:w-1 h-12 sm:h-16 bg-gradient-to-b from-white/5 to-white/15 rounded-full relative overflow-hidden">
          <div className="absolute top-0 w-full bg-gradient-to-b from-emerald-300 to-sky-400 h-1/3 sm:h-1/2 rounded-full animate-scroll-indicator"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};
