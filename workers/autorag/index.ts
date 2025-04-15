/**
 * Cloudflare Worker for AutoRAG
 */

/**
 * Unused interface, kept for reference
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
interface _IEnv {
  AI: unknown;
  OPENAI_API_KEY: string;
}

/**
 * Query request interface
 */
interface IQueryRequest {
  question: string;
  temperature?: number;
  topK?: number;
  filters?: Record<string, unknown>;
}

/**
 * Environment variables for the AutoRAG worker
 */
interface IEnv {
  // Add any environment variables here
  OPENAI_API_KEY?: string;
  AUTORAG_API_KEY?: string;
}

/**
 * Handle the request to the AutoRAG API
 */
const autoRagWorker = {

  async fetch(request: Request, _env: IEnv): Promise<Response> {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse the request body
      const requestData = await request.json() as IQueryRequest;

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

export default autoRagWorker;