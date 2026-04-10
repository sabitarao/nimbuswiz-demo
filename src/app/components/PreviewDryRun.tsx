import { X, AlertTriangle, CheckCircle, Clock, Zap, Shield, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useABTest } from '../contexts/ABTestContext';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface PreviewDryRunProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  profileName: string;
  systemName: string;
}

export default function PreviewDryRun({
  isOpen,
  onClose,
  onConfirm,
  profileName,
  systemName,
}: PreviewDryRunProps) {
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const { getVariantValue } = useABTest();
  const { trackEvent } = useAnalytics();

  if (!isOpen) return null;

  const previewCTA = getVariantValue<string>('preview-cta');

  const handleRunSimulation = () => {
    setRunningSimulation(true);
    trackEvent('simulation_run', {
      profileName,
      systemName,
    });
    // Simulate dry-run execution
    setTimeout(() => {
      setRunningSimulation(false);
      setSimulationComplete(true);
    }, 2500);
  };

  const handleConfirm = () => {
    trackEvent('cta_clicked', {
      cta_location: 'preview_confirm',
      cta_text: previewCTA,
    });
    onConfirm();
  };

  const expectedChanges = [
    { type: 'upgrade', description: 'Core runtime: Nimbus2020 → Nimbus2024', impact: 'high' },
    { type: 'patch', description: 'Apply 14 security patches', impact: 'medium' },
    { type: 'config', description: 'Update 3 configuration files', impact: 'low' },
    { type: 'restart', description: 'Service restart required', impact: 'medium' },
  ];

  const safetyChecks = [
    { name: 'Dependency compatibility', status: 'passed', message: 'All dependencies compatible' },
    { name: 'Disk space available', status: 'passed', message: '47.2 GB free (32.1 GB required)' },
    { name: 'Backup verification', status: 'passed', message: 'Last backup: 2 hours ago' },
    { name: 'Quirk conflicts', status: 'warning', message: '1 quirk found and fixed automatically' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-2xl mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Preview & Dry-Run</h2>
              <p className="text-slate-600 mt-1">
                Review changes before applying <span className="font-medium">{profileName}</span> to{' '}
                <span className="font-medium">{systemName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Expected Changes */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Expected Changes</h3>
              <div className="space-y-2">
                {expectedChanges.map((change, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900">{change.description}</p>
                      <span
                        className={`inline-block text-xs mt-1 px-2 py-0.5 rounded ${
                          change.impact === 'high'
                            ? 'bg-red-100 text-red-700'
                            : change.impact === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {change.impact} impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Checks */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Automatic Safety Checks</h3>
              <div className="space-y-2">
                {safetyChecks.map((check, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      check.status === 'passed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    {check.status === 'passed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{check.name}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{check.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimates */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Estimated Downtime</span>
                </div>
                <p className="text-2xl font-semibold text-blue-900">~8 min</p>
                <p className="text-xs text-blue-700 mt-1">Schedule off-peak</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Performance Gain</span>
                </div>
                <p className="text-2xl font-semibold text-green-900">+19%</p>
                <p className="text-xs text-green-700 mt-1">Faster response time</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Risk Level</span>
                </div>
                <p className="text-2xl font-semibold text-purple-900">Low</p>
                <p className="text-xs text-purple-700 mt-1">92% confidence score</p>
              </div>
            </div>

            {/* Rollback Plan */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Automatic Rollback Plan</span>
              </div>
              <p className="text-sm text-slate-600">
                Auto-rollback in 3 min if issues detected. Backup: 2 hours ago.
              </p>
            </div>

            {/* Simulation */}
            {!simulationComplete && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Run Dry-Run Simulation</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Test this upgrade in a sandboxed environment (~30 seconds)
                    </p>
                  </div>
                  <button
                    onClick={handleRunSimulation}
                    disabled={runningSimulation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {runningSimulation ? 'Running...' : 'Run Simulation'}
                  </button>
                </div>
              </div>
            )}

            {simulationComplete && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">✓ Simulation Successful</p>
                    <p className="text-xs text-green-700 mt-1">
                      No errors detected. All systems functional after simulated upgrade. Ready to apply.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Save for Later
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {previewCTA}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}