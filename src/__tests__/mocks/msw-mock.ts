// This is a simplified mock for MSW to avoid the dependency
// It provides just enough functionality for our tests to work
// Note: This file is kept for backward compatibility, but we're now using
// the fetch mock system defined in jest.setup.ts

export interface IResponseContext {
  status: (code: number) => IResponseContext;
  json: (data: unknown) => IMockResponse;
}

export interface IStatusContext {
  json: (data: unknown) => IMockResponse;
}

export interface IMockResponse {
  status: number;
  data: unknown;
}

// Removed unused interface

export type ResponseTransformer = (ctx: IResponseContext) => IMockResponse;
export type ResponseResolver = (
  req: unknown,
  res: ResponseTransformer,
  ctx: IResponseContext
) => IMockResponse;
export interface IRestHandler {
  type: string;
  method: string;
  url: string;
  handler: ResponseResolver;
}

export type AnyHandler = IRestHandler | unknown; // This allows HttpHandler to be passed

export const rest = {
  get: (url: string, handler: ResponseResolver): IRestHandler => ({
    type: 'rest',
    method: 'GET',
    url,
    handler,
  }),
  post: (url: string, handler: ResponseResolver): IRestHandler => ({
    type: 'rest',
    method: 'POST',
    url,
    handler,
  }),
  delete: (url: string, handler: ResponseResolver): IRestHandler => ({
    type: 'rest',
    method: 'DELETE',
    url,
    handler,
  }),
};

interface IMockServer {
  handlers: AnyHandler[];
  listen: Mock;
  close: Mock;
  resetHandlers: Mock;
  use: Mock;
}

interface IFetchMockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface IGlobal {
      registerFetchMock: (
        url: string,
        method: string,
        handler: () => Promise<IFetchMockResponse>
      ) => void;
    }
  }
}

export const setupServer = (...handlers: AnyHandler[]): IMockServer => {
  const server = {
    handlers,
    listen: vi.fn(),
    close: vi.fn(),
    resetHandlers: vi.fn(),
    use: vi.fn((handler: AnyHandler) => {
      // When server.use is called, register a fetch mock
      if (handler && typeof handler === 'object' && 'type' in handler && handler.type === 'rest') {
        const { method, url, handler: responseHandler } = handler as IRestHandler;
        const mockCtx = {
          status: (code: number): IStatusContext => ({
            json: (data: unknown): IMockResponse => ({ status: code, data }),
          }),
          json: (data: unknown): IMockResponse => ({ status: 200, data }),
        } as IResponseContext;

        // Create a mock response transformer
        const mockRes: ResponseTransformer = (_ctx: IResponseContext) => ({ status: 200, data: {} });

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
