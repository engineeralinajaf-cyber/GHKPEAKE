export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface AppSettings {
  modelName: string;
  temperature: number;
}

// Helper for type-safe event handling
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;