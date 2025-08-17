import { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileCode,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import type { File as FileType } from '@shared/schema';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  children?: FileNode[];
}

export function ProjectExplorer() {
  const { currentProject, setCurrentFile } = useAppStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  const { data: files = [] } = useQuery<FileType[]>({
    queryKey: ['/api/projects', currentProject?.id, 'files'],
    enabled: !!currentProject?.id,
  });

  // Build file tree from flat file list
  const buildFileTree = (files: FileType[]): FileNode[] => {
    const tree: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    // Add a default project structure if no files
    if (!files.length) {
      return [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          path: 'src',
          children: [
            {
              id: 'app-tsx',
              name: 'App.tsx',
              type: 'file',
              path: 'src/App.tsx',
              language: 'typescript'
            },
            {
              id: 'main-ts',
              name: 'main.ts',
              type: 'file', 
              path: 'src/main.ts',
              language: 'typescript'
            }
          ]
        },
        {
          id: 'package-json',
          name: 'package.json',
          type: 'file',
          path: 'package.json',
          language: 'json'
        }
      ];
    }

    // Process actual files
    files.forEach((file) => {
      const pathParts = file.path.split('/');
      let currentLevel = tree;
      let currentPath = '';

      pathParts.forEach((part: string, index: number) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === pathParts.length - 1;
        
        let existingNode = currentLevel.find(node => node.name === part);
        
        if (!existingNode) {
          const node: FileNode = {
            id: isFile ? file.id : currentPath,
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            language: isFile ? file.language : undefined,
            children: isFile ? undefined : []
          };
          
          currentLevel.push(node);
          if (!isFile) {
            folderMap.set(currentPath, node);
          }
          existingNode = node;
        }
        
        if (!isFile && existingNode.children) {
          currentLevel = existingNode.children;
        }
      });
    });

    return tree.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const fileTree = buildFileTree(files);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const selectFile = (file: FileNode) => {
    if (file.type === 'file') {
      const fileData = files.find(f => f.id === file.id);
      if (fileData) {
        setCurrentFile(fileData);
      }
    }
  };

  const getFileIcon = (node: FileNode) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.path) ? FolderOpen : Folder;
    }
    
    const extension = node.name.split('.').pop()?.toLowerCase();
    if (['ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs'].includes(extension || '')) {
      return FileCode;
    }
    return File;
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => {
      const Icon = getFileIcon(node);
      const isExpanded = expandedFolders.has(node.path);
      
      return (
        <div key={node.id}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start px-0 py-1 h-auto text-sm font-normal hover:bg-vscode-hover hover:text-white",
              "text-vscode-text"
            )}
            style={{ paddingLeft: `${level * 12 + 4}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(node.path);
              } else {
                selectFile(node);
              }
            }}
          >
            <div className="flex items-center space-x-2 w-full">
              {node.type === 'folder' && (
                <div className="w-4 h-4 flex items-center justify-center">
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </div>
              )}
              <Icon className={cn(
                "w-4 h-4",
                node.type === 'folder' 
                  ? "text-amber-500" 
                  : node.language === 'typescript' || node.language === 'javascript'
                    ? "text-blue-400"
                    : "text-gray-400"
              )} />
              <span className="truncate">{node.name}</span>
            </div>
          </Button>
          
          {node.type === 'folder' && node.children && isExpanded && (
            <div>
              {renderFileTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!currentProject) {
    return (
      <div className="text-sm text-vscode-text-muted">
        No project selected
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center py-1">
        <Folder className="w-4 h-4 text-amber-500 mr-2" />
        <span className="text-vscode-text font-medium truncate">
          {currentProject.name}
        </span>
      </div>
      <div className="ml-2">
        {renderFileTree(fileTree, 1)}
      </div>
    </div>
  );
}
