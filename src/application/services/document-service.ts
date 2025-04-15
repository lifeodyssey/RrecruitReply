/**
 * Document service for handling document operations
 */

import { ValidationError } from '../errors/application-errors';
import { ApiError } from '../utils/api-error-handler';

import type {
  IDeleteResponseDto,
  IDocumentDto,
  IQueryRequestDto,
  IQueryResponseDto,
  IUploadResponseDto,
} from '../dtos/document-dtos';
import type {
  IDeleteResult,
  IDocument,
  IQueryResult,
  IUploadResult,
} from '@/domain/models/document';
import type { IDocumentRepository } from '@/domain/repositories/document-repository';

/**
 * Mapper interface for converting between domain models and DTOs
 */
interface IDtoMapper<T, U> {
  toDto(domain: T): U;
}

/**
 * Document service for handling document operations
 */
export class DocumentService {
  private readonly mappers: {
    document: IDtoMapper<IDocument, IDocumentDto>;
    queryResult: IDtoMapper<IQueryResult, IQueryResponseDto>;
    uploadResult: IDtoMapper<IUploadResult, IUploadResponseDto>;
    deleteResult: IDtoMapper<IDeleteResult, IDeleteResponseDto>;
  };

  private repository: IDocumentRepository;

  /**
   * Creates a new instance of DocumentService
   *
   * @param documentRepository - The document repository to use
   */
  public constructor(repository: IDocumentRepository) {
    this.repository = repository;

    // Initialize mappers
    this.mappers = {
      document: {
        toDto: (document: IDocument): IDocumentDto => ({
          id: document.id,
          title: document.title,
          filename: document.filename,
          uploadDate: new Date(document.timestamp),
          source: document.source,
        }),
      },
      queryResult: {
        toDto: (result: IQueryResult): IQueryResponseDto => ({
          answer: result.answer,
          sources: result.sources.map((source) => ({
            name: source.title,
            url: source.url || source.source,
          })),
        }),
      },
      uploadResult: {
        toDto: (result: IUploadResult): IUploadResponseDto => ({
          success: result.success,
          documentId: result.documentId,
          message: `Document ${result.documentId} uploaded successfully`,
        }),
      },
      deleteResult: {
        toDto: (result: IDeleteResult): IDeleteResponseDto => ({
          success: result.success,
          documentId: result.documentId,
          message: `Document ${result.documentId} deleted successfully`,
        }),
      },
    };
  }

  /**
   * Validates a query request
   *
   * @param queryDto - The query to validate
   * @throws ValidationError if validation fails
   */
  private validateQueryRequest(queryDto: IQueryRequestDto): void {
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
  public async query(queryDto: IQueryRequestDto): Promise<IQueryResponseDto> {
    this.validateQueryRequest(queryDto);

    const result = await this.repository.query(queryDto.query, queryDto.conversationId);

    return this.mappers.queryResult.toDto(result);
  }

  /**
   * List all documents
   *
   * @returns Promise resolving to an array of document DTOs
   */
  public async listDocuments(): Promise<IDocumentDto[]> {
    const documents = await this.repository.listDocuments();
    return documents.map((doc) => this.mappers.document.toDto(doc));
  }

  /**
   * Upload a document
   *
   * @param file - The file to upload
   * @param title - The document title
   * @param source - Optional source information
   * @returns Promise resolving to the upload response DTO
   */
  public async uploadDocument(
    file: File,
    title: string,
    source?: string
  ): Promise<IUploadResponseDto> {
    if (!file) {
      throw new ValidationError('File is required');
    }

    if (!title?.trim()) {
      throw new ValidationError('Title is required and cannot be empty');
    }

    const result = await this.repository.uploadDocument(file, title, source);
    return this.mappers.uploadResult.toDto(result);
  }

  /**
   * Delete a document
   *
   * @param documentId - The ID of the document to delete
   * @returns Promise resolving to the delete response DTO
   */
  public async deleteDocument(documentId: string): Promise<IDeleteResponseDto> {
    if (!documentId?.trim()) {
      throw new ValidationError('Document ID is required and cannot be empty');
    }

    const result = await this.repository.deleteDocument(documentId);
    return this.mappers.deleteResult.toDto(result);
  }

  /**
   * Get all documents (repository implementation)
   *
   * @returns Promise resolving to an array of documents
   */
  public async getAllDocuments(): Promise<IDocument[]> {
    return this.repository.listDocuments();
  }

  /**
   * Get a document by ID (repository implementation)
   *
   * @param id - The ID of the document to get
   * @returns Promise resolving to the document
   * @throws ApiError if the document is not found
   */
  public async getDocumentById(id: string): Promise<IDocument> {
    const document = await this.repository.getDocumentById(id);

    if (!document) {
      throw new ApiError(`Document with ID ${id} not found`, 404);
    }

    return document;
  }

  /**
   * Create a new document (repository implementation)
   *
   * @param document - The document to create
   * @returns Promise resolving to the created document
   */
  public async createDocument(
    document: Omit<IDocument, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<IDocument> {
    return this.repository.createDocument(document);
  }

  /**
   * Update a document (repository implementation)
   *
   * @param id - The ID of the document to update
   * @param document - The document data to update
   * @returns Promise resolving to the updated document
   * @throws ApiError if the document is not found
   */
  public async updateDocument(
    id: string,
    document: Partial<Omit<IDocument, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<IDocument> {
    const existingDocument = await this.repository.getDocumentById(id);

    if (!existingDocument) {
      throw new ApiError(`Document with ID ${id} not found`, 404);
    }

    return this.repository.updateDocument(id, document);
  }
}
