/**
 * Mock implementation of DocumentRepository for testing
 */
import { DocumentRepository } from '@/domain/repositories/document-repository';
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';

// Default mock data
const DEFAULT_DOCUMENTS: Document[] = [
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

const DEFAULT_QUERY_RESULT: QueryResult = {
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

export class MockDocumentRepository implements DocumentRepository {
  // Mock data
  private mockDocuments: Document[];
  private mockQueryResult: QueryResult;

  /**
   * Create a new MockDocumentRepository with optional custom mock data
   */
  constructor(
    documents: Document[] = DEFAULT_DOCUMENTS,
    queryResult: QueryResult = DEFAULT_QUERY_RESULT
  ) {
    this.mockDocuments = [...documents]; // Clone to avoid reference issues
    this.mockQueryResult = {...queryResult}; // Clone to avoid reference issues
  }

  // Mock implementations
  async query(_query: string): Promise<QueryResult> {
    return this.mockQueryResult;
  }

  async listDocuments(): Promise<Document[]> {
    return this.mockDocuments;
  }

  async uploadDocument(file: File, title: string, source?: string): Promise<UploadResult> {
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

  async deleteDocument(documentId: string): Promise<DeleteResult> {
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

  // Methods for test control
  setMockDocuments(documents: Document[]): void {
    this.mockDocuments = [...documents]; // Clone to avoid reference issues
  }

  setMockQueryResult(result: QueryResult): void {
    this.mockQueryResult = {...result}; // Clone to avoid reference issues
  }
}
