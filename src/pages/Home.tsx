import React from 'react';
import Hero from '../components/Hero';
import VideoGrid from '../components/VideoGrid';
import { useVideo } from '../context/VideoContext';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const { videos, isLoading } = useVideo();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  const featuredVideo = videos.find(v => v.rating && v.rating >= 8) || videos[0];

  return (
    <div className="bg-black min-h-screen">
      {featuredVideo && <Hero video={featuredVideo} />}
      
      <div className="relative z-10 -mt-32 bg-gradient-to-t from-black via-black to-transparent">
        <div className="space-y-12 pt-32">
          <VideoGrid
            title="Filmes"
            videos={videos}
            filter={(video) => video.type === 'movie'}
          />
          
          <VideoGrid
            title="Séries"
            videos={videos}
            filter={(video) => video.type === 'series'}
          />
          
          <VideoGrid
            title="Populares"
            videos={videos}
            filter={(video) => video.rating && video.rating >= 7}
          />
          
          <VideoGrid
            title="Todos os Vídeos"
            videos={videos}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;