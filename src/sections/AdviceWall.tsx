"use client"

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import adviceService, { AdviceEntry } from '@/services/adviceService';

// Define the data structure for advice entries
// interface AdviceEntry {
//   id: string;
//   name: string;
//   message: string;
//   role: string;
//   timestamp: number;
// }

// Sample initial data for testing
const initialAdvice: AdviceEntry[] = [
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
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
};

// Component for individual advice entries with different display styles
const AdviceCard = ({ entry, displayStyle }: { entry: AdviceEntry, displayStyle: string }) => {
  // Different display styles for variety
  switch (displayStyle) {
    case 'flip':
      return (
        <motion.div 
          className="flip-card relative h-60 perspective"
          whileHover={{ rotateY: 180 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-full w-full relative preserve-3d rounded-xl">
            <div className="absolute inset-0 backface-hidden bg-gray-800/80 p-5 rounded-xl border border-white/10 shadow-lg">
              <div className="h-full flex flex-col">
                <h3 className="text-emerald-400 font-medium text-lg line-clamp-1">{entry.name}</h3>
                <p className="text-white/60 text-sm mb-4">{entry.role}</p>
                <div className="flex-grow flex items-center">
                  <p className="text-white/90 italic text-sm">"Click to see advice"</p>
                </div>
                <p className="text-white/40 text-xs text-right">{formatDate(entry.timestamp)}</p>
              </div>
            </div>
            <div className="absolute inset-0 backface-hidden bg-emerald-900/30 p-5 rounded-xl border border-emerald-400/20 shadow-lg rotateY-180">
              <div className="h-full flex flex-col">
                <p className="text-white/90 text-base flex-grow">"{entry.message}"</p>
                <p className="text-white/50 text-xs text-right pt-2">{formatDate(entry.timestamp)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    
    case 'lcd':
      return (
        <div className="bg-gray-900/70 rounded-lg border border-cyan-500/20 p-4 shadow-lg overflow-hidden">
          <div className="lcd-screen bg-cyan-950/70 p-3 rounded border border-cyan-400/30 shadow-inner">
            <div className="font-mono text-cyan-400 leading-relaxed space-y-2">
              <div className="flex justify-between text-xs">
                <span>FROM: {entry.name}</span>
                <span>{formatDate(entry.timestamp)}</span>
              </div>
              <div className="h-px bg-cyan-400/20 w-full"></div>
              <p className="typewriter-text text-sm py-2">"{entry.message}"</p>
              <div className="text-right text-xs text-cyan-400/60">{entry.role}</div>
            </div>
          </div>
        </div>
      );
      
    case 'neon':
      return (
        <motion.div 
          className="bg-gray-900/50 rounded-xl p-5 border border-pink-500/30 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-70"></div>
          <h3 className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            {entry.name}
          </h3>
          <p className="text-white/60 text-xs mb-3">{entry.role}</p>
          <p className="text-white/90 mb-3">"{entry.message}"</p>
          <p className="text-white/40 text-xs">{formatDate(entry.timestamp)}</p>
        </motion.div>
      );
      
    case 'ticker':
      return (
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <div className="ticker-header bg-gray-700/60 px-4 py-2 flex justify-between items-center">
            <h3 className="text-white font-medium truncate">{entry.name}</h3>
            <span className="text-white/40 text-xs ml-2">{formatDate(entry.timestamp)}</span>
          </div>
          <div className="ticker-content p-4 relative overflow-hidden">
            <div className="ticker-tape relative">
              <p className="ticker-scroll whitespace-nowrap text-yellow-400 font-mono text-lg">
                "{entry.message}" <span className="text-white/40 ml-4">—{entry.role}</span>
              </p>
            </div>
          </div>
        </div>
      );
      
    default: // 'card' - default style
      return (
        <motion.div 
          className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-white/10 shadow-lg"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-medium text-white">{entry.name}</h3>
              <p className="text-white/60 text-sm">{entry.role}</p>
            </div>
            <span className="text-white/40 text-xs">{formatDate(entry.timestamp)}</span>
          </div>
          <p className="text-white/90">"{entry.message}"</p>
        </motion.div>
      );
  }
};

export default function AdviceWall() {
  const [advice, setAdvice] = useState<AdviceEntry[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Load advice from API or localStorage on component mount
  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const adviceData = await adviceService.getAllAdvice();
        setAdvice(adviceData.length > 0 ? adviceData : initialAdvice);
      } catch (err) {
        console.error('Error fetching advice:', err);
        // Fallback to initial data if API and localStorage both fail
        setAdvice(initialAdvice);
      }
    };

    fetchAdvice();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !message.trim()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit advice via API service
      await adviceService.submitAdvice({
        name,
        role,
        message,
      });
      
      // Refresh advice list
      const updatedAdvice = await adviceService.getAllAdvice();
      setAdvice(updatedAdvice);
      
      // Reset form
      setName('');
      setRole('');
      setMessage('');
      setSuccess(true);
      
      // Clear success message after delay
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error('Error submitting advice:', err);
      setError('Failed to submit your advice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Assign a display style to each advice entry
  const getDisplayStyle = (index: number): string => {
    const styles = ['card', 'lcd', 'neon', 'flip', 'ticker'];
    return styles[index % styles.length];
  };
  
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Advice</span> Wall
          </h2>
          <p className="mt-3 sm:mt-4 md:mt-6 text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
            Have some advice or feedback? I'd love to hear from fellow developers, designers, and recruiters.
            Your insights help me grow!
          </p>
        </div>

        {/* Submission form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl max-w-2xl mx-auto mb-16">
          <h3 className="text-xl sm:text-2xl font-medium mb-4">Share Your Advice</h3>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-white/80 text-sm mb-1">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-white/80 text-sm mb-1">Role</label>
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  placeholder="Developer, Designer, Recruiter, etc."
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-white/80 text-sm mb-1">Your Advice *</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 h-28"
                placeholder="Share your advice, feedback, or suggestions..."
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-white/40 text-xs">* Required fields</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 rounded-lg text-white font-medium transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Share Advice'}
              </button>
            </div>
            
            {/* Success message */}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thank you for your advice!</span>
                </div>
              </div>
            )}
            
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Display advice in different styles */}
        {advice.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advice.map((entry, index) => (
              <AdviceCard 
                key={entry.id} 
                entry={entry} 
                displayStyle={getDisplayStyle(index)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-white/60">Be the first to leave advice!</p>
          </div>
        )}
      </div>
      
      {/* Add some custom styles for flip cards and LCD effect */}
      <style jsx global>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotateY-180 { transform: rotateY(180deg); }
        
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
          height: 80px;
          display: flex;
          align-items: center;
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
      `}</style>
    </section>
  );
} 