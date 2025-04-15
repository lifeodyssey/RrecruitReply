/**
 * Data Transfer Objects for document operations
 */

// Request DTOs
export interface IQueryRequestDto {
  query: string;
  conversationId?: string;
}

// Response DTOs with proper interfaces instead of type aliases
export interface ISourceDto {
  name: string;
  url?: string;
}

export interface IDocumentDto {
  id: string;
  title: string;
  filename: string;
  uploadDate: Date;
  source?: ISourceDto;
}

export interface IQueryResponseDto {
  answer: string;
  sources: ISourceDto[];
}

export interface IUploadResponseDto {
  success: boolean;
  documentId: string;
  message: string;
}

export interface IDeleteResponseDto {
  success: boolean;
  documentId: string;
  message: string;
}

// Error DTO
export interface IErrorResponseDto {
  error: string;
  status: number;
}
