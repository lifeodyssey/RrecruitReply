/**
 * Factory for creating document service instances
 */
import { DocumentService } from '@/application/services/document-service';
import { AutoRAGRepository } from '../repositories/autorag-repository';
import { DocumentRepository } from '@/domain/repositories/document-repository';

/**
 * Factory for creating document service instances
 *
 * This factory provides methods to create document service instances
 * with different repository implementations.
 */
export class DocumentServiceFactory {
  private static instance: DocumentService | null = null;

  /**
   * Get the default document service instance (singleton)
   */
  static getDefaultInstance(): DocumentService {
    if (!this.instance) {
      this.instance = this.createWithAutoRAG();
    }
    return this.instance;
  }

  /**
   * Create a document service with the AutoRAG repository
   */
  static createWithAutoRAG(): DocumentService {
    const baseUrl = process.env.NEXT_PUBLIC_AUTORAG_API_URL || 'https://autorag.recruitreply.example.com';
    const apiKey = process.env.AUTORAG_API_KEY;

    const repository = new AutoRAGRepository(baseUrl, apiKey);
    return new DocumentService(repository);
  }

  /**
   * Create a document service with a custom repository
   */
  static createWithCustomRepository(repository: DocumentRepository): DocumentService {
    return new DocumentService(repository);
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static resetInstance(): void {
    this.instance = null;
  }
}

// Export a convenience function to get the default instance
export function getDocumentService(): DocumentService {
  return DocumentServiceFactory.getDefaultInstance();
}
