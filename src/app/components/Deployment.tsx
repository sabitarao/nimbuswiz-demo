import { CheckCircle, Clock, AlertCircle, RotateCcw, PlayCircle, FileText } from "lucide-react";

const deployments = [
  {
    id: "dep-001",
    system: "nimbus-lion",
    profile: "Stable",
    status: "completed",
    startTime: "2026-03-25 10:30:00",
    endTime: "2026-03-25 10:45:00",
    duration: "15m",
    deployedBy: "kay.bell@nimbuswiz.io",
  },
  {
    id: "dep-002",
    system: "nimbus-eagle",
    profile: "Performance",
    status: "in-progress",
    startTime: "2026-03-25 11:15:00",
    endTime: null,
    duration: "Running...",
    deployedBy: "mark.flint@nimbuswiz.io",
  },
  {
    id: "dep-003",
    system: "nimbus-dragon",
    profile: "Extended Operation",
    status: "scheduled",
    startTime: "2026-03-25 16:00:00",
    endTime: null,
    duration: "Pending",
    deployedBy: "angie.johnson@nimbuswiz.io",
  },
];

const deploymentPhases = [
  { name: "Preparing", status: "completed", duration: "5m 22s" },
  { name: "Backup & Validation", status: "completed", duration: "8m 15s" },
  { name: "Executing Upgrade", status: "in-progress", duration: "12m 30s" },
  { name: "Testing & Verification", status: "pending", duration: "—" },
  { name: "Monitoring", status: "pending", duration: "—" },
  { name: "Completed", status: "pending", duration: "—" },
];

const logs = [
  { time: "14:42:18", level: "INFO", message: "Executing package upgrade: core-flight-module v2.4.1 → v2.5.0" },
  { time: "14:41:55", level: "INFO", message: "Dependency validation successful" },
  { time: "14:41:32", level: "INFO", message: "System backup completed successfully" },
  { time: "14:40:15", level: "WARN", message: "Legacy compatibility layer will be deprecated in next release" },
  { time: "14:39:48", level: "INFO", message: "Pre-deployment health check passed" },
  { time: "14:39:22", level: "INFO", message: "Deployment initiated by admin@nimbuswiz.io" },
];

export default function Deployment() {
  const activeDeployment = deployments.find((d) => d.status === "in-progress");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Deployment</h1>
          <p className="text-slate-600 mt-1">Monitor and manage system upgrade deployments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlayCircle className="w-5 h-5" />
          New Deployment
        </button>
      </div>

      {/* Active Deployment */}
      {activeDeployment && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Active Deployment</h2>
              <p className="text-sm text-slate-600 mt-1">
                {activeDeployment.system} • {activeDeployment.profile} Profile
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Rollback
              </button>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <Clock className="w-4 h-4" />
                In Progress
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Overall Progress</span>
              <span className="text-sm text-slate-900 font-medium">{activeDeployment.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${activeDeployment.progress}%` }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            {deploymentPhases.map((phase, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {phase.status === "completed" && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                  {phase.status === "in-progress" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                    </div>
                  )}
                  {phase.status === "pending" && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{phase.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Duration: {phase.duration}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      phase.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : phase.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {phase.status === "completed" && "✓ Completed"}
                    {phase.status === "in-progress" && "● In Progress"}
                    {phase.status === "pending" && "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Deployment Schedule & History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Deployment ID</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">System</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Profile</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Start Time</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Progress</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((deployment) => (
                <tr key={deployment.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-4 px-4 text-sm text-slate-900 font-medium">{deployment.id}</td>
                  <td className="py-4 px-4 text-sm text-slate-900">{deployment.system}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{deployment.profile}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        deployment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : deployment.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {deployment.status === "completed" && "✓ Completed"}
                      {deployment.status === "in-progress" && "● In Progress"}
                      {deployment.status === "scheduled" && "○ Scheduled"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{deployment.startTime}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {deployment.endTime
                      ? (() => {
                          const start = new Date(deployment.startTime);
                          const end = new Date(deployment.endTime);
                          const diff = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
                          return `${diff}m`;
                        })()
                      : "—"}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full ${
                            deployment.status === "completed"
                              ? "bg-green-500"
                              : deployment.status === "in-progress"
                              ? "bg-blue-500"
                              : "bg-slate-300"
                          }`}
                          style={{ width: `${deployment.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-900">{deployment.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Deployment Logs</h2>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <FileText className="w-4 h-4" />
            View Full Logs
          </button>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-[300px] overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="py-1">
              <span className="text-slate-400">{log.time}</span>
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

      {/* Deployment Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Deployments</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">1</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">1</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Scheduled</p>
          <p className="text-2xl font-semibold text-slate-600 mt-1">1</p>
        </div>
      </div>
    </div>
  );
}