'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            页面出错 / Page Error
          </h1>
          <pre className="bg-red-50 dark:bg-red-950 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
            {this.state.error?.name}: {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
            {this.state.errorInfo?.componentStack && (
              <>
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </>
            )}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            重试 / Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
