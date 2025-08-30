import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { useVideo, Video, Episode } from '../context/VideoContext';

const Admin: React.FC = () => {
  const { videos, scanVideos, updateVideo, deleteVideo, isLoading } = useVideo();
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    type: 'movie',
    cover: '',
    filename: '',
    genre: '',
    year: new Date().getFullYear(),
    rating: 0,
    episodes: []
  });

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData(video);
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) return;
    
    const videoData: Video = {
      id: editingVideo?.id || `video_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type as 'movie' | 'series',
      cover: formData.cover || 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg',
      filename: formData.filename,
      episodes: formData.episodes || [],
      genre: formData.genre,
      year: formData.year,
      rating: formData.rating
    };

    await updateVideo(videoData);
    setShowAddForm(false);
    setEditingVideo(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'movie',
      cover: '',
      filename: '',
      genre: '',
      year: new Date().getFullYear(),
      rating: 0,
      episodes: []
    });
  };

  const addEpisode = () => {
    const newEpisode: Episode = {
      id: `episode_${Date.now()}`,
      name: `Episódio ${(formData.episodes?.length || 0) + 1}`,
      filename: '',
      description: ''
    };
    setFormData({
      ...formData,
      episodes: [...(formData.episodes || []), newEpisode]
    });
  };

  const updateEpisode = (index: number, field: keyof Episode, value: string) => {
    const updatedEpisodes = [...(formData.episodes || [])];
    updatedEpisodes[index] = { ...updatedEpisodes[index], [field]: value };
    setFormData({ ...formData, episodes: updatedEpisodes });
  };

  const removeEpisode = (index: number) => {
    const updatedEpisodes = [...(formData.episodes || [])];
    updatedEpisodes.splice(index, 1);
    setFormData({ ...formData, episodes: updatedEpisodes });
  };

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Administração de Vídeos</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={scanVideos}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-3 md:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 text-sm md:text-base"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Escanear Vídeos</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingVideo(null);
                resetForm();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Vídeo</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Lista de Vídeos</h2>
            <div className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto">
              {videos.map((video) => (
                <div key={video.id} className="bg-gray-900 rounded-lg p-3 md:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                    <img
                      src={video.cover}
                      alt={video.title}
                      className="w-12 h-16 md:w-16 md:h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white text-sm md:text-base truncate">{video.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">{video.type === 'movie' ? 'Filme' : 'Série'}</p>
                      {video.type === 'series' && (
                        <p className="text-gray-500 text-xs">{video.episodes?.length || 0} ep</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 md:space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(video)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showAddForm && (
            <div className="bg-gray-900 rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  {editingVideo ? 'Editar Vídeo' : 'Adicionar Vídeo'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingVideo(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'movie' | 'series' })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                  >
                    <option value="movie">Filme</option>
                    <option value="series">Série</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white h-20 md:h-24 text-sm md:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ano</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nota</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capa (URL)</label>
                  <input
                    type="url"
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {formData.type === 'movie' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Arquivo</label>
                    <input
                      type="text"
                      value={formData.filename}
                      onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm md:text-base"
                      placeholder="movie.mp4"
                    />
                  </div>
                )}

                {formData.type === 'series' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-300">Episódios</label>
                      <button
                        onClick={addEpisode}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 md:space-y-3 max-h-40 md:max-h-48 overflow-y-auto">
                      {formData.episodes?.map((episode, index) => (
                        <div key={episode.id} className="bg-gray-800 p-2 md:p-3 rounded-md">
                          <div className="flex justify-between items-start mb-2">
                            <input
                              type="text"
                              value={episode.name}
                              onChange={(e) => updateEpisode(index, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs md:text-sm mr-2"
                              placeholder="Nome do episódio"
                            />
                            <button
                              onClick={() => removeEpisode(index)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={episode.filename}
                            onChange={(e) => updateEpisode(index, 'filename', e.target.value)}
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs md:text-sm mb-2"
                            placeholder="arquivo.mp4"
                          />
                          <textarea
                            value={episode.description}
                            onChange={(e) => updateEpisode(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs md:text-sm h-12 md:h-16"
                            placeholder="Descrição do episódio"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 md:py-3 rounded-md flex items-center justify-center space-x-2 transition-colors duration-200 text-sm md:text-base"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;