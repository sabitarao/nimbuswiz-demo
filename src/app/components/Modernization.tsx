import { Zap, Shield, Clock, CheckCircle, TrendingUp, AlertTriangle, Play, Loader2 } from "lucide-react";
import { useState } from "react";

const profiles = [
  {
    id: "stable",
    name: "Stable",
    icon: Shield,
    description: "Prioritizes stability and reliability with conservative upgrade paths",
    recommended: true,
    metrics: {
      stability: { current: 76, projected: 88, change: "+12" },
      responsiveness: { current: 79, projected: 82, change: "+3" },
      network: { current: 74, projected: 76, change: "+2" },
    },
    risk: "low",
    features: [
      "Conservative version upgrades",
      "Extensive compatibility testing",
      "Gradual rollout strategy",
      "Enhanced monitoring and rollback",
      "Minimal breaking changes",
    ],
    timeline: "2-3 weeks",
  },
  {
    id: "performance",
    name: "Performance",
    icon: Zap,
    description: "Optimizes for maximum speed and efficiency with latest features",
    recommended: false,
    metrics: {
      stability: { current: 76, projected: 82, change: "+6" },
      responsiveness: { current: 79, projected: 94, change: "+15" },
      network: { current: 74, projected: 89, change: "+15" },
    },
    risk: "medium",
    features: [
      "Latest performance optimizations",
      "Advanced caching strategies",
      "Network protocol upgrades",
      "Resource usage optimization",
      "Parallel processing enhancements",
    ],
    timeline: "3-4 weeks",
  },
  {
    id: "extended",
    name: "Extended Operation",
    icon: Clock,
    description: "Extends system lifecycle with long-term support and maintenance",
    recommended: false,
    metrics: {
      stability: { current: 76, projected: 92, change: "+16" },
      responsiveness: { current: 79, projected: 81, change: "+2" },
      network: { current: 74, projected: 75, change: "+1" },
    },
    risk: "low",
    features: [
      "Long-term support (LTS) versions",
      "Extended security patches",
      "Backward compatibility focus",
      "Predictable maintenance schedule",
      "Legacy system integration",
    ],
    timeline: "4-6 weeks",
  },
];

const simChecks = [
  { name: "Dependency compatibility", status: "passed" as const, message: "All dependencies compatible with target version" },
  { name: "Disk space available", status: "passed" as const, message: "47.2 GB free — 32.1 GB required" },
  { name: "Backup verification", status: "passed" as const, message: "Latest backup: 2 hours ago" },
  { name: "Quirk conflicts", status: "warning" as const, message: "1 quirk detected — will be auto-fixed during upgrade" },
];

export default function Modernization() {
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "passed">("idle");
  const [appliedProfile, setAppliedProfile] = useState<string | null>(null);

  const runSimulation = () => {
    setSimStatus("running");
    setTimeout(() => setSimStatus("passed"), 2500);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Upgrade Profiles</h1>
        <p className="text-slate-600 mt-1">Choose your upgrade strategy based on risk tolerance and performance goals</p>
      </div>

      {/* Profile Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium">Recommended Profile</p>
            <p className="text-sm text-blue-700 mt-1">
              Based on your current system health and risk assessment, the <strong>Stable</strong> profile
              delivers optimal results with minimal disruption.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`bg-white rounded-lg border-2 ${
              profile.recommended ? "border-blue-600" : "border-slate-200"
            } overflow-hidden`}
          >
            {profile.recommended && (
              <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">Recommended</div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                  <profile.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{profile.name}</h3>
                  <span
                    className={`inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs ${
                      profile.risk === "low"
                        ? "bg-green-100 text-green-700"
                        : profile.risk === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {profile.risk.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 mb-6">{profile.description}</p>

              {/* Metrics Impact */}
              <div className="mb-6 space-y-3">
                <h4 className="text-sm font-semibold text-slate-900">Impact on Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Stability</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-900">
                        {profile.metrics.stability.current} → {profile.metrics.stability.projected}
                      </span>
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {profile.metrics.stability.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Responsiveness</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-900">
                        {profile.metrics.responsiveness.current} → {profile.metrics.responsiveness.projected}
                      </span>
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {profile.metrics.responsiveness.change}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Network</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-900">
                        {profile.metrics.network.current} → {profile.metrics.network.projected}
                      </span>
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {profile.metrics.network.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {profile.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="mb-6 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Estimated Timeline</span>
                  <span className="text-sm text-slate-900 font-medium">{profile.timeline}</span>
                </div>
              </div>

              {/* Action Button */}
              {appliedProfile === profile.id ? (
                <div className="w-full py-2.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {profile.name} Profile Applied
                </div>
              ) : simStatus === "passed" ? (
                <button
                  onClick={() => setAppliedProfile(profile.id)}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                    profile.recommended
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Apply {profile.name} Profile
                </button>
              ) : (
                <button
                  disabled
                  title="Run the simulation below first"
                  className="w-full py-2.5 rounded-lg font-medium bg-slate-100 text-slate-400 cursor-not-allowed"
                >
                  Apply {profile.name} Profile
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simulation Checkpoint */}
      <div
        className={`rounded-lg border-2 p-6 transition-colors ${
          simStatus === "passed" ? "border-green-300 bg-green-50" : "border-slate-200 bg-slate-50"
        }`}
      >
        {simStatus === "passed" ? (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-900">
                Simulation passed — 1 quirk auto-fixed, safe to proceed
              </p>
              <p className="text-xs text-green-700 mt-0.5">Select a profile above and apply when ready.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Before you apply</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Run a simulation first. A passing simulation confirms the upgrade is safe to apply.
                </p>
              </div>
              <div className="flex-shrink-0">
                {simStatus === "running" ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Simulating…
                  </div>
                ) : (
                  <button
                    onClick={runSimulation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    Run it for me
                  </button>
                )}
              </div>
            </div>

            {/* Pre-computed safety checks */}
            <div className="grid grid-cols-2 gap-2">
              {simChecks.map((check, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    check.status === "passed" ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                  }`}
                >
                  {check.status === "passed" ? (
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-slate-900">{check.name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{check.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Feature</th>
                <th className="text-center py-3 px-4 text-sm text-slate-600">Stable</th>
                <th className="text-center py-3 px-4 text-sm text-slate-600">Performance</th>
                <th className="text-center py-3 px-4 text-sm text-slate-600">Extended Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm text-slate-900">Stability Improvement</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+12 points</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+6 points</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+16 points</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm text-slate-900">Performance Gain</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+3 points</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+15 points</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">+2 points</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm text-slate-900">Risk Level</td>
                <td className="py-3 px-4 text-center">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Low</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">Medium</span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Low</span>
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm text-slate-900">Timeline</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">2-3 weeks</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">3-4 weeks</td>
                <td className="py-3 px-4 text-center text-sm text-slate-900">4-6 weeks</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 px-4 text-sm text-slate-900">Rollback Support</td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">What Happens Next?</h3>
          <ol className="space-y-2 list-decimal list-inside text-sm text-slate-600">
            <li>Profile configuration and validation</li>
            <li>Automated compatibility checks</li>
            <li>Staged deployment preparation</li>
            <li>Monitoring and health checks</li>
            <li>Final deployment and verification</li>
          </ol>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Support & Documentation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Upgrade guide and best practices
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              24/7 technical support during upgrade
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Automated rollback capabilities
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              Post-upgrade optimization assistance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
