import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Settings, LogOut, Search, Menu, X, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onToggleFilters?: () => void;
  searchQuery?: string;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, onToggleFilters, searchQuery = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black to-transparent px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Play className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            <span className="text-xl md:text-2xl font-bold text-white">FlixPlayer</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              Início
            </Link>
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Administração
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            {onSearchChange && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar filmes e séries..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-gray-800/80 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-md border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            )}
            {onToggleFilters && (
              <button 
                onClick={onToggleFilters}
                className="text-white hover:text-gray-300 transition-colors duration-200 p-2"
                title="Filtros"
              >
                <Filter className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden text-white hover:text-gray-300 transition-colors duration-200"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs md:text-sm font-medium">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition-colors duration-200"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-gray-300 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800">
          <div className="px-4 py-4 space-y-4">
            {onSearchChange && (
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar filmes e séries..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-gray-800/80 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-md border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            )}
            {onToggleFilters && (
              <button 
                onClick={() => {
                  onToggleFilters();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-200 py-2 w-full"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
            )}
            <Link 
              to="/" 
              className="block text-white hover:text-red-400 transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="block text-white hover:text-red-400 transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Administração
              </Link>
            )}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors duration-200 py-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile search overlay */}
      {showSearch && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 p-4">
          {onSearchChange && (
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar filmes e séries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-800/80 text-white placeholder-gray-400 px-4 py-2 pl-10 rounded-md border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;