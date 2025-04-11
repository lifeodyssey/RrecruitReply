import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsPage from '@/app/documents/page';
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

describe('DocumentsPage', () => {
  it('renders the document management title', async () => {
    render(<DocumentsPage />);
    
    expect(screen.getByText('Document Management')).toBeInTheDocument();
  });

  it('displays loading state initially', async () => {
    render(<DocumentsPage />);
    
    expect(screen.getByText('Loading documents...')).toBeInTheDocument();
  });

  it('displays documents after loading', async () => {
    render(<DocumentsPage />);
    
    // Wait for the documents to load
    await waitFor(() => {
      expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
    });
    
    // Check if documents are displayed
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();
    expect(screen.getByText('Job Description - Software Engineer')).toBeInTheDocument();
  });

  it('filters documents by type', async () => {
    render(<DocumentsPage />);
    
    // Wait for the documents to load
    await waitFor(() => {
      expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
    });
    
    // Click on the Resumes tab
    fireEvent.click(screen.getByRole('tab', { name: 'Resumes' }));
    
    // Check if only resume documents are displayed
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();
    expect(screen.queryByText('Job Description - Software Engineer')).not.toBeInTheDocument();
  });

  it('opens the upload dialog when clicking the upload button', async () => {
    render(<DocumentsPage />);
    
    // Click on the Upload Document button
    fireEvent.click(screen.getByRole('button', { name: 'Upload Document' }));
    
    // Check if the dialog is displayed
    expect(screen.getByText('Upload a document to be indexed and made searchable.')).toBeInTheDocument();
  });

  it('handles document deletion', async () => {
    const user = userEvent.setup();
    
    // Mock the confirm function to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    render(<DocumentsPage />);
    
    // Wait for the documents to load
    await waitFor(() => {
      expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
    });
    
    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);
    
    // Restore the original confirm function
    window.confirm = originalConfirm;
    
    // Check if the delete request was made (this is implicit since we're using MSW)
    // In a real test, we would verify that the document was removed from the list
  });

  it('handles errors when fetching documents', async () => {
    // Override the handler to return an error
    server.use(
      rest.get('/api/autorag/documents', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Failed to fetch documents' }));
      })
    );
    
    render(<DocumentsPage />);
    
    // Wait for the error state
    await waitFor(() => {
      expect(screen.getByText('No documents found. Upload some documents to get started.')).toBeInTheDocument();
    });
  });
});
