import { useState } from 'react';
import { 
  Lightbulb, 
  Table, 
  Code, 
  Wand2, 
  Bug,
  Plus,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore, Mode } from '@/stores/appStore';
import { ProjectExplorer } from './ProjectExplorer';
import { cn } from '@/lib/utils';

const modes: { id: Mode; icon: any; label: string }[] = [
  { id: 'planner', icon: Lightbulb, label: 'Planner' },
  { id: 'architect', icon: Table, label: 'Architect' },
  { id: 'coder', icon: Code, label: 'Coder' },
  { id: 'auto', icon: Wand2, label: 'Auto' },
  { id: 'debug', icon: Bug, label: 'Debug' },
];

export function Sidebar() {
  const { 
    currentMode, 
    setCurrentMode, 
    openRouterConfig,
    sidebarCollapsed 
  } = useAppStore();

  const isConnected = openRouterConfig?.isConnected || false;
  const selectedModel = openRouterConfig?.selectedModel || 'Claude 3.5 Sonnet';

  if (sidebarCollapsed) {
    return (
      <div className="w-12 bg-vscode-sidebar border-r border-vscode-border flex flex-col">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-10 h-10 p-2 rounded-none border-none justify-center",
                currentMode === mode.id 
                  ? "bg-vscode-accent text-white" 
                  : "text-vscode-text hover:bg-vscode-hover hover:text-white"
              )}
              onClick={() => setCurrentMode(mode.id)}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 bg-vscode-sidebar border-r border-vscode-border flex flex-col">
      
      {/* Mode Navigation */}
      <div className="p-4 border-b border-vscode-border">
        <h3 className="text-xs font-semibold text-vscode-text-muted uppercase tracking-wide mb-3">
          Modes
        </h3>
        <nav className="space-y-1">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start px-3 py-2 text-sm rounded-md",
                  currentMode === mode.id 
                    ? "bg-vscode-accent text-white" 
                    : "text-vscode-text hover:bg-vscode-hover hover:text-white"
                )}
                onClick={() => setCurrentMode(mode.id)}
              >
                <Icon className="w-4 h-4 mr-3" />
                {mode.label}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Project Explorer */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-vscode-text-muted uppercase tracking-wide">
            Explorer
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-hover"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <ProjectExplorer />
      </div>

      {/* OpenRouter Status */}
      <div className="p-4 border-t border-vscode-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-vscode-text-muted">OpenRouter</span>
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
        </div>
        <div className="text-xs text-vscode-text-muted">
          <div className="truncate">{selectedModel}</div>
          <div className={cn(
            "text-xs",
            isConnected ? "text-green-400" : "text-red-400"
          )}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>
    </div>
  );
}
