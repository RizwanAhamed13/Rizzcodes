import { useEffect } from 'react';
import { IDELayout } from '@/components/IDELayout';
import { useAppStore } from '@/stores/appStore';
import { useQuery } from '@tanstack/react-query';
import { Project, OpenRouterConfig } from '@shared/schema';

export default function Home() {
  const { 
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

  return <IDELayout />;
}
