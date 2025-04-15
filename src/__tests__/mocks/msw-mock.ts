// This is a simplified mock for MSW to avoid the dependency
// It provides just enough functionality for our tests to work
// Note: This file is kept for backward compatibility, but we're now using
// the fetch mock system defined in jest.setup.ts

export interface ResponseContext {
  status: (code: number) => ResponseContext;
  json: (data: unknown) => MockResponse;
}

export interface StatusContext {
  json: (data: unknown) => MockResponse;
}

export interface MockResponse {
  status: number;
  data: unknown;
}

// Removed unused interface

export type ResponseTransformer = (ctx: ResponseContext) => MockResponse;
export type ResponseResolver = (
  req: unknown,
  res: ResponseTransformer,
  ctx: ResponseContext
) => MockResponse;
export interface RestHandler {
  type: string;
  method: string;
  url: string;
  handler: ResponseResolver;
}

export type AnyHandler = RestHandler | unknown; // This allows HttpHandler to be passed

export const rest = {
  get: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'GET',
    url,
    handler,
  }),
  post: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'POST',
    url,
    handler,
  }),
  delete: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'DELETE',
    url,
    handler,
  }),
};

interface MockServer {
  handlers: AnyHandler[];
  listen: Mock;
  close: Mock;
  resetHandlers: Mock;
  use: Mock;
}

interface FetchMockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      registerFetchMock: (
        url: string,
        method: string,
        handler: () => Promise<FetchMockResponse>
      ) => void;
    }
  }
}

export const setupServer = (...handlers: AnyHandler[]): MockServer => {
  const server = {
    handlers,
    listen: vi.fn(),
    close: vi.fn(),
    resetHandlers: vi.fn(),
    use: vi.fn((handler: AnyHandler) => {
      // When server.use is called, register a fetch mock
      if (handler && typeof handler === 'object' && 'type' in handler && handler.type === 'rest') {
        const { method, url, handler: responseHandler } = handler as RestHandler;
        const mockCtx = {
          status: (code: number): StatusContext => ({
            json: (data: unknown): MockResponse => ({ status: code, data }),
          }),
          json: (data: unknown): MockResponse => ({ status: 200, data }),
        } as ResponseContext;

        // Create a mock response transformer
        const mockRes: ResponseTransformer = (_ctx: ResponseContext) => ({ status: 200, data: {} });

        // Register a fetch mock for this handler
        global.registerFetchMock(url, method, () => {
          // Call the handler with empty request, mock response transformer, and context
          const response = responseHandler({}, mockRes, mockCtx);

          // Return a proper Response object
          return Promise.resolve(
            new Response(JSON.stringify(response.data), {
              status: response.status,
            })
          );
        });
      }
    }),
  };
  return server;
};

// Add a simple test to avoid the "Your test suite must contain at least one test" error
describe('MSW Mock', () => {
  it('should provide mock functionality', () => {
    expect(rest.get).toBeDefined();
    expect(rest.post).toBeDefined();
    expect(rest.delete).toBeDefined();
    expect(setupServer).toBeDefined();
  });
});
