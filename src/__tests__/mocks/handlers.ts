import { rest } from 'msw';

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
