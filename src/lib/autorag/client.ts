/**
 * AutoRAG Client
 *
 * This module provides a client for interacting with the AutoRAG API.
 * It's used by the frontend components to communicate with the backend.
 */
import { ValidationError, NotFoundError, InternalServerError } from '@/application/errors/application-errors';
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';

/**
 * AutoRAG Client class for interacting with the AutoRAG API
 */
export class AutoRAGClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/autorag') {
    this.baseUrl = baseUrl;
  }

  /**
   * Query the AutoRAG system
   */
  async query(query: string, conversationId?: string): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Failed to query AutoRAG';

      if (response.status === 400) {
        throw new ValidationError(errorMessage);
      } else if (response.status === 404) {
        throw new NotFoundError(errorMessage);
      } else {
        throw new InternalServerError(errorMessage);
      }
    }

    return response.json();
  }

  /**
   * Upload a document to the AutoRAG system
   */
  async uploadDocument(file: File, title: string, source?: string): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    if (source) {
      formData.append('source', source);
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Failed to upload document';

      if (response.status === 400) {
        throw new ValidationError(errorMessage);
      } else {
        throw new InternalServerError(errorMessage);
      }
    }

    return response.json();
  }

  /**
   * List all documents in the AutoRAG system
   */
  async listDocuments(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Failed to list documents';

      throw new InternalServerError(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a document from the AutoRAG system
   */
  async deleteDocument(documentId: string): Promise<DeleteResult> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error || 'Failed to delete document';

      if (response.status === 404) {
        throw new NotFoundError(errorMessage);
      } else {
        throw new InternalServerError(errorMessage);
      }
    }

    return response.json();
  }
}

// Export a singleton instance for convenience
export const autoragClient = new AutoRAGClient();
