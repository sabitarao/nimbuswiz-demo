import { useOnboardingTour } from '../contexts/OnboardingTourContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useABTest } from '../contexts/ABTestContext';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';

export default function OnboardingTour() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTour } = useOnboardingTour();
  const { trackEvent } = useAnalytics();
  const { getVariantValue } = useABTest();
  const navigate = useNavigate();
  const location = useLocation();

  const currentStepData = steps[currentStep];
  const skipCopy = getVariantValue<string>('onboarding-skip');

  // Navigate to the step's route when step changes
  useEffect(() => {
    if (isActive && currentStepData?.route && location.pathname !== currentStepData.route) {
      navigate(currentStepData.route);
    }
  }, [currentStep, isActive, currentStepData, navigate, location]);

  // Track step completion
  useEffect(() => {
    if (isActive) {
      trackEvent('onboarding_step_completed', {
        step: currentStep + 1,
        stepId: currentStepData?.id,
        stepTitle: currentStepData?.title,
      });
    }
  }, [currentStep, isActive, currentStepData, trackEvent]);

  const handleSkip = () => {
    trackEvent('onboarding_skipped', {
      step: currentStep + 1,
      totalSteps: steps.length,
    });
    skipTour();
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      trackEvent('onboarding_completed', {
        totalSteps: steps.length,
      });
    }
    nextStep();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-300" />

      {/* Tour Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="bg-white rounded-xl shadow-2xl p-6 mx-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{currentStepData.title}</h3>
                <p className="text-xs text-slate-500">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <p className="text-slate-700 mb-6">{currentStepData.description}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {skipCopy}
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}