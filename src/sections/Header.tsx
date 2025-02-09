'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const pathname = usePathname();
  
  return (
    <div className="flex justify-center items-center fixed left-[50%] translate-x-[-50%] top-3 z-50">
      <nav className="flex gap-1 p-0.5 backdrop-blur border border-white/15 rounded-full bg-white/10">
        <Link href="/" className={`nav-item ${pathname === '/' ? 'bg-white text-gray-900' : 'hover:bg-white/10 transition-colors'}`}>
          Home
        </Link>
        <Link href="#projects" className="nav-item hover:bg-white/10 transition-colors">
          Projects
        </Link>
        <Link href="#about" className="nav-item hover:bg-white/10 transition-colors">
          About
        </Link>
        <Link href="#contact" className="nav-item bg-white text-gray-900 hover:bg-white/90 transition-colors">
          Contact
        </Link>
      </nav>
    </div>
  );
};
