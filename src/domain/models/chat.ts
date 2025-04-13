/**
 * Domain models for chat messaging in the AutoRAG system
 */

import { Source } from './document';

/**
 * Defines possible roles for a message in a conversation
 */
export type MessageRole = 'user' | 'assistant';

/**
 * Represents a message in a conversation
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: Source[];
}

/**
 * Represents a conversation between a user and the assistant
 */
export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
} 