import React from 'react';
import Hero from '../components/Hero';
import VideoGrid from '../components/VideoGrid';
import FilterPanel from '../components/FilterPanel';
import { useVideo } from '../context/VideoContext';
import { Loader2 } from 'lucide-react';

interface HomeProps {
  searchQuery: string;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const Home: React.FC<HomeProps> = ({ searchQuery, showFilters, onToggleFilters }) => {
  const { videos, isLoading } = useVideo();
  const [filters, setFilters] = React.useState({
    type: '',
    genre: '',
    year: '',
    rating: ''
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  const featuredVideo = videos.find(v => v.rating && v.rating >= 8) || videos[0];
  
  // Filter and search logic
  const filteredVideos = videos.filter(video => {
    // Search filter
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type && video.type !== filters.type) {
      return false;
    }
    
    // Genre filter
    if (filters.genre && video.genre !== filters.genre) {
      return false;
    }
    
    // Year filter
    if (filters.year && video.year?.toString() !== filters.year) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && (!video.rating || video.rating < parseFloat(filters.rating))) {
      return false;
    }
    
    return true;
  });
  
  // Get available genres for filter
  const availableGenres = Array.from(new Set(videos.map(v => v.genre).filter(Boolean))) as string[];
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-black min-h-screen relative">
      {featuredVideo && <Hero video={featuredVideo} />}
      
      <div className={`relative z-10 -mt-32 bg-gradient-to-t from-black via-black to-transparent transition-all duration-300 ${showFilters ? 'md:mr-80' : ''}`}>
        <div className="space-y-12 pt-32">
          {searchQuery || Object.values(filters).some(f => f) ? (
            <VideoGrid
              title={`Resultados ${searchQuery ? `para "${searchQuery}"` : 'filtrados'}`}
              videos={filteredVideos}
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      
      <FilterPanel
        isOpen={showFilters}
        onClose={onToggleFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        availableGenres={availableGenres}
      />
    </div>
  );
};

export default Home;