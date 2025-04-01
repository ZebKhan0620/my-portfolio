import ArrowUpRightIcon from '@/assets/icons/arrow-up-right.svg';

const footerLinks = [
  {
    title: 'GitHub',
    href: 'https://github.com/ZebKhan0620',
  },
  {
    title: 'Email',
    href: 'mailto:contact@zebkhan.dev',
  },
  {
    title: 'LinkedIn',
    href: '#', // Add your LinkedIn URL when available
  }
];

export const Footer = () => {
  return ( 
  <footer className='relative -z-10 overflow-x-clip'>
    <div className='absolute h-[300px] sm:h-[350px] md:h-[400px] w-full sm:w-[120%] md:w-[140%] lg:w-[160%] xl:w-[180%] bottom-0 left-1/2 -translate-x-1/2 bg-emerald-300/30 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10'></div>
    <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
    <div className='border-t border-white/15 py-5 sm:py-6 md:py-8 text-xs sm:text-sm gap-5 sm:gap-6 md:gap-8 flex flex-col md:flex-row md:justify-between items-center'>
      <div className='text-white/40'>&copy; {new Date().getFullYear()} Zeb Khan. All rights reserved.</div>
      <nav className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8'>
        {footerLinks.map(link => (
          <a 
            href={link.href} 
            key={link.title} 
            className='inline-flex items-center gap-1 sm:gap-1.5'
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <span className='font-semibold'>{link.title}</span>
            <ArrowUpRightIcon className='size-3.5 sm:size-4'/>
          </a>
        ))}
      </nav>
    </div>
    </div>
  </footer>
  );
};
