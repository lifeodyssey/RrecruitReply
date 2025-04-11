"use client";

import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { QueryResponse } from "@/lib/autorag/client";
import { toast } from "sonner";

// Define message types
type MessageRole = "user" | "assistant";

interface Message {
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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("recruitreply-chat");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Failed to parse saved messages:", error);
        // If parsing fails, start with the welcome message
        setMessages([createWelcomeMessage()]);
      }
    } else {
      // If no saved messages, start with the welcome message
      setMessages([createWelcomeMessage()]);
    }
  }, []);

  // Save conversation to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("recruitreply-chat", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create welcome message
  function createWelcomeMessage(): Message {
    return {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Hello! I'm your recruitment assistant. Ask me any questions about recruitment, and I'll provide answers based on your documents.",
      timestamp: new Date(),
    };
  }

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);

    // Clear input
    setInput("");

    // Set loading state
    setIsLoading(true);

    try {
      // Send query to API
      const response = await fetch("/api/autorag/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: QueryResponse = await response.json();

      // Create assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        sources: data.sources,
      };

      // Add assistant message to state
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error querying AutoRAG:", error);
      toast.error("Failed to get a response. Please try again.");

      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear conversation
  const clearConversation = () => {
    if (confirm("Are you sure you want to clear the conversation?")) {
      setMessages([createWelcomeMessage()]);
      localStorage.removeItem("recruitreply-chat");
    }
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat with RecruitReply</h1>
          <Button variant="outline" onClick={clearConversation}>Clear Conversation</Button>
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
