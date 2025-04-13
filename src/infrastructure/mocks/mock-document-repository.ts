/**
 * Mock implementation of DocumentRepository for testing
 */
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';
import { DocumentRepository } from '@/domain/repositories/document-repository';

// Helper function for deep cloning objects in environments without structuredClone
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Default mock data in a separate constant for better maintainability
export const DEFAULT_DOCUMENTS: Document[] = [
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
];

export const DEFAULT_QUERY_RESULT: QueryResult = {
  answer: 'The company offers health insurance, 401k matching, and paid time off.',
  sources: [
    {
      id: 'doc-1',
      title: 'Benefits Overview',
      source: 'HR Department',
      content: 'Our company provides comprehensive health insurance...',
      similarity: 0.92
    }
  ]
};

/**
 * Implementation of DocumentRepository for testing purposes
 * Follows the repository pattern and provides methods for CRUD operations
 */
export class MockDocumentRepository implements DocumentRepository {
  // Mock data state
  private mockDocuments: Document[];
  private mockQueryResult: QueryResult;

  /**
   * Create a new MockDocumentRepository with optional custom mock data
   * @param documents - Optional initial document collection
   * @param queryResult - Optional query result to return
   */
  constructor(
    documents: Document[] = DEFAULT_DOCUMENTS,
    queryResult: QueryResult = DEFAULT_QUERY_RESULT
  ) {
    this.mockDocuments = deepClone(documents); // Use deepClone for compatibility
    this.mockQueryResult = deepClone(queryResult);
  }

  /**
   * Query the repository with a natural language query
   * @param _query - The query string (unused in mock implementation)
   * @returns Promise<QueryResult> - The mocked query result
   */
  async query(_query: string): Promise<QueryResult> {
    return deepClone(this.mockQueryResult);
  }

  /**
   * List all documents in the repository
   * @returns Promise<Document[]> - A copy of all documents
   */
  async listDocuments(): Promise<Document[]> {
    return deepClone(this.mockDocuments);
  }

  /**
   * Upload a document to the repository
   * @param file - The file to upload
   * @param title - The document title
   * @param source - Optional document source
   * @returns Promise<UploadResult> - The upload result
   */
  async uploadDocument(file: File, title: string, source?: string): Promise<UploadResult> {
    if (!file) {
      throw new Error('File is required');
    }
    
    if (!title) {
      throw new Error('Title is required');
    }
    
    const newDoc = {
      id: `doc-${this.mockDocuments.length + 1}`,
      title,
      source: source || 'Unknown',
      timestamp: Date.now(),
      chunks: 4
    };

    this.mockDocuments.push(newDoc);

    return {
      success: true,
      documentId: newDoc.id,
      chunks: newDoc.chunks
    };
  }

  /**
   * Delete a document from the repository
   * @param documentId - The ID of the document to delete
   * @returns Promise<DeleteResult> - The delete result
   * @throws Error if document not found
   */
  async deleteDocument(documentId: string): Promise<DeleteResult> {
    if (!documentId) {
      throw new Error('Document ID is required');
    }
    
    const index = this.mockDocuments.findIndex(doc => doc.id === documentId);

    if (index === -1) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    this.mockDocuments.splice(index, 1);

    return {
      success: true,
      documentId
    };
  }

  // Test control methods

  /**
   * Set mock documents for testing
   * @param documents - The documents to set
   */
  setMockDocuments(documents: Document[]): void {
    this.mockDocuments = deepClone(documents);
  }

  /**
   * Set mock query result for testing
   * @param result - The query result to set
   */
  setMockQueryResult(result: QueryResult): void {
    this.mockQueryResult = deepClone(result);
  }
}
