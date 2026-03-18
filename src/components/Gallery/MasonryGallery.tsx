import React from 'react';
import { DriveFile } from '../../services/driveApi';
import { ImageCard } from './ImageCard';

interface MasonryGalleryProps {
  files: DriveFile[];
  onFileClick: (file: DriveFile) => void;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({ files, onFileClick, loading, hasMore, onLoadMore }) => {
  // Simple column distribution for masonry (3 columns on desktop, 2 on tablet, 1 on mobile)
  const columns = {
    col1: [] as DriveFile[],
    col2: [] as DriveFile[],
    col3: [] as DriveFile[]
  };

  files.forEach((file, ind) => {
    if (ind % 3 === 0) columns.col1.push(file);
    else if (ind % 3 === 1) columns.col2.push(file);
    else columns.col3.push(file);
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 relative z-10">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-6">
          {columns.col1.map(file => <ImageCard key={file.id} file={file} onClick={onFileClick} />)}
        </div>
        <div className="flex flex-col gap-6 mt-12 md:mt-0">
          {columns.col2.map(file => <ImageCard key={file.id} file={file} onClick={onFileClick} />)}
        </div>
        <div className="flex flex-col gap-6 mt-24 lg:mt-0">
          {columns.col3.map(file => <ImageCard key={file.id} file={file} onClick={onFileClick} />)}
        </div>
      </div>

      {loading && (
        <div className="w-full flex justify-center mt-12">
          <div className="w-8 h-8 border-t-2 border-neon-teal rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && hasMore && (
        <div className="w-full flex justify-center mt-20">
          <button 
            onClick={onLoadMore}
            className="interactive group relative px-8 py-3 rounded-full border border-white/20 glass overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-teal/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 text-white font-sans tracking-widest uppercase text-sm group-hover:text-glow">
              Load More Memories
            </span>
          </button>
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-center text-white/50 py-20 font-sans tracking-widest uppercase">
          No memories found.
        </div>
      )}
    </div>
  );
};
