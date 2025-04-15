/**
 * Repository interface for document operations
 */
import type { IDeleteResult, IDocument, IQueryResult, IUploadResult } from '../models/document';

export interface IDocumentRepository {
  /**
   * Query the document repository with a natural language query
   */
  query(query: string, conversationId?: string): Promise<IQueryResult>;

  /**
   * List all documents in the repository
   */
  listDocuments(): Promise<IDocument[]>;

  /**
   * Upload a document to the repository
   */
  uploadDocument(file: File, title: string, source?: string): Promise<IUploadResult>;

  /**
   * Delete a document from the repository
   */
  deleteDocument(documentId: string): Promise<IDeleteResult>;

  /**
   * Get a document by ID
   */
  getDocumentById(id: string): Promise<IDocument>;

  /**
   * Create a new document
   */
  createDocument(document: Partial<IDocument>): Promise<IDocument>;

  /**
   * Update an existing document
   */
  updateDocument(id: string, document: Partial<IDocument>): Promise<IDocument>;
}
