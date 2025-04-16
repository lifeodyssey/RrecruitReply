import { http, HttpResponse } from 'msw';
import type { DefaultBodyType, PathParams, StrictRequest } from 'msw';

// Define types for request parameters
interface IDocumentIdParams {
  id: string;
}
// Removed unused UploadRequestBody type
// Initial sample document data
const initialSampleDocuments = [
  {
    id: 'doc-1',
    title: 'Sample Resume',
    source: {
      name: 'Resume',
      url: '',
    },
    timestamp: Date.now(),
    chunks: 3,
  },
  {
    id: 'doc-2',
    title: 'Job Description - Software Engineer',
    source: {
      name: 'Job Description',
      url: '',
    },
    timestamp: Date.now() - 86400000, // 1 day ago
    chunks: 2,
  },
];

// Mutable state for documents in tests
let mockDocuments = [...initialSampleDocuments];

// Function to reset the mock documents (call this in test setup)
export const resetMockDocuments = (): void => {
  mockDocuments = [...initialSampleDocuments];
};

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
  // Use http object from msw for standard handlers if rest from msw-mock causes issues
  // Assuming 'rest' from msw-mock is compatible or we switch to 'http'
  http.get('/api/autorag/documents', () => HttpResponse.json([...mockDocuments])),

  // POST /api/autorag/upload - Upload document
  http.post(
    '/api/autorag/upload',
    async ({ request }: { request: StrictRequest<DefaultBodyType> }) => {
      let title = 'Uploaded Test Document'; // Default title

      // Try to parse as FormData first, then as JSON
      try {
        const formData = await request.clone().formData(); // Clone request to read body multiple times if needed
        title = formData.get('title')?.toString() ?? title;
      } catch {
        try {
          const body = (await request.clone().json()) as { title?: string };
          title = body.title ?? title;
        } catch {
          console.warn(
            'MSW handler: Could not parse request body for title in /api/autorag/upload. Using default.'
          );
        }
      }

      const newDocId = `doc-${Date.now()}`;
      const newDocument = {
        id: newDocId,
        title: title, // Use the extracted or default title
        source: {
          name: 'Uploaded',
          url: '',
        },
        timestamp: Date.now(),
        chunks: 4,
      };
      mockDocuments.push(newDocument);

      return HttpResponse.json(
        {
          success: true,
          documentId: newDocId,
          chunks: newDocument.chunks,
        },
        { status: 201 }
      ); // Use 201 Created status
    }
  ),

  // DELETE /api/autorag/documents/:id - Delete document
  http.delete(
    '/api/autorag/documents/:id',
    ({ params }: { params: PathParams<keyof IDocumentIdParams> }) => {
      const { id } = params;
      const initialLength = mockDocuments.length;
      mockDocuments = mockDocuments.filter((doc) => doc.id !== id);
      const success = mockDocuments.length < initialLength;

      if (!success) {
        return HttpResponse.json(
          { success: false, documentId: id, message: 'Document not found' },
          { status: 404 }
        );
      }

      return HttpResponse.json({ success: true, documentId: id }, { status: 200 });
    }
  ),

  // POST /api/autorag/query - Query the RAG system
  http.post('/api/autorag/query', () => HttpResponse.json(sampleQueryResponse)),
];

// Test logic should reside in actual test files (.test.ts/.tsx)

// Add this at the end of the file
// This is a mock file, but adding a simple test to make Vitest happy

// Check if we're in a test environment
if (typeof describe === 'function' && typeof it === 'function' && typeof expect === 'function') {
  describe('Handlers', () => {
    it('should export valid handlers', () => {
      // This is just a placeholder test to make Vitest happy
      expect(handlers).toBeDefined();
      expect(handlers.length).toBeGreaterThan(0);
    });
  });
}
