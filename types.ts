
export enum Screen {
  Welcome = 'welcome',
  Auth = 'auth',
  Chat = 'chat',
  Assessments = 'assessments',
  Profile = 'profile',
  Features = 'features'
}

export type MediaPart = {
  type: 'image' | 'video' | 'audio';
  url: string;
  mimeType?: string;
};

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  analysis?: PsychologicalAnalysis;
  media?: MediaPart;
  grounding?: { title: string; uri: string }[];
  isThinking?: boolean;
}

export interface PsychologicalAnalysis {
  stressLevel: number;
  anxietyLevel: number;
  mood: string;
  energy: number;
  insight: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: number;
  duration: number;
  category: string;
  completed?: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark';
  accentColor: string;
  personalityMode: 'professional' | 'kind' | 'clinical';
  speechSpeed: number;
}

export interface AnalysisPreferences {
  focusArea: 'general' | 'career' | 'relationships' | 'anxiety';
  depth: 'detailed' | 'balanced' | 'concise';
  responseTone: 'empathetic' | 'direct' | 'balanced';
  thinkingEnabled: boolean;
  searchEnabled: boolean;
  modelSpeed: 'fast' | 'balanced' | 'pro';
}

export interface Session {
  id: string;
  date: string;
  summary: string;
  messages: Message[];
}

export interface User {
  name: string;
  phoneNumber: string;
  avatar?: string;
  history?: Message[];
  sessions?: Session[];
  theme?: ThemeSettings;
  analysisPreferences?: AnalysisPreferences;
}
