import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import ChatPage from '@/app/chat/page';

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Chat Page E2E Interaction', () => {
  it('completes a full chat interaction flow', async () => {
    const user = userEvent.setup();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    // Render the page
    render(<ChatPage />);

    // 1. Verify welcome message
    expect(screen.getByText(/Hello! I'm your recruitment assistant/)).toBeInTheDocument();

    // 2. Send a message
    const input = screen.getByPlaceholderText('Type your message here...');
    await user.type(input, 'What are the benefits?');

    const sendButton = screen.getByRole('button', { name: 'Send' });
    await user.click(sendButton);

    // Verify user message is displayed
    expect(screen.getByText('What are the benefits?')).toBeInTheDocument();

    // 3. Wait for response
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });

    // Verify assistant response is displayed
    expect(screen.getByText('This is a sample answer to your query.')).toBeInTheDocument();

    // 4. Verify sources are displayed
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();

    // 5. Send another message
    await user.type(input, 'Tell me more about the job requirements');
    await user.click(sendButton);

    // Wait for response
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });

    // 6. Clear the conversation
    // Mock the confirm function to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    const clearButton = screen.getByRole('button', { name: 'Clear Conversation' });
    await user.click(clearButton);

    // Restore the original confirm function
    window.confirm = originalConfirm;

    // Verify conversation is cleared
    expect(screen.queryByText('What are the benefits?')).not.toBeInTheDocument();
    expect(screen.queryByText('Tell me more about the job requirements')).not.toBeInTheDocument();
    expect(screen.getByText(/Hello! I'm your recruitment assistant/)).toBeInTheDocument();

    // Verify localStorage was updated
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('recruitreply-chat');
  });
});
