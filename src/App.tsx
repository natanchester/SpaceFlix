import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import VideoDetails from './pages/VideoDetails';
import Login from './pages/Login';
import Admin from './pages/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import { Loader2 } from 'lucide-react';

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-white">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstallPrompt />
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? (
            <>
              <Header />
              <Home />
            </>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/watch/:videoId" 
          element={isAuthenticated ? <VideoPlayer /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/details/:videoId" 
          element={isAuthenticated ? (
            <>
              <Header />
              <VideoDetails />
            </>
          ) : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated && user?.isAdmin ? (
            <>
              <Header />
              <Admin />
            </>
          ) : <Navigate to="/" />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <AppRoutes />
        </Router>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;