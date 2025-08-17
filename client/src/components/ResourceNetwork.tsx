import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Search, Database, Globe, Server, Cloud, Cpu, HardDrive } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'service' | 'storage' | 'compute';
  status: 'online' | 'offline' | 'warning' | 'error';
  url?: string;
  description: string;
  metrics?: {
    responseTime?: number;
    uptime?: number;
    connections?: number;
    storage?: string;
  };
}

interface ResourceNetworkProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceNetwork({ isOpen, onClose }: ResourceNetworkProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'online',
      url: 'postgresql://localhost:5432/rizzcode',
      description: 'Primary application database',
      metrics: {
        responseTime: 12,
        uptime: 99.9,
        connections: 8,
        storage: '2.3 GB'
      }
    },
    {
      id: '2',
      name: 'OpenRouter API',
      type: 'api',
      status: 'online',
      url: 'https://openrouter.ai/api/v1',
      description: 'AI models API integration',
      metrics: {
        responseTime: 1200,
        uptime: 98.5
      }
    },
    {
      id: '3',
      name: 'Express Server',
      type: 'service',
      status: 'online',
      url: 'http://localhost:5000',
      description: 'Backend API server',
      metrics: {
        responseTime: 45,
        uptime: 100,
        connections: 3
      }
    },
    {
      id: '4',
      name: 'Vite Dev Server',
      type: 'service',
      status: 'online',
      url: 'http://localhost:5173',
      description: 'Frontend development server',
      metrics: {
        responseTime: 28,
        uptime: 100
      }
    },
    {
      id: '5',
      name: 'Local Storage',
      type: 'storage',
      status: 'online',
      description: 'Browser local storage',
      metrics: {
        storage: '1.2 MB'
      }
    },
    {
      id: '6',
      name: 'Session Storage',
      type: 'storage',
      status: 'online',
      description: 'Application session storage',
      metrics: {
        storage: '156 KB'
      }
    }
  ]);

  const getStatusColor = (status: Resource['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'database': return <Database className="w-4 h-4" />;
      case 'api': return <Globe className="w-4 h-4" />;
      case 'service': return <Server className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'compute': return <Cpu className="w-4 h-4" />;
      default: return <Cloud className="w-4 h-4" />;
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resourcesByType = {
    database: filteredResources.filter(r => r.type === 'database'),
    api: filteredResources.filter(r => r.type === 'api'),
    service: filteredResources.filter(r => r.type === 'service'),
    storage: filteredResources.filter(r => r.type === 'storage'),
    compute: filteredResources.filter(r => r.type === 'compute'),
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-vscode-sidebar border-l border-vscode-border flex flex-col h-full">
      {/* Resource Network Header */}
      <div className="h-10 bg-vscode-sidebar border-b border-vscode-border flex items-center justify-between px-4">
        <h3 className="font-medium text-white text-sm">Resource Network</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
          onClick={onClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-vscode-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vscode-text-muted w-4 h-4" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-vscode-border border-vscode-border text-white placeholder-vscode-text-muted"
          />
        </div>
      </div>

      {/* Resource Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-vscode-border">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
            <TabsTrigger value="storage" className="text-xs">Storage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="flex-1 overflow-hidden p-3">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="bg-vscode-bg border-vscode-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getResourceIcon(resource.type)}
                          <CardTitle className="text-sm text-white">{resource.name}</CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`} />
                          <Badge variant="outline" className="text-xs capitalize">
                            {resource.type}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-vscode-text-muted mb-2">{resource.description}</p>
                      {resource.url && (
                        <p className="text-xs text-blue-400 font-mono break-all mb-2">{resource.url}</p>
                      )}
                      {resource.metrics && (
                        <div className="space-y-1">
                          {resource.metrics.responseTime && (
                            <div className="flex justify-between text-xs">
                              <span className="text-vscode-text-muted">Response:</span>
                              <span className="text-white">{resource.metrics.responseTime}ms</span>
                            </div>
                          )}
                          {resource.metrics.uptime && (
                            <div className="flex justify-between text-xs">
                              <span className="text-vscode-text-muted">Uptime:</span>
                              <span className="text-green-400">{resource.metrics.uptime}%</span>
                            </div>
                          )}
                          {resource.metrics.connections && (
                            <div className="flex justify-between text-xs">
                              <span className="text-vscode-text-muted">Connections:</span>
                              <span className="text-white">{resource.metrics.connections}</span>
                            </div>
                          )}
                          {resource.metrics.storage && (
                            <div className="flex justify-between text-xs">
                              <span className="text-vscode-text-muted">Storage:</span>
                              <span className="text-white">{resource.metrics.storage}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="services" className="flex-1 overflow-hidden p-3">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {[...resourcesByType.service, ...resourcesByType.api].map((resource) => (
                  <Card key={resource.id} className="bg-vscode-bg border-vscode-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getResourceIcon(resource.type)}
                          <CardTitle className="text-sm text-white">{resource.name}</CardTitle>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-vscode-text-muted">{resource.description}</p>
                      {resource.url && (
                        <p className="text-xs text-blue-400 font-mono break-all mt-1">{resource.url}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="storage" className="flex-1 overflow-hidden p-3">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {[...resourcesByType.database, ...resourcesByType.storage].map((resource) => (
                  <Card key={resource.id} className="bg-vscode-bg border-vscode-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getResourceIcon(resource.type)}
                          <CardTitle className="text-sm text-white">{resource.name}</CardTitle>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(resource.status)}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-vscode-text-muted">{resource.description}</p>
                      {resource.metrics?.storage && (
                        <div className="flex justify-between text-xs mt-2">
                          <span className="text-vscode-text-muted">Used:</span>
                          <span className="text-white">{resource.metrics.storage}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}