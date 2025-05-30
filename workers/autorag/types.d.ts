/**
 * Type definitions for Cloudflare Workers
 */

// Cloudflare Vectorize Index
interface IVectorizeIndex {
  /**
   * Insert a vector into the index
   */
  insert(params: {
    id: string;
    values: number[];
    metadata?: Record<string, unknown>;
  }): Promise<void>;

  /**
   * Query the index for similar vectors
   */
  query(
    vector: number[],
    options?: {
      topK?: number;
      filter?: Record<string, unknown>;
      returnMetadata?: boolean;
    }
  ): Promise<{
    matches: Array<{
      id: string;
      score: number;
      metadata?: Record<string, unknown>;
    }>;
  }>;

  /**
   * Get a vector by ID
   */
  getByIds(ids: string[]): Promise<{
    vectors: Array<{
      id: string;
      values: number[];
      metadata?: Record<string, unknown>;
    }>;
  }>;

  /**
   * Delete vectors by ID
   */
  deleteByIds(ids: string[]): Promise<void>;
}

// Cloudflare R2 Bucket
interface IR2Bucket {
  /**
   * Get an object from the bucket
   */
  get(key: string): Promise<IR2Object | null>;

  /**
   * Put an object in the bucket
   */
  put(key: string, value: string | ArrayBuffer | ReadableStream): Promise<IR2Object>;

  /**
   * Delete an object from the bucket
   */
  delete(key: string): Promise<void>;

  /**
   * List objects in the bucket
   */
  list(options?: {
    prefix?: string;
    delimiter?: string;
    cursor?: string;
    limit?: number;
  }): Promise<{
    objects: R2Object[];
    truncated: boolean;
    cursor?: string;
    delimitedPrefixes: string[];
  }>;
}

// Cloudflare R2 Object
interface IR2Object {
  key: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: Record<string, string>;
  customMetadata?: Record<string, string>;
  range?: {
    offset: number;
    length: number;
  };

  /**
   * Get the object body as text
   */
  text(): Promise<string>;

  /**
   * Get the object body as an ArrayBuffer
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * Get the object body as a ReadableStream
   */
  body: ReadableStream;
}

// Cloudflare Workers Execution Context
interface IExecutionContext {
  /**
   * Wait until the promise resolves
   */
  waitUntil(promise: Promise<unknown>): void;

  /**
   * Pass the request to the next handler
   */
  passThroughOnException(): void;
}
