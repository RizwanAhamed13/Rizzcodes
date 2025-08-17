import { create } from 'zustand';
import { Project, File, ChatMessage, OpenRouterConfig } from '@shared/schema';

export type Mode = 'planner' | 'architect' | 'coder' | 'auto' | 'debug';

interface AppState {
  // Current state
  currentMode: Mode;
  currentProject: Project | null;
  currentFile: File | null;
  
  // Data
  projects: Project[];
  files: File[];
  chatMessages: ChatMessage[];
  openRouterConfig: OpenRouterConfig | null;
  
  // UI state
  isLoading: boolean;
  sidebarCollapsed: boolean;
  
  // Actions
  setCurrentMode: (mode: Mode) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentFile: (file: File | null) => void;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  updateFile: (file: File) => void;
  deleteFile: (fileId: string) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setOpenRouterConfig: (config: OpenRouterConfig) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentMode: 'planner',
  currentProject: null,
  currentFile: null,
  projects: [],
  files: [],
  chatMessages: [],
  openRouterConfig: null,
  isLoading: false,
  sidebarCollapsed: false,
  
  // Actions
  setCurrentMode: (mode) => set({ currentMode: mode }),
  
  setCurrentProject: (project) => set({ currentProject: project }),
  
  setCurrentFile: (file) => set({ currentFile: file }),
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  
  updateProject: (project) => set((state) => ({
    projects: state.projects.map(p => p.id === project.id ? project : p),
    currentProject: state.currentProject?.id === project.id ? project : state.currentProject
  })),
  
  deleteProject: (projectId) => set((state) => ({
    projects: state.projects.filter(p => p.id !== projectId),
    currentProject: state.currentProject?.id === projectId ? null : state.currentProject
  })),
  
  setFiles: (files) => set({ files }),
  
  addFile: (file) => set((state) => ({ 
    files: [...state.files, file] 
  })),
  
  updateFile: (file) => set((state) => ({
    files: state.files.map(f => f.id === file.id ? file : f),
    currentFile: state.currentFile?.id === file.id ? file : state.currentFile
  })),
  
  deleteFile: (fileId) => set((state) => ({
    files: state.files.filter(f => f.id !== fileId),
    currentFile: state.currentFile?.id === fileId ? null : state.currentFile
  })),
  
  setChatMessages: (messages) => set({ chatMessages: messages }),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),
  
  setOpenRouterConfig: (config) => set({ openRouterConfig: config }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleSidebar: () => set((state) => ({ 
    sidebarCollapsed: !state.sidebarCollapsed 
  })),
}));
