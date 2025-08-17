import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { StatusBar } from '@/components/StatusBar';
import { TerminalConsole } from '@/components/TerminalConsole';
import { ResourceNetwork } from '@/components/ResourceNetwork';
import { PlannerMode } from '@/components/modes/PlannerMode';
import { ArchitectMode } from '@/components/modes/ArchitectMode';
import { CoderMode } from '@/components/modes/CoderMode';
import { AutoMode } from '@/components/modes/AutoMode';
import { DebugMode } from '@/components/modes/DebugMode';
import { useAppStore } from '@/stores/appStore';
import { 
  Terminal, 
  Network, 
  PanelLeftClose, 
  PanelLeftOpen,
  PanelBottomClose,
  PanelBottomOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

export function IDELayout() {
  const { 
    currentMode, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    terminalOpen,
    setTerminalOpen,
    resourceNetworkOpen,
    setResourceNetworkOpen
  } = useAppStore();

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
      
      {/* Main IDE Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Sidebar Panel */}
          <ResizablePanel
            defaultSize={sidebarCollapsed ? 3 : 20}
            minSize={3}
            maxSize={30}
            collapsible={true}
            onCollapse={() => setSidebarCollapsed(true)}
            onExpand={() => setSidebarCollapsed(false)}
          >
            <div className="h-full flex flex-col">
              <Sidebar />
              
              {/* Panel Toggle Buttons */}
              <div className="border-t border-vscode-border p-2 bg-vscode-sidebar">
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-xs h-8 ${
                      terminalOpen 
                        ? 'bg-vscode-accent text-white' 
                        : 'text-vscode-text hover:bg-vscode-hover hover:text-white'
                    }`}
                    onClick={() => setTerminalOpen(!terminalOpen)}
                  >
                    <Terminal className="w-3 h-3 mr-2" />
                    {!sidebarCollapsed && 'Terminal'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-xs h-8 ${
                      resourceNetworkOpen 
                        ? 'bg-vscode-accent text-white' 
                        : 'text-vscode-text hover:bg-vscode-hover hover:text-white'
                    }`}
                    onClick={() => setResourceNetworkOpen(!resourceNetworkOpen)}
                  >
                    <Network className="w-3 h-3 mr-2" />
                    {!sidebarCollapsed && 'Network'}
                  </Button>
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Content Area */}
          <ResizablePanel defaultSize={resourceNetworkOpen ? 60 : 80} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              {/* Main Content */}
              <ResizablePanel defaultSize={terminalOpen ? 70 : 100} minSize={30}>
                <div className="h-full flex flex-col">
                  {/* Content Header with Panel Controls */}
                  <div className="h-8 bg-vscode-sidebar border-b border-vscode-border flex items-center justify-between px-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-vscode-text-muted capitalize">
                        {currentMode} Mode
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        title={sidebarCollapsed ? "Show Sidebar" : "Hide Sidebar"}
                      >
                        {sidebarCollapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
                        onClick={() => setTerminalOpen(!terminalOpen)}
                        title={terminalOpen ? "Hide Terminal" : "Show Terminal"}
                      >
                        {terminalOpen ? <PanelBottomClose className="w-3 h-3" /> : <PanelBottomOpen className="w-3 h-3" />}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-vscode-text-muted hover:text-white hover:bg-vscode-hover"
                        onClick={() => setResourceNetworkOpen(!resourceNetworkOpen)}
                        title={resourceNetworkOpen ? "Hide Network" : "Show Network"}
                      >
                        {resourceNetworkOpen ? <PanelRightClose className="w-3 h-3" /> : <PanelRightOpen className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>

                  {/* Mode Content */}
                  <div className="flex-1 overflow-hidden">
                    {renderModeContent()}
                  </div>
                </div>
              </ResizablePanel>

              {/* Terminal Panel (collapsible) */}
              {terminalOpen && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
                    <TerminalConsole 
                      isOpen={terminalOpen} 
                      onClose={() => setTerminalOpen(false)} 
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {/* Right Panel - Resource Network (collapsible) */}
          {resourceNetworkOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <ResourceNetwork 
                  isOpen={resourceNetworkOpen} 
                  onClose={() => setResourceNetworkOpen(false)} 
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}