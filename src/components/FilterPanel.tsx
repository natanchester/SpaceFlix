import React from 'react';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    type: string;
    genre: string;
    year: string;
    rating: string;
  };
  onFilterChange: (key: string, value: string) => void;
  availableGenres: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  availableGenres
}) => {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:relative md:bg-transparent md:backdrop-blur-none">
      <div className="absolute right-0 top-0 h-full w-full md:w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-white">Filtros</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Tipo</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value=""
                  checked={filters.type === ''}
                  onChange={(e) => onFilterChange('type', e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="text-white text-sm">Todos</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="movie"
                  checked={filters.type === 'movie'}
                  onChange={(e) => onFilterChange('type', e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="text-white text-sm">Filmes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="series"
                  checked={filters.type === 'series'}
                  onChange={(e) => onFilterChange('type', e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="text-white text-sm">Séries</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Gênero</label>
            <select
              value={filters.genre}
              onChange={(e) => onFilterChange('genre', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-white px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="">Todos os gêneros</option>
              {availableGenres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Ano</label>
            <select
              value={filters.year}
              onChange={(e) => onFilterChange('year', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-white px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="">Todos os anos</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Avaliação mínima</label>
            <select
              value={filters.rating}
              onChange={(e) => onFilterChange('rating', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md text-white px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="">Qualquer avaliação</option>
              <option value="9">9+ estrelas</option>
              <option value="8">8+ estrelas</option>
              <option value="7">7+ estrelas</option>
              <option value="6">6+ estrelas</option>
              <option value="5">5+ estrelas</option>
            </select>
          </div>

          <button
            onClick={() => {
              onFilterChange('type', '');
              onFilterChange('genre', '');
              onFilterChange('year', '');
              onFilterChange('rating', '');
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors duration-200"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;