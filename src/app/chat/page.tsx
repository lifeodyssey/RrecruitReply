"use client";

import React, { ReactElement } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatMessages } from "@/hooks/useChatMessages";

export default function ChatPage(): ReactElement {
  const { messages, isLoading, sendMessage, clearConversation } = useChatMessages();

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chat with RecruitReply</h1>
          <Button
            variant="outline"
            onClick={clearConversation}
            disabled={isLoading}
            data-testid="clear-conversation-button"
          >
            Clear Conversation
          </Button>
        </div>

        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Recruitment Assistant</CardTitle>
          </CardHeader>
          <CardContent className="h-[60vh] overflow-y-auto border rounded-md p-4 mb-4">
            <MessageList messages={messages} isLoading={isLoading} />
          </CardContent>
          <CardFooter>
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
