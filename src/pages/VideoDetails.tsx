import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Calendar, Star, Clock } from 'lucide-react';
import { useVideo } from '../context/VideoContext';

const VideoDetails: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { videos } = useVideo();

  const video = videos.find(v => v.id === videoId);

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Vídeo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 md:pt-20">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={video.cover}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <button
          onClick={() => navigate(-1)}
          className="absolute top-2 md:top-4 left-2 md:left-4 flex items-center space-x-1 md:space-x-2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 px-2 md:px-3 py-1 md:py-2 rounded-md"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Voltar</span>
        </button>
        
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-auto md:max-w-2xl">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
            {video.title}
          </h1>
          
          <div className="flex items-center flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
            <span className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded ${
              video.type === 'movie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-purple-600 text-white'
            }`}>
              {video.type === 'movie' ? 'Filme' : 'Série'}
            </span>
            {video.year && (
              <div className="flex items-center space-x-1 text-gray-300 text-sm md:text-base">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{video.year}</span>
              </div>
            )}
            {video.rating && (
              <div className="flex items-center space-x-1 text-yellow-400 text-sm md:text-base">
                <Star className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{video.rating}/10</span>
              </div>
            )}
            {video.type === 'series' && video.episodes && (
              <div className="flex items-center space-x-1 text-gray-300 text-sm md:text-base">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{video.episodes.length} episódios</span>
              </div>
            )}
          </div>
          
          <Link
            to={`/watch/${video.id}`}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-md font-semibold transition-colors duration-200 text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5" />
            <span>
              {video.type === 'movie' ? 'Assistir Filme' : 'Assistir Primeiro Episódio'}
            </span>
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Sobre</h2>
            <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-6 md:mb-8">
              {video.description}
            </p>
            
            {video.genre && (
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2">Gênero</h3>
                <span className="inline-block bg-gray-800 text-gray-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                  {video.genre}
                </span>
              </div>
            )}
          </div>
          
          {video.type === 'series' && video.episodes && (
            <div className="bg-gray-900 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Episódios</h3>
              <div className="space-y-3 md:space-y-4 max-h-64 md:max-h-96 overflow-y-auto">
                {video.episodes.map((episode, index) => (
                  <div key={episode.id} className="bg-gray-800 rounded-lg p-3 md:p-4 hover:bg-gray-700 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-white text-sm md:text-base flex-1 mr-2">
                        {index + 1}. {episode.name}
                      </h4>
                      <Link
                        to={`/watch/${video.id}?episode=${episode.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 md:p-2 rounded-full transition-colors duration-200 flex-shrink-0"
                      >
                        <Play className="w-3 h-3 md:w-4 md:h-4" />
                      </Link>
                    </div>
                    {episode.description && (
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                        {episode.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;