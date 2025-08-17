import { apiRequest } from '@/lib/queryClient';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type: string;
  };
  pricing: {
    prompt: string;
    completion: string;
  };
}

export class OpenRouterService {
  
  static async sendChatMessage(
    messages: OpenRouterMessage[], 
    options: {
      model?: string;
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<OpenRouterResponse> {
    const response = await apiRequest('POST', '/api/openrouter/chat', {
      messages,
      options
    });
    
    return response.json();
  }
  
  static async getAvailableModels(): Promise<{ data: OpenRouterModel[] }> {
    const response = await apiRequest('GET', '/api/openrouter/models');
    return response.json();
  }
  
  static async getConfig() {
    const response = await apiRequest('GET', '/api/openrouter/config');
    return response.json();
  }
  
  static async updateConfig(config: {
    apiKey?: string;
    selectedModel?: string;
    modelConfigs?: Record<string, any>;
  }) {
    const response = await apiRequest('PATCH', '/api/openrouter/config', config);
    return response.json();
  }
  
  static async testConnection(): Promise<boolean> {
    try {
      await this.sendChatMessage([
        { role: 'user', content: 'Hello' }
      ], { max_tokens: 10 });
      return true;
    } catch (error) {
      return false;
    }
  }
}
