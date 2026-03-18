import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  { year: 'Childhood', desc: 'The early days of wonder.' },
  { year: 'Trips', desc: 'Adventures across the world.' },
  { year: 'Festivals', desc: 'Celebrating moments together.' },
  { year: 'Events', desc: 'Milestones that define us.' }
];

export const Timeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the line drawing down
      gsap.fromTo(lineRef.current,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );

      // Animate each event card
      gsap.utils.toArray<HTMLElement>('.timeline-card').forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
            }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative py-32 max-w-5xl mx-auto px-6">
      {/* Background Line */}
      <div className="absolute left-1/2 top-32 bottom-32 w-[1px] bg-white/10 -translate-x-1/2"></div>
      {/* Animated Line */}
      <div 
        ref={lineRef} 
        className="absolute left-1/2 top-32 w-[2px] bg-gradient-to-b from-neon-teal via-neon-purple to-neon-pink -translate-x-1/2 shadow-[0_0_15px_rgba(5,217,232,0.8)]"
      ></div>

      <div className="relative z-10 flex flex-col gap-32">
        {timelineEvents.map((event, index) => (
          <div key={index} className={`flex items-center w-full timeline-card ${
            index % 2 === 0 ? 'justify-start' : 'justify-end'
          }`}>
            <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
              <div className="glass-card p-8 interactive group hover:bg-white/10 transition-colors">
                <h3 className="text-3xl font-display font-medium text-white mb-2 group-hover:text-glow">
                  {event.year}
                </h3>
                <p className="text-white/60 font-sans tracking-widest text-sm uppercase">
                  {event.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
