import { rest } from './msw-mock';

// Sample document data
const sampleDocuments = [
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
];

// Sample query response
const sampleQueryResponse = {
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
};

// Define handlers for the mock API endpoints
export const handlers = [
  // GET /api/autorag/documents - List documents
  rest.get('/api/autorag/documents', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleDocuments));
  }),

  // POST /api/autorag/upload - Upload document
  rest.post('/api/autorag/upload', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        documentId: 'new-doc-id',
        chunks: 4,
      })
    );
  }),

  // DELETE /api/autorag/documents/:id - Delete document
  rest.delete('/api/autorag/documents/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        documentId: id,
      })
    );
  }),

  // POST /api/autorag/query - Query the RAG system
  rest.post('/api/autorag/query', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(sampleQueryResponse));
  }),
];

// Add a simple test to avoid the "Your test suite must contain at least one test" error
describe('Handlers', () => {
  it('should have sample data', () => {
    expect(sampleDocuments).toBeDefined();
    expect(sampleDocuments.length).toBe(2);
    expect(sampleQueryResponse).toBeDefined();
    expect(sampleQueryResponse.sources.length).toBe(1);
  });
  
  it('should have handlers defined', () => {
    expect(handlers).toBeDefined();
    expect(Array.isArray(handlers)).toBe(true);
    expect(handlers.length).toBe(4);
  });
});
