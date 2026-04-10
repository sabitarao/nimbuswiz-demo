import { CheckCircle, Play, Sparkles, Rocket } from 'lucide-react';
import { useDemoData } from '../contexts/DemoDataContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useABTest } from '../contexts/ABTestContext';
import { Link } from 'react-router';

export default function FirstRunSetup() {
  const { completeFirstRun, toggleDemoMode, isDemoMode } = useDemoData();
  const { trackEvent } = useAnalytics();
  const { getVariantValue } = useABTest();

  const headlineCopy = getVariantValue<string>('first-run-headline');
  const demoCTA = getVariantValue<string>('empty-state-cta');

  const handleDemoToggle = () => {
    const newMode = !isDemoMode;
    trackEvent(newMode ? 'demo_mode_enabled' : 'demo_mode_disabled', {
      source: 'first_run_setup',
    });
    trackEvent('cta_clicked', {
      cta_location: 'first_run_demo',
      cta_text: demoCTA,
    });
    toggleDemoMode();
  };

  const handleDismiss = () => {
    trackEvent('onboarding_skipped', {
      source: 'first_run_setup',
    });
    completeFirstRun();
  };

  const steps = [
    {
      number: 1,
      title: 'Connect a System',
      description: isDemoMode ? 'Using demo fleet (6 systems)' : 'Register your first Nimbus system',
      completed: isDemoMode,
      icon: CheckCircle,
    },
    {
      number: 2,
      title: 'Run Fleet Scan',
      description: 'Analyze system health and dependencies',
      completed: false,
      icon: Play,
    },
    {
      number: 3,
      title: 'View Recommendations',
      description: 'See intelligent upgrade suggestions',
      completed: false,
      icon: Sparkles,
    },
    {
      number: 4,
      title: 'Apply or Preview',
      description: 'Deploy a safe profile or run simulation',
      completed: false,
      icon: Rocket,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{headlineCopy}</h2>
          <p className="text-blue-100">
            See stability insights in under 3 minutes—try our demo or connect your first system
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-sm text-blue-200 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`p-4 rounded-lg ${
                step.completed ? 'bg-blue-700' : 'bg-blue-700/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    step.completed ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                >
                  {step.completed ? '✓' : step.number}
                </div>
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
              <p className="text-xs text-blue-200">{step.description}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {!isDemoMode ? (
          <>
            <button
              onClick={handleDemoToggle}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              {demoCTA}
            </button>
            <Link
              to="/systems"
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium border border-blue-500"
            >
              Register Your First System
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/advisor"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Sparkles className="w-5 h-5" />
              View Recommendations
            </Link>
            <Link
              to="/systems"
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium border border-blue-500"
            >
              Explore Demo Fleet
            </Link>
            <button
              onClick={handleDemoToggle}
              className="text-sm text-blue-200 hover:text-white transition-colors px-4"
            >
              Switch to Real Data
            </button>
          </>
        )}
      </div>
    </div>
  );
}