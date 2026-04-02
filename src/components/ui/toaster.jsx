// Must be rendered inside SafeToastProvider
import React, { Component, useState, useEffect } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

// Global flag to track if provider is initialized
let isProviderInitialized = false;

export const isToastProviderInitialized = () => isProviderInitialized;

class ToastErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 [Toast Error Boundary] caught an error in Toaster:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p className="font-bold text-sm">Toast System Error</p>
          <p className="text-xs">{this.state.error?.message || 'Failed to render notifications'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Development Debug Panel
const ToastDebugPanel = () => {
  if (import.meta.env.MODE !== 'development') return null;
  
  return (
    <div className="fixed bottom-0 left-0 bg-slate-900 text-green-400 text-[10px] px-2 py-1 z-[9999] opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
      ToastProvider: {isProviderInitialized ? '🟢 Active' : '🔴 Failed'}
    </div>
  );
};

export function Toaster() {
  // Call useToast hook unconditionally at the top level
  const toastContext = useToast();

  if (!toastContext) {
    console.error("🚨 [Toaster] Failed to initialize useToast. Ensure Toaster is within SafeToastProvider.");
    return null;
  }

  const { toasts } = toastContext;

  if (!toasts || !Array.isArray(toasts)) {
    console.warn("🚨 [Toaster] toasts is not an array:", toasts);
    return null; 
  }

  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </>
  );
}

export function SafeToastProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      isProviderInitialized = true;
      setMounted(true);
      console.log('✅ [SafeToastProvider] Initialized successfully');
    } catch (err) {
      console.error('🚨 [SafeToastProvider] Initialization failed:', err);
    }
    return () => {
      isProviderInitialized = false;
    };
  }, []);

  return (
    <ToastErrorBoundary>
      <ToastProvider>
        {children}
        {mounted && <Toaster />}
        {mounted && <ToastDebugPanel />}
      </ToastProvider>
    </ToastErrorBoundary>
  );
}