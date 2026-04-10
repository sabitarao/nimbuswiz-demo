import { createContext, useContext, ReactNode, useCallback } from 'react';

export type AnalyticsEvent =
  | 'onboarding_started'
  | 'onboarding_step_completed'
  | 'onboarding_skipped'
  | 'onboarding_completed'
  | 'demo_mode_enabled'
  | 'demo_mode_disabled'
  | 'system_searched'
  | 'filter_applied'
  | 'recommendation_viewed'
  | 'preview_opened'
  | 'simulation_run'
  | 'upgrade_applied'
  | 'upgrade_undone'
  | 'role_changed'
  | 'tooltip_viewed'
  | 'quick_filter_used';

interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

interface AnalyticsContextType {
  trackEvent: (event: AnalyticsEvent, properties?: AnalyticsProperties) => void;
  trackPageView: (pageName: string) => void;
  trackTiming: (category: string, variable: string, timeMs: number) => void;
  getSessionData: () => SessionData;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  eventsCount: number;
  lastEventTime: number;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  // Generate session ID on mount
  const sessionId = typeof window !== 'undefined' 
    ? sessionStorage.getItem('nimbuswiz-session-id') || generateSessionId()
    : 'server';

  if (typeof window !== 'undefined' && !sessionStorage.getItem('nimbuswiz-session-id')) {
    sessionStorage.setItem('nimbuswiz-session-id', sessionId);
  }

  const sessionData: SessionData = {
    sessionId,
    startTime: Date.now(),
    eventsCount: 0,
    lastEventTime: Date.now(),
  };

  const trackEvent = useCallback((event: AnalyticsEvent, properties?: AnalyticsProperties) => {
    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: sessionData.sessionId,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      },
    };

    // Log to console (replace with actual analytics service)
    console.log('[Analytics]', eventData);

    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const existingEvents = JSON.parse(localStorage.getItem('nimbuswiz-analytics') || '[]');
      existingEvents.push(eventData);
      // Keep only last 100 events
      if (existingEvents.length > 100) {
        existingEvents.shift();
      }
      localStorage.setItem('nimbuswiz-analytics', JSON.stringify(existingEvents));
    }

    sessionData.eventsCount++;
    sessionData.lastEventTime = Date.now();
  }, [sessionData]);

  const trackPageView = useCallback((pageName: string) => {
    trackEvent('onboarding_step_completed', { page: pageName });
    console.log('[Analytics] Page View:', pageName);
  }, [trackEvent]);

  const trackTiming = useCallback((category: string, variable: string, timeMs: number) => {
    console.log(`[Analytics] Timing: ${category}.${variable} = ${timeMs}ms`);
    
    if (typeof window !== 'undefined') {
      const timingData = {
        category,
        variable,
        timeMs,
        timestamp: Date.now(),
      };
      const existingTimings = JSON.parse(localStorage.getItem('nimbuswiz-timings') || '[]');
      existingTimings.push(timingData);
      if (existingTimings.length > 50) {
        existingTimings.shift();
      }
      localStorage.setItem('nimbuswiz-timings', JSON.stringify(existingTimings));
    }
  }, []);

  const getSessionData = useCallback(() => sessionData, [sessionData]);

  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        trackPageView,
        trackTiming,
        getSessionData,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}
