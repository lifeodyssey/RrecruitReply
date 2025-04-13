import React from 'react';

import { Avatar } from '@/components/ui/avatar';

export function LoadingMessage(): React.ReactElement {
  return (
    <div className="flex justify-start" data-testid="loading-message">
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
  );
} 