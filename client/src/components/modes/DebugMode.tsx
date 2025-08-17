import { useState, useEffect } from 'react';
import { Play, RotateCcw, Bug, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

interface ErrorInfo {
  type: string;
  file: string;
  line: number;
  column: number;
  message: string;
  stack?: string;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code?: string;
}

export function DebugMode() {
  const { currentProject } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [debugCommand, setDebugCommand] = useState('');
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const { toast } = useToast();

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '14:32:01',
      level: 'info',
      message: 'Starting development server...'
    },
    {
      id: '2',
      timestamp: '14:32:03',
      level: 'info',
      message: '✓ Compiled successfully!'
    },
    {
      id: '3',
      timestamp: '14:32:05',
      level: 'info',
      message: 'Local: http://localhost:3000'
    },
    {
      id: '4',
      timestamp: '14:32:15',
      level: 'error',
      message: '✗ TypeError: Cannot read property \'map\' of undefined'
    },
    {
      id: '5',
      timestamp: '14:32:16',
      level: 'warn',
      message: 'AI Debug: Analyzing error...'
    },
    {
      id: '6',
      timestamp: '14:32:17',
      level: 'warn',
      message: 'AI Debug: Found issue in TaskBoard component'
    },
    {
      id: '7',
      timestamp: '14:32:18',
      level: 'info',
      message: 'AI Debug: Searching for solutions...'
    },
    {
      id: '8',
      timestamp: '14:32:20',
      level: 'info',
      message: 'AI Debug: Proposed fix ready for review'
    }
  ]);

  const [currentError, setCurrentError] = useState<ErrorInfo>({
    type: 'TypeError',
    file: 'TaskBoard.tsx',
    line: 42,
    column: 18,
    message: 'Cannot read property \'map\' of undefined',
    stack: 'TypeError: Cannot read property \'map\' of undefined\n    at TaskBoard.tsx:42:18\n    at renderBoard'
  });

  const [solutions, setSolutions] = useState<Solution[]>([
    {
      id: '1',
      title: 'Apply Optional Chaining',
      description: 'Add ?. operator to safely access tasks property',
      difficulty: 'easy',
      code: 'tasks?.map(task => ...) || []'
    },
    {
      id: '2', 
      title: 'Add Default Props',
      description: 'Set default value for tasks prop in component',
      difficulty: 'easy',
      code: 'const { tasks = [] } = props;'
    },
    {
      id: '3',
      title: 'Add Type Guards',
      description: 'Check if tasks exists before mapping',
      difficulty: 'medium',
      code: 'if (Array.isArray(tasks) && tasks.length > 0) { ... }'
    }
  ]);

  const handleStartApp = () => {
    setIsRunning(true);
    toast({
      title: "Application Started",
      description: "Development server is now running on port 3000",
    });
    
    // Simulate adding new logs
    const newLog: LogEntry = {
      id: String(logs.length + 1),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
      level: 'info',
      message: 'Application restarted successfully'
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleClearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs Cleared",
      description: "Console output has been cleared",
    });
  };

  const handleDebugCommand = () => {
    if (!debugCommand.trim()) return;
    
    const newLog: LogEntry = {
      id: String(logs.length + 1),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
      level: 'info',
      message: `> ${debugCommand}`
    };
    setLogs(prev => [...prev, newLog]);
    setDebugCommand('');
    
    // Simulate command execution
    setTimeout(() => {
      const responseLog: LogEntry = {
        id: String(logs.length + 2),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
        level: 'info',
        message: 'Command executed successfully'
      };
      setLogs(prev => [...prev, responseLog]);
    }, 500);
  };

  const handleApplyFix = (solution: Solution) => {
    toast({
      title: "Fix Applied",
      description: `Applied solution: ${solution.title}`,
    });
    
    const newLog: LogEntry = {
      id: String(logs.length + 1),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 8),
      level: 'info',
      message: `Applied fix: ${solution.title}`
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleAutoFix = () => {
    const recommendedSolution = solutions[0];
    handleApplyFix(recommendedSolution);
  };

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-green-400';
      default:
        return 'text-vscode-text';
    }
  };

  const getDifficultyColor = (difficulty: Solution['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'hard':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="flex h-full">
      
      {/* Debug Console */}
      <div className="flex-1 flex flex-col">
        <div className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center px-4">
          <h2 className="text-lg font-semibold text-white">Debug Console</h2>
          <div className="ml-auto flex items-center space-x-2">
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-500"
              onClick={handleStartApp}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running' : 'Start App'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-600 text-white hover:bg-gray-500"
              onClick={handleClearLogs}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Logs
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {currentError && (
          <Alert className="m-4 border-red-500 bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{currentError.type} detected</h3>
                  <p className="text-sm mt-1">
                    {currentError.message} at {currentError.file}:{currentError.line}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-500"
                  onClick={handleAutoFix}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Auto Fix
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Console Output */}
        <ScrollArea className="flex-1 bg-black p-4 font-code text-sm">
          <div className="space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-2">
                {getLogIcon(log.level)}
                <span className="text-gray-400 text-xs w-16 flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <span className={getLogColor(log.level)}>{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Debug Input */}
        <div className="p-4 border-t border-vscode-border bg-black">
          <div className="flex space-x-2 items-center">
            <span className="text-vscode-accent font-code text-sm">{'>'}</span>
            <Input
              type="text"
              placeholder="Enter debug command..."
              value={debugCommand}
              onChange={(e) => setDebugCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleDebugCommand()}
              className="flex-1 bg-transparent border-none text-white font-code outline-none focus:ring-0 focus:border-none"
            />
          </div>
        </div>
      </div>

      {/* AI Debug Assistant */}
      <div className="w-96 bg-vscode-sidebar border-l border-vscode-border flex flex-col">
        <div className="h-12 border-b border-vscode-border flex items-center px-4">
          <h3 className="font-semibold text-white">AI Debug Assistant</h3>
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          
          {/* Error Analysis */}
          {currentError && (
            <div className="p-4 border-b border-vscode-border">
              <h4 className="font-medium text-white mb-3">Error Analysis</h4>
              <Card className="bg-vscode-border border-vscode-border">
                <CardContent className="p-3 text-sm">
                  <div className="text-red-400 font-medium mb-2">
                    {currentError.type} in {currentError.file}
                  </div>
                  <div className="text-vscode-text mb-3">
                    The error occurs because 'tasks' prop is undefined when the component first renders, 
                    but the code tries to call .map() on it.
                  </div>
                  
                  <h5 className="text-white font-medium mb-2">Suggested Fix:</h5>
                  <div className="bg-vscode-bg rounded p-2 font-code text-xs">
                    <div className="text-gray-500">// Before (line 42)</div>
                    <div className="text-red-300">tasks.map(task =&gt; ...)</div>
                    <div className="text-gray-500 mt-2">// After</div>
                    <div className="text-green-300">tasks?.map(task =&gt; ...) || []</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Solution Options */}
          <div className="p-4 border-b border-vscode-border">
            <h4 className="font-medium text-white mb-3">Solution Options</h4>
            <div className="space-y-2">
              {solutions.map((solution) => (
                <Button
                  key={solution.id}
                  variant="ghost"
                  className="w-full text-left p-3 bg-vscode-border hover:bg-vscode-hover h-auto"
                  onClick={() => handleApplyFix(solution)}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-white text-sm">{solution.title}</div>
                      <Badge className={`${getDifficultyColor(solution.difficulty)} text-white text-xs`}>
                        {solution.difficulty}
                      </Badge>
                    </div>
                    <div className="text-xs text-vscode-text-muted">{solution.description}</div>
                    {solution.code && (
                      <div className="mt-2 bg-vscode-bg rounded p-2 font-code text-xs text-green-300">
                        {solution.code}
                      </div>
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Auto-fix Controls */}
          <div className="p-4">
            <Button
              className="w-full bg-green-600 text-white hover:bg-green-500 mb-3"
              onClick={handleAutoFix}
            >
              <Zap className="w-4 h-4 mr-2" />
              Apply Recommended Fix
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                className="flex-1 bg-vscode-border text-white hover:bg-vscode-hover text-xs"
              >
                Preview
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-vscode-border text-white hover:bg-vscode-hover text-xs"
              >
                Test Fix
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
