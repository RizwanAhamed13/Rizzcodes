import { useState, useEffect } from 'react';
import { Key, Settings, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/appStore';
import { OpenRouterService, OpenRouterModel } from '@/services/openrouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Free models that don't require payment
const FREE_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.2-1b-instruct:free',
  'huggingface/zephyr-7b-beta:free',
  'mistralai/mistral-7b-instruct:free',
  'openchat/openchat-7b:free',
  'gryphe/mythomist-7b:free',
  'undi95/toppy-m-7b:free'
];

interface ApiKeySettingsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function ApiKeySettings({ isOpen, onClose }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [freeOnly, setFreeOnly] = useState(true);
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();
  const { openRouterConfig, setOpenRouterConfig } = useAppStore();
  const queryClient = useQueryClient();

  // Fetch available models
  const { data: modelsData, isLoading: modelsLoading } = useQuery<{ data: OpenRouterModel[] }>({
    queryKey: ['/api/openrouter/models'],
    enabled: isOpen,
  });

  const updateConfigMutation = useMutation({
    mutationFn: OpenRouterService.updateConfig,
    onSuccess: (data) => {
      setOpenRouterConfig(data);
      queryClient.invalidateQueries({ queryKey: ['/api/openrouter/config'] });
      toast({
        title: "Configuration updated",
        description: "OpenRouter settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Could not update OpenRouter configuration.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (openRouterConfig) {
      setApiKey(openRouterConfig.apiKey || '');
      setSelectedModel(openRouterConfig.selectedModel || 'anthropic/claude-3.5-sonnet');
    }
  }, [openRouterConfig]);

  const filteredModels = modelsData?.data?.filter(model => {
    if (freeOnly) {
      return FREE_MODELS.includes(model.id);
    }
    return true;
  }) || [];

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenRouter API key.",
        variant: "destructive"
      });
      return;
    }

    await updateConfigMutation.mutateAsync({
      apiKey: apiKey.trim(),
      selectedModel: selectedModel,
      modelConfigs: { freeOnly }
    });
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key first.",
        variant: "destructive"
      });
      return;
    }

    setTestingConnection(true);
    
    try {
      // First save the config temporarily
      await updateConfigMutation.mutateAsync({
        apiKey: apiKey.trim(),
        selectedModel: selectedModel,
        modelConfigs: { freeOnly }
      });

      // Then test the connection
      const success = await OpenRouterService.testConnection();
      
      if (success) {
        toast({
          title: "Connection successful",
          description: "Successfully connected to OpenRouter API.",
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Could not connect to OpenRouter. Check your API key.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Could not test the connection.",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-vscode-sidebar border-vscode-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-vscode-text">
            <Settings className="w-5 h-5" />
            <span>OpenRouter API Settings</span>
          </CardTitle>
          <CardDescription className="text-vscode-text-muted">
            Configure your OpenRouter API key and model preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apikey" className="text-vscode-text">API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-vscode-text-muted" />
              <Input
                id="apikey"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pl-10 bg-vscode-bg border-vscode-border text-vscode-text"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="free-only"
              checked={freeOnly}
              onCheckedChange={setFreeOnly}
            />
            <Label htmlFor="free-only" className="text-vscode-text">
              Free models only
            </Label>
            {freeOnly ? (
              <ToggleRight className="w-4 h-4 text-ai-primary" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-vscode-text-muted" />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-vscode-text">Model Selection</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="bg-vscode-bg border-vscode-border text-vscode-text">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-vscode-sidebar border-vscode-border">
                {modelsLoading ? (
                  <SelectItem value="loading">Loading models...</SelectItem>
                ) : filteredModels.length > 0 ? (
                  filteredModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span className="text-vscode-text">{model.name}</span>
                        <span className="text-xs text-vscode-text-muted">
                          {freeOnly ? 'Free' : `$${model.pricing.prompt}/$${model.pricing.completion}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-models">No models available</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              onClick={handleTestConnection}
              disabled={testingConnection || !apiKey.trim()}
              variant="outline"
              className="flex-1 border-vscode-border text-vscode-text hover:bg-vscode-hover"
            >
              {testingConnection ? (
                <>Testing...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Test
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateConfigMutation.isPending}
              className="flex-1 bg-ai-primary hover:bg-ai-primary/80"
            >
              {updateConfigMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-vscode-text-muted hover:text-vscode-text hover:bg-vscode-hover"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}