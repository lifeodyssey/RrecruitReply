import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from '@/app/chat/page';
import { server } from '../mocks/server';

// Setup mock server before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

// Mock the toast function
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Chat Interaction E2E', () => {
  it('completes a full chat interaction flow', async () => {
    const user = userEvent.setup();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
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
    window.confirm = jest.fn(() => true);
    
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
