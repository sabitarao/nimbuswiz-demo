import { Sparkles, TrendingUp, ArrowRight, AlertTriangle, CheckCircle, Info, Eye } from "lucide-react";
import { Link } from "react-router";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { useUserRole } from "../contexts/UserRoleContext";
import { useToast } from "../contexts/ToastContext";
import { useABTest } from "../contexts/ABTestContext";
import { useAnalytics } from "../contexts/AnalyticsContext";
import PreviewDryRun from "./PreviewDryRun";
import { InfoTooltip } from "./Tooltip";

const riskPerformanceData = [
  { risk: 15, performance: 85, label: "Upgrade", recommended: true },
  { risk: 28, performance: 65, label: "Partial Modernization", recommended: false },
  { risk: 45, performance: 95, label: "Replace", recommended: false },
];

const systemRecommendations = [
  {
    system: "nimbus-lion",
    recommendation: "Performance Upgrade",
    confidence: 87,
    currentState: { stability: 85, performance: 79, network: 74 },
    projectedState: { stability: 88, performance: 94, network: 89 },
    reason: "System shows consistent behavioral patterns with minimal drift anomalies",
  },
  {
    system: "nimbus-dragon",
    recommendation: "Extended Operation",
    confidence: 92,
    currentState: { stability: 58, performance: 62, network: 55 },
    projectedState: { stability: 92, performance: 65, network: 58 },
    reason: "High-risk profile requires stability-focused preservation approach",
  },
  {
    system: "nimbus-eagle",
    recommendation: "Partial Modernization",
    confidence: 74,
    currentState: { stability: 72, performance: 75, network: 68 },
    projectedState: { stability: 82, performance: 78, network: 72 },
    reason: "Complex dependency chain suggests incremental modernization pathway",
  },
];

const tradeoffFactors = [
  { factor: "System Quirks", impact: "Medium", weight: 35 },
  { factor: "Dependency Risks", impact: "Low", weight: 25 },
  { factor: "Usage Patterns", impact: "High", weight: 40 },
];

export default function ModernizationAdvisor() {
  const primaryRecommendation = systemRecommendations[0];
  const { role, canApply } = useUserRole();
  const { showToast, showSuccessWithUndo } = useToast();
  const { getVariantValue } = useABTest();
  const { trackEvent } = useAnalytics();
  const [showPreview, setShowPreview] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [overrideOption, setOverrideOption] = useState("Extended Operation");
  const [overrideReason, setOverrideReason] = useState("");

  const ctaCopy = getVariantValue<string>('cta-apply-upgrade');
  const badgeCopy = getVariantValue<string>('recommendation-badge');

  const handlePreview = () => {
    trackEvent('preview_opened', {
      profileName: 'Performance Upgrade',
      systemName: 'nimbus-lion',
    });
    setShowPreview(true);
  };

  const handleApply = () => {
    trackEvent('upgrade_applied', {
      profileName: 'Performance Upgrade',
      systemName: 'nimbus-lion',
      confidence: 87,
    });
    showSuccessWithUndo(
      'Upgrade applied—undo within 5s if needed',
      () => {
        trackEvent('upgrade_undone', {
          profileName: 'Performance Upgrade',
          systemName: 'nimbus-lion',
        });
        showToast('info', 'Upgrade rolled back successfully');
      }
    );
    setShowPreview(false);
  };

  const handleCTAClick = () => {
    trackEvent('cta_clicked', {
      cta_location: 'advisor_primary',
      cta_text: ctaCopy,
      user_role: role,
    });
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Modernization Advisor</h1>
        <p className="text-slate-600 mt-1">
          Intelligent upgrade recommendations based on system behavior, dependencies, and usage patterns
        </p>
      </div>

      {/* Primary Recommendation Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Recommended: Performance Upgrade</h2>
            </div>
            <p className="text-blue-100 mb-4">
              Analyzed system behavior, dependency risks, and usage patterns to find the safest, fastest upgrade path
            </p>
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-blue-200">Recommendation Confidence</p>
                  <InfoTooltip
                    title="Confidence Score"
                    description="How much data the Advisor has available. Below 60% means it needs more scans or a Flight Profile to improve its recommendation."
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="relative w-32 h-2 bg-blue-800 rounded-full">
                    <div className="w-[87%] h-full bg-white rounded-full" />
                    {/* 90% threshold marker */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-yellow-300 opacity-80" style={{ left: "90%" }} />
                  </div>
                  <span className="text-lg font-semibold">87%</span>
                </div>
                <button
                  onClick={handlePreview}
                  className="mt-1 text-xs text-blue-200 hover:text-white underline underline-offset-2"
                >
                  What would raise this?
                </button>
              </div>
              <div>
                <p className="text-sm text-blue-200">Affected Systems</p>
                <p className="text-lg font-semibold mt-1">1 system</p>
              </div>
              <div>
                <p className="text-sm text-blue-200">Expected Improvement</p>
                <p className="text-lg font-semibold mt-1">+19% faster response time</p>
              </div>
            </div>
          </div>
          <Link
            to="/modernization"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            onClick={handleCTAClick}
          >
            {ctaCopy}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Override recommendation */}
      <div>
        {!showOverride ? (
          <button
            onClick={() => setShowOverride(true)}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            Disagree with this recommendation?
          </button>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Override to a different path</h4>
            <div className="mb-3">
              <select
                value={overrideOption}
                onChange={(e) => setOverrideOption(e.target.value)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-900"
              >
                <option>Extended Operation</option>
                <option>Partial Modernization</option>
                <option>Replace (Nimbus2026)</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Reason (saved to audit log)"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-3"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (overrideReason.trim()) {
                    showToast("success", `Override to ${overrideOption} saved to audit log`);
                    setShowOverride(false);
                    setOverrideReason("");
                  }
                }}
                disabled={!overrideReason.trim()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save override to audit
              </button>
              <button
                onClick={() => { setShowOverride(false); setOverrideReason(""); }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Options Comparison */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Decision Options Analysis</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Upgrade Option */}
          <div className="p-5 border-2 border-blue-600 bg-blue-50 rounded-lg relative">
            <div className="absolute -top-3 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
              {badgeCopy}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Upgrade</h3>
            <p className="text-sm text-slate-600 mb-4">Apply modernization profile to existing system</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Risk Level</span>
                <span className="text-sm font-medium text-green-600">Low (15%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Performance Gain</span>
                <span className="text-sm font-medium text-slate-900">+19%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Timeline</span>
                <span className="text-sm font-medium text-slate-900">2-3 weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cost Impact</span>
                <span className="text-sm font-medium text-slate-900">Low</span>
              </div>
            </div>
            <div className="pt-3 border-t border-blue-200 space-y-2">
              <p className="text-xs text-slate-600">
                <strong>Best for:</strong> Stable systems with predictable behavior
              </p>
              <div className="p-2 bg-blue-100 rounded text-xs text-blue-900">
                <span className="font-medium">Why this scores high:</span> Usage Patterns (40% weight) — 90-day load profile shows stable, predictable demand with no drift anomalies.
              </div>
            </div>
          </div>

          {/* Partial Modernization */}
          <div className="p-5 border border-slate-200 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Partial Modernization</h3>
            <p className="text-sm text-slate-600 mb-4">Incremental updates to critical components</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Risk Level</span>
                <span className="text-sm font-medium text-yellow-600">Medium (28%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Performance Gain</span>
                <span className="text-sm font-medium text-slate-900">+12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Timeline</span>
                <span className="text-sm font-medium text-slate-900">4-6 weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cost Impact</span>
                <span className="text-sm font-medium text-slate-900">Medium</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <p className="text-xs text-slate-600">
                <strong>Best for:</strong> Complex systems with high dependency chains
              </p>
              <div className="p-2 bg-slate-100 rounded text-xs text-slate-700">
                <span className="font-medium">Why this is limited:</span> Dependency Risks (25% weight) — 8 interdependencies detected. Full upgrade carries too much chain risk.
              </div>
            </div>
          </div>

          {/* Replace */}
          <div className="p-5 border border-slate-200 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Replace (Nimbus2026)</h3>
            <p className="text-sm text-slate-600 mb-4">Full system replacement with latest version</p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Risk Level</span>
                <span className="text-sm font-medium text-red-600">High (45%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Performance Gain</span>
                <span className="text-sm font-medium text-slate-900">+38%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Timeline</span>
                <span className="text-sm font-medium text-slate-900">8-12 weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Cost Impact</span>
                <span className="text-sm font-medium text-slate-900">High</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <p className="text-xs text-slate-600">
                <strong>Best for:</strong> Systems beyond viable modernization
              </p>
              <div className="p-2 bg-red-50 rounded text-xs text-red-800">
                <span className="font-medium">Why this is high risk:</span> System Quirks (35% weight) — 14 behavioral anomalies exceed the upgrade compatibility threshold.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk vs Performance Tradeoff */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Risk vs Performance Tradeoff</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="risk"
              name="Risk"
              unit="%"
              stroke="#64748b"
              label={{ value: "Risk Level", position: "insideBottom", offset: -10 }}
            />
            <YAxis
              type="number"
              dataKey="performance"
              name="Performance"
              unit="%"
              stroke="#64748b"
              label={{ value: "Performance Gain", angle: -90, position: "insideLeft" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="Options" data={riskPerformanceData} fill="#3b82f6">
              {riskPerformanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.recommended ? "#3b82f6" : "#94a3b8"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 flex items-center justify-center gap-6">
          {riskPerformanceData.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${option.recommended ? "bg-blue-600" : "bg-slate-400"}`} />
              <span className="text-sm text-slate-600">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Why We Recommend This</h3>
            <p className="text-sm text-slate-700 mb-4">
              We've analyzed your system's behavior patterns, dependencies, and usage to recommend the safest, fastest upgrade path. Each factor is weighted by its impact on modernization success.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {tradeoffFactors.map((factor, index) => (
            <div key={index} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">{factor.factor}</span>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      factor.impact === "High"
                        ? "bg-red-100 text-red-700"
                        : factor.impact === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {factor.impact} Impact
                  </span>
                  <span className="text-sm text-slate-600">{factor.weight}% weight</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${factor.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System-Specific Recommendations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System-Specific Recommendations</h2>
        <div className="space-y-4">
          {systemRecommendations.map((system, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{system.system}</h3>
                  <p className="text-xs text-slate-600 mt-1">{system.reason}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {system.recommendation}
                  </span>
                  <p className="text-xs text-slate-600 mt-1">{system.confidence}% confidence</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-600 mb-2">Stability</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900">{system.currentState.stability}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-green-600 font-medium">{system.projectedState.stability}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">Performance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900">{system.currentState.performance}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-green-600 font-medium">{system.projectedState.performance}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-2">Network</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900">{system.currentState.network}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-green-600 font-medium">{system.projectedState.network}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Next Steps</h2>
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/modernization"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
          >
            <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Apply Recommendation</h3>
            <p className="text-xs text-slate-600">Configure and deploy recommended profile</p>
          </Link>
          <button
            onClick={handlePreview}
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
          >
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Run Simulation</h3>
            <p className="text-xs text-slate-600">Preview impact before applying changes</p>
          </button>
          <Link
            to="/assessment"
            className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors"
          >
            <AlertTriangle className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Review Risk Analysis</h3>
            <p className="text-xs text-slate-600">Deep dive into dependency and quirk risks</p>
          </Link>
        </div>
      </div>

      {/* Preview/Dry-Run Modal */}
      <PreviewDryRun
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleApply}
        profileName="Performance Upgrade"
        systemName="nimbus-lion"
      />
    </div>
  );
}