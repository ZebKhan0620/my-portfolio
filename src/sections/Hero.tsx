'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';

// Define the skills to be displayed in the typing animation
const SKILLS_EN = [
  "Frontend Development",
  "PHP Backend",
  "Responsive Design",
  "UI/UX Implementation",
  "Full-stack Solutions",
];

const SKILLS_JA = [
  "フロントエンド開発",
  "PHPバックエンド",
  "レスポンシブデザイン",
  "UI/UX実装",
  "フルスタックソリューション"
];

export const HeroSection = () => {
  const { t, locale } = useLanguage();
  
  // Get skills based on current language
  const skills = useMemo(() => {
    return locale === 'ja' ? SKILLS_JA : SKILLS_EN;
  }, [locale]);
  
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
    // Japanese characters need a bit more time to be readable
    const typingSpeed = locale === 'ja' ? 150 : 120;
    const deletingSpeed = locale === 'ja' ? 80 : 60;
    const pauseDuration = 2000; // longer pause at the end of typing

    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion) {
      return () => {};
    }

    let timeout: NodeJS.Timeout;
    const skill = skills[currentSkill];
    
    if (isTyping) {
      if (displayedText.length < skill.length) {
        timeout = setTimeout(() => {
          setDisplayedText(skill.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Only set isTyping to false once
        if (isTyping) {
          timeout = setTimeout(() => {
            setIsTyping(false);
          }, pauseDuration);
        }
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Only change skill and typing state once when text is empty
        if (!isTyping && displayedText.length === 0) {
          setIsTyping(true);
          setCurrentSkill((currentSkill + 1) % skills.length);
        }
      }
    }
    
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedText, isTyping, currentSkill, skills, locale]);

  // Reset the animation when the language changes
  useEffect(() => {
    setCurrentSkill(0);
    setIsTyping(true);
    setDisplayedText('');
  }, [locale]);

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
        return Math.round(baseSize * 0.45); // Smaller for mobile
      } else if (width && width < 640) { // sm-md breakpoint
        return Math.round(baseSize * 0.55);
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
        <StarIcon className={`${isMobile ? 'size-5 xs:size-6' : 'size-8 sm:size-10 md:size-12'} text-emerald-300`} />
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
        onClick={() => {}}
        isDecorative={false}
        description="Decorative sparkle element"
        easing="linear"
        spinEasing="linear"
        animateOnVisible
      >
        <SparkleIcon className={`${isMobile ? 'size-5 xs:size-6' : 'size-8'} text-emerald-300/20`} />
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
        <StarIcon className={`${isMobile ? 'size-12 xs:size-16' : 'size-20 sm:size-24 md:size-28'} text-emerald-300`} />
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
        <SparkleIcon className={`${isMobile ? 'size-8 xs:size-10' : 'size-12 sm:size-14'} text-emerald-300/20`} />
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
      className="py-10 xs:py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 relative z-0 overflow-hidden w-full"
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
        {t('hero.skipToContent')}
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
          <div className="size-[200px] xs:size-[240px] sm:size-[340px] md:size-[480px] lg:size-[580px] xl:size-[620px] hero-ring"></div>
          <div className="size-[260px] xs:size-[320px] sm:size-[440px] md:size-[620px] lg:size-[760px] xl:size-[820px] hero-ring"></div>
          <div className="size-[340px] xs:size-[420px] sm:size-[580px] md:size-[750px] lg:size-[940px] xl:size-[1020px] hero-ring hidden xs:block"></div>
          <div className="size-[450px] xs:size-[550px] sm:size-[720px] md:size-[900px] lg:size-[1120px] xl:size-[1220px] hero-ring hidden sm:block"></div>
          <div className="size-[550px] xs:size-[650px] sm:size-[820px] md:size-[1020px] lg:size-[1280px] xl:size-[1420px] hero-ring hidden md:block"></div>
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
              className="size-[60px] xs:size-[70px] sm:size-[80px] md:size-[90px] lg:size-[100px] animate-float"
              src={memojiImage}
              alt="Memoji of Zeb Khan on a computer"
              priority
            />
          </motion.div>
          
          <motion.div 
            className="bg-gray-950 border border-gray-800 px-1.5 xs:px-2 sm:px-2.5 md:px-3.5 py-1 xs:py-1.5 inline-flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 rounded-lg mt-3 xs:mt-4 text-[10px] xs:text-xs sm:text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-green-500 size-1 xs:size-1.5 sm:size-2 md:size-2.5 rounded-full relative">
              <div className="bg-green-500 absolute rounded-full inset-0 animate-ping-large"></div>
            </div>
            <div className="font-medium">
              {t('hero.availableStatus')}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="max-w-[280px] xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto mt-3 xs:mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h1 className="font-serif text-base xs:text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl text-center mt-3 xs:mt-4 sm:mt-6 md:mt-8 tracking-wide">
            {t('hero.name')}
          </h1>
          <h2 className="font-serif text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-center mt-1 xs:mt-2 tracking-wide text-gradient">
            {t('hero.jobTitle')}
          </h2>
          
          {/* Typing animation */}
          <div className="h-5 xs:h-6 sm:h-7 md:h-8 lg:h-10 flex justify-center items-center mt-1 xs:mt-2">
            <p className="font-mono text-center text-white/80 text-[10px] xs:text-xs sm:text-sm md:text-base">
              <span className="inline-block">{t('hero.skills.prefix')}&nbsp; </span>
              <span className="inline-block text-emerald-300 font-semibold">
                {displayedText}
                <span className={`typing-cursor ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
              </span>
            </p>
          </div>
          
          <p className="text-center mt-2 xs:mt-3 md:mt-4 text-white/60 text-[10px] xs:text-xs sm:text-sm md:text-base px-2 xs:px-4 sm:px-0">
            {t('hero.description')}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center mt-4 xs:mt-5 sm:mt-6 md:mt-8 gap-2 xs:gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link 
            href="#projects" 
            onClick={(e) => handleScroll(e, 'projects')}
            aria-label="View my projects"
            className="btn-hover-effect group w-full sm:w-auto flex justify-center items-center gap-1.5 xs:gap-2 border border-white/15 px-2.5 xs:px-3.5 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 text-xs xs:text-sm"
          >
            <span className="font-semibold">{t('hero.viewProjects')}</span>
            <ArrowDown className="size-3 xs:size-3.5 sm:size-3.5 md:size-4 transition-transform duration-300 group-hover:translate-y-1" />
          </Link>
          <Link 
            href="#contact"
            onClick={(e) => handleScroll(e, 'contact')}
            aria-label="Contact me"
            className="btn-hover-effect w-full sm:w-auto flex justify-center items-center gap-1.5 xs:gap-2 border border-white bg-white text-gray-900 px-2.5 xs:px-3.5 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 rounded-xl hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white text-xs xs:text-sm shadow-sm"
          >
            <span role="img" aria-label="wave emoji" className="text-sm xs:text-base sm:text-base md:text-lg">🙌</span>
            <span className="font-semibold">{t('hero.connect')}</span>
          </Link>
        </motion.div>
      </div>
        
      {/* Scroll indicator - fixed position that doesn't overlap buttons */}
      <div className="absolute bottom-4 lg:bottom-6 xl:bottom-6 left-0 right-0 flex justify-center z-10 hidden xs:flex sm:hidden md:hidden lg:flex">
        <motion.div 
          className="flex flex-col items-center sm:opacity-100 opacity-80 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-white/60 text-xs xs:text-sm tracking-wide font-medium mb-1 xs:mb-2 flex items-center gap-1 xs:gap-2">
            <ArrowDown className="size-2.5 xs:size-3 text-emerald-300" />
            <span className="hidden lg:inline text-xs md:text-sm">{t('hero.scrollToExplore')}</span>
          </span>
          <div className="w-0.5 xs:w-0.5 md:w-1 h-8 xs:h-10 md:h-16 bg-gradient-to-b from-white/5 to-white/15 rounded-full relative overflow-hidden">
            <div className="absolute top-0 w-full bg-gradient-to-b from-emerald-300 to-sky-400 h-1/4 xs:h-1/3 md:h-1/2 rounded-full animate-scroll-indicator"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
