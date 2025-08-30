import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../context/VideoContext';

interface VideoGridProps {
  title: string;
  videos: Video[];
  filter?: (video: Video) => boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ title, videos, filter }) => {
  const filteredVideos = filter ? videos.filter(filter) : videos;

  if (filteredVideos.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6 px-4">{title}</h2>
      <div className="px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoGrid;