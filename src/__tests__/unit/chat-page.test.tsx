import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from '@/app/chat/page';
import { server } from '../mocks/server';
import { rest } from 'msw';

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

describe('ChatPage', () => {
  it('renders the chat title', () => {
    render(<ChatPage />);
    
    expect(screen.getByText('Chat with RecruitReply')).toBeInTheDocument();
  });

  it('displays the welcome message', () => {
    render(<ChatPage />);
    
    expect(screen.getByText(/Hello! I'm your recruitment assistant/)).toBeInTheDocument();
  });

  it('allows sending a message and displays the response', async () => {
    const user = userEvent.setup();
    
    render(<ChatPage />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message here...');
    await user.type(input, 'What are the benefits?');
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: 'Send' });
    await user.click(sendButton);
    
    // Check if the user message is displayed
    expect(screen.getByText('What are the benefits?')).toBeInTheDocument();
    
    // Check if the loading indicator is displayed
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
    
    // Check if the assistant response is displayed
    expect(screen.getByText('This is a sample answer to your query.')).toBeInTheDocument();
  });

  it('displays sources in the response', async () => {
    const user = userEvent.setup();
    
    render(<ChatPage />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message here...');
    await user.type(input, 'What are the benefits?');
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: 'Send' });
    await user.click(sendButton);
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
    
    // Check if the sources are displayed
    expect(screen.getByText('Sources:')).toBeInTheDocument();
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();
  });

  it('handles errors when querying', async () => {
    // Override the handler to return an error
    server.use(
      rest.post('/api/autorag/query', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Failed to query' }));
      })
    );
    
    const user = userEvent.setup();
    
    render(<ChatPage />);
    
    // Type a message
    const input = screen.getByPlaceholderText('Type your message here...');
    await user.type(input, 'What are the benefits?');
    
    // Send the message
    const sendButton = screen.getByRole('button', { name: 'Send' });
    await user.click(sendButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText("I'm sorry, I couldn't process your request. Please try again later.")).toBeInTheDocument();
    });
  });

  it('clears the conversation when clicking the clear button', async () => {
    const user = userEvent.setup();
    
    // Mock the confirm function to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<ChatPage />);
    
    // Type and send a message
    const input = screen.getByPlaceholderText('Type your message here...');
    await user.type(input, 'What are the benefits?');
    
    const sendButton = screen.getByRole('button', { name: 'Send' });
    await user.click(sendButton);
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
    
    // Click the clear button
    const clearButton = screen.getByRole('button', { name: 'Clear Conversation' });
    await user.click(clearButton);
    
    // Restore the original confirm function
    window.confirm = originalConfirm;
    
    // Check if the conversation is cleared (only welcome message remains)
    expect(screen.queryByText('What are the benefits?')).not.toBeInTheDocument();
    expect(screen.queryByText('This is a sample answer to your query.')).not.toBeInTheDocument();
    expect(screen.getByText(/Hello! I'm your recruitment assistant/)).toBeInTheDocument();
  });
});
