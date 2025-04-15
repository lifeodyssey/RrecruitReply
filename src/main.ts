/**
 * Main entry point for the RAG application
 */

import { AutoRagClient } from './lib/autorag';

// This is a placeholder for the actual application
// In a real application, this would render a UI and set up event handlers
console.log('RAG Application Initializing...');

// Example usage of the AutoRagClient
const client = new AutoRagClient({
  apiKey: 'demo-key',
  endpoint: 'https://api.example.com/autorag',
  model: 'gpt-4',
});

// Example function to query the RAG system
async function queryRag(question: string): Promise<void> {
  try {
    const response = await client.query(question);
    console.log('Question:', question);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error querying RAG:', error);
  }
}

// For demonstration - not executed in production
if (import.meta.env.DEV) {
  void queryRag('What are the best practices for technical interviews?');
}

export { queryRag }; 