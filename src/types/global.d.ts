// Global type declarations

declare global {
  /**
   * Register a custom fetch mock for a specific URL pattern and HTTP method
   * @param urlPattern The URL pattern to match
   * @param method The HTTP method to match
   * @param responseFactory A function that returns a mocked Response
   * @returns A cleanup function to remove the mock
   */
  function registerFetchMock(
    urlPattern: string,
    method: string,
    responseFactory: (url: string, init?: RequestInit) => Promise<Response>
  ): () => void;
}

export {};
