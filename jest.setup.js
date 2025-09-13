// Jest setup file for all tests (integration and component tests)
require('@testing-library/jest-dom');

// Extend Jest timeout for integration tests
jest.setTimeout(30000);

// React Testing Library setup (will only be used if @testing-library/react is available)
try {
  require('@testing-library/jest-dom');
} catch (e) {
  // @testing-library/jest-dom not available - component tests will need proper setup
}

// Global test setup
beforeAll(() => {
  console.log('🧪 Starting test suite...');
  console.log('⏱️  Test timeout set to 30 seconds for network operations');
});

afterAll(() => {
  console.log('✅ Test suite completed');
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Console configuration for cleaner test output
if (process.env.NODE_ENV === 'test') {
  console.log('🔧 Test environment configured');
}

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia for responsive components and accessibility tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});