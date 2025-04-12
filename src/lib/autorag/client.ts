/**
 * AutoRAG Client
 * 
 * This module provides a client for interacting with the AutoRAG API.
 * It's used by the frontend components to communicate with the backend.
 */

/**
 * Interface for document information returned by the API
 */
export interface DocumentInfo {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  chunks: number;
}

/**
 * Interface for query response returned by the API
 */
export interface QueryResponse {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    source: string;
    content: string;
    similarity: number;
  }>;
}

/**
 * Interface for upload response returned by the API
 */
export interface UploadResponse {
  success: boolean;
  documentId: string;
  chunks: number;
}

/**
 * Interface for delete response returned by the API
 */
export interface DeleteResponse {
  success: boolean;
  documentId: string;
}

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
  async query(query: string, conversationId?: string): Promise<QueryResponse> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to query AutoRAG');
    }

    return response.json();
  }

  /**
   * Upload a document to the AutoRAG system
   */
  async uploadDocument(file: File, title: string, source?: string): Promise<UploadResponse> {
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
      throw new Error(error.error || 'Failed to upload document');
    }

    return response.json();
  }

  /**
   * List all documents in the AutoRAG system
   */
  async listDocuments(): Promise<DocumentInfo[]> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to list documents');
    }

    return response.json();
  }

  /**
   * Delete a document from the AutoRAG system
   */
  async deleteDocument(documentId: string): Promise<DeleteResponse> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete document');
    }

    return response.json();
  }
}
