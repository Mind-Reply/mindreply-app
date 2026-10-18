import type { UIMessage } from 'ai';

// The chat UI streams typed custom data parts (artifact deltas, suggestions, and status events).
// Keep this transport type aligned with the AI SDK writer while the data-part map is centralized.
export type ChatMessage = UIMessage<any, any, any>;

export type Phase = 'waiting' | 'still-waiting' | 'health' | 'thinking' | 'error';

export interface Chat {
  id: string;
  userId: string;
  title: string;
  visibility: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWithMessages extends Chat {
  messages: DBMessage[];
}

export interface DBMessage {
  id: string;
  chatId: string;
  role: string;
  content: string | ChatMessage['parts'];
  createdAt: Date;
}

export interface Vote {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface Document {
  id: string;
  createdAt: Date;
  title: string;
  content: string;
  kind: string;
  userId: string;
}

export interface Suggestion {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description?: string;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
}

export interface VoiceMemory {
  id: string;
  userId: string;
  key: string;
  value: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}