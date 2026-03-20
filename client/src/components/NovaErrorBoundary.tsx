/* eslint-disable react-refresh/only-export-components */
import { Component, useEffect } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Agent: Log the error to the console or external observability service here
    console.error("[CRITICAL_RENDER_ERROR]:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 p-6">
      <h2 className="text-2xl font-bold mb-4">Application Failed to Mount</h2>
      <div className="bg-white p-4 rounded shadow w-full max-w-3xl overflow-auto border border-red-200">
        <p className="font-mono text-sm font-semibold border-b pb-2 mb-2">{error.message}</p>
        {/* Agent: Add additional stack trace mapping here if available */}
        {error.stack && (
          <pre className="font-mono text-xs overflow-auto text-left mt-2 text-slate-700 whitespace-pre-wrap">
            {error.stack}
          </pre>
        )}
      </div>
      <button 
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Attempt Recovery
      </button>
    </div>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class NovaErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Automatically reload if we hit a chunk loading error (stale deployment)
    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed') ||
      error.message.includes('is not valid JSON') // Sometimes chunk loads return index.html causing a JSON parse error
    ) {
      // Set a session storage flag to avoid infinite reload loops
      if (!sessionStorage.getItem('nova_reloaded_for_chunk')) {
        sessionStorage.setItem('nova_reloaded_for_chunk', 'true');
        window.location.reload();
      }
    }
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("NEBULA_COLLAPSE_DETECTED:", error, errorInfo);
    }
  }

  public resetBoundary = () => {
    sessionStorage.removeItem('nova_reloaded_for_chunk');
    window.location.reload();
  };

  public render() {
    if (this.state.error) {
      return <GlobalError error={this.state.error} reset={this.resetBoundary} />;
    }

    return this.props.children;
  }
}
