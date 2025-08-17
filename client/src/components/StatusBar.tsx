import { useAppStore } from '@/stores/appStore';
import { GitBranch, AlertCircle } from 'lucide-react';

export function StatusBar() {
  const { openRouterConfig, currentFile } = useAppStore();
  
  const isConnected = openRouterConfig?.isConnected || false;
  const selectedModel = openRouterConfig?.selectedModel || 'No model selected';

  return (
    <div className="h-6 bg-vscode-accent flex items-center justify-between px-4 text-xs text-white">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>No issues</span>
        </div>
        <div>
          OpenRouter: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div>{currentFile?.language || 'TypeScript'}</div>
        <div>UTF-8</div>
        <div>Ln 1, Col 1</div>
      </div>
    </div>
  );
}
