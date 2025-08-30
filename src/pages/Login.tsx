import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('Usuário deve ter pelo menos 3 caracteres');
      return;
    }
    
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setError('');
    setIsLoading(true);

    const success = await login(username.trim(), password);
    if (success) {
      navigate('/');
    } else {
      setError('Usuário ou senha inválidos. Verifique suas credenciais.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm md:max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Play className="w-10 h-10 md:w-12 md:h-12 text-red-600" />
            <span className="text-3xl md:text-4xl font-bold text-white">FlixPlayer</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base">Entre para acessar sua biblioteca de vídeos</p>
        </div>
        
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200 text-sm md:text-base"
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200 text-sm md:text-base"
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-xs md:text-sm text-center bg-red-900/20 p-3 rounded-md border border-red-800">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-2 md:py-3 rounded-md transition-colors duration-200 text-sm md:text-base"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-4 md:mt-6 text-center">
            <div className="text-gray-400 text-sm">
              <p className="mb-2">Usuário padrão:</p>
              <p className="text-xs md:text-sm"><strong>admin</strong> / <strong>admin123</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;