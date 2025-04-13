import { QueryRequestDto } from '@/application/dtos/document-dtos';
import { MockDocumentRepository } from '@/infrastructure/mocks/mock-document-repository';

import { DocumentService } from '../document-service';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let mockRepository: MockDocumentRepository;

  beforeEach(() => {
    mockRepository = new MockDocumentRepository();
    documentService = new DocumentService(mockRepository);
  });

  describe('query', () => {
    it('should query the repository and return the result', async () => {
      const queryDto: QueryRequestDto = {
        query: 'What are the benefits?',
        conversationId: 'conv-123'
      };

      const result = await documentService.query(queryDto);

      expect(result).toHaveProperty('answer');
      expect(result).toHaveProperty('sources');
      expect(Array.isArray(result.sources)).toBe(true);
    });

    it('should throw an error if query is missing', async () => {
      const queryDto = {} as QueryRequestDto;

      await expect(documentService.query(queryDto)).rejects.toThrow('Query is required');
    });
  });

  describe('listDocuments', () => {
    it('should list documents from the repository', async () => {
      const documents = await documentService.listDocuments();

      expect(Array.isArray(documents)).toBe(true);
      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0]).toHaveProperty('id');
      expect(documents[0]).toHaveProperty('title');
    });
  });

  describe('uploadDocument', () => {
    it('should upload a document to the repository', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const title = 'Test Document';
      const source = 'Test Source';

      const result = await documentService.uploadDocument(file, title, source);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('documentId');
      expect(result).toHaveProperty('message');
    });

    it('should throw an error if file is missing', async () => {
      const title = 'Test Document';
      const source = 'Test Source';

      await expect(documentService.uploadDocument(null as unknown as File, title, source))
        .rejects.toThrow('File is required');
    });

    it('should throw an error if title is missing', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const source = 'Test Source';

      await expect(documentService.uploadDocument(file, '', source))
        .rejects.toThrow('Title is required');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document from the repository', async () => {
      const documentId = 'doc-1';

      const result = await documentService.deleteDocument(documentId);

      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('documentId', documentId);
    });

    it('should throw an error if document ID is missing', async () => {
      await expect(documentService.deleteDocument('')).rejects.toThrow('Document ID is required');
    });

    it('should throw an error if document is not found', async () => {
      const documentId = 'non-existent-doc';

      // Set up the mock to throw an error for this document ID
      jest.spyOn(mockRepository, 'deleteDocument').mockImplementation((id) => {
        if (id === documentId) {
          throw new Error(`Document with ID ${id} not found`);
        }
        return Promise.resolve({ success: true, documentId: id });
      });

      await expect(documentService.deleteDocument(documentId))
        .rejects.toThrow(`Document with ID ${documentId} not found`);
    });
  });
}); 