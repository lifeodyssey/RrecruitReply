/**
 * Domain models for chat messaging in the AutoRAG system
 */

import type { ISource } from './document';

/**
 * Defines possible roles for a message in a conversation
 */
export type MessageRole = 'user' | 'assistant';

/**
 * Represents a message in a conversation
 */
export interface IMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: ISource[];
}

/**
 * Represents a conversation between a user and the assistant
 */
export interface IConversation {
  id: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}
