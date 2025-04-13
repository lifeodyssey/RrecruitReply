/**
 * Factory for creating DocumentService instances
 */
import { DocumentService } from '@/application/services/document-service';
import { DocumentRepository } from '@/domain/repositories/document-repository';
import { AutoRAGRepository } from '@/infrastructure/repositories/autorag-repository';

/**
 * Factory configuration for DocumentService
 */
interface DocumentServiceConfig {
  baseUrl: string;
  apiKey?: string;
}

/**
 * Factory for creating DocumentService instances
 */
export class DocumentServiceFactory {
  private static config: DocumentServiceConfig = {
    baseUrl: process.env.AUTORAG_API_URL || 'https://api.autorag.workers.dev',
    apiKey: process.env.AUTORAG_API_KEY
  };

  /**
   * Configure the factory with custom settings
   * 
   * @param config - Custom configuration settings
   */
  public static configure(config: Partial<DocumentServiceConfig>): void {
    DocumentServiceFactory.config = {
      ...DocumentServiceFactory.config,
      ...config
    };
  }

  /**
   * Create a new DocumentRepository instance
   * 
   * @returns A configured DocumentRepository instance
   */
  public static createRepository(): DocumentRepository {
    return new AutoRAGRepository(
      DocumentServiceFactory.config.baseUrl,
      DocumentServiceFactory.config.apiKey
    );
  }

  /**
   * Create a new DocumentService instance
   * 
   * @returns A configured DocumentService instance
   */
  public static createService(): DocumentService {
    const repository = DocumentServiceFactory.createRepository();
    return new DocumentService(repository);
  }
}

/**
 * Get a configured DocumentService instance
 * 
 * @returns A configured DocumentService instance
 */
export function getDocumentService(): DocumentService {
  return DocumentServiceFactory.createService();
}
