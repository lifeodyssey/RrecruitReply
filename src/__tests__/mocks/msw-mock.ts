// This is a simplified mock for MSW to avoid the dependency
// It provides just enough functionality for our tests to work
// Note: This file is kept for backward compatibility, but we're now using
// the fetch mock system defined in jest.setup.ts

export const rest = {
  get: (url: string, handler: any) => ({
    type: 'rest',
    method: 'GET',
    url,
    handler
  }),
  post: (url: string, handler: any) => ({
    type: 'rest',
    method: 'POST',
    url,
    handler
  }),
  delete: (url: string, handler: any) => ({
    type: 'rest',
    method: 'DELETE',
    url,
    handler
  })
};

export const setupServer = (...handlers: any[]) => {
  const server = {
    handlers,
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn(),
    use: jest.fn((handler) => {
      // When server.use is called, register a fetch mock
      if (handler && handler.type === 'rest') {
        const { method, url, handler: responseHandler } = handler;
        const mockCtx = {
          status: (code: number) => ({ json: (data: any) => ({ status: code, data }) }),
          json: (data: any) => ({ status: 200, data })
        };

        const mockRes = (ctx: any) => {
          return (config: any) => {
            const { status = 200, data } = config;
            return Promise.resolve({
              ok: status >= 200 && status < 300,
              status,
              json: () => Promise.resolve(data)
            });
          };
        };

        // Register a fetch mock for this handler
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
