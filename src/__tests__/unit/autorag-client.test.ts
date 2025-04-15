import { AutoRAGRepository } from '@/infrastructure/repositories/autorag-repository';

// Store cleanup functions for fetch mocks
const cleanupFunctions: Array<() => void> = [];

// Clean up all fetch mocks after each test
afterEach(() => {
  cleanupFunctions.forEach((cleanup) => cleanup());
  cleanupFunctions.length = 0;
});

describe('AutoRAGRepository', () => {
  const baseUrl = 'http://localhost:3000/api/autorag';
  const apiKey = 'test-api-key';
  let repository: AutoRAGRepository;

  beforeEach(() => {
    repository = new AutoRAGRepository(baseUrl, apiKey);
  });

  describe('query', () => {
    it('should send a query and return the response', async () => {
      const query = 'What are the benefits?';
      const conversationId = 'conv-123';

      // Register a custom fetch mock for the query endpoint with a successful response
      const cleanup = global.registerFetchMock('/query', 'POST', () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              answer: 'This is a sample answer to your query.',
              sources: [
                {
                  id: '1',
                  title: 'Sample Resume',
                  source: 'Resume',
                  content: 'This is a sample resume content.',
                  similarity: 0.85,
                  url: '/documents/sample-resume.pdf',
                },
              ],
            }),
            { status: 200 }
          )
        )
      );
      cleanupFunctions.push(cleanup);

      const response = await repository.query(query, conversationId);

      expect(response).toHaveProperty('answer');
      expect(response).toHaveProperty('sources');
      expect(Array.isArray(response.sources)).toBe(true);
    });

    it('should handle errors when querying', async () => {
      // Register a custom fetch mock for the query endpoint
      const cleanup = global.registerFetchMock('/query', 'POST', () =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Failed to query AutoRAG' }), {
            status: 500,
          })
        )
      );
      cleanupFunctions.push(cleanup);

      const query = 'What are the benefits?';

      await expect(repository.query(query)).rejects.toThrow('Failed to query AutoRAG');
    });
  });

  describe('listDocuments', () => {
    it('should list documents', async () => {
      // Register a custom fetch mock for the documents endpoint with a successful response
      const cleanup = global.registerFetchMock('/documents', 'GET', () =>
        Promise.resolve(
          new Response(
            JSON.stringify([
              {
                id: '1',
                title: 'Sample Resume',
                filename: 'resume.pdf',
                timestamp: Date.now(),
                source: {
                  name: 'Resume',
                  url: '',
                },
              },
              {
                id: '2',
                title: 'Job Description',
                filename: 'job.pdf',
                timestamp: Date.now(),
                source: {
                  name: 'Job',
                  url: '',
                },
              },
            ]),
            { status: 200 }
          )
        )
      );
      cleanupFunctions.push(cleanup);

      const documents = await repository.listDocuments();

      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0]).toHaveProperty('id');
      expect(documents[0]).toHaveProperty('title');
    });

    it('should handle errors when listing documents', async () => {
      // Register a custom fetch mock for the documents endpoint
      const cleanup = global.registerFetchMock('/documents', 'GET', () =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Failed to list documents' }), {
            status: 500,
          })
        )
      );
      cleanupFunctions.push(cleanup);

      await expect(repository.listDocuments()).rejects.toThrow('Failed to list documents');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const documentId = 'doc-1';

      // Register a custom fetch mock for the delete document endpoint with a successful response
      const cleanup = global.registerFetchMock(`/documents/${documentId}`, 'DELETE', () =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              success: true,
              documentId,
            }),
            { status: 200 }
          )
        )
      );
      cleanupFunctions.push(cleanup);

      const response = await repository.deleteDocument(documentId);

      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('documentId', documentId);
    });

    it('should handle errors when deleting a document', async () => {
      const documentId = 'doc-1';

      // Register a custom fetch mock for the delete document endpoint
      const cleanup = global.registerFetchMock(`/documents/${documentId}`, 'DELETE', () =>
        Promise.resolve(
          new Response(JSON.stringify({ error: 'Failed to delete document' }), {
            status: 500,
          })
        )
      );
      cleanupFunctions.push(cleanup);

      await expect(repository.deleteDocument(documentId)).rejects.toThrow(
        'Failed to delete document'
      );
    });
  });

  // Note: uploadDocument is harder to test because it uses FormData
  // In a real implementation, we would mock the fetch and FormData
});
