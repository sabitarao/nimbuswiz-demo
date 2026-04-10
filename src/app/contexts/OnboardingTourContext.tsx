import { createContext, useContext, useState, ReactNode } from 'react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector
  route?: string; // Route to navigate to
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
  skipTour: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NimbusWiz! 🎉',
    description: 'Let\'s take a quick tour to show you how to modernize and stabilize your legacy Nimbus fleet in minutes.',
    route: '/',
  },
  {
    id: 'dashboard',
    title: 'Fleet Overview Dashboard',
    description: 'Monitor real-time health metrics, stability scores, and critical alerts for all your systems at a glance.',
    route: '/',
  },
  {
    id: 'systems',
    title: 'System Management',
    description: 'View detailed information about each Nimbus system. Use quick filters and keyboard shortcuts (press /) to find systems fast.',
    route: '/systems',
  },
  {
    id: 'advisor',
    title: 'Modernization Advisor',
    description: 'Get intelligent upgrade recommendations powered by quirk analysis. Each suggestion includes confidence scores and risk assessments.',
    route: '/advisor',
  },
  {
    id: 'profiles',
    title: 'Upgrade Profiles',
    description: 'Compare upgrade profiles side-by-side. See performance gains, downtime estimates, and rollback plans before applying.',
    route: '/advisor',
  },
  {
    id: 'troubleshooting',
    title: 'Active Issues & Quick Fixes',
    description: 'See prioritized issues with recommended fixes. One-click apply for common problems.',
    route: '/troubleshooting',
  },
  {
    id: 'complete',
    title: 'You\'re All Set! ✨',
    description: 'You can restart this tour anytime from Settings. Now go stabilize your fleet!',
    route: '/',
  },
];

const OnboardingTourContext = createContext<OnboardingTourContextType | undefined>(undefined);

export function OnboardingTourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(
    localStorage.getItem('nimbuswiz-tour-completed') === 'true'
  );

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setHasCompletedTour(true);
    localStorage.setItem('nimbuswiz-tour-completed', 'true');
  };

  const skipTour = () => {
    endTour();
  };

  return (
    <OnboardingTourContext.Provider
      value={{
        isActive,
        currentStep,
        steps: tourSteps,
        startTour,
        nextStep,
        prevStep,
        endTour,
        skipTour,
      }}
    >
      {children}
    </OnboardingTourContext.Provider>
  );
}

export function useOnboardingTour() {
  const context = useContext(OnboardingTourContext);
  if (context === undefined) {
    throw new Error('useOnboardingTour must be used within an OnboardingTourProvider');
  }
  return context;
}
