import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';
import { MonitoringService } from '@/services/monitoringService';

/**
 * Service to track Core Web Vitals and performance metrics.
 * Integrates with the existing MonitoringService to send data to Supabase.
 */
export const PerformanceMonitor = {
  initialized: false,

  init() {
    if (this.initialized) return;
    
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    try {
      // Track Core Web Vitals
      onCLS(this.handleMetric);
      onFID(this.handleMetric);
      onLCP(this.handleMetric);
      onFCP(this.handleMetric);
      onTTFB(this.handleMetric);

      // Track resources loading (simple check for slow resources)
      this.observeResourceTiming();

      this.initialized = true;
      if (import.meta.env.DEV) {
        console.log('[PerformanceMonitor] Initialized');
      }
    } catch (e) {
      console.warn('[PerformanceMonitor] Failed to initialize:', e);
    }
  },

  handleMetric(metric) {
    // Determine rating based on standard thresholds
    let rating = 'good';
    if (metric.name === 'LCP') {
        if (metric.value > 2500) rating = 'needs-improvement';
        if (metric.value > 4000) rating = 'poor';
    } else if (metric.name === 'FID') {
        if (metric.value > 100) rating = 'needs-improvement';
        if (metric.value > 300) rating = 'poor';
    } else if (metric.name === 'CLS') {
        if (metric.value > 0.1) rating = 'needs-improvement';
        if (metric.value > 0.25) rating = 'poor';
    }

    // Log to Supabase via existing service
    // Fixed: calling correct method name logPerformanceMetric instead of logMetric
    MonitoringService.logPerformanceMetric(metric.name, metric.value, rating);
    
    // Dev logging
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${metric.name}:`, metric.value, rating);
    }
  },

  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log significantly slow API calls (> 2s)
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
             if (entry.duration > 2000) {
                 MonitoringService.logPerformanceMetric(`Slow_API_${new URL(entry.name).pathname}`, entry.duration, 'poor');
             }
          }
        });
      });
      observer.observe({ entryTypes: ['resource'] });
    }
  }
};