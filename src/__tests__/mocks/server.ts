import { setupServer } from './msw-mock';
import { handlers } from './handlers';

// Setup requests interception using the given handlers
export const server = setupServer(...handlers);

// Register all handlers with our fetch mock system
beforeAll(() => {
  // Initialize the server (this will register the handlers with our fetch mock system)
  server.listen();
});

// Add a simple test to avoid the "Your test suite must contain at least one test" error
describe('Mock Server', () => {
  it('should be defined', () => {
    expect(server).toBeDefined();
    expect(server.listen).toBeDefined();
    expect(server.close).toBeDefined();
    expect(server.resetHandlers).toBeDefined();
  });
});
