/**
 * Data Transfer Objects for document operations
 */
import { Document, Source, QueryResult, UploadResult, DeleteResult } from '@/domain/models/document';

// Request DTOs
export interface QueryRequestDto {
  query: string;
  conversationId?: string;
}

// Response DTOs that just reference the domain models to avoid duplication
export type SourceDto = Source;
export type DocumentDto = Document;
export type QueryResponseDto = QueryResult;
export type UploadResponseDto = UploadResult;
export type DeleteResponseDto = DeleteResult;

// Error DTO
export interface ErrorResponseDto {
  error: string;
  status: number;
}
