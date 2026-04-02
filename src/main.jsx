import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";
import App from '@/App';
import { RootProviders } from '@/lib/providerConfig';
import '@/index.css';

// Sentry Initialization
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT || "development",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, 
    // Session Replay
    replaysSessionSampleRate: 0.1, 
    replaysOnErrorSampleRate: 1.0, 
  });
}

// Ensure React is available in scope to prevent "React is not defined" errors in older JSX transforms
window.React = React;

// Setup Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ [ServiceWorker] registration successful with scope: ', registration.scope);
      })
      .catch((err) => {
        console.error('🚨 [ServiceWorker] registration failed: ', err);
      });
  });
}

// Find Root Element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('🚨 [React Init] Failed to find the root element with id "root".');
  document.body.innerHTML = '<div style="color:red; padding: 20px; font-family: sans-serif;">Critical Error: Failed to mount React application. "root" element not found.</div>';
} else {
  try {
    console.log('🚀 [React Init] Mounting application...');
    const root = ReactDOM.createRoot(rootElement);
    
    // StrictMode helps identify side effects, deprecated methods, and hook rule violations
    root.render(
      <>
        <BrowserRouter>
          <HelmetProvider>
            <RootProviders>
              <App />
            </RootProviders>
          </HelmetProvider>
        </BrowserRouter>
      </>
    );
    console.log('✅ [React Init] Application mounted successfully.');
  } catch (error) {
    console.error('🚨 [React Init] Error during root rendering:', error);
  }
}