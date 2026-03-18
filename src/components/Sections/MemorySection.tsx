import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MemorySectionProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

export const MemorySection: React.FC<MemorySectionProps> = ({ title, subtitle, children, align = 'center' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax and fade effect for text
      gsap.fromTo(textRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 40%",
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative min-h-screen py-32 flex flex-col justify-center overflow-hidden"
    >
      <div className={`container mx-auto px-6 mb-20 z-10 ${
        align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
      }`}>
        <div ref={textRef} className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-light text-glow mb-4 tracking-tight">
            {title}
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r from-neon-teal to-neon-purple mb-8 ${
            align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
          }`}></div>
          <p className="text-lg md:text-xl text-white/60 font-sans tracking-widest uppercase">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative z-20">
        {children}
      </div>
      
      {/* Decorative ambient light specifically for this section */}
      <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none flex items-center justify-center opacity-10 blur-[150px]">
        <div className="w-[800px] h-[400px] bg-neon-pink rounded-[100%] mix-blend-screen"></div>
      </div>
    </section>
  );
};
