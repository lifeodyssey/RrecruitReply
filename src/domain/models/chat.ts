/**
 * Domain models for chat messaging in the AutoRAG system
 */

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: Array<{
    id: string;
    title: string;
    source: string;
    content: string;
    similarity: number;
  }>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
} 