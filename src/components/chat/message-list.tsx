import React, { useRef, useEffect } from 'react';

import { Message } from '@/domain/models/chat';

import { LoadingMessage } from './loading-message';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps): React.ReactElement {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Scroll to bottom of messages
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Loading indicator */}
      {isLoading && <LoadingMessage />}

      {/* Invisible div for scrolling to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
} 