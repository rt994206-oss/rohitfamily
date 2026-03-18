import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollPromptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We delay the hero animation slightly to allow Loader to finish (3s)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 3.2 });
      
      // Title characters animation (assuming simple fade up for now)
      tl.fromTo(titleRef.current,
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }
      )
      .fromTo(subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        "-=1"
      )
      .fromTo(scrollPromptRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        "-=0.5"
      );

      // Continuous bounce for scroll prompt
      gsap.to(scrollPromptRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'sine.inOut',
        delay: 4.5
      });
      
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center pointer-events-none">
      <div className="z-10 text-center px-4">
        <h1 
          ref={titleRef}
          className="font-display font-light text-5xl md:text-8xl lg:text-9xl tracking-tight text-white mix-blend-plus-lighter opacity-0 relative"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-teal via-white to-neon-purple animate-text-shine inline-block">
            Rohit Family
          </span>
          <br />
          <span className="text-3xl md:text-6xl font-serif italic text-neon-teal/80 text-glow inline-block animate-float">Memories</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="mt-8 font-sans text-lg md:text-xl text-white/50 max-w-2xl mx-auto uppercase tracking-[0.2em] opacity-0"
        >
          A Cinematic Journey Through Time
        </p>
      </div>

      <div 
        ref={scrollPromptRef}
        className="absolute bottom-12 flex flex-col items-center gap-2 opacity-0 opacity-80"
      >
        <span className="text-xs uppercase tracking-widest text-white/40 font-sans">Scroll to explore</span>
        <ChevronDown className="text-white/40 w-5 h-5" />
      </div>
    </section>
  );
};
