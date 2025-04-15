import { describe, it, expect } from 'vitest';

import worker from './index';

describe('AutoRAG Worker', () => {
  const mockEnv = {
    AI: {} as unknown,
    OPENAI_API_KEY: 'test-key',
  };

  it('should return 405 for non-POST requests', async () => {
    const request = new Request('https://example.com', {
      method: 'GET',
    });

    const response = await worker.fetch(request, mockEnv);
    
    expect(response.status).toBe(405);
    expect(await response.text()).toBe('Method not allowed');
  });

  it('should return 400 when question is missing', async () => {
    const request = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await worker.fetch(request, mockEnv);
    
    expect(response.status).toBe(400);
    const responseData = await response.json();
    expect(responseData.error).toBeDefined();
  });

  it('should return a response for valid question', async () => {
    const question = 'What is RAG?';
    const request = new Request('https://example.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const response = await worker.fetch(request, mockEnv);
    
    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData.answer).toContain(question);
  });

  it('should return 500 when JSON parsing fails', async () => {
    const request = new Request('https://example.com', {
      method: 'POST',
      body: 'invalid-json',
    });

    const response = await worker.fetch(request, mockEnv);
    
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData.error).toBeDefined();
  });
}); 