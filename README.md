# FlixPlayer - Netflix-style Offline Video Player

Um **PWA (Progressive Web App)** completo inspirado na Netflix para reprodução de vídeos offline, desenvolvido em React + Node.js.

## 🚀 Funcionalidades

### Frontend (React + Tailwind CSS)
- ✅ Interface moderna inspirada na Netflix
- ✅ **PWA completo** - instalável no celular como app nativo
- ✅ **Design responsivo** otimizado para mobile, tablet e desktop
- ✅ Grid responsivo de filmes e séries
- ✅ Player de vídeo avançado com controles modernos
- ✅ Suporte a múltiplos formatos (MP4, MKV, AVI, WebM)
- ✅ Sistema de autenticação simples
- ✅ Área administrativa para gestão de conteúdo
- ✅ Páginas de detalhes com informações completas
- ✅ Suporte completo a séries com episódios
- ✅ Funcionalidade offline para interface
- ✅ Menu mobile com navegação touch-friendly

### Backend (Node.js + Express)
- ✅ Streaming de vídeos da pasta local `/videos`
- ✅ API RESTful para gestão de conteúdo
- ✅ Sistema de autenticação JWT-like
- ✅ Scan automático de novos vídeos
- ✅ Armazenamento em JSON para operação offline
- ✅ CORS configurado para acesso via rede local

## 🛠️ Instalação e Uso

### 1. Instalar dependências
```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Iniciar os servidores
```bash
# Terminal 1: Frontend (React)
npm run dev

# Terminal 2: Backend (Node.js)
cd server && npm run dev
```

### 3. Adicionar vídeos
- Coloque seus arquivos de vídeo na pasta `server/videos/`
- Use o botão "Escanear Vídeos" na área administrativa
- Ou edite manualmente o arquivo `server/data/videos.json`

### 4. Acessar o sistema

#### Desktop
- **URL:** http://localhost:5173
- **Login padrão:** admin / admin123
- **Login usuário:** user / user123

#### Mobile (PWA)
1. **Descobrir o IP do seu PC:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
   
2. **Acessar pelo celular:**
   - Conecte o celular na mesma rede Wi-Fi do PC
   - Abra o navegador e acesse: `http://SEU_IP:5173`
   - Exemplo: `http://192.168.1.100:5173`

3. **Instalar como PWA:**
   - No Chrome/Safari mobile, toque no menu "⋮" ou "Compartilhar"
   - Selecione "Adicionar à tela inicial" ou "Instalar app"
   - O FlixPlayer será instalado como um app nativo

4. **Usar offline:**
   - A interface funciona offline após a primeira visita
   - Vídeos precisam de conexão com o servidor para streaming

## 📁 Estrutura do Projeto

```
/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # Ícones PWA
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizáveis
│   │   └── InstallPrompt.tsx  # Prompt de instalação PWA
│   ├── context/           # Context API (Auth, Video)
│   ├── hooks/             # Custom hooks
│   │   └── usePWA.ts      # Hook para funcionalidades PWA
│   ├── pages/             # Páginas da aplicação
│   ├── utils/             # Utilitários
│   │   └── config.ts      # Configuração de API endpoints
│   └── App.tsx            # Componente principal
├── server/                # Backend Node.js
│   ├── data/              # Arquivos JSON
│   │   ├── users.json     # Usuários
│   │   └── videos.json    # Catálogo de vídeos
│   ├── videos/            # Pasta para arquivos de vídeo
│   └── server.js          # Servidor Express
└── README.md
```

## 📱 Funcionalidades PWA

### Instalação
- **Android:** Prompt automático de instalação + menu "Adicionar à tela inicial"
- **iOS:** Menu "Compartilhar" > "Adicionar à tela inicial"
- **Desktop:** Ícone de instalação na barra de endereços

### Offline
- Interface funciona completamente offline após primeira visita
- Cache inteligente de recursos estáticos
- Streaming de vídeos requer conexão com servidor

### Mobile
- Layout otimizado para touch
- Controles de vídeo adaptados para mobile
- Menu hambúrguer responsivo
- Suporte a gestos nativos

## 🎬 Gerenciamento de Conteúdo

### Filmes
- Adicione filmes individuais com capa, descrição e metadados
- Suporte a classificação por gênero, ano e nota

### Séries
- Organize episódios em séries
- Cada episódio pode ter nome e descrição individuais
- Navegação sequencial entre episódios

## 🔐 Autenticação

- Sistema de login simples com usuário e senha
- Área administrativa restrita para usuários admin
- Autenticação baseada em tokens simples para uso offline

## 📱 Design Responsivo

- **Mobile-first:** Layout otimizado para smartphones
- **Tablet:** Grid adaptável e controles touch-friendly
- **Desktop:** Interface completa com hover effects
- Controles de vídeo adaptáveis ao tamanho da tela
- Interface fluida e moderna com animações suaves
- Suporte a dispositivos com notch (iPhone X+)

## ⚡ Performance

- Streaming de vídeos com suporte a range requests
- Carregamento otimizado de metadados
- Interface responsiva com lazy loading
- Cache inteligente para recursos estáticos
- Service Worker para funcionalidade offline

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS, React Router
- **PWA:** Service Worker, Web App Manifest, Cache API
- **Backend:** Node.js, Express, File System APIs
- **Ícones:** Lucide React
- **Build:** Vite

## 🌐 Acesso via Rede Local

Para usar o FlixPlayer no celular via rede local:

1. **Configure o IP do servidor:**
   - O frontend detecta automaticamente o IP quando acessado via rede
   - Para configuração manual, edite `src/utils/config.ts`

2. **Inicie os servidores:**
   ```bash
   npm run dev          # Frontend na porta 5173
   cd server && npm run dev  # Backend na porta 3001
   ```

3. **Acesse pelo celular:**
   - Descubra o IP do PC: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
   - Acesse: `http://SEU_IP:5173`
   - Instale como PWA para experiência nativa

## 🔧 Configuração de Rede

O sistema funciona automaticamente em:
- **Localhost:** `http://localhost:5173`
- **Rede local:** `http://192.168.x.x:5173`
- **Outras redes:** Configure manualmente em `src/utils/config.ts`

---

**FlixPlayer PWA** - Sua biblioteca pessoal de vídeos, agora como aplicativo nativo instalável! 🎬📱