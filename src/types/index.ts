export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  toolType: AIToolType;
  tags: string[];
  folderId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  apiKeys: APIKeys;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: Theme;
  language: Language;
  defaultMode: PromptMode;
}

export type Theme = 'light' | 'dark' | 'system';

export type Language = 'en' | 'am' | 'fr' | 'es' | 'de' | 'ar';

export interface APIKeys {
  huggingface?: string;
  openai?: string;
  anthropic?: string;
  googleAi?: string;
  mistral?: string;
  cohere?: string;
  xai?: string;
}

export type AIToolType = 
  | 'TEXT_TO_IMAGE'
  | 'IMAGE_ENHANCEMENT'
  | 'TEXT_TO_VIDEO'
  | 'IMAGE_TO_VIDEO'
  | 'VIDEO_TO_VIDEO'
  | 'TEXT_COMPLETION'
  | 'CODE_GENERATION';

export type PromptMode = 'guide' | 'generate';

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  project_type: string;
  tags?: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}