import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { autoragClient } from '@/lib/autorag/client';

import type { IMessage } from '@/domain/models/chat';

/**
 * Custom hook for managing chat messages
 */
export function useChatMessages(): {
  messages: IMessage[];
  isLoading: boolean;
  sendMessage: (messageText: string) => Promise<void>;
  clearConversation: () => void;
} {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Create welcome message
  const createWelcomeMessage = useCallback(
    (): IMessage => ({
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        "Hello! I'm your recruitment assistant. Ask me any questions about recruitment, and I'll provide answers based on your documents.",
      timestamp: new Date(),
    }),
    []
  );

  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('recruitreply-chat');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg: IMessage & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse saved messages:', error);
        // If parsing fails, start with the welcome message
        setMessages([createWelcomeMessage()]);
      }
    } else {
      // If no saved messages, start with the welcome message
      setMessages([createWelcomeMessage()]);
    }
  }, [createWelcomeMessage]);

  // Save conversation to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('recruitreply-chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Send a message and get a response
  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) {
        return;
      }

      // Create user message
      const userMessage: IMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageText.trim(),
        timestamp: new Date(),
      };

      // Add user message to state
      setMessages((prev) => [...prev, userMessage]);

      // Set loading state
      setIsLoading(true);

      try {
        // Send query to API
        const data = await autoragClient.query(userMessage.content);

        // Create assistant message
        const assistantMessage: IMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
          sources: data.sources,
        };

        // Add assistant message to state
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error querying AutoRAG:', error);
        toast.error('Failed to get a response. Please try again.');

        // Add error message
        const errorMessage: IMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "I'm sorry, I couldn't process your request. Please try again later.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  // Clear conversation
  const clearConversation = useCallback(() => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      setMessages([createWelcomeMessage()]);
      localStorage.removeItem('recruitreply-chat');
    }
  }, [createWelcomeMessage]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  };
}
