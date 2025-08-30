// Configuration for API endpoints with domain support
const getApiBaseUrl = (): string => {
  const hostname = window.location.hostname;

  // Se estamos acessando pelo túnel do frontend
  if (hostname === 'f.natanchestern8n.com.br') {
    return 'https://b1.natanchestern8n.com.br'; // backend via túnel
  }


  // Modo desenvolvimento
  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  // Localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }

  // Acesso via IP
  if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return `http://${hostname}:3001`;
  }

  // Fallback
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('flixplayer-token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
