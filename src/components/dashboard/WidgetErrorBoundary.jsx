import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[WidgetErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-100 rounded-xl text-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <p className="text-sm text-red-600 font-medium">
            {this.props.fallbackMessage || "Ce widget n'a pas pu se charger."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 underline"
          >
            <RefreshCcw className="h-3 w-3" /> Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default WidgetErrorBoundary;
