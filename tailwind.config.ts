import { addScaleCorrector } from "framer-motion";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2.5rem",
        xl: "3rem",
      },
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px"
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', "ui-sans-serif", "system-ui"],
        serif: ['var(--font-serif)', "ui-serif", "Georgia"],
      },
      animation: {
        'ping-large': "ping-large 1s ease-in-out infinite",
        'move-left': "move-left 30s linear infinite",
        'move-right': "move-right 15s linear infinite",
        'orbit-clockwise': "orbit-clockwise 40s linear infinite forwards",
        'orbit-counter': "orbit-counter 40s linear infinite forwards",
        'float': "float 4s ease-in-out infinite",
        'pulse-slow': "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        'bounce-in': "bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        'slide-in': "slide-in 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        'fade-in': "fade-in 0.4s ease-out forwards",
        'scale-in': "scale-in 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        'scroll-indicator': "scroll-indicator 2.5s ease-in-out infinite",
      },
      keyframes: {
        'ping-large': {
          '75%, 100%': {
            transform: 'scale(3)',
            opacity: '0',
          }
        },
        'move-left': {
          '0%': {
            transform: 'translateX(0%)'
          },
          '100%': {
            transform: 'translateX(-50%)'
          }
        },
        'move-right': {
          '0%': {
            transform: 'translateX(-50%)'
          },
          '100%': {
            transform: 'translateX(0%)'
          }
        },
        'orbit-clockwise': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          }
        },
        'orbit-counter': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(-360deg)',
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          }
        },
        'scroll-indicator': {
          '0%, 100%': {
            transform: 'translateY(0%)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateY(70%)',
            opacity: '0.6',
          }
        },
        'bounce-in': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        }
      },
      transitionTimingFunction: {
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.45, 0, 0.55, 1)',
        'sharp': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'gentle': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }
    },
  },
  plugins: [],
};
export default config;
