import { Search, Filter, Download, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

const logs = [
  { timestamp: "2026-03-25 14:45:32", level: "ERROR", system: "nimbus-dragon", message: "Legacy adapter initialization failed - deprecated version detected" },
  { timestamp: "2026-03-25 14:44:18", level: "WARN", system: "nimbus-stag", message: "Memory usage at 78% - approaching threshold" },
  { timestamp: "2026-03-25 14:43:05", level: "INFO", system: "nimbus-eagle", message: "System scan completed successfully in 142ms" },
  { timestamp: "2026-03-25 14:41:52", level: "INFO", system: "nimbus-lion", message: "Network sync completed - 42 endpoints synchronized" },
  { timestamp: "2026-03-25 14:40:28", level: "WARN", system: "nimbus-dragon", message: "Stability index below optimal range: 58" },
  { timestamp: "2026-03-25 14:39:15", level: "ERROR", system: "nimbus-dragon", message: "Dependency resolution failed for network-sync-adapter v1.8.2" },
  { timestamp: "2026-03-25 14:38:03", level: "INFO", system: "nimbus-fawkes", message: "Health check passed - all metrics within normal range" },
  { timestamp: "2026-03-25 14:36:47", level: "INFO", system: "nimbus-lion", message: "Automated backup completed successfully" },
  { timestamp: "2026-03-25 14:35:22", level: "WARN", system: "nimbus-eagle", message: "Response time increased by 12% over baseline" },
  { timestamp: "2026-03-25 14:34:10", level: "INFO", system: "nimbus-eagle", message: "Upgrade profile 'Performance' applied successfully" },
  { timestamp: "2026-03-25 14:32:58", level: "ERROR", system: "nimbus-dragon", message: "Critical: System requires immediate attention" },
  { timestamp: "2026-03-25 14:31:42", level: "INFO", system: "nimbus-stag", message: "Deployment validation completed" },
];

const commonIssues = [
  {
    title: "System Stability Below Threshold",
    severity: "critical",
    occurrences: 3,
    affectedSystems: ["nimbus-dragon"],
    lastSeen: "1 hour ago",
  },
  {
    title: "Memory Usage Warning",
    severity: "warning",
    occurrences: 12,
    affectedSystems: ["nimbus-stag", "nimbus-eagle"],
    lastSeen: "3 hours ago",
  },
  {
    title: "Deprecated Dependency",
    severity: "warning",
    occurrences: 5,
    affectedSystems: ["nimbus-dragon", "nimbus-eagle"],
    lastSeen: "5 hours ago",
  },
];

const suggestedFixes = [
  {
    issue: "System Stability Below Threshold",
    fixes: [
      "Run comprehensive system scan to identify root cause",
      "Apply Extended Operation upgrade profile for enhanced stability",
      "Review and update deprecated dependencies",
      "Consider temporary capacity increase during peak hours",
    ],
  },
  {
    issue: "Memory Usage Warning",
    fixes: [
      "Review application memory allocation settings",
      "Clear temporary cache and log files",
      "Optimize query performance to reduce memory overhead",
      "Schedule memory cleanup during off-peak hours",
    ],
  },
  {
    issue: "Deprecated Dependency",
    fixes: [
      "Update to latest compatible version via Modernization profile",
      "Review breaking changes in migration guide",
      "Test updated dependency in staging environment first",
      "Plan maintenance window for production upgrade",
    ],
  },
];

export default function Troubleshooting() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSystem, setSelectedSystem] = useState("all");

  const filteredLogs = logs.filter((log) => {
    if (selectedLevel !== "all" && log.level !== selectedLevel) return false;
    if (selectedSystem !== "all" && log.system !== selectedSystem) return false;
    return true;
  });

  const systems = Array.from(new Set(logs.map((log) => log.system)));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Troubleshooting</h1>
        <p className="text-slate-600 mt-1">Diagnose issues, view system logs, and apply recommended fixes</p>
      </div>

      {/* Common Issues */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Issues</h2>
        <div className="space-y-3">
          {commonIssues.map((issue, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                issue.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle
                      className={`w-5 h-5 ${
                        issue.severity === "critical" ? "text-red-600" : "text-yellow-600"
                      }`}
                    />
                    <h3 className="text-sm font-semibold text-slate-900">{issue.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        issue.severity === "critical"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-8 space-y-1">
                    <p className="text-sm text-slate-600">
                      Affected systems: {issue.affectedSystems.join(", ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {issue.occurrences} occurrences • Last seen: {issue.lastSeen}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-white transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Fixes */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Suggested Fixes</h2>
        <div className="space-y-4">
          {suggestedFixes.map((suggestion, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <h3 className="text-sm font-semibold text-slate-900">{suggestion.issue}</h3>
              </div>
              <ul className="ml-8 space-y-2">
                {suggestion.fixes.map((fix, fixIndex) => (
                  <li key={fixIndex} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Log Viewer */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">System Logs</h2>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
            </select>
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Systems</option>
              {systems.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Log Display */}
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
          {filteredLogs.map((log, index) => (
            <div key={index} className="py-1 hover:bg-slate-800 transition-colors">
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
              <span className="ml-3 text-blue-400">{log.system}</span>
              <span className="ml-3 text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredLogs.length} of {logs.length} log entries
        </div>
      </div>

      {/* Diagnostic Tools */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Diagnostic Tools</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">System Health Check</h3>
            <p className="text-xs text-slate-600">Run comprehensive diagnostics on all systems</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Network Diagnostics</h3>
            <p className="text-xs text-slate-600">Test connectivity and latency issues</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Performance Profiler</h3>
            <p className="text-xs text-slate-600">Analyze resource usage and bottlenecks</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Dependency Checker</h3>
            <p className="text-xs text-slate-600">Validate all system dependencies</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Configuration Validator</h3>
            <p className="text-xs text-slate-600">Check for configuration conflicts</p>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-left">
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Log Analyzer</h3>
            <p className="text-xs text-slate-600">AI-powered log pattern detection</p>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Log Entries</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Errors (24h)</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">
            {logs.filter((l) => l.level === "ERROR").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Warnings (24h)</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">
            {logs.filter((l) => l.level === "WARN").length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Active Issues</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{commonIssues.length}</p>
        </div>
      </div>
    </div>
  );
}