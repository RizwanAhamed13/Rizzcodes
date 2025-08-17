import { useState, useRef, useEffect } from 'react';
import { Play, X, Send, Bot, MessageSquare, ExpandIcon, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonacoEditor } from '@/components/MonacoEditor';
import { useAppStore } from '@/stores/appStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { OpenRouterService } from '@/services/openrouter';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@shared/schema';

interface CodeTab {
  id: string;
  name: string;
  language: string;
  content: string;
  isActive: boolean;
}

export function CoderMode() {
  const { currentProject, currentFile, setCurrentFile } = useAppStore();
  const [activeTab, setActiveTab] = useState('app-tsx');
  const [chatInput, setChatInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiChatExpanded, setAiChatExpanded] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Default tabs for demonstration
  const [tabs, setTabs] = useState<CodeTab[]>([
    {
      id: 'app-tsx',
      name: 'App.tsx',
      language: 'typescript',
      content: `import React from 'react';
import { TaskBoard } from './components/TaskBoard';
import { Header } from './components/Header';

function App() {
  return (
    <div className="app">
      <Header />
      <TaskBoard />
    </div>
  );
}

export default App;`,
      isActive: true
    },
    {
      id: 'taskboard-tsx',
      name: 'TaskBoard.tsx',
      language: 'typescript',
      content: `import React from 'react';

export function TaskBoard() {
  return (
    <div className="task-board">
      <h2>Task Board</h2>
      {/* Component implementation goes here */}
    </div>
  );
}`,
      isActive: false
    }
  ]);

  const { data: chatMessages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/projects', currentProject?.id, 'chat', 'coder'],
    enabled: !!currentProject?.id,
  });

  const sendChatMessageMutation = useMutation({
    mutationFn: async ({ content, role }: { content: string; role: 'user' | 'assistant' }) => {
      if (!currentProject) throw new Error('No project selected');
      
      const response = await apiRequest('POST', '/api/chat', {
        projectId: currentProject.id,
        mode: 'coder',
        role,
        content,
        metadata: { activeFile: activeTab }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/projects', currentProject?.id, 'chat', 'coder']
      });
    }
  });

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleTabClose = (tabId: string) => {
    if (tabs.length <= 1) return;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTab === tabId) {
      setActiveTab(newTabs[0].id);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setTabs(tabs.map(tab => ({ ...tab, isActive: tab.id === tabId })));
  };

  const handleCodeChange = (value: string) => {
    setTabs(tabs.map(tab => 
      tab.id === activeTab ? { ...tab, content: value } : tab
    ));
  };

  const handleRunCode = () => {
    console.log('Running code...');
    toast({
      title: "Code Execution",
      description: "Code execution started. Check the console for output.",
    });
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoading(true);

    try {
      // Send user message
      await sendChatMessageMutation.mutateAsync({
        content: userMessage,
        role: 'user'
      });

      // Get AI response with code context
      const codeContext = `Current file: ${activeTabData?.name}\n\nCode:\n${activeTabData?.content}`;
      const aiMessages = [
        { 
          role: 'system' as const, 
          content: 'You are a helpful AI coding assistant. Help with code generation, debugging, and explanations. Always provide practical, working code examples.' 
        },
        { role: 'user' as const, content: `Context: ${codeContext}\n\nQuestion: ${userMessage}` }
      ];

      const aiResponse = await OpenRouterService.sendChatMessage(aiMessages, {
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.3,
        max_tokens: 1500
      });

      const aiContent = aiResponse.choices[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';

      // Send AI response
      await sendChatMessageMutation.mutateAsync({
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

  const handleContextChat = async () => {
    if (!contextInput.trim()) return;

    const userMessage = `@${activeTabData?.name}: ${contextInput.trim()}`;
    setContextInput('');
    setIsLoading(true);

    try {
      await sendChatMessageMutation.mutateAsync({
        content: userMessage,
        role: 'user'
      });

      // AI would analyze the context and provide relevant suggestions
      const aiResponse = await OpenRouterService.sendChatMessage([
        { 
          role: 'system' as const, 
          content: 'You are analyzing code context. Provide helpful suggestions and explanations based on the mentioned files and code.' 
        },
        { role: 'user' as const, content: userMessage }
      ], {
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.3,
        max_tokens: 1000
      });

      const aiContent = aiResponse.choices[0]?.message?.content || 'I cannot analyze this context at the moment.';

      await sendChatMessageMutation.mutateAsync({
        content: aiContent,
        role: 'assistant'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze context.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      
      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        
        {/* Editor Tabs */}
        <div className="h-10 bg-vscode-sidebar border-b border-vscode-border flex items-center">
          <div className="flex">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 text-sm border-r border-vscode-border cursor-pointer ${
                  tab.id === activeTab 
                    ? 'bg-vscode-bg text-white' 
                    : 'text-vscode-text-muted hover:text-white hover:bg-vscode-hover'
                }`}
                onClick={() => handleTabSelect(tab.id)}
              >
                <FileCode className={`w-4 h-4 ${
                  tab.language === 'typescript' ? 'text-blue-400' : 'text-green-400'
                }`} />
                <span>{tab.name}</span>
                {tabs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-4 p-0 text-vscode-text-muted hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTabClose(tab.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="ml-auto px-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-vscode-text-muted hover:text-white"
              onClick={handleRunCode}
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <MonacoEditor
            defaultValue={activeTabData?.content || ''}
            language={activeTabData?.language || 'typescript'}
            onChange={handleCodeChange}
          />
        </div>

        {/* AI Code Assistant Panel */}
        <div className={`border-t border-vscode-border bg-vscode-sidebar flex flex-col transition-all duration-200 ${
          aiChatExpanded ? 'h-96' : 'h-48'
        }`}>
          <div className="h-8 border-b border-vscode-border flex items-center px-4">
            <h3 className="text-sm font-medium text-white">AI Code Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-vscode-text-muted hover:text-white"
              onClick={() => setAiChatExpanded(!aiChatExpanded)}
            >
              <ExpandIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="text-sm space-y-2">
              {chatMessages.slice(-3).map((message) => (
                <div key={message.id} className="flex items-start space-x-2">
                  <Bot className="w-4 h-4 text-ai-primary mt-1 flex-shrink-0" />
                  <div className="text-vscode-text">{message.content}</div>
                </div>
              ))}
              
              {chatMessages.length === 0 && (
                <div className="flex items-start space-x-2">
                  <Bot className="w-4 h-4 text-ai-primary mt-1" />
                  <div className="text-vscode-text">
                    I've generated the basic App component structure. Would you like me to create the TaskBoard component with drag-and-drop functionality?
                  </div>
                </div>
              )}
              
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <Bot className="w-4 h-4 text-ai-primary mt-1 animate-pulse" />
                  <div className="text-vscode-text">Thinking...</div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-vscode-border">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask about code or request changes..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                className="flex-1 bg-vscode-border border-vscode-border text-white placeholder-vscode-text-muted"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendChatMessage}
                disabled={!chatInput.trim() || isLoading}
                className="bg-vscode-accent text-white hover:bg-blue-600"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Chat Sidebar */}
      <div className="w-80 bg-vscode-sidebar border-l border-vscode-border flex flex-col">
        <div className="h-10 border-b border-vscode-border flex items-center px-4">
          <h3 className="font-medium text-white">Context Chat</h3>
        </div>
        
        <div className="p-3 border-b border-vscode-border">
          <div className="text-xs bg-vscode-border rounded p-2">
            <div className="text-vscode-text-muted mb-1">Context:</div>
            <div className="text-vscode-text">@{activeTabData?.name || 'No file selected'}</div>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2 text-sm">
            {chatMessages.filter(msg => msg.metadata && typeof msg.metadata === 'object' && 'activeFile' in msg.metadata).map((message) => (
              <Card key={message.id} className={`${
                message.role === 'user' ? 'bg-vscode-bg' : 'bg-ai-primary/10'
              } border-vscode-border`}>
                <CardContent className="p-2">
                  <div className="font-medium text-xs mb-1">
                    {message.role === 'user' ? 'You' : 'AI'}:
                  </div>
                  <div className="text-vscode-text">{message.content}</div>
                </CardContent>
              </Card>
            ))}
            
            {chatMessages.filter(msg => msg.metadata && typeof msg.metadata === 'object' && 'activeFile' in msg.metadata).length === 0 && (
              <div className="text-vscode-text-muted text-center py-8">
                No context chat messages yet.<br />
                Start by asking about your code!
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t border-vscode-border">
          <Input
            type="text"
            placeholder="Chat about your code..."
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleContextChat()}
            className="bg-vscode-border border-vscode-border text-white placeholder-vscode-text-muted"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
