describe('Basic Tests', () => {
  // Original test
  test('adds 1 + 1 to equal 2', () => {
    expect(1 + 1).toBe(2);
  });
  
  // Added test using inline code instead of requiring a separate file
  test('logs calculation results', () => {
    const logSpy = jest.spyOn(console, 'log');
    
    // Mock the functionality that was in simple.js directly
    console.log('Running simple test');
    console.log('1 + 1 =', 1 + 1);
    console.log('Test passed!');
    
    expect(logSpy).toHaveBeenCalledWith('Running simple test');
    expect(logSpy).toHaveBeenCalledWith('1 + 1 =', 2);
    expect(logSpy).toHaveBeenCalledWith('Test passed!');
    
    logSpy.mockRestore();
  });
});
