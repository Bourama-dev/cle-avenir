import { MonitoringService } from '@/services/monitoringService';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export const initPerformanceMonitoring = () => {
  // Basic implementation without 'web-vitals' dependency if not installed
  // Using PerformanceObserver API natively
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Log LCP
        if (entry.entryType === 'largest-contentful-paint') {
           MonitoringService.logMetric('LCP', entry.startTime);
        }
        // Log CLS (layout-shift)
        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
           MonitoringService.logMetric('CLS', entry.value);
        }
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Log First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
                MonitoringService.logMetric('FCP', entry.startTime);
            }
        });
    });
    paintObserver.observe({ type: 'paint', buffered: true });

  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
};