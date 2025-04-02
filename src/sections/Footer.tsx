import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg';

const footerLinks = [
  {
    title: 'GitHub',
    href: 'https://github.com/ZebKhan0620',
    icon: (
      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    )
  },
  {
    title: 'Email',
    href: 'mailto:zebkhan0620@gmail.com',
    icon: (
      <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
      </svg>
    )
  }
];

export const Footer = () => {
  return (
    <footer className="relative -z-10 overflow-x-clip">
      {/* Background gradient */}
      <div className="absolute h-[300px] sm:h-[350px] md:h-[400px] w-full sm:w-[120%] md:w-[140%] lg:w-[160%] xl:w-[180%] bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-t from-emerald-300/30 to-transparent [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10"></div>
      
      {/* Content */}
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
        <div className="border-t border-white/15 py-4 xs:py-5 sm:py-6 md:py-8">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-4">
            {/* Copyright */}
            <div className="text-white/40 text-[10px] xs:text-xs sm:text-sm">
              &copy; {new Date().getFullYear()} Zeb Khan. All rights reserved.
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-3 xs:gap-4 sm:gap-6">
              {footerLinks.map(link => (
                <a 
                  href={link.href} 
                  key={link.title} 
                  className="inline-flex items-center gap-1.5 group text-white/60 hover:text-white transition-colors duration-300"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.icon}
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium">{link.title}</span>
                  <ArrowUpRightIcon className="size-2.5 xs:size-3 sm:size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"/>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
