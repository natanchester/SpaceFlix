import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 3 seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowPrompt(false);
    }
  };

  if (!showPrompt || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Download className="w-5 h-5 flex-shrink-0" />
          <h3 className="font-semibold text-sm">Instalar FlixPlayer</h3>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-white/80 hover:text-white transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-white/90 text-xs mb-4 leading-relaxed">
        Instale o FlixPlayer no seu dispositivo para acesso rápido e experiência nativa.
      </p>
      
      <div className="flex space-x-2">
        <button
          onClick={handleInstall}
          className="bg-white text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200 flex-1"
        >
          Instalar
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-900 transition-colors duration-200"
        >
          Agora não
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;