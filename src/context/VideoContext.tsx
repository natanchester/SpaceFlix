import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl, getAuthHeaders } from '../utils/config';

export interface Episode {
  id: string;
  name: string;
  filename: string;
  description?: string;
  duration?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  type: 'movie' | 'series';
  cover: string;
  filename?: string;
  episodes?: Episode[];
  genre?: string;
  year?: number;
  rating?: number;
}

interface VideoContextType {
  videos: Video[];
  isLoading: boolean;
  fetchVideos: () => Promise<void>;
  scanVideos: () => Promise<void>;
  updateVideo: (video: Video) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl('/videos'), {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      } else if (response.status === 401) {
        console.error('Unauthorized access to videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scanVideos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(buildApiUrl('/videos/scan'), {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchVideos();
      }
    } catch (error) {
      console.error('Error scanning videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVideo = async (video: Video) => {
    try {
      const response = await fetch(buildApiUrl(`/videos/${video.id}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(video),
      });
      if (response.ok) {
        await fetchVideos();
      }
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const response = await fetch(buildApiUrl(`/videos/${id}`), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        await fetchVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <VideoContext.Provider value={{
      videos,
      isLoading,
      fetchVideos,
      scanVideos,
      updateVideo,
      deleteVideo
    }}>
      {children}
    </VideoContext.Provider>
  );
};