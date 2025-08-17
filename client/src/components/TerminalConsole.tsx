import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Play, Square, RotateCcw } from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: Date;
}

interface TerminalConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerminalConsole({ isOpen, onClose }: TerminalConsoleProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Rizz Codes Terminal v1.0.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('/project');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addLine = (type: 'input' | 'output' | 'error', content: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    addLine('input', `${currentDirectory}$ ${command}`);
    setIsRunning(true);

    // Simulate command execution
    await new Promise(resolve => setTimeout(resolve, 100));

    const trimmedCommand = command.trim().toLowerCase();

    switch (trimmedCommand) {
      case 'help':
        addLine('output', 'Available commands:');
        addLine('output', '  help     - Show this help message');
        addLine('output', '  clear    - Clear terminal screen');
        addLine('output', '  pwd      - Show current directory');
        addLine('output', '  ls       - List directory contents');
        addLine('output', '  npm      - Run npm commands');
        addLine('output', '  node     - Run node commands');
        addLine('output', '  git      - Git version control');
        break;

      case 'clear':
        setLines([]);
        break;

      case 'pwd':
        addLine('output', currentDirectory);
        break;

      case 'ls':
        addLine('output', 'client/');
        addLine('output', 'server/');
        addLine('output', 'shared/');
        addLine('output', 'package.json');
        addLine('output', 'README.md');
        addLine('output', 'tsconfig.json');
        break;

      case '':
        // Empty command, just show prompt again
        break;

      default:
        if (trimmedCommand.startsWith('npm ')) {
          addLine('output', `Executing: ${command}`);
          addLine('output', 'npm command simulation - would run in real environment');
        } else if (trimmedCommand.startsWith('node ')) {
          addLine('output', `Executing: ${command}`);
          addLine('output', 'Node.js command simulation - would run in real environment');
        } else if (trimmedCommand.startsWith('git ')) {
          addLine('output', `Executing: ${command}`);
          addLine('output', 'Git command simulation - would run in real environment');
        } else {
          addLine('error', `Command not found: ${command}`);
          addLine('output', 'Type "help" for available commands');
        }
        break;
    }

    setIsRunning(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRunning) {
      if (currentInput.trim()) {
        executeCommand(currentInput);
      } else {
        addLine('input', `${currentDirectory}$ `);
      }
      setCurrentInput('');
    }
  };

  const clearTerminal = () => {
    setLines([
      {
        id: Date.now().toString(),
        type: 'output',
        content: 'Terminal cleared',
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-vscode-bg border-t border-vscode-border h-80 flex flex-col">
      {/* Terminal Header */}
      <div className="h-10 bg-vscode-sidebar border-b border-vscode-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-white text-sm">Terminal</span>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
              onClick={clearTerminal}
              disabled={isRunning}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
            {isRunning ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-vscode-hover"
                onClick={() => setIsRunning(false)}
              >
                <Square className="w-3 h-3 fill-current" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-vscode-hover"
              >
                <Play className="w-3 h-3 fill-current" />
              </Button>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
          onClick={onClose}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-3" ref={scrollRef}>
          <div className="font-mono text-sm space-y-1">
            {lines.map((line) => (
              <div key={line.id} className="flex">
                <span
                  className={
                    line.type === 'input'
                      ? 'text-vscode-text'
                      : line.type === 'error'
                      ? 'text-red-400'
                      : 'text-gray-300'
                  }
                >
                  {line.content}
                </span>
              </div>
            ))}
            {isRunning && (
              <div className="flex items-center text-yellow-400">
                <span className="mr-2">Running...</span>
                <div className="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Terminal Input */}
        <div className="p-3 border-t border-vscode-border bg-vscode-bg">
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-mono text-sm">{currentDirectory}$</span>
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isRunning}
              className="bg-transparent border-none focus:ring-0 font-mono text-sm text-white placeholder-gray-500 px-0"
              placeholder="Type a command..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}