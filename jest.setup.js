// Jest setup file for integration tests

// Extend Jest timeout for integration tests
jest.setTimeout(30000);

// Global test setup
beforeAll(() => {
  console.log('🧪 Starting integration test suite...');
  console.log('⏱️  Test timeout set to 30 seconds for network operations');
});

afterAll(() => {
  console.log('✅ Integration test suite completed');
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Console configuration for cleaner test output
if (process.env.NODE_ENV === 'test') {
  console.log('🔧 Test environment configured');
}