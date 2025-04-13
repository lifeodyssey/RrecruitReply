/**
 * Factory for creating document service instances
 */
import { DocumentService } from '@/application/services/document-service';
import { AutoRAGRepository } from '../repositories/autorag-repository';
import { DocumentRepository } from '@/domain/repositories/document-repository';

/**
 * Environment configuration interface
 */
export interface DocumentServiceConfig {
  apiUrl: string;
  apiKey?: string;
}

/**
 * Factory interface for creating document services
 */
export interface IDocumentServiceFactory {
  createService(config?: Partial<DocumentServiceConfig>): DocumentService;
}

/**
 * Factory for creating document service instances
 *
 * This factory provides methods to create document service instances
 * with different repository implementations.
 */
export class DocumentServiceFactory implements IDocumentServiceFactory {
  private static instance: DocumentService | null = null;
  private defaultConfig: DocumentServiceConfig;

  constructor(config?: DocumentServiceConfig) {
    // Use provided config or get from environment
    this.defaultConfig = config || {
      apiUrl: process.env.CLOUDFLARE_AUTORAG_ENDPOINT || 'https://autorag.recruitreply.example.com',
      apiKey: process.env.CLOUDFLARE_AUTORAG_API_KEY
    };
  }

  /**
   * Get the default document service instance (singleton)
   */
  static getDefaultInstance(): DocumentService {
    if (!this.instance) {
      const factory = new DocumentServiceFactory();
      this.instance = factory.createService();
    }
    return this.instance;
  }

  /**
   * Create a document service with the provided configuration
   */
  createService(config?: Partial<DocumentServiceConfig>): DocumentService {
    const effectiveConfig = {
      ...this.defaultConfig,
      ...config
    };
    
    const repository = new AutoRAGRepository(effectiveConfig.apiUrl, effectiveConfig.apiKey);
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
