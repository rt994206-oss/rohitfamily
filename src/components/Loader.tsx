import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Loader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Text animation
      tl.fromTo(textRef.current, 
        { y: 50, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' }
      );

      // Progress bar growing
      tl.to(progressRef.current, {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut'
      }, '-=1');

      // Fade out everything
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        delay: 0.2
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,217,232,0.1)_0,transparent_50%)]"></div>
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-teal rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 ref={textRef} className="text-4xl md:text-6xl font-display font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40 mb-8 tracking-widest uppercase">
          Rohit Family
        </h1>
        
        {/* Sleek Progress Bar */}
        <div className="w-64 h-[1px] bg-white/10 overflow-hidden">
          <div ref={progressRef} className="w-0 h-full bg-neon-teal shadow-[0_0_10px_rgba(5,217,232,0.8)]"></div>
        </div>
        
        <div className="mt-4 text-xs font-sans text-white/40 tracking-widest uppercase animate-pulse">
          Initializing Memories
        </div>
      </div>
    </div>
  );
};
