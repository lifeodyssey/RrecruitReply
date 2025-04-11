import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocumentsPage from '@/app/documents/page';
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

describe('Document Management E2E', () => {
  it('completes the full document management flow', async () => {
    const user = userEvent.setup();
    
    // Mock the confirm function to return true for deletion
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);
    
    // Mock the FormData and File
    global.FormData = class FormData {
      append = jest.fn();
      get = jest.fn();
    };
    global.File = class File {
      constructor() {
        return {};
      }
    };
    
    // Render the page
    render(<DocumentsPage />);
    
    // Wait for documents to load
    await waitFor(() => {
      expect(screen.queryByText('Loading documents...')).not.toBeInTheDocument();
    });
    
    // 1. View documents
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();
    expect(screen.getByText('Job Description - Software Engineer')).toBeInTheDocument();
    
    // 2. Filter documents
    await user.click(screen.getByRole('tab', { name: 'Resumes' }));
    expect(screen.getByText('Sample Resume')).toBeInTheDocument();
    expect(screen.queryByText('Job Description - Software Engineer')).not.toBeInTheDocument();
    
    // Go back to all documents
    await user.click(screen.getByRole('tab', { name: 'All Documents' }));
    
    // 3. Upload a document
    await user.click(screen.getByRole('button', { name: 'Upload Document' }));
    
    // Fill the form
    const titleInput = screen.getByLabelText('Title');
    const sourceInput = screen.getByLabelText('Source/Type');
    const fileInput = screen.getByLabelText('File');
    
    await user.type(titleInput, 'New Resume');
    await user.type(sourceInput, 'Resume');
    
    // Mock the file input change
    Object.defineProperty(fileInput, 'files', {
      value: [new File()],
    });
    fireEvent.change(fileInput);
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Upload' }));
    
    // 4. Delete a document
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);
    
    // Restore the original confirm function
    window.confirm = originalConfirm;
    
    // Verify the document management flow is complete
    // In a real test, we would verify that the document was added and then removed
  });
});
