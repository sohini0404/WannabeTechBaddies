import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="mosaic-card rounded-2xl p-6 text-center space-y-4 border border-amber-300 bg-amber-50/70 my-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
            <AlertTriangle className="w-6 h-6 text-amber-700" />
          </div>

          <div>
            <h3 className="text-base font-bold text-teal-950 font-['Outfit',sans-serif]">
              {this.props.fallbackTitle || "Simulation Display Notice"}
            </h3>
            <p className="text-xs text-teal-800/80 max-w-md mx-auto mt-1 leading-relaxed">
              {this.props.fallbackMessage ||
                "A graphics rendering exception occurred (such as WebGL context restriction in this browser session). You can refresh to retry or continue with the high-performance 2D view."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Rendering</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
