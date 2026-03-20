import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AuraErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, this would pipe to a sovereign logging endpoint
    if (import.meta.env.DEV) {
      console.error("NEBULA_COLLAPSE_DETECTED:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden">
          <div className="text-center space-y-6 max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h2 className="text-slate-900 text-xl font-bold font-['Space_Grotesk']">Something went wrong</h2>
              <p className="text-slate-600 text-sm mt-2">We encountered an unexpected error. Please refresh the page to try again.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
