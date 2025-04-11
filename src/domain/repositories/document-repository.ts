/**
 * Repository interface for document operations
 */
import { Document, QueryResult, UploadResult, DeleteResult } from '../models/document';

export interface DocumentRepository {
  /**
   * Query the document repository with a natural language query
   */
  query(query: string, conversationId?: string): Promise<QueryResult>;
  
  /**
   * List all documents in the repository
   */
  listDocuments(): Promise<Document[]>;
  
  /**
   * Upload a document to the repository
   */
  uploadDocument(file: File, title: string, source?: string): Promise<UploadResult>;
  
  /**
   * Delete a document from the repository
   */
  deleteDocument(documentId: string): Promise<DeleteResult>;
}
