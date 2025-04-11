/**
 * AutoRAG Client
 * 
 * This module provides a client for interacting with the AutoRAG Worker API.
 */

// Types for API responses
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

export interface DocumentInfo {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  chunks: number;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  chunks: number;
}

export interface DeleteResponse {
  success: boolean;
  documentId: string;
}

export interface ErrorResponse {
  error: string;
}

// AutoRAG client class
export class AutoRAGClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Query the AutoRAG system
   */
  async query(query: string, conversationId?: string): Promise<QueryResponse> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to query AutoRAG');
    }

    return response.json() as Promise<QueryResponse>;
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
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {},
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to upload document');
    }

    return response.json() as Promise<UploadResponse>;
  }

  /**
   * List all documents in the AutoRAG system
   */
  async listDocuments(): Promise<DocumentInfo[]> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to list documents');
    }

    return response.json() as Promise<DocumentInfo[]>;
  }

  /**
   * Delete a document from the AutoRAG system
   */
  async deleteDocument(documentId: string): Promise<DeleteResponse> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to delete document');
    }

    return response.json() as Promise<DeleteResponse>;
  }
}

// Create a singleton instance with environment variables
export const autoragClient = new AutoRAGClient(
  process.env.NEXT_PUBLIC_AUTORAG_API_URL || 'https://autorag.recruitreply.example.com',
  process.env.AUTORAG_API_KEY
);

export default autoragClient;
