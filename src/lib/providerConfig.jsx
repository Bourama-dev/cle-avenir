import React, { Component } from 'react';
import { SafeToastProvider } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { EstablishmentAuthProvider } from '@/contexts/EstablishmentAuthContext';
import { PersistenceProvider } from '@/context/PersistenceContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CartProvider } from '@/hooks/useCart';
import StripeProvider from '@/components/StripeProvider';

class GlobalProviderErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 [Provider Config] Error Boundary caught an error in provider hierarchy:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-red-200 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">System Initialization Error</h2>
            <p className="text-slate-600 text-sm mb-4">
              A critical error occurred while initializing application providers.
            </p>
            <div className="bg-slate-100 p-3 rounded text-left overflow-auto text-xs text-slate-800 mb-4 font-mono">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * RootProviders centralizes all application providers in the strict required order.
 * Order: SafeToastProvider -> AuthProvider -> EstablishmentAuthProvider -> 
 * PersistenceProvider -> NotificationProvider -> CartProvider -> StripeProvider
 */
export function RootProviders({ children }) {
  return (
    <GlobalProviderErrorBoundary>
      <SafeToastProvider>
        <AuthProvider>
          <EstablishmentAuthProvider>
            <PersistenceProvider>
              <NotificationProvider>
                <CartProvider>
                  <StripeProvider>
                    {children}
                  </StripeProvider>
                </CartProvider>
              </NotificationProvider>
            </PersistenceProvider>
          </EstablishmentAuthProvider>
        </AuthProvider>
      </SafeToastProvider>
    </GlobalProviderErrorBoundary>
  );
}