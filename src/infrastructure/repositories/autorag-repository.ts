/**
 * AutoRAG Repository Implementation
 * 
 * This module provides a concrete implementation of the DocumentRepository interface
 * for interacting with the AutoRAG Worker API.
 */
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';
import { DocumentRepository } from '@/domain/repositories/document-repository';

/**
 * Error response from the AutoRAG API
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Repository implementation for Cloudflare AutoRAG
 */
export class AutoRAGRepository implements DocumentRepository {
  private readonly baseUrl: string;
  private readonly apiKey?: string;

  /**
   * Creates a new instance of AutoRAGRepository
   * 
   * @param baseUrl - The base URL of the AutoRAG API
   * @param apiKey - Optional API key for authentication
   */
  public constructor(baseUrl: string, apiKey?: string) {
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
   * Handles API response errors
   * 
   * @param response - The fetch Response object
   * @param defaultErrorMessage - Default error message if none is provided by the API
   * @throws Error with the appropriate error message
   */
  private async handleApiError(response: Response, defaultErrorMessage: string): Promise<never> {
    try {
      const errorData = await response.json() as ErrorResponse;
      throw new Error(errorData.error || defaultErrorMessage);
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new Error(`${defaultErrorMessage} (Status: ${response.status})`);
      }
      throw e;
    }
  }

  /**
   * Query the AutoRAG system
   * 
   * @param query - The natural language query string
   * @param conversationId - Optional conversation ID for context
   * @returns Promise resolving to the query result
   */
  public async query(query: string, conversationId?: string): Promise<QueryResult> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: 'POST',
      headers: this.getJsonHeaders(),
      body: JSON.stringify({ query, conversationId }),
    });

    if (!response.ok) {
      await this.handleApiError(response, 'Failed to query AutoRAG');
    }

    return response.json() as Promise<QueryResult>;
  }

  /**
   * Upload a document to the AutoRAG system
   * 
   * @param file - The file to upload
   * @param title - The document title
   * @param source - Optional source information
   * @returns Promise resolving to the upload result
   */
  public async uploadDocument(file: File, title: string, source?: string): Promise<UploadResult> {
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
      await this.handleApiError(response, 'Failed to upload document');
    }

    return response.json() as Promise<UploadResult>;
  }

  /**
   * List all documents in the AutoRAG system
   * 
   * @returns Promise resolving to an array of documents
   */
  public async listDocuments(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'GET',
      headers: this.getJsonHeaders(),
    });

    if (!response.ok) {
      await this.handleApiError(response, 'Failed to list documents');
    }

    return response.json() as Promise<Document[]>;
  }

  /**
   * Delete a document from the AutoRAG system
   * 
   * @param documentId - The ID of the document to delete
   * @returns Promise resolving to the delete result
   */
  public async deleteDocument(documentId: string): Promise<DeleteResult> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
      headers: this.getJsonHeaders(),
    });

    if (!response.ok) {
      await this.handleApiError(response, 'Failed to delete document');
    }

    return response.json() as Promise<DeleteResult>;
  }
}
