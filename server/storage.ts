import { 
  type Project, 
  type InsertProject, 
  type File, 
  type InsertFile,
  type ChatMessage,
  type InsertChatMessage,
  type OpenRouterConfig,
  type InsertOpenRouterConfig
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getProject(id: string): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Files
  getFile(id: string): Promise<File | undefined>;
  getProjectFiles(projectId: string): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, file: Partial<InsertFile>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  
  // Chat Messages
  getChatMessages(projectId: string, mode: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // OpenRouter Config
  getOpenRouterConfig(): Promise<OpenRouterConfig | undefined>;
  updateOpenRouterConfig(config: Partial<InsertOpenRouterConfig>): Promise<OpenRouterConfig>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project> = new Map();
  private files: Map<string, File> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private openRouterConfig: OpenRouterConfig | undefined;

  constructor() {}

  // Projects
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now,
      description: insertProject.description || null,
      status: insertProject.status || "active",
      config: insertProject.config || {}
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: Project = { 
      ...project, 
      ...updateData,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Files
  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getProjectFiles(projectId: string): Promise<File[]> {
    return Array.from(this.files.values()).filter(file => file.projectId === projectId);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const now = new Date();
    const file: File = { 
      ...insertFile, 
      id,
      createdAt: now,
      updatedAt: now,
      projectId: insertFile.projectId || null,
      content: insertFile.content || null,
      language: insertFile.language || null
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, updateData: Partial<InsertFile>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile: File = { 
      ...file, 
      ...updateData,
      updatedAt: new Date()
    };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Chat Messages
  async getChatMessages(projectId: string, mode: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.projectId === projectId && msg.mode === mode)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      createdAt: new Date(),
      projectId: insertMessage.projectId || null,
      metadata: insertMessage.metadata || {}
    };
    this.chatMessages.set(id, message);
    return message;
  }

  // OpenRouter Config
  async getOpenRouterConfig(): Promise<OpenRouterConfig | undefined> {
    // Initialize with environment variable if no config exists
    if (!this.openRouterConfig && process.env.OPENROUTER_API_KEY) {
      await this.updateOpenRouterConfig({
        apiKey: process.env.OPENROUTER_API_KEY
      });
    }
    return this.openRouterConfig;
  }

  async updateOpenRouterConfig(config: Partial<InsertOpenRouterConfig>): Promise<OpenRouterConfig> {
    // Use environment variable as default API key
    const envApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!this.openRouterConfig) {
      const id = randomUUID();
      this.openRouterConfig = {
        id,
        apiKey: config.apiKey || envApiKey || null,
        selectedModel: "meta-llama/llama-3.2-3b-instruct:free",
        modelConfigs: { freeOnly: true },
        isConnected: !!(config.apiKey || envApiKey),
        updatedAt: new Date(),
        ...config
      };
    } else {
      this.openRouterConfig = {
        ...this.openRouterConfig,
        ...config,
        updatedAt: new Date()
      };
      
      // Update connection status based on API key availability
      if (config.apiKey || envApiKey) {
        this.openRouterConfig.isConnected = true;
      }
    }
    return this.openRouterConfig;
  }
}

export const storage = new MemStorage();
