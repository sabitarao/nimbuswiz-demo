import { Play, Pause, Plus, Settings, Clock, CheckCircle, XCircle } from "lucide-react";

const pipelines = [
  {
    id: "pipe-001",
    name: "Production Deployment Pipeline",
    status: "active",
    lastRun: "2 hours ago",
    successRate: 98.5,
    runs: 247,
    trigger: "Manual",
  },
  {
    id: "pipe-002",
    name: "Nightly System Scan",
    status: "active",
    lastRun: "8 hours ago",
    successRate: 100,
    runs: 89,
    trigger: "Scheduled",
  },
  {
    id: "pipe-003",
    name: "Auto-Upgrade Stable Systems",
    status: "paused",
    lastRun: "3 days ago",
    successRate: 95.2,
    runs: 42,
    trigger: "Event",
  },
];

const scheduledJobs = [
  { name: "Daily Health Check", schedule: "0 9 * * *", nextRun: "Tomorrow at 9:00 AM", status: "enabled" },
  { name: "Weekly Dependency Scan", schedule: "0 0 * * 0", nextRun: "Sunday at 12:00 AM", status: "enabled" },
  { name: "Monthly Performance Report", schedule: "0 0 1 * *", nextRun: "April 1 at 12:00 AM", status: "enabled" },
  { name: "Quarterly Compliance Audit", schedule: "0 0 1 */3 *", nextRun: "April 1 at 12:00 AM", status: "disabled" },
];

const eventHooks = [
  { event: "System Health Critical", action: "Trigger Emergency Scan", enabled: true },
  { event: "Deployment Completed", action: "Run Integration Tests", enabled: true },
  { event: "New Security Patch Available", action: "Create Assessment Report", enabled: true },
  { event: "Stability Below Threshold", action: "Alert On-Call Team", enabled: false },
];

const recentRuns = [
  { pipeline: "Production Deployment Pipeline", status: "success", duration: "4m 32s", time: "2 hours ago" },
  { pipeline: "Nightly System Scan", status: "success", duration: "12m 18s", time: "8 hours ago" },
  { pipeline: "Auto-Upgrade Stable Systems", status: "success", duration: "28m 45s", time: "3 days ago" },
  { pipeline: "Production Deployment Pipeline", status: "failed", duration: "2m 15s", time: "1 week ago" },
];

export default function Automation() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Automation</h1>
          <p className="text-slate-600 mt-1">Configure CI/CD pipelines and automated workflows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          Create Pipeline
        </button>
      </div>

      {/* Pipelines Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">CI/CD Pipelines</h2>
        <div className="space-y-3">
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">{pipeline.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        pipeline.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {pipeline.status}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                      {pipeline.trigger}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <span>Last run: {pipeline.lastRun}</span>
                    <span>Success rate: {pipeline.successRate}%</span>
                    <span>Total runs: {pipeline.runs}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-600 hover:text-blue-600 transition-colors" title="Run">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-yellow-600 transition-colors" title="Pause">
                    <Pause className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors" title="Configure">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Visualization</h2>
        <div className="bg-slate-50 rounded-lg p-8">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-blue-600 flex items-center justify-center mb-2 mx-auto">
                <Play className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-slate-900 font-medium">Trigger</p>
              <p className="text-xs text-slate-500">Manual/Scheduled</p>
            </div>

            <div className="flex-1 h-px bg-slate-300 mx-4" />

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center mb-2 mx-auto">
                <Settings className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-sm text-slate-900 font-medium">Prepare</p>
              <p className="text-xs text-slate-500">Validate & Setup</p>
            </div>

            <div className="flex-1 h-px bg-slate-300 mx-4" />

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center mb-2 mx-auto">
                <Play className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-sm text-slate-900 font-medium">Execute</p>
              <p className="text-xs text-slate-500">Run Tasks</p>
            </div>

            <div className="flex-1 h-px bg-slate-300 mx-4" />

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center mb-2 mx-auto">
                <CheckCircle className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-sm text-slate-900 font-medium">Test</p>
              <p className="text-xs text-slate-500">Verify Results</p>
            </div>

            <div className="flex-1 h-px bg-slate-300 mx-4" />

            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-green-600 flex items-center justify-center mb-2 mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-slate-900 font-medium">Deploy</p>
              <p className="text-xs text-slate-500">Complete</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Scheduled Jobs */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Scheduled Jobs</h2>
          <div className="space-y-3">
            {scheduledJobs.map((job, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900">{job.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      <code className="bg-white px-2 py-0.5 rounded border border-slate-200">{job.schedule}</code>
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      job.status === "enabled" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  Next run: {job.nextRun}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Hooks */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Event Hooks</h2>
          <div className="space-y-3">
            {eventHooks.map((hook, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{hook.event}</h3>
                    <p className="text-xs text-slate-600">→ {hook.action}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={hook.enabled} readOnly />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* YAML Editor */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pipeline Configuration (YAML)</h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-slate-100">
            <code>{`name: Production Deployment Pipeline

on:
  workflow_dispatch:
  schedule:
    - cron: '0 9 * * *'

jobs:
  deploy:
    runs-on: nimbus-runner
    steps:
      - name: Validate System Health
        run: |
          nimbus scan --system $SYSTEM_ID
          
      - name: Backup Current State
        run: |
          nimbus backup create --system $SYSTEM_ID
          
      - name: Apply Upgrade Profile
        run: |
          nimbus upgrade apply \\
            --profile stable \\
            --system $SYSTEM_ID
            
      - name: Run Integration Tests
        run: |
          nimbus test run --suite integration
          
      - name: Monitor Deployment
        run: |
          nimbus monitor --duration 300s
          
      - name: Notify on Success
        if: success()
        run: |
          nimbus notify --channel slack \\
            --message "Deployment completed successfully"`}</code>
          </pre>
        </div>
      </div>

      {/* Recent Runs */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Pipeline Runs</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Pipeline</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Duration</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentRuns.map((run, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900">{run.pipeline}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        run.status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {run.status === "success" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{run.duration}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{run.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Pipelines</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Active Jobs</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Success Rate</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">97.9%</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Runs (30d)</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">378</p>
        </div>
      </div>
    </div>
  );
}
