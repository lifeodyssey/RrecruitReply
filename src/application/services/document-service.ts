/**
 * Document service for handling document operations
 */
import { Document, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';
import { DocumentRepository } from '@/domain/repositories/document-repository';

import {
  QueryRequestDto,
  QueryResponseDto,
  DocumentDto,
  UploadResponseDto,
  DeleteResponseDto,
  SourceDto
} from '../dtos/document-dtos';
import { ValidationError } from '../errors/application-errors';

/**
 * Mapper interface for converting between domain models and DTOs
 */
interface DtoMapper<T, U> {
  toDto(domain: T): U;
}

/**
 * Document service for handling document operations
 */
export class DocumentService {
  private mappers: {
    document: DtoMapper<Document, DocumentDto>,
    queryResult: DtoMapper<QueryResult, QueryResponseDto>,
    uploadResult: DtoMapper<UploadResult, UploadResponseDto>,
    deleteResult: DtoMapper<DeleteResult, DeleteResponseDto>
  };

  public constructor(private readonly documentRepository: DocumentRepository) {
    // Initialize mappers
    this.mappers = {
      document: {
        toDto: (document: Document): DocumentDto => ({
          id: document.id,
          title: document.title,
          filename: document.filename,
          uploadDate: document.timestamp,
          source: document.source ? {
            name: document.source.name,
            url: document.source.url
          } : undefined
        })
      },
      queryResult: {
        toDto: (result: QueryResult): QueryResponseDto => ({
          answer: result.answer,
          sources: result.sources.map(source => ({
            name: source.title,
            url: source.url
          }))
        })
      },
      uploadResult: {
        toDto: (result: UploadResult): UploadResponseDto => ({
          success: result.success,
          documentId: result.documentId,
          message: `Document ${result.documentId} uploaded successfully`
        })
      },
      deleteResult: {
        toDto: (result: DeleteResult): DeleteResponseDto => ({
          success: result.success,
          documentId: result.documentId,
          message: `Document ${result.documentId} deleted successfully`
        })
      }
    };
  }

  /**
   * Query the document repository
   */
  public async query(queryDto: QueryRequestDto): Promise<QueryResponseDto> {
    if (!queryDto.query || typeof queryDto.query !== 'string') {
      throw new ValidationError('Query is required and must be a string');
    }

    const result = await this.documentRepository.query(
      queryDto.query,
      queryDto.conversationId
    );

    return this.mappers.queryResult.toDto(result);
  }

  /**
   * List all documents
   */
  public async listDocuments(): Promise<DocumentDto[]> {
    const documents = await this.documentRepository.listDocuments();
    return documents.map(doc => this.mappers.document.toDto(doc));
  }

  /**
   * Upload a document
   */
  public async uploadDocument(file: File, title: string, source?: string): Promise<UploadResponseDto> {
    if (!file) {
      throw new ValidationError('File is required');
    }

    if (!title) {
      throw new ValidationError('Title is required');
    }

    const result = await this.documentRepository.uploadDocument(file, title, source);
    return this.mappers.uploadResult.toDto(result);
  }

  /**
   * Delete a document
   */
  public async deleteDocument(documentId: string): Promise<DeleteResponseDto> {
    if (!documentId) {
      throw new ValidationError('Document ID is required');
    }

    const result = await this.documentRepository.deleteDocument(documentId);
    return this.mappers.deleteResult.toDto(result);
  }
}
