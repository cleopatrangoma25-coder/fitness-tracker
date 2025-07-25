import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '@fitness-tracker/ui';

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Normal component</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We're sorry, but something unexpected happened/)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('resets error state when Try Again is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again
    fireEvent.click(screen.getByText('Try Again'));

    // Re-render without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('shows error details in development mode', () => {
    // Mock NODE_ENV to development
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
    
    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('does not show error details in production mode', () => {
    // Mock NODE_ENV to production
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
    
    // Restore original env
    process.env.NODE_ENV = originalEnv;
  });

  it('logs error to console in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Production error:',
      expect.objectContaining({
        error: 'Test error',
        stack: expect.any(String),
        componentStack: expect.any(String),
        timestamp: expect.any(String)
      })
    );

    consoleSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });
});

describe('useErrorHandler', () => {
  it('throws the provided error', () => {
    const { useErrorHandler } = require('@fitness-tracker/ui');
    const errorHandler = useErrorHandler();
    const testError = new Error('Test error');

    expect(() => errorHandler(testError)).toThrow('Test error');
  });
});

describe('withErrorBoundary HOC', () => {
  it('wraps component with ErrorBoundary', () => {
    const { withErrorBoundary } = require('@fitness-tracker/ui');
    const WrappedComponent = withErrorBoundary(ThrowError);

    render(<WrappedComponent shouldThrow={true} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('uses custom fallback when provided', () => {
    const { withErrorBoundary } = require('@fitness-tracker/ui');
    const customFallback = <div>Custom fallback</div>;
    const WrappedComponent = withErrorBoundary(ThrowError, customFallback);

    render(<WrappedComponent shouldThrow={true} />);

    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('passes props to wrapped component', () => {
    const { withErrorBoundary } = require('@fitness-tracker/ui');
    const WrappedComponent = withErrorBoundary(ThrowError);

    render(<WrappedComponent shouldThrow={false} />);

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });
}); 