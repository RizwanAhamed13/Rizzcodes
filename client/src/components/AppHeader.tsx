import { Minus, Square, X, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const handleMinimize = () => {
    // In a real Electron app, this would minimize the window
    console.log('Minimize window');
  };

  const handleMaximize = () => {
    // In a real Electron app, this would maximize/restore the window
    console.log('Maximize/restore window');
  };

  const handleClose = () => {
    // In a real Electron app, this would close the window
    console.log('Close window');
  };

  return (
    <div className="h-8 bg-vscode-sidebar border-b border-vscode-border flex items-center justify-between px-4 text-xs drag-region">
      <div className="flex items-center space-x-2">
        <Code className="w-4 h-4 text-ai-primary" />
        <span className="font-medium text-vscode-text">Rizz Codes</span>
      </div>
      <div className="flex items-center space-x-1 no-drag">
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 hover:bg-vscode-hover text-vscode-text-muted hover:text-vscode-text"
          onClick={handleMinimize}
        >
          <Minus className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 hover:bg-vscode-hover text-vscode-text-muted hover:text-vscode-text"
          onClick={handleMaximize}
        >
          <Square className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 hover:bg-red-600 text-vscode-text-muted hover:text-white"
          onClick={handleClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
