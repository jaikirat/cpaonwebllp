/**
 * Jest Test Setup Configuration
 *
 * Global test setup for integration tests.
 * This file runs before all tests and configures the test environment.
 */

// Extend Jest matchers if needed
import 'jest-extended';

// Global test timeout for all tests
jest.setTimeout(60000);

// Mock console methods to reduce noise during testing
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Silence console.error for expected failures in TDD mode
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore original console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test environment variables
(process.env as any).NODE_ENV = 'test';
(process.env as any).NEXT_TELEMETRY_DISABLED = '1';

// Mock external services for integration tests
// These will be overridden in specific tests when needed
global.fetch = jest.fn((_input: any, _init?: any) =>
  Promise.resolve({
    ok: false,
    status: 503,
    statusText: 'Service Unavailable',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    body: null,
    bodyUsed: false,
    formData: () => Promise.resolve(new FormData()),
    text: () => Promise.resolve('Service not configured'),
    json: () => Promise.resolve({ error: 'Service not configured' }),
  } as unknown as Response),
) as jest.MockedFunction<typeof fetch>;

// Add custom matchers if needed
expect.extend({
  toBeValidUrl(received: string) {
    try {
      new URL(received);
      return {
        message: () => `Expected ${received} not to be a valid URL`,
        pass: true,
      };
    } catch {
      return {
        message: () => `Expected ${received} to be a valid URL`,
        pass: false,
      };
    }
  },
});

// TypeScript declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidUrl(): R;
    }
  }
}

export {};