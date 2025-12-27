
export enum Screen {
  Welcome = 'welcome',
  Auth = 'auth',
  Chat = 'chat',
  Assessments = 'assessments',
  Profile = 'profile',
  Features = 'features'
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  analysis?: PsychologicalAnalysis;
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
}

export interface AnalysisPreferences {
  focusArea: 'general' | 'career' | 'relationships' | 'anxiety';
  depth: 'detailed' | 'balanced' | 'concise';
}

export interface User {
  name: string;
  phoneNumber: string;
  avatar?: string;
  history?: Message[];
  theme?: ThemeSettings;
  analysisPreferences?: AnalysisPreferences;
}
