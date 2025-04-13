import { NextRequest } from 'next/server';
import { POST as queryHandler } from '@/app/api/autorag/query/route';
import { GET as listDocumentsHandler } from '@/app/api/autorag/documents/route';
import { DELETE as deleteDocumentHandler } from '@/app/api/autorag/documents/[id]/route';
import { getDocumentService } from '@/infrastructure/factories/document-service-factory';

// Mock the document service factory first, before using any mocks
jest.mock('@/infrastructure/factories/document-service-factory', () => ({
  getDocumentService: jest.fn()
}));

// Create a mock document service
const mockDocumentService = {
  // Mock implementations
  query: jest.fn().mockImplementation(queryDto => {
    // Validate the query and throw an error if it's missing
    if (!queryDto.query) {
      throw new Error('Query is required and must be a string');
    }

    return Promise.resolve({
      answer: 'This is a sample answer to your query.',
      sources: [
        {
          id: 'doc-1',
          title: 'Sample Resume',
          source: 'HR Department',
          content: 'This is a sample document content.',
          similarity: 0.92
        }
      ]
    });
  }),

  listDocuments: jest.fn().mockResolvedValue([
    {
      id: 'doc-1',
      title: 'Benefits Overview',
      source: 'HR Department',
      timestamp: Date.now(),
      chunks: 5
    },
    {
      id: 'doc-2',
      title: 'Recruitment Process',
      source: 'HR Department',
      timestamp: Date.now(),
      chunks: 3
    }
  ]),

  deleteDocument: jest.fn().mockImplementation(documentId => {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    
    return Promise.resolve({
      success: true,
      documentId
    });
  })
};

// Setup the mock implementation
(getDocumentService as jest.Mock).mockReturnValue(mockDocumentService);

describe('API Routes', () => {
  describe('/api/autorag/query', () => {
    it('handles valid query requests', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'What are the benefits?' }),
      });

      // Call the handler
      const response = await queryHandler(request);

      // Check the response
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('answer');
      expect(data).toHaveProperty('sources');
    });

    it('handles invalid query requests', async () => {
      // Create a mock request with missing query
      const request = new NextRequest('http://localhost:3000/api/autorag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      // Call the handler
      const response = await queryHandler(request);

      // Check the response
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('handles errors from the document service', async () => {
      // Mock the documentService.query to throw an error
      mockDocumentService.query.mockRejectedValueOnce(new Error('Failed to query AutoRAG'));

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'What are the benefits?' }),
      });

      // Call the handler
      const response = await queryHandler(request);

      // Check the response
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Failed to query AutoRAG');
    });
  });

  describe('/api/autorag/documents', () => {
    it('handles successful document listing', async () => {
      // Call the handler
      const response = await listDocumentsHandler();

      // Check the response
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data[0]).toHaveProperty('id', 'doc-1');
      expect(data[1]).toHaveProperty('id', 'doc-2');
    });

    it('handles errors from the document service', async () => {
      // Mock the documentService.listDocuments to throw an error
      mockDocumentService.listDocuments.mockRejectedValueOnce(new Error('Failed to list documents'));

      // Call the handler
      const response = await listDocumentsHandler();

      // Check the response
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Failed to list documents');
    });
  });

  describe('/api/autorag/documents/[id]', () => {
    it('handles successful document deletion', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents/doc-1', {
        method: 'DELETE',
      });

      // Create a mock params object that resolves to { id: 'doc-1' }
      const params = Promise.resolve({ id: 'doc-1' });

      // Call the handler with params
      const response = await deleteDocumentHandler(request, { params });

      // Check the response
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('documentId', 'doc-1');
    });

    it('handles missing document ID', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents/', {
        method: 'DELETE',
      });

      // Create a mock params object that resolves to { id: '' }
      const params = Promise.resolve({ id: '' });

      // Call the handler with params
      const response = await deleteDocumentHandler(request, { params });

      // Check the response
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('handles errors from the document service', async () => {
      // Mock the documentService.deleteDocument to throw an error
      mockDocumentService.deleteDocument.mockRejectedValueOnce(new Error('Failed to delete document'));

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents/doc-1', {
        method: 'DELETE',
      });

      // Create a mock params object that resolves to { id: 'doc-1' }
      const params = Promise.resolve({ id: 'doc-1' });

      // Call the handler with params
      const response = await deleteDocumentHandler(request, { params });

      // Check the response
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Failed to delete document');
    });
  });
});
