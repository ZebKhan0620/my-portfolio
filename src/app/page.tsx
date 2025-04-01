import {Header} from '@/sections/Header';
import {HeroSection} from '@/sections/Hero';
import ProjectsSection from '@/sections/Projects';
import { TapeSection } from '@/sections/Tape';
import { AboutSection } from '@/sections/About';
import { ContactSection } from '@/sections/Contact'
import AdviceWall from '@/sections/AdviceWall';
import { Footer } from '@/sections/Footer';
import { ScrollProgressIndicator } from '@/components/ScrollProgressIndicator';

export default function Home() {
  return (
    <div className="relative">
      {/* Accessibility landmark for assistive technology */}
      <header>
        <Header />
        {/* Skip link target */}
        <a id="main-content" className="sr-only">Main content</a>
      </header>
      
      <main>
        {/* Scroll progress indicator */}
        <ScrollProgressIndicator />
        
        {/* Main sections */}
        <section id="home" aria-label="Introduction">
          <HeroSection />
        </section>
        
        <section id="projects" aria-label="My Projects">
          <ProjectsSection />
        </section>
        
        <div aria-hidden="true">
          <TapeSection />
        </div>
        
        <section id="about" aria-label="About Me">
          <AboutSection />
        </section>
        
        <section id="advice" aria-label="Advice Wall">
          <AdviceWall />
        </section>
        
        <section id="contact" aria-label="Contact Information">
          <ContactSection />
        </section>
      </main>
      
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
