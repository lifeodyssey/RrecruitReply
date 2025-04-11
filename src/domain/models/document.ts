/**
 * Domain models for documents in the AutoRAG system
 */

export interface Document {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  chunks: number;
}

export interface Source {
  id: string;
  title: string;
  source: string;
  content: string;
  similarity: number;
}

export interface QueryResult {
  answer: string;
  sources: Source[];
}

export interface UploadResult {
  success: boolean;
  documentId: string;
  chunks: number;
}

export interface DeleteResult {
  success: boolean;
  documentId: string;
}
