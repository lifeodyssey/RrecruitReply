/**
 * Cloudflare Worker for AutoRAG
 */

interface Env {
  AI: unknown;
  OPENAI_API_KEY: string;
}

interface QueryRequest {
  question: string;
  temperature?: number;
  topK?: number;
  filters?: Record<string, unknown>;
}

/**
 * Handle the request to the AutoRAG API
 */
export default {
  async fetch(request: Request, _env: Env): Promise<Response> {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the request body
      const requestData = await request.json() as QueryRequest;
      
      // Validate input
      if (!requestData.question || typeof requestData.question !== 'string') {
        return new Response(JSON.stringify({ error: 'Question is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // TODO: Implement actual AutoRAG query using Cloudflare's AI bindings
      // This is a placeholder implementation
      const response = {
        answer: `This is a mock response to the question: "${requestData.question}"`,
        sources: [],
      };

      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error('Error processing request:', error);
      
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  },
}; 