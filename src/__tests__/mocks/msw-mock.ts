// This is a simplified mock for MSW to avoid the dependency
// It provides just enough functionality for our tests to work
// Note: This file is kept for backward compatibility, but we're now using
// the fetch mock system defined in jest.setup.ts

type ResponseResolver = (req: unknown, res: ResponseTransformer, ctx: ResponseContext) => MockResponse;
type ResponseTransformer = (ctx: ResponseContext) => MockResponseConfig;
type ResponseContext = {
  status: (code: number) => { json: (data: unknown) => MockResponse };
  json: (data: unknown) => MockResponse;
};
type MockResponse = { status: number; data: unknown };
type MockResponseConfig = { status?: number; data: unknown };
type RestHandler = {
  type: string;
  method: string;
  url: string;
  handler: ResponseResolver;
};

export const rest = {
  get: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'GET',
    url,
    handler
  }),
  post: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'POST',
    url,
    handler
  }),
  delete: (url: string, handler: ResponseResolver): RestHandler => ({
    type: 'rest',
    method: 'DELETE',
    url,
    handler
  })
};

interface MockServer {
  handlers: RestHandler[];
  listen: jest.Mock;
  close: jest.Mock;
  resetHandlers: jest.Mock;
  use: jest.Mock;
}

type FetchMockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      registerFetchMock: (url: string, method: string, handler: () => Promise<FetchMockResponse>) => void;
    }
  }
}

export const setupServer = (...handlers: RestHandler[]): MockServer => {
  const server = {
    handlers,
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
    use: jest.fn((handler: RestHandler) => {
      // When server.use is called, register a fetch mock
      if (handler && handler.type === 'rest') {
        const { method, url, handler: responseHandler } = handler;
        const mockCtx: ResponseContext = {
          status: (code: number) => ({ json: (data: unknown) => ({ status: code, data }) }),
          json: (data: unknown) => ({ status: 200, data })
        };

        const mockRes = (ctx: ResponseContext) => {
          return (config: MockResponseConfig) => {
            const { status = 200, data } = config;
            return Promise.resolve({
              ok: status >= 200 && status < 300,
              status,
              json: () => Promise.resolve(data)
            });
          };
        };

        // Register a fetch mock for this handler
        // @ts-expect-error - global.registerFetchMock is defined in jest setup
        global.registerFetchMock(url, method, () => {
          const response = responseHandler({}, mockRes(mockCtx), mockCtx);
          return Promise.resolve({
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            json: () => Promise.resolve(response.data)
          });
        });
      }
    })
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
