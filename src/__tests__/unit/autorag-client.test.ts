import { AutoRAGClient } from '@/lib/autorag/client';

// Store cleanup functions for fetch mocks
const cleanupFunctions: Array<() => void> = [];

// Clean up all fetch mocks after each test
afterEach(() => {
  cleanupFunctions.forEach(cleanup => cleanup());
  cleanupFunctions.length = 0;
});

describe('AutoRAGClient', () => {
  const baseUrl = 'http://localhost:3000/api/autorag';
  const apiKey = 'test-api-key';
  let client: AutoRAGClient;

  beforeEach(() => {
    client = new AutoRAGClient(baseUrl, apiKey);
  });

  describe('query', () => {
    it('should send a query and return the response', async () => {
      const query = 'What are the benefits?';
      const conversationId = 'conv-123';

      const response = await client.query(query, conversationId);

      expect(response).toHaveProperty('answer');
      expect(response).toHaveProperty('sources');
      expect(Array.isArray(response.sources)).toBe(true);
    });

    it('should handle errors when querying', async () => {
      // Register a custom fetch mock for the query endpoint
      const cleanup = global.registerFetchMock('/query', 'POST', () => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Failed to query AutoRAG' }),
        });
      });
      cleanupFunctions.push(cleanup);

      const query = 'What are the benefits?';

      await expect(client.query(query)).rejects.toThrow('Failed to query AutoRAG');
    });
  });

  describe('listDocuments', () => {
    it('should list documents', async () => {
      const documents = await client.listDocuments();

      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0]).toHaveProperty('id');
      expect(documents[0]).toHaveProperty('title');
    });

    it('should handle errors when listing documents', async () => {
      // Register a custom fetch mock for the documents endpoint
      const cleanup = global.registerFetchMock('/documents', 'GET', () => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Failed to list documents' }),
        });
      });
      cleanupFunctions.push(cleanup);

      await expect(client.listDocuments()).rejects.toThrow('Failed to list documents');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const documentId = 'doc-1';

      const response = await client.deleteDocument(documentId);

      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('documentId', documentId);
    });

    it('should handle errors when deleting a document', async () => {
      const documentId = 'doc-1';

      // Register a custom fetch mock for the delete document endpoint
      const cleanup = global.registerFetchMock(`/documents/${documentId}`, 'DELETE', () => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Failed to delete document' }),
        });
      });
      cleanupFunctions.push(cleanup);

      await expect(client.deleteDocument(documentId)).rejects.toThrow('Failed to delete document');
    });
  });

  // Note: uploadDocument is harder to test because it uses FormData
  // In a real implementation, we would mock the fetch and FormData
});
