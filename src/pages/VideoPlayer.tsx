import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { useVideo } from '../context/VideoContext';
import { buildApiUrl } from '../utils/config';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { videos } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const video = videos.find(v => v.id === videoId);

  useEffect(() => {
    if (video?.type === 'series' && video.episodes && video.episodes.length > 0) {
      setSelectedEpisode(video.episodes[0].id);
    }
  }, [video]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [selectedEpisode]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimeout();
    
    return () => clearTimeout(timeout);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">Vídeo não encontrado</p>
      </div>
    );
  }

  const getVideoSource = () => {
    if (video.type === 'movie') {
      return buildApiUrl(`/videos/stream/${video.filename}`);
    } else if (video.type === 'series' && selectedEpisode) {
      const episode = video.episodes?.find(ep => ep.id === selectedEpisode);
      return episode ? buildApiUrl(`/videos/stream/${episode.filename}`) : '';
    }
    return '';
  };

  const currentEpisode = video.type === 'series' 
    ? video.episodes?.find(ep => ep.id === selectedEpisode)
    : null;

  return (
    <div className="min-h-screen bg-black">
      <div className={`relative ${isFullscreen ? 'h-screen' : ''}`}>
        <video
          ref={videoRef}
          src={getVideoSource()}
          className={`w-full bg-black ${isFullscreen ? 'h-full object-contain' : 'aspect-video'}`}
          onMouseMove={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onTouchStart={() => setShowControls(true)}
        />
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute top-2 md:top-4 left-2 md:left-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1 md:space-x-2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 px-2 md:px-3 py-1 md:py-2 rounded-md"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Voltar</span>
            </button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
            <div className="mb-4">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 md:h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-red-400 transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 md:w-8 md:h-8" />
                  ) : (
                    <Play className="w-6 h-6 md:w-8 md:h-8" />
                  )}
                </button>
                
                <div className="hidden md:flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-red-400 transition-colors duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <span className="text-white text-xs md:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="md:hidden text-white hover:text-red-400 transition-colors duration-200"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-400 transition-colors duration-200"
                >
                  <Maximize className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {video.title}
              {currentEpisode && (
                  <span className="text-lg md:text-xl text-gray-400 block mt-2">
                  {currentEpisode.name}
                </span>
              )}
            </h1>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {currentEpisode ? currentEpisode.description || video.description : video.description}
            </p>
          </div>
          
          {video.type === 'series' && video.episodes && (
              <div className="bg-gray-900 rounded-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Episódios</h3>
                <div className="space-y-2 max-h-64 md:max-h-96 overflow-y-auto">
                {video.episodes.map((episode) => (
                    <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                      selectedEpisode === episode.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                      <div className="font-medium text-sm md:text-base">{episode.name}</div>
                    {episode.description && (
                        <div className="text-xs md:text-sm opacity-75 mt-1 line-clamp-2">
                        {episode.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;