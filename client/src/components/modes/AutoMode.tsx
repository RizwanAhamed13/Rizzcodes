import { useState } from 'react';
import { Play, Square, Settings, CheckCircle, Clock, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

type AutoMode = 'supervised' | 'autonomous';
type Stage = 'planning' | 'architecture' | 'development' | 'testing' | 'completed';

interface StageInfo {
  id: Stage;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress?: number;
}

export function AutoMode() {
  const { currentProject } = useAppStore();
  const [mode, setMode] = useState<AutoMode>('supervised');
  const [goal, setGoal] = useState('Build a complete task management app with user authentication, real-time collaboration, and a modern React frontend');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage>('development');
  const { toast } = useToast();

  const [stages, setStages] = useState<StageInfo[]>([
    {
      id: 'planning',
      name: 'Planning',
      description: 'Project requirements and user stories generated',
      status: 'completed'
    },
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'Tech stack selected and database schema designed',
      status: 'completed'
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Generating React components and API endpoints',
      status: 'in-progress',
      progress: 75
    },
    {
      id: 'testing',
      name: 'Testing & Debugging',
      description: 'Running tests and fixing any issues',
      status: 'pending'
    }
  ]);

  const [currentActivities] = useState([
    'Creating TaskBoard component...',
    'Implementing drag and drop functionality...',
    'Adding real-time updates with Socket.io...'
  ]);

  const handleStart = () => {
    if (!goal.trim()) {
      toast({
        title: "Error",
        description: "Please enter a development goal first.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    toast({
      title: "Auto Mode Started",
      description: `Starting ${mode} development mode...`,
    });
    
    // Simulate auto development process
    setTimeout(() => {
      setStages(prev => prev.map(stage => 
        stage.id === 'development' 
          ? { ...stage, progress: Math.min((stage.progress || 0) + 10, 100) }
          : stage
      ));
    }, 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
    toast({
      title: "Auto Mode Stopped",
      description: "Development process has been paused.",
    });
  };

  const getStageIcon = (stage: StageInfo) => {
    if (stage.status === 'completed') {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    } else if (stage.status === 'in-progress') {
      return <Cog className="w-8 h-8 text-ai-primary animate-spin" />;
    } else {
      return <Clock className="w-8 h-8 text-vscode-text-muted" />;
    }
  };

  const getStageStatusText = (stage: StageInfo) => {
    if (stage.status === 'completed') {
      return <span className="text-xs text-green-400">Completed</span>;
    } else if (stage.status === 'in-progress') {
      return <span className="text-xs text-ai-primary">In Progress</span>;
    } else {
      return <span className="text-xs text-vscode-text-muted">Pending</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-12 bg-vscode-sidebar border-b border-vscode-border flex items-center px-4">
        <h2 className="text-lg font-semibold text-white">Auto Development</h2>
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-vscode-text-muted">Mode:</span>
            <Select value={mode} onValueChange={(value: AutoMode) => setMode(value)}>
              <SelectTrigger className="bg-vscode-border border-vscode-border text-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-vscode-bg border-vscode-border">
                <SelectItem value="supervised">Supervised</SelectItem>
                <SelectItem value="autonomous">Autonomous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isRunning ? (
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-500"
              onClick={handleStop}
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-green-600 text-white hover:bg-green-500"
              onClick={handleStart}
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Goal Input */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Development Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="bg-vscode-bg border-vscode-border text-white placeholder-vscode-text-muted resize-none"
                placeholder="Describe what you want to build..."
                disabled={isRunning}
              />
              <div className="mt-2 text-xs text-vscode-text-muted">
                Be as specific as possible about your requirements, features, and preferences.
              </div>
            </CardContent>
          </Card>

          {/* Progress Pipeline */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Development Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center space-x-4">
                  {getStageIcon(stage)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{stage.name}</h3>
                        <p className="text-sm text-vscode-text-muted">{stage.description}</p>
                      </div>
                      {getStageStatusText(stage)}
                    </div>
                    {stage.status === 'in-progress' && stage.progress && (
                      <div className="mt-2">
                        <Progress 
                          value={stage.progress} 
                          className="h-2 bg-vscode-bg"
                        />
                        <div className="text-xs text-vscode-text-muted mt-1">
                          {stage.progress}% complete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Activity */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Current Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isRunning ? (
                <div className="space-y-2 text-sm font-code">
                  {currentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-ai-primary rounded-full animate-pulse"></div>
                      <span className="text-vscode-text">{activity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-vscode-text-muted">
                  No active development process. Click "Start" to begin.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mode Information */}
          <Card className="bg-vscode-border border-vscode-border">
            <CardHeader>
              <CardTitle className="text-white">Mode Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-1">Current Mode: {mode}</h4>
                  <p className="text-vscode-text-muted">
                    {mode === 'supervised' 
                      ? 'The AI will ask for your approval at key milestones before proceeding to the next stage.'
                      : 'The AI will work autonomously through all stages with minimal interruption. You can monitor progress and stop at any time.'
                    }
                  </p>
                </div>
                
                <div className="pt-2 border-t border-vscode-border">
                  <h4 className="font-medium text-white mb-2">Features:</h4>
                  <ul className="space-y-1 text-vscode-text-muted">
                    <li>• Automatic project planning and architecture design</li>
                    <li>• Code generation with best practices</li>
                    <li>• Real-time progress tracking</li>
                    <li>• Integrated testing and debugging</li>
                    <li>• Auto-in-Auto: Recursive problem solving</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
