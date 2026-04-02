import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

class SubscriptionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Subscription Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="m-6 border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Erreur d'affichage de l'abonnement</h2>
            <p className="text-red-700 mb-6">
              Nous n'avons pas pu charger les détails de votre abonnement. 
              {this.state.error?.message && <span className="block mt-2 text-sm opacity-80">{this.state.error.message}</span>}
            </p>
            <Button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Réessayer
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default SubscriptionErrorBoundary;