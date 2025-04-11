// This file is used to mock file imports in Jest tests
module.exports = 'test-file-stub';

// Add a simple test to avoid the "Your test suite must contain at least one test" error
describe('File mock', () => {
  it('should return a string', () => {
    expect(module.exports).toBe('test-file-stub');
  });
});
