/**
 * Mock implementation of DocumentRepository for testing
 */
import type {
  IDeleteResult,
  IDocument,
  IQueryResult,
  IUploadResult,
} from '@/domain/models/document';
import type { IDocumentRepository } from '@/domain/repositories/document-repository';

// Helper function for deep cloning objects in environments without structuredClone
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Default mock data in a separate constant for better maintainability
export const DEFAULT_DOCUMENTS: IDocument[] = [
  {
    id: 'doc-1',
    title: 'Benefits Overview',
    filename: 'benefits-overview.pdf',
    source: {
      name: 'HR Department',
      url: 'https://example.com/hr',
    },
    timestamp: Date.now(),
  },
  {
    id: 'doc-2',
    title: 'Recruitment Process',
    filename: 'recruitment-process.pdf',
    source: {
      name: 'HR Department',
      url: 'https://example.com/hr',
    },
    timestamp: Date.now(),
  },
];

export const DEFAULT_QUERY_RESULT: IQueryResult = {
  answer: 'The company offers health insurance, 401k matching, and paid time off.',
  sources: [
    {
      id: 'doc-1',
      title: 'Benefits Overview',
      source: 'HR Department',
      content: 'Our company provides comprehensive health insurance...',
      similarity: 0.92,
    },
  ],
};

/**
 * Implementation of DocumentRepository for testing purposes
 * Follows the repository pattern and provides methods for CRUD operations
 */
export class MockDocumentRepository implements IDocumentRepository {
  // Mock data state
  private mockDocuments: IDocument[];
  private mockQueryResult: IQueryResult;

  /**
   * Create a new MockDocumentRepository with optional custom mock data
   * @param documents - Optional initial document collection
   * @param queryResult - Optional query result to return
   */
  constructor(
    documents: IDocument[] = DEFAULT_DOCUMENTS,
    queryResult: IQueryResult = DEFAULT_QUERY_RESULT
  ) {
    this.mockDocuments = deepClone(documents); // Use deepClone for compatibility
    this.mockQueryResult = deepClone(queryResult);
  }

  /**
   * Query the repository with a natural language query
   * @param _query - The query string (unused in mock implementation)
   * @returns Promise<IQueryResult> - The mocked query result
   */
  query(_query: string): Promise<IQueryResult> {
    return Promise.resolve(deepClone(this.mockQueryResult));
  }

  /**
   * List all documents in the repository
   * @returns Promise<IDocument[]> - A copy of all documents
   */
  listDocuments(): Promise<IDocument[]> {
    return Promise.resolve(deepClone(this.mockDocuments));
  }

  /**
   * Upload a document to the repository
   * @param file - The file to upload
   * @param title - The document title
   * @param source - Optional document source
   * @returns Promise<IUploadResult> - The upload result
   */
  uploadDocument(file: File, title: string, source?: string): Promise<IUploadResult> {
    if (!file) {
      throw new Error('File is required');
    }

    if (!title) {
      throw new Error('Title is required');
    }

    const newDoc: IDocument = {
      id: `doc-${this.mockDocuments.length + 1}`,
      title,
      filename: file.name,
      source: source
        ? {
            name: source,
            url: `https://example.com/${source.toLowerCase().replace(/\s+/g, '-')}`,
          }
        : undefined,
      timestamp: Date.now(),
    };

    this.mockDocuments.push(newDoc);

    return Promise.resolve({
      success: true,
      documentId: newDoc.id,
      chunks: 4,
    });
  }

  /**
   * Delete a document from the repository
   * @param documentId - The ID of the document to delete
   * @returns Promise<IDeleteResult> - The delete result
   * @throws Error if document not found
   */
  deleteDocument(documentId: string): Promise<IDeleteResult> {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const index = this.mockDocuments.findIndex((doc) => doc.id === documentId);

    if (index === -1) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    this.mockDocuments.splice(index, 1);

    return Promise.resolve({
      success: true,
      documentId,
    });
  }

  // Test control methods

  /**
   * Set mock documents for testing
   * @param documents - The documents to set
   */
  setMockDocuments(documents: IDocument[]): void {
    this.mockDocuments = deepClone(documents);
  }

  /**
   * Set mock query result for testing
   * @param result - The query result to set
   */
  setMockQueryResult(result: IQueryResult): void {
    this.mockQueryResult = deepClone(result);
  }

  /**
   * Get a document by ID
   * @param id - The document ID
   * @returns Promise<IDocument> - The document
   * @throws Error if document not found
   */
  getDocumentById(id: string): Promise<IDocument> {
    const document = this.mockDocuments.find((doc) => doc.id === id);
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    return Promise.resolve(deepClone(document));
  }

  /**
   * Create a new document
   * @param document - The document to create
   * @returns Promise<IDocument> - The created document
   */
  createDocument(document: Partial<IDocument>): Promise<IDocument> {
    const newDocument: IDocument = {
      id: document.id ?? `doc-${Date.now()}`,
      title: document.title ?? 'Untitled Document',
      filename: document.filename ?? 'untitled.txt',
      timestamp: document.timestamp ?? Date.now(),
      source: document.source,
    };

    this.mockDocuments.push(newDocument);
    return Promise.resolve(deepClone(newDocument));
  }

  /**
   * Update an existing document
   * @param id - The document ID
   * @param document - The document updates
   * @returns Promise<IDocument> - The updated document
   * @throws Error if document not found
   */
  updateDocument(id: string, document: Partial<IDocument>): Promise<IDocument> {
    const index = this.mockDocuments.findIndex((doc) => doc.id === id);
    if (index === -1) {
      throw new Error(`Document with ID ${id} not found`);
    }

    const updatedDocument = {
      ...this.mockDocuments[index],
      ...document,
      id, // Ensure ID doesn't change
    };

    this.mockDocuments[index] = updatedDocument;
    return Promise.resolve(deepClone(updatedDocument));
  }
}
