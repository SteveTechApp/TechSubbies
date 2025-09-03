import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 m-4 border-2 border-dashed border-red-500 bg-red-50 rounded-lg">
          <h1 className="text-2xl font-bold text-red-700">Application Error</h1>
          <p className="mt-2 text-gray-700">Something went wrong during rendering. This diagnostic tool has caught the error to prevent the application from crashing.</p>
          <p className="mt-1 text-gray-700">Please use the details below to identify and fix the issue in the code.</p>
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h2 className="font-bold text-lg">Error Details:</h2>
            <pre className="mt-2 text-sm text-red-600 bg-white p-2 rounded overflow-auto" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {this.state.error?.toString()}
            </pre>
            <h3 className="font-bold mt-4">Component Stack:</h3>
            <pre className="mt-2 text-sm text-gray-800 bg-white p-2 rounded overflow-auto" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
