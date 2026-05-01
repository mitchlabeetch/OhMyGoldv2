import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
    this.props.onError?.(error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-status-error/10 rounded-full">
                <AlertTriangle className="w-10 h-10 text-status-error" aria-hidden="true" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
              <p className="text-text-secondary text-sm leading-relaxed">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error?.message && (
                <p className="text-xs text-text-muted font-mono bg-surface-elevated px-3 py-2 rounded-lg mt-4 break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold-500 text-black font-semibold text-sm hover:bg-gold-400 transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try again
              </button>
              <button
                onClick={() => window.location.assign("/")}
                className="px-5 py-2.5 rounded-lg bg-surface-elevated text-text-secondary font-semibold text-sm hover:bg-surface-card border border-border transition-colors"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
