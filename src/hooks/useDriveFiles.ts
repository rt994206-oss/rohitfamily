import { useState, useEffect } from 'react';
import { fetchDriveFiles, DriveFile } from '../services/driveApi';

export const useDriveFiles = () => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const loadFiles = async (reset = false) => {
    if (!reset && !hasMore) return;
    
    setLoading(true);
    try {
      const token = reset ? undefined : nextPageToken;
      const response = await fetchDriveFiles(token);
      
      const newFiles = response.files.filter(f => f.mimeType.startsWith('image/') || f.mimeType.startsWith('video/'));
      
      setFiles(prev => reset ? newFiles : [...prev, ...newFiles]);
      setNextPageToken(response.nextPageToken);
      setHasMore(!!response.nextPageToken);
      setError(null);
    } catch (err) {
      setError('Failed to fetch memories from Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(true);
  }, []);

  return { files, loading, error, hasMore, loadMore: () => loadFiles() };
};
