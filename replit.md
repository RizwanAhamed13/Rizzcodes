# Overview

This is "Rizz Codes," a complete AI-powered Integrated Development Environment (IDE) designed as a next-generation development platform. The application features five distinct operational modes (Planner, Architect, Coder, Auto, Debug) with a full IDE experience including terminal console, resource network monitoring, and resizable panel system. The platform integrates with OpenRouter API for access to multiple AI models and provides a comprehensive VS Code-like interface for professional development.

## Recent Changes (August 2025)
- **Complete IDE Transformation**: Added terminal console with command execution simulation
- **Resource Network Panel**: Real-time monitoring of APIs, databases, and services  
- **Resizable Panel System**: Professional IDE layout with closable/resizable panels
- **Enhanced UI Architecture**: Comprehensive panel management with VS Code theming
- **Free Model Integration**: Configured to use only free OpenRouter models by default
- **Production Ready**: Complete repository setup ready for git deployment

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom VS Code-inspired dark theme
- **State Management**: Zustand for global application state
- **Routing**: Wouter for client-side routing
- **Code Editor**: Monaco Editor (VS Code editor) with custom themes and language support
- **Data Fetching**: TanStack Query (React Query) for server state management

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Development**: TypeScript with tsx for development execution
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Storage**: Connect-pg-simple for PostgreSQL session storage
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

## Database Schema
- **Projects Table**: Stores project metadata with mode, status, and configuration
- **Files Table**: Manages project files with content, language, and relationships
- **Chat Messages Table**: Stores conversation history by project and mode
- **OpenRouter Config Table**: Manages AI model configurations and API settings

## Mode-Based Architecture
- **Planner Mode**: Requirements gathering and project planning
- **Architect Mode**: Technical architecture design and database schema creation
- **Coder Mode**: Code generation and editing with AI assistance
- **Auto Mode**: Autonomous development with minimal user intervention
- **Debug Mode**: Error detection, analysis, and automated fixing

## Storage Layer
- **Interface-Based Design**: IStorage interface allows multiple storage implementations
- **Memory Storage**: In-memory implementation for development/testing
- **Database Storage**: Production implementation using Drizzle ORM
- **File Management**: Project file storage with language detection and content management

## Development Workflow
- **Hot Reloading**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)
- **Error Handling**: Runtime error overlay for development debugging

# External Dependencies

## AI Integration
- **OpenRouter API**: Primary AI service integration for accessing multiple language models
- **Model Selection**: Dynamic model switching based on task requirements
- **Chat Interface**: Real-time AI conversation with context management

## Database
- **PostgreSQL**: Primary database via Neon serverless connection
- **Drizzle Kit**: Database migrations and schema management
- **Connection Pooling**: @neondatabase/serverless for optimized connections

## UI Components
- **Radix UI**: Comprehensive primitive component library
- **Lucide React**: Icon library for consistent iconography
- **Monaco Editor**: VS Code editor integration for code editing
- **Embla Carousel**: Carousel component for UI elements

## Development Tools
- **Replit Integration**: Development environment with cartographer plugin
- **PostCSS**: CSS processing with Tailwind and autoprefixer
- **Date-fns**: Date manipulation and formatting
- **React Hook Form**: Form handling with @hookform/resolvers validation

## Build and Deployment
- **Vite**: Frontend build system with React plugin
- **esbuild**: Backend compilation for production
- **TypeScript**: Type checking and compilation
- **ESM Modules**: Modern JavaScript module system throughout