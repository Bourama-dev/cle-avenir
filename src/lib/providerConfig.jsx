import React, { Component } from 'react';
import { SafeToastProvider } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { EstablishmentAuthProvider } from '@/contexts/EstablishmentAuthContext';
import { PersistenceProvider } from '@/context/PersistenceContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CartProvider } from '@/hooks/useCart';
import StripeProvider from '@/components/StripeProvider';

const THIRD_PARTY_PATTERNS = ['yt.mid', 'yt.', 'ytInitialData', 'youtube', 'gtag', 'fbq', 'clarity'];

function isThirdPartyError(error) {
  const msg = (error?.message || '') + (error?.stack || '');
  return THIRD_PARTY_PATTERNS.some(p => msg.includes(p));
}

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

    const reloadCount = parseInt(sessionStorage.getItem('_app_reload_count') || '0', 10);

    if (isThirdPartyError(error) && reloadCount < 2) {
      sessionStorage.setItem('_app_reload_count', String(reloadCount + 1));
      window.location.reload();
      return;
    }

    // Reset counter on genuine app errors so future third-party reloads still work
    if (!isThirdPartyError(error)) {
      sessionStorage.removeItem('_app_reload_count');
    }
  }

  render() {
    if (this.state.hasError && !isThirdPartyError(this.state.error)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg border border-red-200 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erreur de chargement</h2>
            <p className="text-slate-600 text-sm mb-4">
              Une erreur est survenue. Rechargez la page pour continuer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
            >
              Recharger
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