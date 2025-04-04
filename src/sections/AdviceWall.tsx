"use client"

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionHeader } from '@/components/SectionHeader';

// Sample initial data
const initialAdvice = [
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

// Format the timestamp
const formatDate = (timestamp: number, t: any): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return t('advice.dateFormat.today');
  } else if (diffDays === 1) {
    return t('advice.dateFormat.yesterday');
  } else if (diffDays < 7) {
    return `${diffDays} ${t('advice.dateFormat.daysAgo')}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
};

// Component for individual advice entries with different display styles
const AdviceCard = ({ entry, displayStyle, t }: { entry: typeof initialAdvice[0], displayStyle: string, t: any }) => {
  // Different display styles for variety
  switch (displayStyle) {
    case 'gradient':
      return (
        <motion.div 
          className="relative bg-gradient-to-br from-indigo-900/40 to-violet-900/40 rounded-xl p-4 xs:p-5 border border-indigo-500/20 shadow-lg overflow-hidden h-full flex flex-col"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-600/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="flex justify-between items-start mb-2 xs:mb-3">
            <h3 className="text-base xs:text-lg font-medium text-indigo-300 line-clamp-1">{entry.name}</h3>
            <span className="text-indigo-200/40 text-xs whitespace-nowrap ml-2">{formatDate(entry.timestamp, t)}</span>
          </div>
          <div className="overflow-y-auto flex-grow mb-2 xs:mb-3">
            <p className="text-white/90 text-sm xs:text-base">"{entry.message}"</p>
          </div>
          <p className="text-indigo-300/60 text-xs xs:text-sm mt-auto">{entry.role}</p>
        </motion.div>
      );
    
    case 'lcd':
      return (
        <div className="bg-gray-900/70 rounded-lg border border-cyan-500/20 p-3 xs:p-4 shadow-lg overflow-hidden h-full flex flex-col">
          <div className="lcd-screen bg-cyan-950/70 p-2 xs:p-3 rounded border border-cyan-400/30 shadow-inner flex-grow">
            <div className="font-mono text-cyan-400 leading-relaxed space-y-2 h-full flex flex-col">
              <div className="flex justify-between text-xs">
                <span className="line-clamp-1 pr-2">{t('advice.terminal.from')}: {entry.name}</span>
                <span className="whitespace-nowrap">{formatDate(entry.timestamp, t)}</span>
              </div>
              <div className="h-px bg-cyan-400/20 w-full"></div>
              <div className="flex-grow overflow-y-auto">
                <p className="text-xs xs:text-sm py-2">"{entry.message}"</p>
              </div>
              <div className="text-right text-xs text-cyan-400/60 line-clamp-1">{entry.role}</div>
            </div>
          </div>
        </div>
      );
      
    case 'neon':
      return (
        <motion.div 
          className="bg-gray-900/50 rounded-xl p-4 xs:p-5 border border-pink-500/30 shadow-lg relative overflow-hidden h-full flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-70"></div>
          <div className="flex justify-between items-start mb-2 xs:mb-3">
            <h3 className="text-base xs:text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 line-clamp-1 pr-2">
              {entry.name}
            </h3>
            <span className="text-white/40 text-xs whitespace-nowrap">{formatDate(entry.timestamp, t)}</span>
          </div>
          <p className="text-white/60 text-xs xs:text-sm mb-2">{entry.role}</p>
          <div className="flex-grow overflow-y-auto">
            <p className="text-white/90 text-sm xs:text-base">"{entry.message}"</p>
          </div>
        </motion.div>
      );
      
    case 'ticker':
      return (
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg h-full flex flex-col">
          <div className="ticker-header bg-gray-700/60 px-3 xs:px-4 py-2 flex justify-between items-center">
            <h3 className="text-white font-medium truncate text-sm xs:text-base">{entry.name}</h3>
            <span className="text-white/40 text-xs ml-2 whitespace-nowrap">{formatDate(entry.timestamp, t)}</span>
          </div>
          <div className="flex-grow flex flex-col">
            <div className="ticker-content px-3 xs:px-4 py-2 xs:py-3 relative overflow-hidden">
              <div className="ticker-tape relative">
                <p className="ticker-scroll whitespace-nowrap text-yellow-400 font-mono text-sm xs:text-base">
                  "{entry.message}" <span className="text-white/40 ml-4">—{entry.role}</span>
                </p>
              </div>
            </div>
            <div className="mt-auto p-2 xs:p-3 text-right border-t border-white/10">
              <span className="text-white/60 text-xs">{entry.role}</span>
            </div>
          </div>
        </div>
      );
    
    case 'paper':
      return (
        <div className="bg-amber-100/95 rounded-lg p-4 xs:p-5 shadow-lg relative overflow-hidden transform rotate-1 h-full flex flex-col">
          <div className="absolute top-0 right-0 border-l-8 border-b-8 border-l-amber-200 border-b-amber-200 w-5 h-5"></div>
          <div className="mb-2 xs:mb-3 border-b border-amber-200 pb-2">
            <div className="flex justify-between">
              <h3 className="text-amber-900 font-medium text-sm xs:text-base line-clamp-1 pr-2">{entry.name}</h3>
              <span className="text-amber-700/60 text-xs whitespace-nowrap">{formatDate(entry.timestamp, t)}</span>
            </div>
            <p className="text-amber-700 text-xs">{entry.role}</p>
          </div>
          <div className="flex-grow overflow-y-auto">
            <p className="text-amber-950 font-handwriting text-base xs:text-lg">"{entry.message}"</p>
          </div>
        </div>
      );
      
    case 'terminal':
      return (
        <div className="bg-gray-950 rounded-lg border border-green-500/30 p-3 xs:p-4 font-mono shadow-lg overflow-hidden h-full flex flex-col">
          <div className="flex items-center mb-2 xs:mb-3">
            <div className="flex gap-1.5 mr-3">
              <div className="size-2.5 xs:size-3 rounded-full bg-red-500/80"></div>
              <div className="size-2.5 xs:size-3 rounded-full bg-amber-500/80"></div>
              <div className="size-2.5 xs:size-3 rounded-full bg-green-500/80"></div>
            </div>
            <p className="text-white/40 text-xs">{t('advice.terminal.user')}</p>
          </div>
          <p className="text-green-500 mb-1 xs:mb-2 text-xs xs:text-sm">
            <span className="text-blue-400">{t('advice.terminal.cat')}</span> advice_from_{entry.name.toLowerCase().replace(/\s+/g, '_')}.txt
          </p>
          <div className="flex-grow overflow-y-auto">
            <p className="text-white/90 mb-2 xs:mb-3 text-xs xs:text-sm whitespace-pre-line pl-2 xs:pl-4">"{entry.message}"</p>
          </div>
          <p className="text-white/40 text-xs flex justify-between border-t border-white/10 pt-2 mt-auto">
            <span className="line-clamp-1 pr-2">{entry.role}</span>
            <span className="text-green-400/70 whitespace-nowrap">{t('advice.dateFormat.created')}: {formatDate(entry.timestamp, t)}</span>
          </p>
        </div>
      );
    
    case 'glass':
      return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 xs:p-5 border border-white/10 shadow-lg relative overflow-hidden h-full flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none"></div>
          <div className="relative h-full flex flex-col">
            <div className="flex justify-between items-start mb-2 xs:mb-3">
              <h3 className="text-white font-medium text-sm xs:text-base line-clamp-1 pr-2">{entry.name}</h3>
              <span className="text-white/40 text-xs whitespace-nowrap">{formatDate(entry.timestamp, t)}</span>
            </div>
            <div className="flex-grow overflow-y-auto">
              <p className="text-white/90 text-sm xs:text-base mb-3">"{entry.message}"</p>
            </div>
            <p className="text-white/60 text-xs xs:text-sm inline-block px-2 py-0.5 bg-white/10 rounded-full mt-auto">{entry.role}</p>
          </div>
        </div>
      );

    default: // 'card' - default style
      return (
        <motion.div 
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 xs:p-5 border border-white/10 shadow-lg h-full flex flex-col"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start mb-2 xs:mb-3">
            <div>
              <h3 className="text-base xs:text-lg font-medium text-white line-clamp-1">{entry.name}</h3>
              <p className="text-white/60 text-xs xs:text-sm">{entry.role}</p>
            </div>
            <span className="text-white/40 text-xs whitespace-nowrap ml-2">{formatDate(entry.timestamp, t)}</span>
          </div>
          <div className="flex-grow overflow-y-auto">
            <p className="text-white/90 text-sm xs:text-base">"{entry.message}"</p>
          </div>
        </motion.div>
      );
  }
};

export default function AdviceWall() {
  const { t, language } = useLanguage();
  const [advice, setAdvice] = useState(initialAdvice);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const autoScrollRef = useRef<NodeJS.Timeout>();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Check if device is touch-enabled and screen size
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Show arrows for laptop and desktop screens (>= 1280px)
      setShowArrows(width >= 1280);
      setIsTouchDevice(isTouch);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (!autoScroll || advice.length <= 1) return;

    const interval = setInterval(() => {
      const totalPages = getTotalPages();
      setCurrentIndex((prevIndex) => 
        prevIndex === totalPages - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Scroll every 5 seconds

    autoScrollRef.current = interval;

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, [autoScroll, advice.length]);

  // Pause auto-scroll on user interaction
  const pauseAutoScroll = () => {
    setAutoScroll(false);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
    }
    // Resume auto-scroll after 15 seconds of inactivity
    setTimeout(() => setAutoScroll(true), 15000);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoScroll();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Calculate cards per page based on screen size
  const getCardsPerPage = () => {
    if (typeof window === 'undefined') return 4; // Default for SSR
    
    const width = window.innerWidth;
    if (width < 320) return 1; // Mobile (320x568)
    if (width < 440) return 1; // iPhone (440x882)
    if (width < 500) return 1; // Small tablets
    if (width < 768) return 2; // Tablets (500x768)
    if (width < 1280) return 3; // Laptops (1280x800)
    return 4; // Desktop (1440x900)
  };

  // Calculate total pages based on cards per page
  const getTotalPages = () => {
    if (!advice.length) return 0;
    const cardsPerPage = getCardsPerPage();
    return Math.max(1, Math.ceil(advice.length / cardsPerPage));
  };

  // Update touch handlers to pause auto-scroll
  const nextSlide = () => {
    pauseAutoScroll();
    const totalPages = getTotalPages();
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    pauseAutoScroll();
    const totalPages = getTotalPages();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  // Update dots click handler
  const handleDotClick = (index: number) => {
    pauseAutoScroll();
    setCurrentIndex(index);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/advice', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      // if (!response.ok) throw new Error('Failed to submit advice');
      
      // For now, just simulate success
      const newAdvice = {
        id: String(Date.now()),
        name: formData.name,
        role: formData.role,
        message: formData.message,
        timestamp: Date.now()
      };
      
      setAdvice(prev => [newAdvice, ...prev]);
      setSubmitSuccess(true);
      setFormData({ name: '', message: '', role: '' });
    } catch (err) {
      console.error('Error submitting advice:', err);
      setSubmitError(t('advice.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDisplayStyle = (id: string): string => {
    const styles = ['card', 'lcd', 'neon', 'ticker', 'paper', 'terminal', 'gradient', 'glass'];
    const lastChar = id.slice(-1);
    const styleIndex = parseInt(lastChar, 16) % styles.length;
    return styles[styleIndex];
  };
  
  return (
    <section className="py-12 xs:py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-7xl">
        <SectionHeader
          title={t('adviceWall.title')}
          eyebrow={t('adviceWall.eyebrow')}
          description={t('adviceWall.description')}
        />

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl xs:rounded-2xl p-4 xs:p-6 sm:p-8 border border-white/10 shadow-xl max-w-2xl mx-auto mb-12 xs:mb-16">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-medium mb-3 xs:mb-4">{t('advice.form.title')}</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 xs:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
              <div>
                <label htmlFor="name" className="block text-white/80 text-xs xs:text-sm mb-1">{t('advice.form.nameLabel')}</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-1.5 xs:py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm"
                  placeholder={t('advice.form.namePlaceholder')}
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-white/80 text-xs xs:text-sm mb-1">{t('advice.form.roleLabel')}</label>
                <input
                  type="text"
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-1.5 xs:py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm"
                  placeholder={t('advice.form.rolePlaceholder')}
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-white/80 text-xs xs:text-sm mb-1">{t('advice.form.messageLabel')}</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-1.5 xs:py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-sm h-20 xs:h-24 sm:h-28"
                placeholder={t('advice.form.messagePlaceholder')}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between pt-1 xs:pt-2">
              <p className="text-white/40 text-xs">{t('advice.form.requiredFields')}</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 xs:px-4 py-1.5 xs:py-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 rounded-lg text-white text-sm font-medium transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting ? t('advice.form.processing') : t('advice.form.submitButton')}
              </button>
            </div>
            
            {/* Success message */}
            {submitSuccess && (
              <div className="p-2 xs:p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{t('advice.form.successMessage')}</span>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {submitError && (
              <div className="p-2 xs:p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 xs:w-5 xs:h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm">{submitError}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Carousel */}
        {advice.length > 0 ? (
          <div className="relative">
            {/* Left arrow - shown on laptop and desktop */}
            {showArrows && (
              <button
                onClick={prevSlide}
                className="absolute left-[-30px] xs:left-[-40px] sm:left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 text-white p-1.5 xs:p-2 rounded-full shadow-lg transition-all duration-300"
                aria-label={t('advice.carousel.previousSlide')}
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Carousel container with touch support */}
            <div 
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-in-out" 
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                  <div key={pageIndex} className="flex-none w-full">
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
                      {advice.slice(pageIndex * getCardsPerPage(), (pageIndex + 1) * getCardsPerPage()).map((entry) => (
                        <div 
                          key={entry.id} 
                          className="h-56 xs:h-64 sm:h-72 lg:h-80"
                        >
                          <AdviceCard 
                            entry={entry} 
                            displayStyle={getDisplayStyle(entry.id)} 
                            t={t}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right arrow - shown on laptop and desktop */}
            {showArrows && (
              <button
                onClick={nextSlide}
                className="absolute right-[-30px] xs:right-[-40px] sm:right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 text-white p-1.5 xs:p-2 rounded-full shadow-lg transition-all duration-300"
                aria-label={t('advice.carousel.nextSlide')}
              >
                <svg className="w-4 h-4 xs:w-5 xs:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            
            {/* Simple dots - always visible */}
            {getTotalPages() > 1 && (
              <div className="flex justify-center mt-4 xs:mt-6 gap-1.5 xs:gap-2">
                {Array.from({ length: getTotalPages() }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-emerald-500' : 'bg-gray-600'
                    }`}
                    aria-label={`${t('advice.carousel.goToPage')} ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 xs:py-10">
            <p className="text-white/60 text-sm xs:text-base">{t('advice.carousel.emptyState')}</p>
          </div>
        )}
      </div>
      
      {/* Add custom styles */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        .typewriter-text {
          overflow: hidden;
          border-right: 2px solid rgba(6, 182, 212, 0.5);
          white-space: nowrap;
          animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: rgba(6, 182, 212, 0.7) }
        }
        
        /* Ticker Scroll Animation */
        .ticker-content {
          height: 60px;
          display: flex;
          align-items: center;
        }
        
        @media (min-width: 375px) {
          .ticker-content {
            height: 70px;
          }
        }
        
        .ticker-tape {
          width: 100%;
          overflow: hidden;
        }
        
        .ticker-scroll {
          display: inline-block;
          padding-left: 100%;
          animation: ticker 20s linear infinite;
        }
        
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        
        /* Paper note style font */
        @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');
        .font-handwriting {
          font-family: 'Caveat', cursive;
          font-size: 1.25rem;
        }
      `}</style>
    </section>
  );
} 