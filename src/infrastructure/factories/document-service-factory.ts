/**
 * Factory for creating document service instances
 */
import { DocumentService } from '@/application/services/document-service';
import { AutoRAGRepository } from '../repositories/autorag-repository';

export class DocumentServiceFactory {
  /**
   * Create a document service with the AutoRAG repository
   */
  static createWithAutoRAG(): DocumentService {
    const baseUrl = process.env.NEXT_PUBLIC_AUTORAG_API_URL || 'https://autorag.recruitreply.example.com';
    const apiKey = process.env.AUTORAG_API_KEY;
    
    const repository = new AutoRAGRepository(baseUrl, apiKey);
    return new DocumentService(repository);
  }
}

// Create a singleton instance for convenience
export const documentService = DocumentServiceFactory.createWithAutoRAG();
