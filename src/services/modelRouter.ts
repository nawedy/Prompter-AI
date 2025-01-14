import type { AIModel, ProjectType, PromptConfig } from '../types';

interface ModelCapability {
  maxTokens: number;
  supportedTypes: ProjectType[];
  costPerToken: number;
}

export class ModelRouter {
  private static instance: ModelRouter;
  
  private constructor() {}

  static getInstance(): ModelRouter {
    if (!ModelRouter.instance) {
      ModelRouter.instance = new ModelRouter();
    }
    return ModelRouter.instance;
  }

  getModelCapabilities(model: AIModel): ModelCapability {
    return this.modelCapabilities[model];
  }

  async routePrompt(config: PromptConfig): Promise<AIModel> {
    const { projectType, preferredModel, maxCost } = config;
    
    // If preferred model is specified and supports the project type, use it
    if (preferredModel) {
      const capabilities = this.getModelCapabilities(preferredModel);
      if (capabilities.supportedTypes.includes(projectType)) {
        return preferredModel;
      }
    }

    // Find all models that support the project type
    const compatibleModels = Object.entries(this.modelCapabilities)
      .filter(([_, capabilities]) => capabilities.supportedTypes.includes(projectType))
      .map(([model]) => model as AIModel);

    if (compatibleModels.length === 0) {
      throw new Error(`No models support project type: ${projectType}`);
    }

    // If max cost is specified, filter by cost
    if (maxCost) {
      const affordableModels = compatibleModels.filter(model => 
        this.modelCapabilities[model].costPerToken <= maxCost
      );
      if (affordableModels.length > 0) {
        return affordableModels[0];
      }
    }

    // Default to the first compatible model
    return compatibleModels[0];
  }

  private modelCapabilities: Record<AIModel, ModelCapability> = {
    'gpt-4': {
      maxTokens: 8192,
      supportedTypes: ['text-completion', 'code-generation'],
      costPerToken: 0.03,
    },
    'gpt-3.5-turbo': {
      maxTokens: 4096,
      supportedTypes: ['text-completion', 'code-generation'],
      costPerToken: 0.002,
    },
    'claude-2': {
      maxTokens: 100000,
      supportedTypes: ['text-completion', 'code-generation'],
      costPerToken: 0.01,
    },
    'mistral-medium': {
      maxTokens: 32768,
      supportedTypes: ['text-completion', 'code-generation'],
      costPerToken: 0.007,
    },
    'stable-diffusion-xl': {
      maxTokens: 77,
      supportedTypes: ['text-to-image'],
      costPerToken: 0.02,
    },
    'midjourney': {
      maxTokens: 60,
      supportedTypes: ['text-to-image'],
      costPerToken: 0.04,
    },
  };
}

export const modelRouter = ModelRouter.getInstance();