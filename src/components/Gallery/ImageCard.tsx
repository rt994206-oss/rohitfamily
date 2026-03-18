import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { DriveFile, getImageUrl } from '../../services/driveApi';
import { Play } from 'lucide-react';

interface ImageCardProps {
  file: DriveFile;
  onClick: (file: DriveFile) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ file, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Framer Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const isVideo = file.mimeType.startsWith('video/');
  
  // Use high-res thumbnail for both videos and images as uc?export=view is blocked by Google Drive CORS
  const imgSrc = file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s800') : getImageUrl(file.id);

  // Check if this image needs rotation
  const isRotated = file.name.includes("2470") || file.name.includes("2471");
  const rotateClass = isRotated ? 'rotate-90' : '';

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-full rounded-2xl overflow-hidden cursor-pointer interactive mb-6 group ${
        !imgLoaded ? 'animate-pulse bg-white/5 min-h-[300px]' : ''
      }`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      onClick={() => onClick(file)}
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Glow layer */}
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-neon-teal via-neon-purple to-neon-pink rounded-2xl blur-xl opacity-0 transition-opacity duration-700 group-hover:opacity-40" 
        style={{ transform: "translateZ(-20px)" }}
      ></div>

      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 glass-card">
        <motion.img
          src={imgSrc}
          alt={file.name}
          onLoad={() => setImgLoaded(true)}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className={`w-full h-auto object-cover transition-transform duration-1000 ease-out will-change-transform ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${rotateClass}`}
          style={{ transform: isHovered ? "scale(1.1) translateZ(30px)" : "scale(1) translateZ(0px)" }}
          loading="lazy"
        />

        {/* Video overlay icon */}
        {isVideo && imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center backdrop-blur-md">
              <Play className="text-white ml-1 w-8 h-8 opacity-80" />
            </div>
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-end p-6">
          <p className="text-white font-sans text-sm tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            {file.name.replace(/\.[^/.]+$/, "")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
