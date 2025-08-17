import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { useAppStore } from '@/stores/appStore';

// Configure Monaco for dark theme to match VSCode
monaco.editor.defineTheme('vscode-dark-custom', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955' },
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'class', foreground: '4EC9B0' },
    { token: 'function', foreground: 'DCDCAA' },
    { token: 'variable', foreground: '9CDCFE' },
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#CCCCCC',
    'editor.lineHighlightBackground': '#2A2D2E',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3D41',
  }
});

monaco.editor.setTheme('vscode-dark-custom');

interface MonacoEditorProps {
  defaultValue?: string;
  language?: string;
  onChange?: (value: string) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  className?: string;
}

export function MonacoEditor({ 
  defaultValue = '', 
  language = 'typescript',
  onChange,
  onMount,
  className = ''
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { currentFile } = useAppStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = monaco.editor.create(containerRef.current, {
      value: currentFile?.content || defaultValue,
      language: currentFile?.language || language,
      theme: 'vscode-dark-custom',
      automaticLayout: true,
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
    });

    editorRef.current = editor;

    // Handle content changes
    const disposable = editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange?.(value);
    });

    onMount?.(editor);

    return () => {
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  // Update editor content when current file changes
  useEffect(() => {
    if (editorRef.current && currentFile) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== currentFile.content) {
        editorRef.current.setValue(currentFile.content || '');
        
        // Update language
        const model = editorRef.current.getModel();
        if (model && currentFile.language) {
          monaco.editor.setModelLanguage(model, currentFile.language);
        }
      }
    }
  }, [currentFile]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
    />
  );
}
