import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class CVErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CVErrorBoundary] Caught template rendering error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px] bg-slate-50/80 rounded-xl border border-slate-200">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Erreur lors du chargement du CV</h3>
          <p className="text-slate-600 mb-6 max-w-md">
            Un problème est survenu lors de l'affichage du modèle de CV. Vos données sont sauvegardées. Veuillez réessayer.
          </p>
          <Button onClick={this.handleRetry} className="bg-slate-900 hover:bg-slate-800 text-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}