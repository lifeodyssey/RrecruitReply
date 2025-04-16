import { describe, expect, it } from 'vitest';

import { AutoRagClient, type IAutoRagConfig } from './index';

describe('AutoRagClient', () => {
  const testConfig: IAutoRagConfig = {
    apiKey: 'test-api-key',
    endpoint: 'https://api.example.com/autorag',
    model: 'gpt-4',
    maxTokens: 1000,
  };

  it('should be instantiated with config', () => {
    const client = new AutoRagClient(testConfig);
    expect(client).toBeInstanceOf(AutoRagClient);
  });

  it('should redact API key when getting config', () => {
    const client = new AutoRagClient(testConfig);
    const config = client.getConfig();

    expect(config.apiKey).toBe('********');
    expect(config.endpoint).toBe(testConfig.endpoint);
    expect(config.model).toBe(testConfig.model);
    expect(config.maxTokens).toBe(testConfig.maxTokens);
  });

  it('should throw error on empty question', () => {
    const client = new AutoRagClient(testConfig);

    expect(() => client.query('')).toThrow('Question cannot be empty');
    expect(() => client.query('   ')).toThrow('Question cannot be empty');
  });

  it('should return a response for valid question', async () => {
    const client = new AutoRagClient(testConfig);
    const question = 'What are the benefits of RAG?';

    const response = await client.query(question);

    expect(response).toContain(question);
    expect(typeof response).toBe('string');
  });
});