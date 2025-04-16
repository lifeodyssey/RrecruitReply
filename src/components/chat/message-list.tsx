import React, { useEffect, useRef } from 'react';


import { LoadingMessage } from './loading-message';
import { MessageItem } from './message-item';

import type { IMessage } from '@/domain/models/chat';


interface IMessageListProps {
  messages: IMessage[];
  isLoading: boolean;
}

export const MessageList = ({ messages, isLoading }: IMessageListProps): React.ReactElement => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Scroll to bottom of messages
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Loading indicator */}
      {isLoading ? <LoadingMessage /> : null}

      {/* Invisible div for scrolling to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};
