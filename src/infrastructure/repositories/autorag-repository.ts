/**
 * AutoRAG Repository Implementation
 * 
 * This module provides a concrete implementation of the DocumentRepository interface
 * for interacting with the AutoRAG Worker API.
 */
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';
import { DocumentRepository } from '@/domain/repositories/document-repository';

export interface ErrorResponse {
  error: string;
}

export class AutoRAGRepository implements DocumentRepository {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Get headers for API requests (JSON content type)
   */
  private getJsonHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Get authorization header only (for FormData requests)
   */
  private getAuthHeader(): HeadersInit {
    if (!this.apiKey) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  /**
   * Query the AutoRAG system
   */
  async query(query: string, conversationId?: string): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: this.getJsonHeaders(),
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to query AutoRAG');
    }

    return response.json() as Promise<QueryResult>;
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
      headers: this.getAuthHeader(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to upload document');
    }

    return response.json() as Promise<UploadResult>;
  }

  /**
   * List all documents in the AutoRAG system
   */
  async listDocuments(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'GET',
      headers: this.getJsonHeaders(),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to list documents');
    }

    return response.json() as Promise<Document[]>;
  }

  /**
   * Delete a document from the AutoRAG system
   */
  async deleteDocument(documentId: string): Promise<DeleteResult> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
      headers: this.getJsonHeaders(),
    });

    if (!response.ok) {
      const error = await response.json() as ErrorResponse;
      throw new Error(error.error || 'Failed to delete document');
    }

    return response.json() as Promise<DeleteResult>;
  }
}
