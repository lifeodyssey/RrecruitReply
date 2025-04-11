# Cloudflare AutoRAG Integration Guide

This document provides information on setting up and using Cloudflare AutoRAG with the RecruitReply application.

## What is Cloudflare AutoRAG?

Cloudflare AutoRAG is a managed Retrieval-Augmented Generation (RAG) service that allows you to build AI applications that can retrieve and reference information from your own data. It combines the power of large language models with your own documents to provide accurate, contextual responses.

## Setting Up Cloudflare AutoRAG

### Prerequisites

- Cloudflare account with Workers AI access
- R2 bucket for document storage (created via Terraform)
- API token with appropriate permissions

### Creation Steps

1. **Create a Vector Index**:
   - Go to the Cloudflare dashboard
   - Navigate to Workers & Pages > AI > Vector Indexes
   - Click "Create Vector Index"
   - Name it "recruitreply-index"
   - Choose the appropriate dimensions (1536 for OpenAI embeddings)
   - Select "cosine" as the similarity metric

2. **Connect to R2 Bucket**:
   - In the Vector Index settings, go to the "Data Sources" tab
   - Click "Add Data Source"
   - Select the "recruitreply-documents" R2 bucket
   - Configure the indexing settings (file types, chunking strategy)
   - Set up a schedule for reindexing or use on-demand indexing

3. **Create a Worker for RAG**:
   - Create a new Worker in the Cloudflare dashboard
   - Use the AutoRAG template or create a custom implementation
   - Bind the Vector Index to the Worker
   - Configure the LLM provider (Cloudflare Workers AI or OpenAI)

## API Usage

### Endpoints

The AutoRAG Worker will expose the following endpoints:

- `POST /query`: Submit a query to the RAG system
  ```json
  {
    "query": "What are the benefits offered to new employees?",
    "conversationId": "optional-conversation-id"
  }
  ```

- `POST /upload`: Upload a document to the R2 bucket and trigger indexing
  ```json
  {
    "file": "base64-encoded-file",
    "filename": "document.pdf",
    "contentType": "application/pdf"
  }
  ```

- `GET /documents`: List all indexed documents
- `DELETE /documents/:id`: Delete a document and remove it from the index

### Integration with Next.js

In the Next.js application, create API routes that proxy requests to the AutoRAG Worker:

```typescript
// src/app/api/query/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const response = await fetch('https://autorag-worker.your-domain.workers.dev/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AUTORAG_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  return NextResponse.json(data);
}
```

## Testing Document Upload and Indexing

1. Create a test document with recruitment-related content
2. Upload it using the `/upload` endpoint
3. Verify it appears in the list of documents
4. Submit a query related to the document content
5. Verify the response contains information from the document

## Monitoring and Maintenance

- Monitor vector index size and performance
- Regularly update documents to keep information current
- Review query logs to identify common questions and improve document coverage
- Optimize chunking and embedding strategies based on performance

## Troubleshooting

- **Indexing Issues**: Check R2 bucket permissions and file formats
- **Query Performance**: Adjust chunk size and overlap settings
- **Response Quality**: Review prompt templates and context window size
- **Rate Limiting**: Monitor usage and adjust plans if needed

## Resources

- [Cloudflare Vector Search Documentation](https://developers.cloudflare.com/vector-search/)
- [Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [R2 Storage Documentation](https://developers.cloudflare.com/r2/)
