import { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { Hero } from './components/Hero';
import { ThreeBackground } from './components/ThreeBackground';
import { CustomCursor } from './components/CustomCursor';
import { MasonryGallery } from './components/Gallery/MasonryGallery';
import { Lightbox } from './components/Viewer/Lightbox';
import { MemorySection } from './components/Sections/MemorySection';
import { Timeline } from './components/Sections/Timeline';
import { useDriveFiles } from './hooks/useDriveFiles';
import { DriveFile } from './services/driveApi';
import Lenis from '@studio-freight/lenis';

function App() {
  const [loadingApp, setLoadingApp] = useState(true);
  const { files, loading, error, hasMore, loadMore } = useDriveFiles();
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  useEffect(() => {
    // Setting up Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Simulate initial cinematic loading sequence
    const timer = setTimeout(() => {
      setLoadingApp(false);
    }, 4500);
    
    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  const handleNext = () => {
    if (!selectedFile) return;
    const currentIndex = files.findIndex(f => f.id === selectedFile.id);
    if (currentIndex < files.length - 1) {
      setSelectedFile(files[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!selectedFile) return;
    const currentIndex = files.findIndex(f => f.id === selectedFile.id);
    if (currentIndex > 0) {
      setSelectedFile(files[currentIndex - 1]);
    }
  };

  return (
    <>
      {/* Cinematic Film Grain Noise Overlay */}
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fixed inset-0 z-[150] w-full h-full opacity-[0.04] pointer-events-none mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
      </svg>

      <CustomCursor />
      {loadingApp && <Loader />}
      
      <Lightbox 
        file={selectedFile} 
        onClose={() => setSelectedFile(null)} 
        onNext={handleNext}
        onPrev={handlePrev}
      />

      <div className="relative min-h-screen w-full select-none bg-black">
        {/* Fixed 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ThreeBackground />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 transition-opacity duration-1000" style={{ opacity: loadingApp ? 0 : 1 }}>
          <Hero />
          
          {error && (
            <div className="w-full text-center py-12">
              <p className="text-red-400 glass-card inline-block px-8 py-4 font-sans tracking-widest uppercase">
                {error}
              </p>
            </div>
          )}

          <MemorySection 
            title="Family Moments" 
            subtitle="A collection of timeless memories"
            align="center"
          >
            <MasonryGallery 
              files={files} 
              onFileClick={setSelectedFile} 
              loading={loading} 
              hasMore={hasMore} 
              onLoadMore={loadMore} 
            />
          </MemorySection>

          <MemorySection 
            title="The Origin" 
            subtitle="Where the story began"
            align="center"
          >
            <Timeline />
          </MemorySection>

          {/* Additional cinematic sections can be added easily here */}
          
          <footer className="w-full py-12 border-t border-white/10 mt-32 relative z-10 glass">
            <div className="text-center">
              <h4 className="font-display font-light text-2xl text-white/50 tracking-[0.3em] uppercase mb-4">
                Rohit Family
              </h4>
              <p className="text-white/30 text-xs font-sans tracking-widest">
                A Cinematic Journey &copy; {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
