import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps): React.ReactElement {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    await onSendMessage(input);
    setInput("");
  };

  return (
    <form className="flex w-full gap-2" onSubmit={handleSubmit}>
      <Input
        placeholder="Type your message here..."
        className="flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isLoading}
        data-testid="chat-input"
      />
      <Button 
        type="submit" 
        disabled={isLoading || !input.trim()}
        data-testid="send-button"
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
} 