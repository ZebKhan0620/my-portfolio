"use client";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { CardHeader } from "@/components/CardHeader";
import StarIcon from "@/assets/icons/star.svg";
import CheckCircleIcon from "@/assets/icons/check-circle.svg";
import BookImage from "@/assets/images/book-cover.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaBook,
  FaPlane,
  FaGamepad,
  FaDumbbell,
  FaCar,
  FaMusic,
  FaHiking,
  FaPhp,
  FaDatabase,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiGithub,
  SiJquery,
  SiMysql,
} from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { TechIcon } from "@/components/TechIcon";
import MapImage from "@/assets/images/map.png";
import SmileMemoji from "@/assets/images/memoji-smile.png";
import { ToolboxItems } from "@/components/ToolboxItem";
import { useRef, useState, useEffect } from 'react';
import { EasingFunction, getEasingValue } from "@/config/animations";
import AchievementImage from "@/assets/images/HAL東京進級制作展 企画力賞受賞.png";

const Toolbox = [
  {
    name: "JavaScript",
    iconType: <SiJavascript />,
  },
  {
    name: "TypeScript", 
    iconType: <SiTypescript />,
  },
  {
    name: "React",
    iconType: <FaReact />,
  },
  {
    name: "Next.js",
    iconType: <RiNextjsFill />,
  },
  {
    name: "HTML5",
    iconType: <FaHtml5 />,
  },
  {
    name: "CSS3",
    iconType: <FaCss3 />,
  },
  {
    name: "Tailwind CSS",
    iconType: <SiTailwindcss />,
  },
  {
    name: "Node.js",
    iconType: <FaNodeJs />,
  },
  {
    name: "PHP",
    iconType: <FaPhp />,
  },
  {
    name: "MySQL",
    iconType: <SiMysql />,
  },
  {
    name: "jQuery",
    iconType: <SiJquery />,
  },
  {
    name: "GitHub",
    iconType: <SiGithub />,
  },
];

const Hobbies = [
  {
    name: "Reading",
    iconType: "📖",
    left: { base: "5%", xs: "5%", sm: "6%", md: "10%", lg: "12%" },
    top: { base: "5%", xs: "5%", sm: "5%", md: "5%", lg: "7%" },
    delay: 0,
    gradient: "from-purple-400 to-indigo-400",
  },
  {
    name: "Traveling",
    iconType: "🗺️",
    left: { base: "60%", xs: "58%", sm: "50%", md: "60%", lg: "62%" },
    top: { base: "5%", xs: "6%", sm: "5%", md: "5%", lg: "7%" },
    delay: 0.1,
    gradient: "from-sky-400 to-blue-500",
  },
  {
    name: "Gaming",
    iconType: "🎮",
    left: { base: "10%", xs: "10%", sm: "10%", md: "15%", lg: "18%" },
    top: { base: "30%", xs: "35%", sm: "30%", md: "35%", lg: "38%" },
    delay: 0.2,
    gradient: "from-green-400 to-teal-500",
  },
  {
    name: "Exercising",
    iconType: "🏋️",
    left: { base: "50%", xs: "52%", sm: "40%", md: "40%", lg: "45%" },
    top: { base: "40%", xs: "45%", sm: "50%", md: "50%", lg: "52%" },
    delay: 0.3,
    gradient: "from-red-400 to-rose-500",
  },
  {
    name: "Driving",
    iconType: "🚗",
    left: { base: "75%", xs: "78%", sm: "75%", md: "75%", lg: "75%" },
    top: { base: "25%", xs: "28%", sm: "30%", md: "35%", lg: "40%" },
    delay: 0.4,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    name: "Music",
    iconType: "🎵",
    left: { base: "15%", xs: "15%", sm: "15%", md: "20%", lg: "22%" },
    top: { base: "65%", xs: "68%", sm: "70%", md: "75%", lg: "75%" },
    delay: 0.5,
    gradient: "from-pink-400 to-fuchsia-500",
  },
  {
    name: "Hiking",
    iconType: "🥾",
    left: { base: "60%", xs: "63%", sm: "65%", md: "65%", lg: "68%" },
    top: { base: "65%", xs: "68%", sm: "70%", md: "70%", lg: "72%" },
    delay: 0.6,
    gradient: "from-emerald-400 to-green-500",
  },
];

export const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const constraintRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
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
  
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-14" ref={sectionRef}>
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[1280px]">
        <SectionHeader
          title="About Me"
          eyebrow="About Me"
          description="I'm Zeb Khan, a full-stack developer from Pakistan currently studying at HAL Tokyo. I'm passionate about building user-friendly web applications and continuously expanding my skills in both frontend and backend technologies."
        />
        
        {/* Modern Bento Grid Layout */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-6 gap-3 xs:gap-4">
          {/* About Me Card - Spans 2 columns */}
          <Card className="md:col-span-2 p-4 sm:p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <h3 className="text-lg xs:text-xl font-semibold text-white mb-3 sm:mb-4">My Journey</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 xs:gap-3 group">
                <div className="bg-gradient-to-r from-sky-400 to-emerald-400 p-1.5 xs:p-2 rounded-full flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <FaReact className="size-4 xs:size-5 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-white">Front-end Developer</p>
                  <p className="text-sm text-white/70">Creating intuitive and responsive user interfaces</p>
                </div>
              </div>
              <div className="flex items-start gap-2 xs:gap-3 group">
                <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-1.5 xs:p-2 rounded-full flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <FaBook className="size-4 xs:size-5 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-white">HAL Tokyo College</p>
                  <p className="text-sm text-white/70">Planning Award Winner - Car Marketplace Project</p>
                </div>
              </div>
              <div className="flex items-start gap-2 xs:gap-3 group">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-1.5 xs:p-2 rounded-full flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                  <FaGithub className="size-4 xs:size-5 text-gray-900" />
                </div>
                <div>
                  <p className="font-medium text-white">Technical Innovation</p>
                  <p className="text-sm text-white/70">Bridging powerful features with exceptional UX</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Card - Spans 2 columns */}
          <Card className="md:col-span-2 p-0 overflow-hidden relative min-h-[200px] xs:min-h-[220px] sm:min-h-[240px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8280305550287!2d139.76454677612345!3d35.681235979999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c0d02d8064d%3A0xd11a5f0b574e7b43!2sHAL%20TOKYO!5e0!3m2!1sen!2sjp!4v1709712345678!5m2!1sen!2sjp&markers=color:red%7Clabel:H%7C35.681236,139.764547"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover object-center rounded-3xl"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full size-14 xs:size-16 sm:size-20 after:content-[''] after:absolute after:inset-0 after:outline after:outline-2 after:-outline-offset-2 after:rounded-full after:outline-gray-950/30">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-20 animate-ping [animation-duration:2s]"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 to-sky-400 -z-10"></div>
              <Image 
                src={SmileMemoji} 
                alt="My memoji" 
                className="size-full p-1" 
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-white text-sm xs:text-base font-medium">HAL TOKYO College</p>
            </div>
          </Card>

          {/* Philosophy Card - Spans 2 columns */}
          <Card className="md:col-span-2 p-4 sm:p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <h3 className="text-lg xs:text-xl font-semibold text-white mb-3 sm:mb-4">My Philosophy</h3>
            <p className="text-white/80 mb-3 sm:mb-4">I believe in staying calm under pressure and approaching problems methodically. I never give up when facing challenges and value consistency in my growth journey.</p>
            <div className="w-20 xs:w-24 mx-auto">
              <Image
                src={BookImage}
                alt="Book Cover"
                priority
                className="focus-indicator"
              />
            </div>
          </Card>

          {/* Toolbox Section - Full Width */}
          <Card className="md:col-span-6 overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <div className="p-4 sm:p-5">
              <h3 className="text-lg xs:text-xl font-semibold text-white mb-1 sm:mb-2">My Toolbox</h3>
              <p className="text-white/60 text-sm">Technologies and skills I use to create digital experiences.</p>
            </div>
            <div className="motion-safe overflow-hidden pb-3 sm:pb-4">
              <ToolboxItems 
                items={Toolbox} 
                className="mt-2"
                ItemsWrapperClassName={`animate-move-left [animation-duration:45s] ${!prefersReducedMotion ? "ease-smooth" : ""}`}
              />
              <ToolboxItems 
                items={Toolbox.slice().reverse()} 
                className="mt-2" 
                ItemsWrapperClassName={`animate-move-right [animation-duration:30s] ${!prefersReducedMotion ? "ease-gentle" : ""}`} 
              />
            </div>
          </Card>

          {/* Hobbies Section - Full Width */}
          <Card className="md:col-span-6 min-h-[240px] xs:min-h-[260px] sm:min-h-[280px] p-0 bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <div className="p-4 sm:p-5">
              <h3 className="text-lg xs:text-xl font-semibold text-white mb-1 sm:mb-2">My Hobbies</h3>
              <p className="text-white/60 text-sm">When I'm not coding, here's what I enjoy doing.</p>
            </div>
            <div 
              className="relative h-[200px] xs:h-[220px] sm:h-[240px]" 
              ref={constraintRef}
              aria-label="Interactive hobby bubbles that can be dragged"
            >
              {Hobbies.map((hobby, index) => {
                // Determine which size key to use based on screen dimensions
                const sizeKey = typeof window !== 'undefined' && window.innerWidth <= 320 ? 'base' 
                  : typeof window !== 'undefined' && window.innerWidth <= 440 ? 'xs'
                  : typeof window !== 'undefined' && window.innerWidth <= 500 ? 'sm'
                  : typeof window !== 'undefined' && window.innerWidth <= 1280 ? 'md' 
                  : 'lg';
                
                return (
                  <motion.div 
                    key={hobby.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: hobby.delay, duration: 0.5 }
                    }}
                    className={`inline-block absolute bg-gradient-to-r ${hobby.gradient} rounded-full px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm shadow-lg cursor-grab active:cursor-grabbing`}
                    style={{
                      left: hobby.left[prefersReducedMotion ? 'base' : sizeKey],
                      top: hobby.top[prefersReducedMotion ? 'base' : sizeKey],
                    }}
                    drag={!prefersReducedMotion}
                    dragConstraints={constraintRef}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                    tabIndex={0}
                    role="button"
                    aria-label={`${hobby.name} hobby bubble, draggable`}
                  >
                    <span className="mr-1 xs:mr-1.5">{hobby.iconType}</span>
                    <span className="text-gray-900 font-medium">{hobby.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Career Goals Card - Spans 4 columns */}
          <Card className="md:col-span-4 p-4 xs:p-5 sm:p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <h3 className="text-lg xs:text-xl font-semibold text-sky-400 mb-4 sm:mb-6">Career Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Short-term Goals */}
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="bg-sky-400 p-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-white">Short-term Goals</h4>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-sky-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Complete studies at HAL Tokyo</span>
                      <span className="text-white/50 text-sm">Current Focus</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-sky-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Master frontend development skills</span>
                      <span className="text-white/50 text-sm">Technical Growth</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-sky-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Work as a full-stack developer</span>
                      <span className="text-white/50 text-sm">Career Transition</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Long-term Goals */}
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="bg-emerald-400 p-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-white">Long-term Goals</h4>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-emerald-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Focus on frontend skills for 3-4 years</span>
                      <span className="text-white/50 text-sm">Specialization Phase</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-emerald-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Transition to deeper backend development</span>
                      <span className="text-white/50 text-sm">Skill Expansion</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 xs:gap-3">
                    <div className="bg-emerald-400 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                      <CheckCircleIcon className="size-3.5 xs:size-4 text-gray-900" />
                    </div>
                    <div>
                      <span className="text-white/90 block">Become a well-rounded full-stack developer</span>
                      <span className="text-white/50 text-sm">Career Milestone</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Achievements Card - Spans 2 columns */}
          <Card className="md:col-span-2 p-4 xs:p-5 sm:p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/30">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-emerald-300 to-sky-400 p-1.5 rounded-full">
                <StarIcon className="size-4 xs:size-5 text-gray-900" />
              </div>
              <h3 className="text-lg xs:text-xl font-semibold text-white">Achievements</h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {/* IELTS Achievement */}
              <div className="group bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-3 xs:p-4 rounded-xl">
                <div className="flex items-start gap-2 xs:gap-3">
                  <div className="bg-gradient-to-r from-emerald-300 to-sky-400 rounded-full p-1.5 xs:p-2 flex-shrink-0">
                    <StarIcon className="size-4 xs:size-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base xs:text-lg text-white">IELTS Academic</h4>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs xs:text-sm">Score: 6.5</span>
                    </div>
                    <p className="text-white/70 mt-1 xs:mt-2 text-xs xs:text-sm">International English Language Testing System</p>
                  </div>
                </div>
              </div>

              {/* HAL Tokyo Achievement */}
              <div className="group bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3 xs:p-4 rounded-xl">
                <div className="flex items-start gap-2 xs:gap-3">
                  <div className="bg-gradient-to-r from-amber-300 to-amber-500 rounded-full p-1.5 xs:p-2 flex-shrink-0">
                    <StarIcon className="size-4 xs:size-5 text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-base xs:text-lg text-white">HAL Tokyo Award</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 xs:gap-2">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs xs:text-sm">Planning Award (企画力賞受賞)</span>
                      <button 
                        className="inline-flex items-center gap-1 xs:gap-1.5 px-2 xs:px-3 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-xs xs:text-sm hover:bg-amber-500/30 transition-colors group/cert relative"
                      >
                        <span>View Certificate</span>
                        <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19V6.413L11.707 13.707L10.293 12.293L17.587 5H13V3H21Z" />
                        </svg>
                        
                        <div className="absolute invisible opacity-0 group-hover/cert:visible group-hover/cert:opacity-100 transition-opacity duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                          <div className="bg-gray-900 border border-gray-700 p-1.5 rounded-lg shadow-xl">
                            <Image 
                              src={AchievementImage} 
                              alt="HAL Tokyo Award Certificate" 
                              width={240}
                              height={320}
                              className="rounded-md object-contain max-h-[180px] xs:max-h-[220px] w-auto"
                            />
                          </div>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-b border-r border-gray-700 transform rotate-45"></div>
                        </div>
                      </button>
                    </div>
                    <p className="text-white/60 text-xs xs:text-sm mt-1 xs:mt-2">
                      Recognized for exceptional planning and conceptual design skills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
