// Performance monitoring and error tracking service
// This can be easily integrated with services like Sentry, LogRocket, or custom analytics

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string> | undefined;
}

interface ErrorEvent {
  message: string;
  stack?: string;
  componentStack?: string;
  userId?: string | undefined;
  timestamp: number;
  url: string;
  userAgent: string;
  tags?: Record<string, string> | undefined;
}

interface UserAction {
  action: string;
  category: string;
  label?: string | undefined;
  value?: number | undefined;
  timestamp: number;
  userId?: string | undefined;
  tags?: Record<string, string> | undefined;
}

class MonitoringService {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorEvent[] = [];
  private actions: UserAction[] = [];
  private isProduction = process.env.NODE_ENV === 'production';
  private userId?: string;

  constructor() {
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    // Initialize error tracking
    this.initializeErrorTracking();
    
    // Initialize user action tracking
    this.initializeActionTracking();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private initializePerformanceMonitoring() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      this.monitorCoreWebVitals();
      
      // Monitor resource loading
      this.monitorResourceLoading();
      
      // Monitor API performance
      this.monitorAPIPerformance();
    }
  }

  private monitorCoreWebVitals() {
    // Monitor Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('lcp', lastEntry.startTime, 'ms');
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingStart) {
            this.recordMetric('fid', entry.processingStart - entry.startTime, 'ms');
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.recordMetric('cls', clsValue, 'score');
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private monitorResourceLoading() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
            this.recordMetric('api_response_time', entry.duration, 'ms', {
              url: entry.name,
              method: entry.initiatorType
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  private monitorAPIPerformance() {
    // Intercept fetch requests to monitor API performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : args[0].toString();
      const method = args[1]?.method || 'GET';
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        this.recordMetric('api_request', endTime - startTime, 'ms', {
          url,
          method,
          status: response.status.toString()
        });
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.recordMetric('api_error', endTime - startTime, 'ms', {
          url,
          method,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    };
  }

  private initializeErrorTracking() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    });
  }

  private initializeActionTracking() {
    // Track page views
    let currentUrl = window.location.href;
    const trackPageView = () => {
      const newUrl = window.location.href;
      if (newUrl !== currentUrl) {
        this.recordAction('page_view', 'navigation', newUrl);
        currentUrl = newUrl;
      }
    };

    // Listen for navigation changes
    window.addEventListener('popstate', trackPageView);
    
    // Override pushState and replaceState to track programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      trackPageView();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      trackPageView();
    };
  }

  recordMetric(name: string, value: number, unit: string, tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);
    
    if (this.isProduction) {
      // Send to monitoring service
      this.sendMetric(metric);
    } else {
      console.log('📊 Metric:', metric);
    }
  }

  recordError(error: Omit<ErrorEvent, 'timestamp'>) {
    const errorEvent: ErrorEvent = {
      ...error,
      userId: this.userId,
      timestamp: Date.now()
    };

    this.errors.push(errorEvent);
    
    if (this.isProduction) {
      // Send to error tracking service
      this.sendError(errorEvent);
    } else {
      console.error('🚨 Error:', errorEvent);
    }
  }

  recordAction(action: string, category: string, label?: string, value?: number, tags?: Record<string, string>) {
    const userAction: UserAction = {
      action,
      category,
      label,
      value,
      userId: this.userId,
      timestamp: Date.now(),
      tags
    };

    this.actions.push(userAction);
    
    if (this.isProduction) {
      // Send to analytics service
      this.sendAction(userAction);
    } else {
      console.log('👤 Action:', userAction);
    }
  }

  private async sendMetric(metric: PerformanceMetric) {
    try {
      // TODO: Send to monitoring service (Sentry, DataDog, etc.)
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.error('Failed to send metric:', error);
    }
  }

  private async sendError(error: ErrorEvent) {
    try {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      });
    } catch (error) {
      console.error('Failed to send error:', error);
    }
  }

  private async sendAction(action: UserAction) {
    try {
      // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
    } catch (error) {
      console.error('Failed to send action:', error);
    }
  }

  // Get performance data for debugging
  getMetrics() {
    return this.metrics;
  }

  getErrors() {
    return this.errors;
  }

  getActions() {
    return this.actions;
  }

  // Clear data (useful for testing)
  clear() {
    this.metrics = [];
    this.errors = [];
    this.actions = [];
  }
}

// Create singleton instance
export const monitoring = new MonitoringService();

// Export types for use in components
export type { PerformanceMetric, ErrorEvent, UserAction }; 