import React from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Message } from '@/domain/models/chat';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps): React.ReactElement {
  return (
    <div 
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
      data-testid={`message-${message.role}`}
    >
      <div 
        className={`p-3 rounded-lg ${
          message.role === "user" 
            ? "bg-primary text-primary-foreground ml-12" 
            : "bg-muted mr-12"
        } max-w-[80%]`}
      >
        <div className="flex items-center gap-2 mb-1">
          <Avatar className="h-6 w-6">
            <div className="flex h-full w-full items-center justify-center bg-muted">
              {message.role === "user" ? "U" : "R"}
            </div>
          </Avatar>
          <p className="text-sm font-medium">
            {message.role === "user" ? "You" : "RecruitReply"}
          </p>
        </div>
        <p className="whitespace-pre-wrap">{message.content}</p>

        {/* Show sources if available */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs font-medium mb-1">Sources:</p>
            <div className="space-y-1">
              {message.sources.map((source) => (
                <div key={source.id} className="text-xs">
                  <p className="font-medium">{source.title}</p>
                  <p className="opacity-80 truncate">{source.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 