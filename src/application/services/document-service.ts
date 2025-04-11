/**
 * Document service for handling document operations
 */
import { DocumentRepository } from '@/domain/repositories/document-repository';
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';
import { 
  QueryRequestDto, 
  QueryResponseDto, 
  DocumentDto, 
  UploadResponseDto, 
  DeleteResponseDto 
} from '../dtos/document-dtos';

export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  /**
   * Query the document repository
   */
  async query(queryDto: QueryRequestDto): Promise<QueryResponseDto> {
    if (!queryDto.query || typeof queryDto.query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    const result = await this.documentRepository.query(
      queryDto.query, 
      queryDto.conversationId
    );

    return this.mapQueryResultToDto(result);
  }

  /**
   * List all documents
   */
  async listDocuments(): Promise<DocumentDto[]> {
    const documents = await this.documentRepository.listDocuments();
    return documents.map(this.mapDocumentToDto);
  }

  /**
   * Upload a document
   */
  async uploadDocument(file: File, title: string, source?: string): Promise<UploadResponseDto> {
    if (!file) {
      throw new Error('File is required');
    }

    if (!title) {
      throw new Error('Title is required');
    }

    const result = await this.documentRepository.uploadDocument(file, title, source);
    return this.mapUploadResultToDto(result);
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<DeleteResponseDto> {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    const result = await this.documentRepository.deleteDocument(documentId);
    return this.mapDeleteResultToDto(result);
  }

  // Mapper methods
  private mapQueryResultToDto(result: QueryResult): QueryResponseDto {
    return {
      answer: result.answer,
      sources: result.sources.map(source => ({
        id: source.id,
        title: source.title,
        source: source.source,
        content: source.content,
        similarity: source.similarity
      }))
    };
  }

  private mapDocumentToDto(document: Document): DocumentDto {
    return {
      id: document.id,
      title: document.title,
      source: document.source,
      timestamp: document.timestamp,
      chunks: document.chunks
    };
  }

  private mapUploadResultToDto(result: UploadResult): UploadResponseDto {
    return {
      success: result.success,
      documentId: result.documentId,
      chunks: result.chunks
    };
  }

  private mapDeleteResultToDto(result: DeleteResult): DeleteResponseDto {
    return {
      success: result.success,
      documentId: result.documentId
    };
  }
}
