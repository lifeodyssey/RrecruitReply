import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from '@/app/chat/page';

// Store cleanup functions for fetch mocks
const cleanupFunctions: Array<() => void> = [];

// Clean up all fetch mocks after each test
afterEach(() => {
  cleanupFunctions.forEach(cleanup => cleanup());
  cleanupFunctions.length = 0;
});

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
    expect(screen.getAllByText('What are the benefits?')[0]).toBeInTheDocument();

    // Wait for the response (skip checking for loading indicator as it might be too fast)
    await waitFor(() => {
      // Use getAllByText since there might be multiple elements with the same text
      expect(screen.getAllByText('This is a sample answer to your query.')[0]).toBeInTheDocument();
    });
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
      // Use getAllByText since there might be multiple elements with the same text
      expect(screen.getAllByText('This is a sample answer to your query.')[0]).toBeInTheDocument();
    });

    // Check if the sources are displayed
    // Use getAllByText since there might be multiple elements with 'Sources:'
    expect(screen.getAllByText('Sources:')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sample Resume')[0]).toBeInTheDocument();
  });

  it('handles errors when querying', async () => {
    // Register a custom fetch mock for the query endpoint
    const cleanup = global.registerFetchMock('/query', 'POST', () => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Failed to query' }),
      });
    });
    cleanupFunctions.push(cleanup);

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
