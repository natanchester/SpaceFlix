import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, Star } from 'lucide-react';
import { Video } from '../context/VideoContext';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="group relative overflow-hidden rounded-md md:rounded-lg bg-gray-900 transition-all duration-300 hover:scale-105 hover:z-10">
      <div className="aspect-[2/3] md:aspect-video relative overflow-hidden">
        <img
          src={video.cover}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/details/${video.id}`}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 md:p-3 transition-colors duration-200"
          >
            <Play className="w-4 h-4 md:w-6 md:h-6" />
          </Link>
        </div>
        
        <div className="absolute top-1 right-1 md:top-2 md:right-2">
          <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs font-medium rounded ${
            video.type === 'movie' 
              ? 'bg-blue-600 text-white' 
              : 'bg-purple-600 text-white'
          }`}>
            {video.type === 'movie' ? 'Filme' : 'Série'}
          </span>
        </div>
      </div>
      
      <div className="p-2 md:p-4">
        <h3 className="font-semibold text-white text-sm md:text-base mb-1 md:mb-2 truncate group-hover:text-red-400 transition-colors duration-200">
          {video.title}
        </h3>
        <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-2 md:mb-3 hidden md:block">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1 md:space-x-2 text-gray-500">
            {video.year && (
              <div className="flex items-center space-x-0.5 md:space-x-1">
                <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span>{video.year}</span>
              </div>
            )}
            {video.rating && (
              <div className="flex items-center space-x-0.5 md:space-x-1">
                <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span className="hidden md:inline">{video.rating}/10</span>
                <span className="md:hidden">{video.rating}</span>
              </div>
            )}
          </div>
          
          {video.type === 'series' && video.episodes && (
            <span className="text-gray-500">
              <span className="hidden md:inline">{video.episodes.length} episódios</span>
              <span className="md:hidden">{video.episodes.length} ep</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;