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
  private readonly mappers: {
    document: DtoMapper<Document, DocumentDto>,
    queryResult: DtoMapper<QueryResult, QueryResponseDto>,
    uploadResult: DtoMapper<UploadResult, UploadResponseDto>,
    deleteResult: DtoMapper<DeleteResult, DeleteResponseDto>
  };

  /**
   * Creates a new instance of DocumentService
   * 
   * @param documentRepository - The document repository to use
   */
  public constructor(private readonly documentRepository: DocumentRepository) {
    // Initialize mappers
    this.mappers = {
      document: {
        toDto: (document: Document): DocumentDto => ({
          id: document.id,
          title: document.title,
          filename: document.filename,
          uploadDate: new Date(document.timestamp),
          source: document.source
        })
      },
      queryResult: {
        toDto: (result: QueryResult): QueryResponseDto => ({
          answer: result.answer,
          sources: result.sources.map(source => ({
            name: source.title,
            url: source.url || source.source
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
   * Validates a query request
   * 
   * @param queryDto - The query to validate
   * @throws ValidationError if validation fails
   */
  private validateQueryRequest(queryDto: QueryRequestDto): void {
    if (!queryDto.query?.trim()) {
      throw new ValidationError('Query is required and cannot be empty');
    }
  }

  /**
   * Query the document repository
   * 
   * @param queryDto - The query request DTO
   * @returns Promise resolving to the query response DTO
   */
  public async query(queryDto: QueryRequestDto): Promise<QueryResponseDto> {
    this.validateQueryRequest(queryDto);

    const result = await this.documentRepository.query(
      queryDto.query,
      queryDto.conversationId
    );

    return this.mappers.queryResult.toDto(result);
  }

  /**
   * List all documents
   * 
   * @returns Promise resolving to an array of document DTOs
   */
  public async listDocuments(): Promise<DocumentDto[]> {
    const documents = await this.documentRepository.listDocuments();
    return documents.map(doc => this.mappers.document.toDto(doc));
  }

  /**
   * Upload a document
   * 
   * @param file - The file to upload
   * @param title - The document title
   * @param source - Optional source information
   * @returns Promise resolving to the upload response DTO
   */
  public async uploadDocument(file: File, title: string, source?: string): Promise<UploadResponseDto> {
    if (!file) {
      throw new ValidationError('File is required');
    }

    if (!title?.trim()) {
      throw new ValidationError('Title is required and cannot be empty');
    }

    const result = await this.documentRepository.uploadDocument(file, title, source);
    return this.mappers.uploadResult.toDto(result);
  }

  /**
   * Delete a document
   * 
   * @param documentId - The ID of the document to delete
   * @returns Promise resolving to the delete response DTO
   */
  public async deleteDocument(documentId: string): Promise<DeleteResponseDto> {
    if (!documentId?.trim()) {
      throw new ValidationError('Document ID is required and cannot be empty');
    }

    const result = await this.documentRepository.deleteDocument(documentId);
    return this.mappers.deleteResult.toDto(result);
  }
}
