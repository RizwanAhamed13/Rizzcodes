import { useState, useEffect } from 'react';
import { Send, Plus, FileText, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { OpenRouterService } from '@/services/openrouter';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@shared/schema';

interface ProjectBrief {
  name: string;
  description: string;
  targetUsers: string[];
  keyFeatures: string[];
}

export function PlannerMode() {
  const { currentProject, addChatMessage, chatMessages } = useAppStore();
  const [messageInput, setMessageInput] = useState('');
  const [projectBrief, setProjectBrief] = useState<ProjectBrief>({
    name: '',
    description: '',
    targetUsers: [],
    keyFeatures: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat messages for planner mode
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/projects', currentProject?.id, 'chat', 'planner'],
    enabled: !!currentProject?.id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, role }: { content: string; role: 'user' | 'assistant' }) => {
      if (!currentProject) throw new Error('No project selected');
      
      const response = await apiRequest('POST', '/api/chat', {
        projectId: currentProject.id,
        mode: 'planner',
        role,
        content,
        metadata: {}
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/projects', currentProject?.id, 'chat', 'planner']
      });
    }
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentProject) return;
    
    const userMessage = messageInput.trim();
    setMessageInput('');
    setIsLoading(true);

    try {
      // Send user message
      await sendMessageMutation.mutateAsync({
        content: userMessage,
        role: 'user'
      });

      // Get AI response
      const aiMessages = [
        { role: 'system' as const, content: 'You are a helpful AI assistant for project planning. Help users clarify their project requirements, create user stories, and develop comprehensive project plans.' },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      const aiResponse = await OpenRouterService.sendChatMessage(aiMessages, {
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.7,
        max_tokens: 1000
      });

      const aiContent = aiResponse.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';

      // Send AI message
      await sendMessageMutation.mutateAsync({
        content: aiContent,
        role: 'assistant'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please check your OpenRouter configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewProject = async () => {
    try {
      const response = await apiRequest('POST', '/api/projects', {
        name: 'New Project',
        description: 'A new AI-powered project',
        mode: 'planner',
        status: 'active',
        config: {}
      });
      
      const newProject = await response.json();
      // The project would be selected via app store update
      toast({
        title: "Success",
        description: "New project created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new project.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex-1 flex">
      
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center px-4">
          <h2 className="text-lg font-semibold text-white">Project Planning Assistant</h2>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              size="sm"
              className="bg-vscode-accent text-white hover:bg-blue-600"
              onClick={handleCreateNewProject}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-600 text-white hover:bg-gray-500"
            >
              <FileText className="w-4 h-4 mr-2" />
              Import Brief
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            
            {/* Initial AI Message */}
            {messages.length === 0 && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-ai-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <Card className="bg-vscode-border border-vscode-border">
                    <CardContent className="p-3">
                      <p className="text-sm text-vscode-text">
                        Hello! I'm your AI planning assistant. Let's create something amazing together. 
                        What project would you like to build?
                      </p>
                    </CardContent>
                  </Card>
                  <div className="text-xs text-vscode-text-muted mt-1">AI Assistant • Just now</div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-ai-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`flex-1 ${message.role === 'user' ? 'max-w-md' : ''}`}>
                  <Card className={
                    message.role === 'user' 
                      ? "bg-vscode-accent border-vscode-accent" 
                      : "bg-vscode-border border-vscode-border"
                  }>
                    <CardContent className="p-3">
                      <p className={`text-sm ${
                        message.role === 'user' ? 'text-white' : 'text-vscode-text'
                      }`}>
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                  <div className={`text-xs text-vscode-text-muted mt-1 ${
                    message.role === 'user' ? 'text-right' : ''
                  }`}>
                    {message.role === 'user' ? 'You' : 'AI Assistant'} • 
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-ai-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <Card className="bg-vscode-border border-vscode-border">
                    <CardContent className="p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-vscode-text-muted rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-vscode-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-vscode-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t border-vscode-border">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Describe your project idea..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-vscode-border border-vscode-border text-white placeholder-vscode-text-muted focus:border-vscode-accent"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isLoading}
              className="bg-vscode-accent hover:bg-blue-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Brief Panel */}
      <div className="w-80 bg-vscode-sidebar border-l border-vscode-border flex flex-col">
        <div className="h-12 border-b border-vscode-border flex items-center px-4">
          <h3 className="font-semibold text-white">Project Brief</h3>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-vscode-text-muted mb-2">
                Project Name
              </label>
              <Input
                type="text"
                value={projectBrief.name}
                onChange={(e) => setProjectBrief(prev => ({ ...prev, name: e.target.value }))}
                className="bg-vscode-border border-vscode-border text-white"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vscode-text-muted mb-2">
                Description
              </label>
              <Textarea
                rows={3}
                value={projectBrief.description}
                onChange={(e) => setProjectBrief(prev => ({ ...prev, description: e.target.value }))}
                className="bg-vscode-border border-vscode-border text-white resize-none"
                placeholder="Describe your project"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-vscode-text-muted mb-2">
                Target Users
              </label>
              <div className="space-y-2 text-sm text-vscode-text">
                {projectBrief.targetUsers.length === 0 ? (
                  <div className="text-vscode-text-muted">No target users defined</div>
                ) : (
                  projectBrief.targetUsers.map((user, index) => (
                    <div key={index}>• {user}</div>
                  ))
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-vscode-text-muted mb-2">
                Key Features
              </label>
              <div className="space-y-1 text-sm text-vscode-text">
                {projectBrief.keyFeatures.length === 0 ? (
                  <div className="text-vscode-text-muted">No features defined</div>
                ) : (
                  projectBrief.keyFeatures.map((feature, index) => (
                    <div key={index}>• {feature}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
