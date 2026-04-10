import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAnalytics } from './AnalyticsContext';

export type ABTestVariant = 'A' | 'B';

interface ABTest {
  testId: string;
  variant: ABTestVariant;
  description: string;
}

interface ABTestConfig {
  [testId: string]: {
    description: string;
    variants: {
      A: any;
      B: any;
    };
  };
}

// Define A/B tests here
const abTestConfig: ABTestConfig = {
  'cta-apply-upgrade': {
    description: 'Apply upgrade button copy',
    variants: {
      A: 'Upgrade Now (Low Risk)',
      B: 'Apply Upgrade—8 min',
    },
  },
  'recommendation-badge': {
    description: 'Recommendation badge style',
    variants: {
      A: 'Best for You',
      B: '⭐ Top Pick',
    },
  },
  'preview-cta': {
    description: 'Preview button text',
    variants: {
      A: 'Confirm & Apply',
      B: 'Start Upgrade',
    },
  },
  'empty-state-cta': {
    description: 'Empty state call-to-action',
    variants: {
      A: 'Try Demo (Your Data Safe)',
      B: 'Preview with Sample Fleet',
    },
  },
  'first-run-headline': {
    description: 'First-run setup headline',
    variants: {
      A: 'Stabilize Your Fleet in 3 Minutes',
      B: 'See Your Fleet Health in Under 3 Min',
    },
  },
  'onboarding-skip': {
    description: 'Skip tour button text',
    variants: {
      A: 'Skip (Restart Anytime)',
      B: 'Skip for Now',
    },
  },
};

interface ABTestContextType {
  getVariant: (testId: string) => ABTestVariant;
  getVariantValue: <T = any>(testId: string) => T;
  getAllTests: () => ABTest[];
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [variants, setVariants] = useState<{ [testId: string]: ABTestVariant }>({});
  const { trackEvent } = useAnalytics();

  // Initialize variants on mount
  useEffect(() => {
    const storedVariants = localStorage.getItem('nimbuswiz-ab-tests');
    
    if (storedVariants) {
      setVariants(JSON.parse(storedVariants));
    } else {
      // Assign random variants for first visit
      const newVariants: { [testId: string]: ABTestVariant } = {};
      
      Object.keys(abTestConfig).forEach((testId) => {
        const variant: ABTestVariant = Math.random() < 0.5 ? 'A' : 'B';
        newVariants[testId] = variant;
        
        // Track assignment
        trackEvent('onboarding_started', {
          testId,
          variant,
          description: abTestConfig[testId].description,
        });
      });
      
      setVariants(newVariants);
      localStorage.setItem('nimbuswiz-ab-tests', JSON.stringify(newVariants));
    }
  }, [trackEvent]);

  const getVariant = (testId: string): ABTestVariant => {
    return variants[testId] || 'A';
  };

  const getVariantValue = <T = any,>(testId: string): T => {
    const variant = getVariant(testId);
    return abTestConfig[testId]?.variants[variant] as T;
  };

  const getAllTests = (): ABTest[] => {
    return Object.keys(abTestConfig).map((testId) => ({
      testId,
      variant: variants[testId] || 'A',
      description: abTestConfig[testId].description,
    }));
  };

  return (
    <ABTestContext.Provider
      value={{
        getVariant,
        getVariantValue,
        getAllTests,
      }}
    >
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}