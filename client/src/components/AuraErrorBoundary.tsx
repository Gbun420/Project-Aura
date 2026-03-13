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
        <div className="h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden relative">
          {/* Fallback Nebula Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
          
          <div className="text-center space-y-6 relative z-10">
            <div className="h-16 w-16 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(34,211,238,0.2)]" />
            <div>
              <h2 className="text-white font-mono text-xs tracking-[0.4em] uppercase font-black">RE-CENTERING_NEBULA</h2>
              <p className="text-gray-600 font-mono text-[9px] mt-2 uppercase tracking-widest">Restoring Sovereign Connection...</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white/5 border border-white/10 text-white font-mono text-[10px] tracking-widest rounded-lg hover:bg-white/10 transition-all"
            >
              INITIALIZE_RE_ENTRY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
