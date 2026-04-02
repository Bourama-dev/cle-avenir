import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Oups ! Une erreur est survenue.</h1>
            <p className="text-slate-500 mb-6">
              Ne vous inquiétez pas, cela arrive. Nous avons été notifiés du problème.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={this.handleReload} className="w-full gap-2">
                <RefreshCcw className="h-4 w-4" />
                Rafraîchir la page
              </Button>
              <Button onClick={this.handleReset} variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
            
            {import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-slate-950 text-slate-50 rounded text-left text-xs overflow-auto max-h-40">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;