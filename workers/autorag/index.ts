/**
 * RecruitReply AutoRAG Worker
 *
 * This worker handles document indexing and querying using Cloudflare's Vector Search
 * and Workers AI for embeddings and LLM capabilities.
 */

// Import types from types.d.ts
/// <reference path="./types.d.ts" />

// Use the Env interface from types.d.ts

// Document metadata structure
interface DocumentMetadata {
  id: string;
  title: string;
  source: string;
  timestamp: number;
  chunkIndex: number;
  totalChunks: number;
}

// Response structure for queries
interface QueryResponse {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    source: string;
    content: string;
    similarity: number;
  }>;
}

// Type guard for AI embedding response
interface EmbeddingResponse {
  data: number[][];
}

function isEmbeddingResponse(obj: unknown): obj is EmbeddingResponse {
  const resp = obj as Partial<EmbeddingResponse>;
  return resp !== null &&
    typeof resp === 'object' &&
    Array.isArray(resp.data) &&
    resp.data.length > 0 &&
    Array.isArray(resp.data[0]);
}

// Type guard for DocumentMetadata
function isDocumentMetadata(obj: unknown): obj is DocumentMetadata {
  const metadata = obj as Partial<DocumentMetadata>;
  return metadata !== null &&
    typeof metadata === 'object' &&
    typeof metadata.id === 'string' &&
    typeof metadata.title === 'string' &&
    typeof metadata.source === 'string' &&
    typeof metadata.timestamp === 'number' &&
    typeof metadata.chunkIndex === 'number' &&
    typeof metadata.totalChunks === 'number';
}

// Type guard for LLM response
interface LlmResponse {
  response: string;
}

function isLlmResponse(obj: unknown): obj is LlmResponse {
  const resp = obj as Partial<LlmResponse>;
  return resp !== null && 
    typeof resp === 'object' && 
    typeof resp.response === 'string';
}

export default {
  /**
   * Handle incoming requests to the worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Set up CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS requests for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Parse the URL to determine the endpoint
    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);

    // Route the request to the appropriate handler
    try {
      if (path[0] === 'query' && request.method === 'POST') {
        return await this.handleQuery(request, env, corsHeaders);
      } else if (path[0] === 'upload' && request.method === 'POST') {
        return await this.handleUpload(request, env, corsHeaders);
      } else if (path[0] === 'documents' && request.method === 'GET') {
        return await this.listDocuments(request, env, corsHeaders);
      } else if (path[0] === 'documents' && path[1] && request.method === 'DELETE') {
        return await this.deleteDocument(request, env, corsHeaders, path[1]);
      } else {
        return new Response('Not found', { status: 404, headers: corsHeaders });
      }
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },

  /**
   * Handle document query requests
   */
  async handleQuery(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    // Parse the request body
    const body = await request.json();
    const { query, conversationId } = body as { query: string; conversationId?: string };

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    try {
      // Generate embeddings for the query using Workers AI
      const embedding = await this.generateEmbedding(query, env);

      // Search for relevant documents in the vector index
      const results = await env.RECRUITREPLY_INDEX.query(embedding, {
        topK: 5,
        returnMetadata: true,
      });

      // Retrieve the full content of the matched documents
      const sources = await Promise.all(
        results.matches.map(async (match) => {
          // Use type guard for metadata
          const metadata = match.metadata;
          if (!isDocumentMetadata(metadata)) {
            console.error('Invalid metadata format:', metadata);
            return null;
          }
          
          const documentKey = `${metadata.id}/chunk_${metadata.chunkIndex}.txt`;

          // Get the document chunk from R2
          const chunk = await env.DOCUMENTS.get(documentKey);
          const content = chunk ? await chunk.text() : 'Content not found';

          return {
            id: metadata.id,
            title: metadata.title,
            source: metadata.source,
            content,
            similarity: match.score,
          };
        })
      );

      // Filter out null values
      const validSources = sources.filter((source): source is NonNullable<typeof source> => source !== null);

      // Combine the document contents to create context for the LLM
      const context = validSources.map((source) => source.content).join('\n\n');

      // Generate a response using the LLM
      const prompt = `
You are an AI assistant for recruitment agents. Answer the following question based on the provided context.
If the answer is not in the context, say "I don't have information about that in my knowledge base."

Context:
${context}

Question: ${query}

Answer:`;

      // Call the LLM to generate a response
      const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        prompt,
        max_tokens: 500,
      });

      if (!isLlmResponse(response)) {
        throw new Error('Invalid LLM response format');
      }

      // Return the response with sources
      return new Response(
        JSON.stringify({
          answer: response.response,
          sources: validSources,
        } as QueryResponse),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error processing query:', error);
      return new Response(JSON.stringify({ error: 'Failed to process query' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },

  /**
   * Handle document upload requests
   */
  async handleUpload(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    // Parse the request as FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const source = formData.get('source') as string | null;

    if (!file || !title) {
      return new Response(JSON.stringify({ error: 'File and title are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    try {
      // Generate a unique ID for the document
      const documentId = crypto.randomUUID();
      const timestamp = Date.now();

      // Read the file content
      const content = await file.text();

      // Store the original document in R2
      await env.DOCUMENTS.put(`${documentId}/original.txt`, content);

      // Configuration for chunking
      const CHUNK_SIZE = 1000;
      const CHUNK_OVERLAP = 200;

      // Split the document into chunks for embedding
      const chunks = this.chunkDocument(content, CHUNK_SIZE, CHUNK_OVERLAP);

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Store the chunk in R2
        await env.DOCUMENTS.put(`${documentId}/chunk_${i}.txt`, chunk);

        // Generate embeddings for the chunk
        const embedding = await this.generateEmbedding(chunk, env);

        // Create the document metadata
        const metadata: DocumentMetadata = {
          id: documentId,
          title,
          source: source || 'Unknown',
          timestamp,
          chunkIndex: i,
          totalChunks: chunks.length,
        };

        // Store the embedding in the vector index with metadata
        await env.RECRUITREPLY_INDEX.insert({
          id: `${documentId}_${i}`,
          values: embedding,
          metadata: metadata as unknown as Record<string, unknown>,
        });
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          documentId,
          chunks: chunks.length,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      return new Response(JSON.stringify({ error: 'Failed to upload document' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },

  /**
   * List all indexed documents
   */
  async listDocuments(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
    try {
      // List all objects in the R2 bucket
      const objects = await env.DOCUMENTS.list({ prefix: '', delimiter: '/' });

      // Extract unique document IDs
      const documentIds = new Set<string>();
      for (const object of objects.objects) {
        const parts = object.key.split('/');
        if (parts.length > 0) {
          documentIds.add(parts[0]);
        }
      }

      // Get metadata for each document
      const documents = await Promise.all(
        Array.from(documentIds).map(async (id) => {
          // Get the first chunk to extract metadata
          const chunk = await env.DOCUMENTS.get(`${id}/chunk_0.txt`);
          if (!chunk) return null;

          // Query the vector index to get metadata
          const embedding = await this.generateEmbedding(await chunk.text(), env);
          const results = await env.RECRUITREPLY_INDEX.query(embedding, {
            topK: 1,
            filter: { id },
            returnMetadata: true,
          });

          if (results.matches.length === 0) return null;

          const metadata = results.matches[0].metadata;
          
          // Use type guard instead of unsafe casting
          if (isDocumentMetadata(metadata)) {
            return {
              id: metadata.id,
              title: metadata.title,
              source: metadata.source,
              timestamp: metadata.timestamp,
              chunks: metadata.totalChunks,
            };
          }
          
          return null;
        })
      );

      // Filter out null values and return the list
      return new Response(
        JSON.stringify(documents.filter(Boolean)),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error listing documents:', error);
      return new Response(JSON.stringify({ error: 'Failed to list documents' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },

  /**
   * Delete a document and its embeddings
   */
  async deleteDocument(
    request: Request,
    env: Env,
    corsHeaders: Record<string, string>,
    documentId: string
  ): Promise<Response> {
    try {
      // List all objects for this document
      const objects = await env.DOCUMENTS.list({ prefix: `${documentId}/` });

      // Delete all objects from R2
      for (const object of objects.objects) {
        await env.DOCUMENTS.delete(object.key);
      }

      // Delete all embeddings from the vector index
      // Note: This is a simplified approach. In a production environment,
      // you would need to handle pagination for large numbers of embeddings.
      const dummyEmbedding = new Array(1536).fill(0);
      const results = await env.RECRUITREPLY_INDEX.query(dummyEmbedding, {
        topK: 100,
        filter: { id: documentId },
        returnMetadata: true,
      });

      for (const match of results.matches) {
        // Cast to string to ensure type safety
        const matchId = String(match.id);
        await env.RECRUITREPLY_INDEX.deleteByIds([matchId]);
      }

      return new Response(
        JSON.stringify({ success: true, documentId }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Error deleting document:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete document' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },

  /**
   * Generate embeddings for text using Workers AI
   */
  async generateEmbedding(text: string, env: Env): Promise<number[]> {
    const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [text],
    });

    // Use type guard instead of unsafe casting
    if (isEmbeddingResponse(response)) {
      return response.data[0];
    }
    
    throw new Error('Invalid embedding response format');
  },

  /**
   * Split a document into chunks with overlap
   * @deprecated Use the shared utility from src/lib/utils.ts instead
   */
  chunkDocument(text: string, chunkSize: number, overlap: number): string[] {
    // This implementation remains for backward compatibility
    // but we should migrate to using the shared utility
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      chunks.push(text.substring(startIndex, endIndex));
      startIndex += chunkSize - overlap;
    }

    return chunks;
  },
};
