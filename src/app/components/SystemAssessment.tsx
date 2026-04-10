import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const riskAssessment = [
  {
    component: "core-flight-module",
    risk: "low",
    currentVersion: "v2.4.1",
    recommendedVersion: "v2.5.0",
    recommendation: "Minor update available - optional upgrade",
  },
  {
    component: "network-sync-adapter",
    risk: "medium",
    currentVersion: "v1.8.2",
    recommendedVersion: "v2.0.0",
    recommendation: "Performance improvements and bug fixes available",
  },
  {
    component: "legacy-compat-layer",
    risk: "high",
    currentVersion: "v1.5.1",
    recommendedVersion: "v2.0.0",
    recommendation: "Critical security patches - immediate upgrade recommended",
  },
  {
    component: "telemetry-collector",
    risk: "low",
    currentVersion: "v2.0.5",
    recommendedVersion: "v2.0.5",
    recommendation: "Up to date - no action required",
  },
  {
    component: "stability-analyzer",
    risk: "medium",
    currentVersion: "v3.1.2",
    recommendedVersion: "v3.2.0",
    recommendation: "Enhanced stability features available",
  },
  {
    component: "nimbus-runtime",
    risk: "high",
    currentVersion: "v2.0.0",
    recommendedVersion: "v2.6.0",
    recommendation: "Multiple versions behind - modernization required",
  },
];

const dependencyGraph = {
  nodes: [
    { id: "system", label: "nimbus-lion", level: 0 },
    { id: "core", label: "core-flight-module", level: 1 },
    { id: "network", label: "network-sync-adapter", level: 1 },
    { id: "stability", label: "nimbus-stability-lib", level: 1 },
    { id: "telemetry", label: "telemetry-collector", level: 2 },
    { id: "legacy", label: "legacy-compat-layer", level: 2 },
  ],
};

export default function SystemAssessment() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">System Assessment</h1>
        <p className="text-slate-600 mt-1">Analyze system dependencies and identify modernization opportunities</p>
      </div>

      {/* Assessment Summary */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">High Risk Components</p>
              <p className="text-3xl font-semibold text-red-600 mt-2">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Require immediate attention</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Medium Risk Components</p>
              <p className="text-3xl font-semibold text-yellow-600 mt-2">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Recommended upgrades available</p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Up to Date Components</p>
              <p className="text-3xl font-semibold text-green-600 mt-2">2</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">No action required</p>
        </div>
      </div>

      {/* Dependency Graph Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Dependency Graph</h2>
        <div className="bg-slate-50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-6 w-full max-w-4xl">
            {/* Level 0 - System */}
            <div className="flex justify-center">
              <div className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md">
                nimbus-lion
              </div>
            </div>

            {/* Connector lines */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-slate-300" />
            </div>

            {/* Level 1 - Direct Dependencies */}
            <div className="flex justify-center gap-8">
              {["core-flight-module", "network-sync-adapter", "nimbus-stability-lib"].map((dep) => (
                <div key={dep} className="flex flex-col items-center gap-2">
                  <div className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-sm">
                    {dep}
                  </div>
                  <div className="w-px h-8 bg-slate-300" />
                </div>
              ))}
            </div>

            {/* Level 2 - Nested Dependencies */}
            <div className="flex justify-center gap-6">
              {["telemetry-collector", "legacy-compat-layer"].map((dep) => (
                <div key={dep} className="px-3 py-2 bg-white border border-slate-200 rounded text-xs text-slate-600">
                  {dep}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4 text-center">
          Visual representation of system dependencies and their relationships
        </p>
      </div>

      {/* Risk Heatmap Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Risk Heatmap & Recommendations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Component</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Risk Level</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Current Version</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Recommended Version</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {riskAssessment.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-sm text-slate-900 font-medium">{item.component}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        item.risk === "high"
                          ? "bg-red-100 text-red-700"
                          : item.risk === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.risk === "high" && "● High"}
                      {item.risk === "medium" && "● Medium"}
                      {item.risk === "low" && "● Low"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{item.currentVersion}</td>
                  <td className="py-4 px-4 text-sm text-slate-900 font-medium">{item.recommendedVersion}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{item.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Ready to Modernize?</h3>
            <p className="text-blue-100 mt-1">
              Based on this assessment, we recommend applying an upgrade profile to address identified risks.
            </p>
          </div>
          <Link
            to="/modernization"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Proceed to Modernization
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Scan Information */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Scan Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Last Scan</span>
              <span className="text-sm text-slate-900 font-medium">2026-03-25 14:30:00</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Scan Duration</span>
              <span className="text-sm text-slate-900 font-medium">2m 34s</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Scan Type</span>
              <span className="text-sm text-slate-900 font-medium">Full System Analysis</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Components Analyzed</span>
              <span className="text-sm text-slate-900 font-medium">6</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Vulnerabilities Found</span>
              <span className="text-sm text-slate-900 font-medium">2 Critical, 3 Medium</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Next Scheduled Scan</span>
              <span className="text-sm text-slate-900 font-medium">2026-03-26 14:30:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}