import { AutoRAGClient } from '@/lib/autorag/client';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Setup mock server before tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

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
      // Override the handler to return an error
      server.use(
        rest.post(`${baseUrl}/query`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Failed to query AutoRAG' })
          );
        })
      );

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
      // Override the handler to return an error
      server.use(
        rest.get(`${baseUrl}/documents`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Failed to list documents' })
          );
        })
      );

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
      // Override the handler to return an error
      server.use(
        rest.delete(`${baseUrl}/documents/doc-1`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Failed to delete document' })
          );
        })
      );

      const documentId = 'doc-1';

      await expect(client.deleteDocument(documentId)).rejects.toThrow('Failed to delete document');
    });
  });

  // Note: uploadDocument is harder to test because it uses FormData
  // In a real implementation, we would mock the fetch and FormData
});
