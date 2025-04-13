"use client";

import React, { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function ChatPage(): React.ReactNode {
  const { messages, isLoading, sendMessage, clearConversation } = useChatMessages();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat with RecruitReply</h1>
          <Button
            variant="outline"
            onClick={clearConversation}
            disabled={isLoading}
          >
            Clear Conversation
          </Button>
        </div>

        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Recruitment Assistant</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] overflow-y-auto border rounded-md p-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground ml-12" : "bg-muted mr-12"} max-w-[80%]`}>
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
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg mr-12 max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <div className="flex h-full w-full items-center justify-center bg-muted">R</div>
                      </Avatar>
                      <p className="text-sm font-medium">RecruitReply</p>
                    </div>
                    <p>Thinking...</p>
                  </div>
                </div>
              )}

              {/* Invisible div for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter>
            <form className="flex w-full gap-2" onSubmit={handleSubmit}>
              <Input
                placeholder="Type your message here..."
                className="flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
