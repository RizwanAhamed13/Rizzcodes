import { useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { StatusBar } from '@/components/StatusBar';
import { PlannerMode } from '@/components/modes/PlannerMode';
import { ArchitectMode } from '@/components/modes/ArchitectMode';
import { CoderMode } from '@/components/modes/CoderMode';
import { AutoMode } from '@/components/modes/AutoMode';
import { DebugMode } from '@/components/modes/DebugMode';
import { useAppStore } from '@/stores/appStore';
import { useQuery } from '@tanstack/react-query';
import { Project, OpenRouterConfig } from '@shared/schema';

export default function Home() {
  const { 
    currentMode, 
    setProjects, 
    setOpenRouterConfig,
    currentProject,
    setCurrentProject
  } = useAppStore();

  // Fetch initial data
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: openRouterConfig } = useQuery<OpenRouterConfig | { isConnected: boolean }>({
    queryKey: ['/api/openrouter/config'],
  });

  // Update store with fetched data
  useEffect(() => {
    if (projects.length > 0) {
      setProjects(projects);
      // Auto-select first project if none selected
      if (!currentProject) {
        setCurrentProject(projects[0]);
      }
    }
  }, [projects, setProjects, currentProject, setCurrentProject]);

  useEffect(() => {
    if (openRouterConfig && 'id' in openRouterConfig) {
      setOpenRouterConfig(openRouterConfig as OpenRouterConfig);
    }
  }, [openRouterConfig, setOpenRouterConfig]);

  const renderModeContent = () => {
    switch (currentMode) {
      case 'planner':
        return <PlannerMode />;
      case 'architect':
        return <ArchitectMode />;
      case 'coder':
        return <CoderMode />;
      case 'auto':
        return <AutoMode />;
      case 'debug':
        return <DebugMode />;
      default:
        return <PlannerMode />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-vscode-bg">
      {/* App Header */}
      <AppHeader />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Mode Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderModeContent()}
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
