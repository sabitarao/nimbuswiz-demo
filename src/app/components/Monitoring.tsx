import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { AlertTriangle, TrendingUp, Bell, Activity } from "lucide-react";

const performanceData = [
  { time: "00:00", stability: 72, responsiveness: 75, network: 68 },
  { time: "02:00", stability: 74, responsiveness: 77, network: 70 },
  { time: "04:00", stability: 73, responsiveness: 76, network: 69 },
  { time: "06:00", stability: 76, responsiveness: 78, network: 72 },
  { time: "08:00", stability: 78, responsiveness: 80, network: 74 },
  { time: "10:00", stability: 80, responsiveness: 82, network: 76 },
  { time: "12:00", stability: 82, responsiveness: 84, network: 78 },
  { time: "14:00", stability: 81, responsiveness: 83, network: 77 },
  { time: "16:00", stability: 79, responsiveness: 81, network: 75 },
  { time: "18:00", stability: 77, responsiveness: 79, network: 73 },
  { time: "20:00", stability: 76, responsiveness: 78, network: 72 },
  { time: "22:00", stability: 75, responsiveness: 77, network: 71 },
];

const systemMetrics = [
  { time: "00:00", cpu: 42, memory: 58, disk: 45 },
  { time: "04:00", cpu: 48, memory: 62, disk: 46 },
  { time: "08:00", cpu: 65, memory: 71, disk: 48 },
  { time: "12:00", cpu: 72, memory: 78, disk: 52 },
  { time: "16:00", cpu: 68, memory: 74, disk: 51 },
  { time: "20:00", cpu: 55, memory: 65, disk: 49 },
];

const alerts = [
  {
    severity: "critical",
    system: "nimbus-dragon",
    message: "Stability index below threshold (58)",
    time: "1 hour ago",
    acknowledged: false,
  },
  {
    severity: "warning",
    system: "nimbus-stag",
    message: "Memory usage consistently above 75%",
    time: "3 hours ago",
    acknowledged: false,
  },
  {
    severity: "warning",
    system: "nimbus-eagle",
    message: "Network latency increased by 15%",
    time: "5 hours ago",
    acknowledged: true,
  },
  {
    severity: "info",
    system: "nimbus-lion",
    message: "Scheduled maintenance reminder",
    time: "8 hours ago",
    acknowledged: true,
  },
];

const predictions = [
  {
    metric: "Stability",
    current: 76,
    predicted: 82,
    trend: "improving",
    confidence: 87,
    recommendation: "Continue current optimization strategy",
  },
  {
    metric: "Memory Usage",
    current: 74,
    predicted: 78,
    trend: "stable",
    confidence: 92,
    recommendation: "Monitor for potential capacity planning",
  },
  {
    metric: "Network Performance",
    current: 74,
    predicted: 71,
    trend: "declining",
    confidence: 79,
    recommendation: "Investigate network sync adapter configuration",
  },
];

export default function Monitoring() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Monitoring & Alerts</h1>
        <p className="text-slate-600 mt-1">Real-time system health monitoring and predictive analytics</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Critical Alerts</p>
              <p className="text-2xl font-semibold text-red-600 mt-1">1</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Warnings</p>
              <p className="text-2xl font-semibold text-yellow-600 mt-1">2</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Info</p>
              <p className="text-2xl font-semibold text-blue-600 mt-1">1</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">System Health</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">82%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics (24 Hours)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line key="stability-line" type="monotone" dataKey="stability" stroke="#10b981" strokeWidth={2} name="Stability Index" />
            <Line
              key="responsiveness-line"
              type="monotone"
              dataKey="responsiveness"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Responsiveness Score"
            />
            <Line key="network-line" type="monotone" dataKey="network" stroke="#8b5cf6" strokeWidth={2} name="Network Interaction" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* System Resource Usage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">System Resource Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={systemMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="CPU %" />
            <Area
              type="monotone"
              dataKey="memory"
              stackId="2"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Memory %"
            />
            <Area
              type="monotone"
              dataKey="disk"
              stackId="3"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
              name="Disk %"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Panel */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Active Alerts</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">No active alerts.</p>
              <p className="text-sm text-slate-500 mt-1">Your systems are healthy.</p>
            </div>
          ) : alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                alert.severity === "critical"
                  ? "bg-red-50 border-red-200"
                  : alert.severity === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              } ${alert.acknowledged ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-red-600"
                        : alert.severity === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          alert.severity === "critical"
                            ? "bg-red-200 text-red-800"
                            : alert.severity === "warning"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-slate-900">{alert.system}</span>
                    </div>
                    <p className="text-sm text-slate-900">{alert.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <button className="px-3 py-1 text-xs border border-slate-300 rounded hover:bg-white transition-colors">
                    Acknowledge
                  </button>
                )}
                {alert.acknowledged && <span className="text-xs text-slate-500">Acknowledged</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Maintenance */}

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Predictive Maintenance Insights</h2>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{prediction.metric}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <span className="text-xs text-slate-600">Current: </span>
                      <span className="text-sm font-medium text-slate-900">{prediction.current}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Predicted (7d): </span>
                      <span className="text-sm font-medium text-slate-900">{prediction.predicted}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-600">Confidence: </span>
                      <span className="text-sm font-medium text-slate-900">{prediction.confidence}%</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    prediction.trend === "improving"
                      ? "bg-green-100 text-green-700"
                      : prediction.trend === "declining"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {prediction.trend === "improving" && "↗ Improving"}
                  {prediction.trend === "declining" && "↘ Declining"}
                  {prediction.trend === "stable" && "→ Stable"}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Recommendation:</span> {prediction.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Average Response Time</p>
          <p className="text-2xl font-semibold text-slate-900 mt-2">142ms</p>
          <p className="text-xs text-green-600 mt-1">↓ 8% from last week</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Uptime (30 days)</p>
          <p className="text-2xl font-semibold text-slate-900 mt-2">99.97%</p>
          <p className="text-xs text-green-600 mt-1">Above SLA target</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Error Rate</p>
          <p className="text-2xl font-semibold text-slate-900 mt-2">0.03%</p>
          <p className="text-xs text-green-600 mt-1">Within acceptable range</p>
        </div>
      </div>
    </div>
  );
}