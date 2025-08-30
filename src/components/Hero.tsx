import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Video } from '../context/VideoContext';

interface HeroProps {
  video: Video;
}

const Hero: React.FC<HeroProps> = ({ video }) => {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={video.cover}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-lg md:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {video.title}
            </h1>
            <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8 line-clamp-3 leading-relaxed">
              {video.description}
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={`/details/${video.id}`}
                className="bg-white text-black px-6 md:px-8 py-3 rounded-md font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                <span>Assistir</span>
              </Link>
              
              <Link
                to={`/details/${video.id}`}
                className="bg-gray-600/70 text-white px-6 md:px-8 py-3 rounded-md font-semibold flex items-center justify-center space-x-2 hover:bg-gray-600 transition-colors duration-200"
              >
                <Info className="w-5 h-5" />
                <span>Mais Info</span>
              </Link>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 md:gap-4 mt-4 md:mt-6">
              <span className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded ${
                video.type === 'movie' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-purple-600 text-white'
              }`}>
                {video.type === 'movie' ? 'Filme' : 'Série'}
              </span>
              {video.year && (
                <span className="text-gray-300 text-sm md:text-base">{video.year}</span>
              )}
              {video.rating && (
                <span className="text-yellow-400 text-sm md:text-base">★ {video.rating}/10</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;