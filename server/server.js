import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'flixplayer-secret-key-2024';

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://f.natanchestern8n.com.br',
  /^https?:\/\/localhost:5173$/,
  /^https?:\/\/127\.0\.0\.1:5173$/
];

app.use(cors({
  origin: (origin, callback) => {
    // Requisições sem origin (Postman, curl) são permitidas
    if (!origin) return callback(null, true);

    // Verifica se é um origin permitido
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return allowed === origin;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    // Verifica se é um IP local na porta 5173
    const isLocalIP = /^https?:\/\/192\.168\.\d+\.\d+:5173$/.test(origin) || 
                      /^https?:\/\/10\.\d+\.\d+\.\d+:5173$/.test(origin) ||
                      /^https?:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:5173$/.test(origin);
    
    if (isAllowed || isLocalIP) {
      return callback(null, true);
    } else {
      console.log('Blocked CORS:', origin);
      return callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Ensure directories exist
const dataDir = path.join(__dirname, 'data');
const videosDir = path.join(__dirname, 'videos');
const thumbnailsDir = path.join(__dirname, 'thumbnails');

try {
  await fs.access(dataDir);
} catch {
  await fs.mkdir(dataDir, { recursive: true });
}

try {
  await fs.access(videosDir);
} catch {
  await fs.mkdir(videosDir, { recursive: true });
}

try {
  await fs.access(thumbnailsDir);
} catch {
  await fs.mkdir(thumbnailsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, videosDir);
    } else if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailsDir);
    }
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    cb(null, `${nameWithoutExt}_${timestamp}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      const videoExtensions = ['.mp4', '.mkv', '.avi', '.webm', '.mov', '.m4v'];
      const extension = path.extname(file.originalname).toLowerCase();
      if (videoExtensions.includes(extension)) {
        cb(null, true);
      } else {
        cb(new Error('Formato de vídeo não suportado'));
      }
    } else if (file.fieldname === 'thumbnail') {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const extension = path.extname(file.originalname).toLowerCase();
      if (imageExtensions.includes(extension)) {
        cb(null, true);
      } else {
        cb(new Error('Formato de imagem não suportado'));
      }
    } else {
      cb(new Error('Campo de arquivo não reconhecido'));
    }
  }
});

// Initialize data files
const usersFile = path.join(dataDir, 'users.json');
const videosFile = path.join(dataDir, 'videos.json');

// Hash passwords for default users
const defaultUsers = [
  {
    id: 'admin',
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    isAdmin: true
  },
  {
    id: 'user',
    username: 'user',
    password: await bcrypt.hash('user123', 10),
    isAdmin: false
  }
];

const defaultVideos = [
  {
    id: 'sample_movie_1',
    title: 'Aventura nas Montanhas',
    description: 'Uma jornada épica através das montanhas mais altas do mundo. Acompanhe a história de coragem e determinação de um grupo de escaladores em busca do pico mais alto.',
    type: 'movie',
    cover: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg',
    filename: 'adventure-movie.mp4',
    genre: 'Aventura',
    year: 2023,
    rating: 8.5
  },
  {
    id: 'sample_series_1',
    title: 'Cosmos: Uma Odisseia',
    description: 'Uma fascinante jornada pelo universo, explorando os mistérios do cosmos e as descobertas científicas mais importantes da humanidade.',
    type: 'series',
    cover: 'https://images.pexels.com/photos/1200450/pexels-photo-1200450.jpeg',
    genre: 'Documentário',
    year: 2022,
    rating: 9.2,
    episodes: [
      {
        id: 'cosmos_ep1',
        name: 'O Nascimento do Universo',
        filename: 'cosmos-s01e01.mp4',
        description: 'Como tudo começou: do Big Bang à formação das primeiras estrelas.'
      },
      {
        id: 'cosmos_ep2', 
        name: 'Galáxias Distantes',
        filename: 'cosmos-s01e02.mp4',
        description: 'Explorando as galáxias mais distantes e suas características únicas.'
      },
      {
        id: 'cosmos_ep3',
        name: 'A Busca por Vida',
        filename: 'cosmos-s01e03.mp4', 
        description: 'A procura por sinais de vida em outros planetas.'
      }
    ]
  },
  {
    id: 'sample_movie_2',
    title: 'Cidade Futurista',
    description: 'Em um futuro próximo, a tecnologia transformou completamente a vida urbana. Esta é a história de como a humanidade se adapta a um novo mundo.',
    type: 'movie',
    cover: 'https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg',
    filename: 'future-city.mp4',
    genre: 'Ficção Científica',
    year: 2024,
    rating: 7.8
  },
  {
    id: 'sample_series_2',
    title: 'Mistérios Urbanos',
    description: 'Uma série de crimes inexplicáveis assombra a cidade. Acompanhe os detetives em suas investigações mais desafiadoras.',
    type: 'series', 
    cover: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg',
    genre: 'Mistério',
    year: 2023,
    rating: 8.7,
    episodes: [
      {
        id: 'mystery_ep1',
        name: 'O Primeiro Caso',
        filename: 'mystery-s01e01.mp4',
        description: 'Um crime que desafia toda lógica inicia a série.'
      },
      {
        id: 'mystery_ep2',
        name: 'Pistas Perdidas', 
        filename: 'mystery-s01e02.mp4',
        description: 'As investigações levam a descobertas inesperadas.'
      }
    ]
  }
];

// Initialize files if they don't exist
try {
  await fs.access(usersFile);
} catch {
  await fs.writeFile(usersFile, JSON.stringify(defaultUsers, null, 2));
}

try {
  await fs.access(videosFile);
} catch {
  await fs.writeFile(videosFile, JSON.stringify(defaultVideos, null, 2));
}

// Helper functions
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// JWT middleware for protected routes
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await readJsonFile(usersFile);
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Validation middleware
const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password must be strings' });
  }
  
  if (username.trim().length < 3 || password.length < 6) {
    return res.status(400).json({ error: 'Username must be at least 3 characters and password at least 6 characters' });
  }
  
  next();
};

// Authentication endpoints
app.post('/auth/login', validateLoginInput, async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readJsonFile(usersFile);
    
    const user = users.find(u => u.username === username.trim());
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    const { password: _, ...userData } = user;
    
    res.json({
      user: userData,
      token,
      expiresIn: '7d'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/session', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    valid: true
  });
});

// Protected video routes
app.get('/videos', authenticateToken, async (req, res) => {
  try {
    const videos = await readJsonFile(videosFile);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.put('/videos/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    const updatedVideo = req.body;
    
    let videos = await readJsonFile(videosFile);
    const videoIndex = videos.findIndex(v => v.id === id);
    
    if (videoIndex !== -1) {
      videos[videoIndex] = { ...videos[videoIndex], ...updatedVideo };
    } else {
      videos.push(updatedVideo);
    }
    
    const success = await writeJsonFile(videosFile, videos);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to update video' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/videos/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    let videos = await readJsonFile(videosFile);
    videos = videos.filter(v => v.id !== id);
    
    const success = await writeJsonFile(videosFile, videos);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete video' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/videos/stream/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Also check for token in query params for video streaming
    if (!req.user && req.query.token) {
      try {
        const decoded = jwt.verify(req.query.token, JWT_SECRET);
        const users = await readJsonFile(usersFile);
        const user = users.find(u => u.id === decoded.userId);
        if (user) {
          req.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
        }
      } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
      }
    }
    
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const videoPath = path.join(videosDir, filename);
    
    try {
      await fs.access(videoPath);
    } catch {
      return res.status(404).json({ error: 'Video file not found' });
    }

    const stat = await fs.stat(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      
      const fs = await import('fs');
      const stream = fs.createReadStream(videoPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        'Cache-Control': 'no-cache'
      });
      
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache'
      });
      
      const fs = await import('fs');
      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    res.status(500).json({ error: 'Failed to stream video' });
  }
});

app.post('/videos/scan', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const files = await fs.readdir(videosDir);
    const videoExtensions = ['.mp4', '.mkv', '.avi', '.webm', '.mov', '.m4v'];
    
    const videoFiles = files.filter(file => 
      videoExtensions.some(ext => file.toLowerCase().endsWith(ext))
    );
    
    let videos = await readJsonFile(videosFile);
    
    for (const filename of videoFiles) {
      const existingVideo = videos.find(v => 
        v.filename === filename || 
        (v.episodes && v.episodes.some(ep => ep.filename === filename))
      );
      
      if (!existingVideo) {
        const videoId = `scanned_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newVideo = {
          id: videoId,
          title: filename.replace(/\.[^/.]+$/, "").replace(/[._-]/g, ' '),
          description: `Arquivo detectado automaticamente: ${filename}`,
          type: 'movie',
          cover: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg',
          filename: filename,
          genre: 'Não categorizado',
          year: new Date().getFullYear(),
          rating: 0
        };
        
        videos.push(newVideo);
      }
    }
    
    const success = await writeJsonFile(videosFile, videos);
    if (success) {
      res.json({ 
        success: true, 
        scanned: videoFiles.length,
        message: `${videoFiles.length} arquivos de vídeo escaneados` 
      });
    } else {
      res.status(500).json({ error: 'Failed to save scanned videos' });
    }
  } catch (error) {
    console.error('Error scanning videos:', error);
    res.status(500).json({ error: 'Failed to scan videos directory' });
  }
});

// File upload endpoints
app.post('/upload/video', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }
    
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

app.post('/upload/thumbnail', authenticateToken, upload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No thumbnail file provided' });
    }
    
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/thumbnails/${req.file.filename}`
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
});

// Serve thumbnail files
app.get('/thumbnails/:filename', (req, res) => {
  const { filename } = req.params;
  const thumbnailPath = path.join(thumbnailsDir, filename);
  
  res.sendFile(thumbnailPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Thumbnail not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FlixPlayer Server rodando na porta ${PORT}`);
  console.log(`🔐 JWT Authentication habilitado`);
  console.log(`🌐 CORS configurado para localhost e https://na.natanchestern8n.com.br`);
  console.log(`📁 Pasta de vídeos: ${videosDir}`);
  console.log(`📊 Dados salvos em: ${dataDir}`);
});

export default app;