import { useState, useEffect } from 'react';
import { Database, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/appStore';

interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  realtime: string;
}

interface DatabaseTable {
  name: string;
  color: string;
  fields: { name: string; type: string }[];
}

export function ArchitectMode() {
  const { currentProject } = useAppStore();
  const [techStack, setTechStack] = useState<TechStack>({
    frontend: 'React + TypeScript',
    backend: 'Node.js + Express',
    database: 'PostgreSQL',
    realtime: 'Socket.io'
  });

  const [databaseSchema, setDatabaseSchema] = useState<DatabaseTable[]>([
    {
      name: 'Users',
      color: 'text-blue-400',
      fields: [
        { name: 'id', type: 'UUID (PK)' },
        { name: 'email', type: 'VARCHAR(255)' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'avatar_url', type: 'TEXT' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'Projects',
      color: 'text-green-400',
      fields: [
        { name: 'id', type: 'UUID (PK)' },
        { name: 'name', type: 'VARCHAR(100)' },
        { name: 'description', type: 'TEXT' },
        { name: 'owner_id', type: 'UUID (FK)' },
        { name: 'created_at', type: 'TIMESTAMP' }
      ]
    },
    {
      name: 'Tasks',
      color: 'text-amber-400',
      fields: [
        { name: 'id', type: 'UUID (PK)' },
        { name: 'title', type: 'VARCHAR(200)' },
        { name: 'description', type: 'TEXT' },
        { name: 'status', type: 'ENUM' },
        { name: 'project_id', type: 'UUID (FK)' },
        { name: 'assignee_id', type: 'UUID (FK)' }
      ]
    }
  ]);

  const generateSchema = () => {
    // This would typically call an AI service to generate the schema
    console.log('Generating database schema...');
  };

  const exportSpecs = () => {
    // This would export the architectural specifications
    console.log('Exporting specifications...');
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center px-4">
        <h2 className="text-lg font-semibold text-white">System Architecture</h2>
        <div className="ml-auto flex items-center space-x-2">
          <Button
            size="sm"
            className="bg-vscode-accent text-white hover:bg-blue-600"
            onClick={generateSchema}
          >
            <Database className="w-4 h-4 mr-2" />
            Generate Schema
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="bg-gray-600 text-white hover:bg-gray-500"
            onClick={exportSpecs}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Specs
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          
          {/* Tech Stack Selection */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-vscode-text-muted mb-1">
                  Frontend
                </label>
                <Select 
                  value={techStack.frontend} 
                  onValueChange={(value) => setTechStack(prev => ({ ...prev, frontend: value }))}
                >
                  <SelectTrigger className="bg-vscode-bg border-vscode-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-vscode-bg border-vscode-border">
                    <SelectItem value="React + TypeScript">React + TypeScript</SelectItem>
                    <SelectItem value="Vue.js">Vue.js</SelectItem>
                    <SelectItem value="Angular">Angular</SelectItem>
                    <SelectItem value="Svelte">Svelte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-vscode-text-muted mb-1">
                  Backend
                </label>
                <Select 
                  value={techStack.backend} 
                  onValueChange={(value) => setTechStack(prev => ({ ...prev, backend: value }))}
                >
                  <SelectTrigger className="bg-vscode-bg border-vscode-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-vscode-bg border-vscode-border">
                    <SelectItem value="Node.js + Express">Node.js + Express</SelectItem>
                    <SelectItem value="Python + FastAPI">Python + FastAPI</SelectItem>
                    <SelectItem value="Go + Gin">Go + Gin</SelectItem>
                    <SelectItem value="Rust + Axum">Rust + Axum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-vscode-text-muted mb-1">
                  Database
                </label>
                <Select 
                  value={techStack.database} 
                  onValueChange={(value) => setTechStack(prev => ({ ...prev, database: value }))}
                >
                  <SelectTrigger className="bg-vscode-bg border-vscode-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-vscode-bg border-vscode-border">
                    <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                    <SelectItem value="SQLite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-vscode-text-muted mb-1">
                  Real-time
                </label>
                <Select 
                  value={techStack.realtime} 
                  onValueChange={(value) => setTechStack(prev => ({ ...prev, realtime: value }))}
                >
                  <SelectTrigger className="bg-vscode-bg border-vscode-border text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-vscode-bg border-vscode-border">
                    <SelectItem value="Socket.io">Socket.io</SelectItem>
                    <SelectItem value="WebSockets">WebSockets</SelectItem>
                    <SelectItem value="Server-Sent Events">Server-Sent Events</SelectItem>
                    <SelectItem value="WebRTC">WebRTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-vscode-border">
                <h4 className="text-sm font-medium text-white mb-2">Selected Stack:</h4>
                <div className="space-y-1 text-sm text-vscode-text">
                  <div><span className="text-vscode-text-muted">Frontend:</span> {techStack.frontend}</div>
                  <div><span className="text-vscode-text-muted">Backend:</span> {techStack.backend}</div>
                  <div><span className="text-vscode-text-muted">Database:</span> {techStack.database}</div>
                  <div><span className="text-vscode-text-muted">Real-time:</span> {techStack.realtime}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Schema */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Database Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3 text-sm font-code">
                  {databaseSchema.map((table, index) => (
                    <Card key={index} className="bg-vscode-bg border-vscode-border">
                      <CardContent className="p-3">
                        <div className={`font-semibold mb-2 ${table.color}`}>
                          {table.name}
                        </div>
                        <div className="ml-2 text-vscode-text-muted space-y-1">
                          {table.fields.map((field, fieldIndex) => (
                            <div key={fieldIndex} className="flex justify-between">
                              <span>{field.name}:</span>
                              <span>{field.type}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
