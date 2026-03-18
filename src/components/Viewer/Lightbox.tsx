import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DriveFile, getImageUrl } from '../../services/driveApi';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface LightboxProps {
  file: DriveFile | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ file, onClose, onNext, onPrev }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when file changes
  useEffect(() => {
    setIsLoading(true);
  }, [file]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10 interactive"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation */}
          {onPrev && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-6 p-4 rounded-full bg-white/5 hover:bg-white/20 transition-colors z-10 interactive"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {onNext && (
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-6 p-4 rounded-full bg-white/5 hover:bg-white/20 transition-colors z-10 interactive"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-screen h-screen flex flex-col items-center justify-center bg-black/90 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && !file.mimeType.startsWith('video/') && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <Loader2 className="w-12 h-12 text-neon-teal animate-spin mb-4" />
                <p className="text-neon-teal text-sm font-outfit tracking-widest animate-pulse">LOADING FULL RESOLUTION</p>
              </div>
            )}

            {(() => {
              // Extract the direct media URL via stable high-res thumbnail to bypass anti-CORS redirects
              const imgSrc = file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s2000') : getImageUrl(file.id);
              
              // Handle rotation for specific images
              const isRotated = file.name.includes("2470") || file.name.includes("2471");
              const rotateClass = isRotated ? 'rotate-90' : '';

              if (file.mimeType.startsWith('video/')) {
                return (
                  <video 
                    src={imgSrc} 
                    controls 
                    autoPlay 
                    onLoadedData={() => setIsLoading(false)}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className={`w-full h-full object-contain shadow-[0_0_50px_rgba(5,217,232,0.5)] ${rotateClass} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
                  />
                );
              }

              return (
                <img 
                  src={imgSrc} 
                  alt={file.name}
                  onLoad={() => setIsLoading(false)}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className={`w-full h-full object-contain shadow-[0_0_50px_rgba(176,38,255,0.2)] ${rotateClass} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
                />
              );
            })()}
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 px-8 py-3 glass-card rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-3xl z-20 pointer-events-none"
            >
              <p className="text-white font-sans tracking-[0.2em] uppercase text-sm font-light">
                {file.name.replace(/\.[^/.]+$/, "")}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
