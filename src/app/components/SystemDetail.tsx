import { useParams, Link } from "react-router";
import { ArrowLeft, Activity, AlertCircle, Database, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const systemData = {
  "nimbus-lion": {
    name: "nimbus-lion",
    status: "healthy",
    stability: 85,
    serialNumber: "NMB-2024-1147",
    version: "Nimbus2024",
    manufacturingYear: 2024,
    flightHours: 1247,
    maxVelocity: 87,
    handlingScore: 85,
    acceleration: "Fast",
    usageType: "Racing",
    location: "Facility A - Hangar 3",
    lastServiceDate: "2026-03-23",
    nextServiceDue: "2026-06-23",
    serviceHistory: 3,
    safetyCertification: "Valid",
    knownIssues: "Minor tail brush wear",
    compatibility: "All Nimbus2020+ upgrades",
    registeredDate: "2025-01-15",
    upgradeProfile: "Stable",
  },
};

const metricsData = [
  { time: "00:00", cpu: 45, memory: 62, network: 38 },
  { time: "04:00", cpu: 52, memory: 65, network: 42 },
  { time: "08:00", cpu: 68, memory: 71, network: 55 },
  { time: "12:00", cpu: 75, memory: 78, network: 62 },
  { time: "16:00", cpu: 71, memory: 74, network: 58 },
  { time: "20:00", cpu: 58, memory: 68, network: 48 },
];

const dependencies = [
  { name: "core-flight-module", version: "v2.4.1", status: "current" },
  { name: "nimbus-stability-lib", version: "v3.1.0", status: "current" },
  { name: "network-sync-adapter", version: "v1.8.2", status: "outdated" },
  { name: "telemetry-collector", version: "v2.0.5", status: "current" },
  { name: "legacy-compat-layer", version: "v1.5.1", status: "deprecated" },
];

const alerts = [
  { severity: "warning", message: "Memory usage above 75% threshold", time: "2 hours ago" },
  { severity: "info", message: "Scheduled scan completed successfully", time: "5 hours ago" },
];

const logs = [
  { timestamp: "2026-03-25 14:32:15", level: "INFO", message: "System health check passed" },
  { timestamp: "2026-03-25 14:15:42", level: "WARN", message: "Memory usage elevated: 78%" },
  { timestamp: "2026-03-25 13:58:11", level: "INFO", message: "Dependency scan completed" },
  { timestamp: "2026-03-25 13:45:03", level: "INFO", message: "Network sync successful" },
  { timestamp: "2026-03-25 13:30:22", level: "ERROR", message: "Legacy adapter deprecated warning" },
];

export default function SystemDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const system = systemData[id as keyof typeof systemData] || systemData["nimbus-lion"];

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "dependencies", label: "Dependencies", icon: Database },
    { id: "metrics", label: "Metrics", icon: Activity },
    { id: "logs", label: "Logs", icon: FileText },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link to="/systems" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Systems
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{system.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  system.status === "healthy"
                    ? "bg-green-100 text-green-700"
                    : system.status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                ● {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
              </span>
              <span className="text-sm text-slate-600">{system.usageType}</span>
              <span className="text-sm text-slate-600">Location: {system.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Run Scan
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Upgrade System
            </button>
          </div>
        </div>
      </div>

      {/* System Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Stability Score</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{system.stability}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Current Version</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{system.version}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Upgrade Profile</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{system.upgradeProfile}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Registered</p>
          <p className="text-lg font-semibold text-slate-900 mt-1">{system.registeredDate}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="border-b border-slate-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">System Metadata</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Core Information</h4>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">System ID</span>
                      <span className="text-sm text-slate-900 font-medium">{system.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Serial Number</span>
                      <span className="text-sm text-slate-900 font-medium">{system.serialNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Version</span>
                      <span className="text-sm text-slate-900 font-medium">{system.version}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Manufacturing Year</span>
                      <span className="text-sm text-slate-900 font-medium">{system.manufacturingYear}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Usage Type</span>
                      <span className="text-sm text-slate-900 font-medium">{system.usageType}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Location</span>
                      <span className="text-sm text-slate-900 font-medium">{system.location}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Performance Metrics</h4>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Flight Hours</span>
                      <span className="text-sm text-slate-900 font-medium">{system.flightHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Max Velocity</span>
                      <span className="text-sm text-slate-900 font-medium">{system.maxVelocity}/100</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Handling Score</span>
                      <span className="text-sm text-slate-900 font-medium">{system.handlingScore}/100</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Acceleration</span>
                      <span className="text-sm text-slate-900 font-medium">{system.acceleration}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Stability Score</span>
                      <span className="text-sm text-slate-900 font-medium">{system.stability}/100</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Service & Safety</h4>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Last Service</span>
                      <span className="text-sm text-slate-900 font-medium">{system.lastServiceDate}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Next Service Due</span>
                      <span className="text-sm text-slate-900 font-medium">{system.nextServiceDue}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Service History</span>
                      <span className="text-sm text-slate-900 font-medium">{system.serviceHistory} repairs</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Safety Certification</span>
                      <span className={`text-sm font-medium ${system.safetyCertification === 'Valid' ? 'text-green-700' : 'text-red-700'}`}>{system.safetyCertification}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Known Issues</span>
                      <span className="text-sm text-slate-900 font-medium">{system.knownIssues}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600">Compatibility</span>
                      <span className="text-sm text-slate-900 font-medium">{system.compatibility}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        alert.severity === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle
                          className={`w-5 h-5 mt-0.5 ${
                            alert.severity === "warning" ? "text-yellow-600" : "text-blue-600"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">{alert.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dependencies Tab */}
          {activeTab === "dependencies" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Dependencies</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Package Name</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Version</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependencies.map((dep, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm text-slate-900 font-medium">{dep.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{dep.version}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              dep.status === "current"
                                ? "bg-green-100 text-green-700"
                                : dep.status === "outdated"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {dep.status.charAt(0).toUpperCase() + dep.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === "metrics" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics (Last 24 Hours)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line key="cpu-line" type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} name="CPU Usage %" />
                  <Line key="memory-line" type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} name="Memory Usage %" />
                  <Line key="network-line" type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2} name="Network %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">System Logs</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="py-1">
                    <span className="text-slate-400">{log.timestamp}</span>
                    <span
                      className={`ml-3 ${
                        log.level === "ERROR"
                          ? "text-red-400"
                          : log.level === "WARN"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      [{log.level}]
                    </span>
                    <span className="ml-3 text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}