# Rizz Codes - AI-Powered Coding Platform

A next-generation development environment with AI-powered coding assistance featuring five specialized modes for different development tasks.

![Rizz Codes](https://img.shields.io/badge/Rizz%20Codes-AI%20Coding%20Platform-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

## Features

### 🎯 **Five AI Modes**
- **Planner Mode**: Requirements gathering and project planning with AI assistance
- **Architect Mode**: Technical architecture design and database schema creation
- **Coder Mode**: Code generation and editing with Monaco Editor (VS Code engine)
- **Auto Mode**: Autonomous development with minimal user intervention
- **Debug Mode**: Error detection, analysis, and automated fixing

### 🔧 **Core Features**
- **VS Code-like Interface**: Monaco Editor with custom dark theme and syntax highlighting
- **Project Management**: Create, organize, and manage multiple coding projects
- **File Explorer**: Browse and edit project files with language detection
- **Chat Interface**: Real-time AI conversation for each mode
- **OpenRouter Integration**: Access to multiple AI models (GPT, Claude, Llama, etc.)
- **Free Model Support**: Toggle to use only free OpenRouter models
- **Session Management**: Persistent chat history and project state
- **Dark Theme**: Custom VS Code-inspired dark theme throughout

### 🎨 **Technical Highlights**
- **Modern Full-Stack Architecture**: React + Express + TypeScript
- **Type-Safe Development**: Full TypeScript coverage with Zod validation
- **Component Library**: shadcn/ui with Radix UI primitives
- **Real-time Updates**: TanStack Query for server state management
- **Database Integration**: Drizzle ORM with PostgreSQL support
- **Hot Module Reloading**: Vite development server with instant updates

## Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn
- PostgreSQL database (optional - uses in-memory storage by default)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd rizz-codes
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (optional)
```bash
# Create .env file if you want to use PostgreSQL
DATABASE_URL=your_postgresql_connection_string

# OpenRouter API key will be set through the UI
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
rizz-codes/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── modes/      # AI mode components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── pages/          # Route pages
│   │   ├── stores/         # Zustand state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── lib/            # Utility libraries
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts            # Main server entry point
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Storage interface and implementations
│   └── vite.ts             # Vite development server integration
├── shared/                 # Shared TypeScript definitions
│   └── schema.ts           # Database schema and types
├── package.json
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reloading
npm run check        # TypeScript type checking

# Production
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push database schema changes (if using PostgreSQL)
```

## Configuration

### OpenRouter API Setup

1. Visit [OpenRouter](https://openrouter.ai/) and create an account
2. Generate an API key from your dashboard
3. Click the "Setup API" button in the Rizz Codes header
4. Enter your API key and select your preferred model
5. Enable "Free models only" to use only free models
6. Test the connection and save

### Free Models Available
- meta-llama/llama-3.2-3b-instruct:free
- meta-llama/llama-3.2-1b-instruct:free  
- huggingface/zephyr-7b-beta:free
- mistralai/mistral-7b-instruct:free
- openchat/openchat-7b:free
- gryphe/mythomist-7b:free
- undi95/toppy-m-7b:free

## Usage Guide

### 1. Getting Started
- Launch the application and create your first project
- Configure your OpenRouter API key for AI features
- Choose your preferred AI model (free or paid)

### 2. Using AI Modes

**Planner Mode** 📋
- Describe your project idea in natural language
- Get help with requirements gathering and user stories
- Create comprehensive project plans and feature lists

**Architect Mode** 🏗️
- Design technical architecture and system components
- Create database schemas and API specifications
- Get recommendations for technology stack and patterns

**Coder Mode** 💻
- Write code with AI assistance in the Monaco editor
- Get code suggestions, refactoring help, and bug fixes
- Support for multiple programming languages

**Auto Mode** 🤖  
- Let AI build your project autonomously
- Minimal user intervention required
- Automatic file generation and project structure

**Debug Mode** 🔍
- Paste error messages for AI analysis
- Get step-by-step debugging instructions
- Automated error resolution suggestions

### 3. Project Management
- Create multiple projects with different configurations
- Switch between projects seamlessly
- Each project maintains its own chat history per mode

### 4. File Management
- Browse project files in the sidebar
- Edit files directly in the Monaco editor
- Automatic language detection and syntax highlighting

## API Integration

The application integrates with OpenRouter API to provide access to various AI models:

- **Chat Completions**: Real-time AI conversations
- **Model Selection**: Choose from 50+ available models
- **Token Management**: Track usage and costs
- **Error Handling**: Robust error handling and fallbacks

## Database Schema

```typescript
// Projects - Store project metadata
projects {
  id: string (UUID)
  name: string
  description: string?
  mode: string
  status: string
  config: json
  createdAt: timestamp
  updatedAt: timestamp
}

// Files - Manage project files  
files {
  id: string (UUID)
  projectId: string (FK)
  path: string
  content: string?
  language: string?
  createdAt: timestamp
  updatedAt: timestamp
}

// Chat Messages - Store AI conversations
chatMessages {
  id: string (UUID)
  projectId: string (FK)  
  mode: string
  role: string (user|assistant)
  content: string
  metadata: json
  createdAt: timestamp
}

// OpenRouter Config - API configuration
openrouterConfig {
  id: string (UUID)
  apiKey: string?
  selectedModel: string
  modelConfigs: json
  isConnected: boolean
  updatedAt: timestamp
}
```

## Development

### Technology Stack

**Frontend**
- React 18 with TypeScript
- Vite for build tooling and HMR
- TanStack Query for server state
- Zustand for client state
- Wouter for routing
- Monaco Editor for code editing
- Tailwind CSS + shadcn/ui for styling

**Backend** 
- Express.js with TypeScript
- Drizzle ORM for database operations
- PostgreSQL or in-memory storage
- Session management with express-session

**Shared**
- TypeScript for type safety
- Zod for runtime validation
- ESM modules throughout

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Consistent component organization
- Interface-based architecture for scalability

## Deployment

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start production server  
npm run start
```

### Environment Variables
```bash
# Production
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_database_url

# Optional
OPENROUTER_API_KEY=your_api_key
```

### Database Setup
If using PostgreSQL in production:
```bash
# Push schema to production database
npm run db:push
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📧 Email: support@rizzcodes.com
- 💬 Discord: [Join our server](https://discord.gg/rizzcodes)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## Roadmap

- [ ] Plugin system for extensions
- [ ] Multiple theme support  
- [ ] Git integration
- [ ] Team collaboration features
- [ ] Cloud project storage
- [ ] Mobile app companion

---

Built with ❤️ by the Rizz Codes team