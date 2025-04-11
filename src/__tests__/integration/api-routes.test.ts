import { NextRequest } from 'next/server';
import { POST as queryHandler } from '@/app/api/autorag/query/route';
import { GET as listDocumentsHandler } from '@/app/api/autorag/documents/route';
import { DELETE as deleteDocumentHandler } from '@/app/api/autorag/documents/[id]/route';
import { documentService } from '@/infrastructure/factories/document-service-factory';

// Mock the document service
jest.mock('@/infrastructure/factories/document-service-factory', () => ({
  documentService: {
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
            source: 'Resume',
            content: 'Sample content from the document that matches the query.',
            similarity: 0.95,
          },
        ],
      });
    }),
    listDocuments: jest.fn().mockResolvedValue([
      {
        id: 'doc-1',
        title: 'Sample Resume',
        source: 'Resume',
        timestamp: Date.now(),
        chunks: 3,
      },
      {
        id: 'doc-2',
        title: 'Job Description - Software Engineer',
        source: 'Job Description',
        timestamp: Date.now() - 86400000, // 1 day ago
        chunks: 2,
      },
    ]),
    deleteDocument: jest.fn().mockImplementation(documentId => {
      // Validate the document ID and throw an error if it's missing
      if (!documentId) {
        throw new Error('Document ID is required');
      }

      return Promise.resolve({
        success: true,
        documentId,
      });
    }),
  },
}));

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
      documentService.query.mockRejectedValueOnce(new Error('Failed to query AutoRAG'));

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
    it('handles document listing requests', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents', {
        method: 'GET',
      });

      // Call the handler
      const response = await listDocumentsHandler(request);

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
      documentService.listDocuments.mockRejectedValueOnce(new Error('Failed to list documents'));

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents', {
        method: 'GET',
      });

      // Call the handler
      const response = await listDocumentsHandler(request);

      // Check the response
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Failed to list documents');
    });
  });

  describe('/api/autorag/documents/[id]', () => {
    it('handles document deletion requests', async () => {
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents/doc-1', {
        method: 'DELETE',
      });

      // Call the handler with params
      const response = await deleteDocumentHandler(request, { params: { id: 'doc-1' } });

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

      // Call the handler with empty params
      const response = await deleteDocumentHandler(request, { params: { id: '' } });

      // Check the response
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Document ID is required');
    });

    it('handles errors from the document service', async () => {
      // Mock the documentService.deleteDocument to throw an error
      documentService.deleteDocument.mockRejectedValueOnce(new Error('Failed to delete document'));

      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/autorag/documents/doc-1', {
        method: 'DELETE',
      });

      // Call the handler with params
      const response = await deleteDocumentHandler(request, { params: { id: 'doc-1' } });

      // Check the response
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toHaveProperty('error', 'Failed to delete document');
    });
  });
});
