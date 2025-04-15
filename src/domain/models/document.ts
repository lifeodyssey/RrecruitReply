/**
 * Domain models for documents in the AutoRAG system
 */

/**
 * Represents a document in the system
 */
export interface IDocument {
  id: string;
  title: string;
  filename: string;
  timestamp: number;
  source?: {
    name: string;
    url: string;
  };
}

/**
 * Represents a source referenced in a query result
 */
export interface ISource {
  id: string;
  title: string;
  source: string;
  content: string;
  similarity: number;
  url?: string;
}

/**
 * Represents the result of a query operation
 */
export interface IQueryResult {
  answer: string;
  sources: ISource[];
}

/**
 * Represents the result of a document upload operation
 */
export interface IUploadResult {
  success: boolean;
  documentId: string;
  chunks: number;
}

/**
 * Represents the result of a document deletion operation
 */
export interface IDeleteResult {
  success: boolean;
  documentId: string;
}
