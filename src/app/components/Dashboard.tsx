import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Lightbulb, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router";
import { useDemoData } from "../contexts/DemoDataContext";
import FirstRunSetup from "./FirstRunSetup";
import { InfoTooltip } from "./Tooltip";

const metricsData = [
  { id: 1, time: "00:00", stability: 68, responsiveness: 72, network: 65 },
  { id: 2, time: "04:00", stability: 70, responsiveness: 74, network: 68 },
  { id: 3, time: "08:00", stability: 72, responsiveness: 76, network: 70 },
  { id: 4, time: "12:00", stability: 75, responsiveness: 78, network: 73 },
  { id: 5, time: "16:00", stability: 74, responsiveness: 77, network: 72 },
  { id: 6, time: "20:00", stability: 76, responsiveness: 79, network: 74 },
];

const systems = [
  { name: "nimbus-lion", status: "healthy", stability: 85, lastUpgrade: "2 days ago" },
  { name: "nimbus-eagle", status: "warning", stability: 72, lastUpgrade: "5 days ago" },
  { name: "nimbus-badger", status: "healthy", stability: 91, lastUpgrade: "1 day ago" },
  { name: "nimbus-dragon", status: "critical", stability: 58, lastUpgrade: "14 days ago" },
];

const recentActivity = [
  { action: "Fleet scan complete—all systems checked", system: "nimbus-lion", time: "5 minutes ago", type: "success" },
  { action: "Upgrade profile deployment started", system: "nimbus-eagle", time: "23 minutes ago", type: "info" },
  { action: "Critical stability alert triggered", system: "nimbus-dragon", time: "1 hour ago", type: "error" },
  { action: "Performance upgrade successfully applied", system: "nimbus-stag", time: "2 hours ago", type: "success" },
  { action: "Integration sync completed", system: "CI/CD Pipeline", time: "3 hours ago", type: "info" },
];

const alerts = [
  { severity: "critical", message: "nimbus-dragon at risk (58/100)—stabilize within 2 days to prevent failure", time: "1 hour ago" },
  { severity: "warning", message: "nimbus-stag showing performance degradation—review recommended", time: "3 hours ago" },
  { severity: "info", message: "Scheduled maintenance window begins in 24 hours", time: "5 hours ago" },
];

export default function Dashboard() {
  const { isDemoMode, isFirstRun } = useDemoData();

  return (
    <div className="p-8 space-y-6">
      {/* First-Run Setup Card */}
      {isFirstRun && <FirstRunSetup />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Fleet Overview</h1>
          <p className="text-slate-600 mt-1">Real-time health monitoring for all Nimbus systems</p>
        </div>
        {isDemoMode && (
          <div className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg border border-blue-200">
            <span className="font-medium">Demo Mode</span> • Using sample data
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">Stability Index</p>
              <InfoTooltip
                title="Stability Index"
                description="System health score (0-100). Above 80 is stable. Below 60 needs attention soon."
              />
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 mt-2">76</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-green-600">+8% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">Responsiveness Score</p>
              <InfoTooltip
                title="Responsiveness Score"
                description="Measures system reaction times and throughput. Combines latency, queue depth, and processing speed."
              />
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 mt-2">79</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-blue-600">+5% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-600">Network Interaction</p>
              <InfoTooltip
                title="Network Interaction"
                description="Quality of inter-system communication. Tracks packet loss, connection reliability, and mesh stability."
              />
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-slate-900 mt-2">74</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-purple-600">+3% from last week</span>
          </div>
        </div>
      </div>

      {/* Recommended Actions Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Recommended Actions</h2>
            </div>
            <p className="text-blue-100 mb-4">
              2 systems ready for performance boost • 1 critical system at risk of failure
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">nimbus-lion: Performance upgrade ready (87% confidence)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">nimbus-dragon: Apply Extended Operation profile now to prevent failure</span>
              </div>
            </div>
          </div>
          <Link
            to="/advisor"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium whitespace-nowrap"
          >
            View All Recommendations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Systems at Risk Widget */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Systems Requiring Attention</h2>
            <p className="text-sm text-slate-600 mt-1">1 critical system identified based on behavioral patterns</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">nimbus-dragon</h3>
                <p className="text-xs text-slate-600 mt-1">Stability degradation detected • Last upgraded 14 days ago</p>
              </div>
              <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded">CRITICAL</span>
            </div>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-red-200">
              <div className="text-xs">
                <span className="text-slate-600">Stability: </span>
                <span className="font-medium text-red-600">58</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-600">Risk Level: </span>
                <span className="font-medium text-red-600">High</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-600">Action: </span>
                <span className="font-medium text-slate-900">Extended Operation Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance Trends (Last 24 Hours)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="stability" 
              stroke="#10b981" 
              strokeWidth={2} 
              name="Stability"
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="responsiveness" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              name="Responsiveness"
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="network" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              name="Network"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200"
                    : alert.severity === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-red-600"
                        : alert.severity === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <div className="mt-1">
                  {activity.type === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.type === "info" && <Clock className="w-5 h-5 text-blue-600" />}
                  {activity.type === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {activity.system} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Systems Health Overview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Systems Health Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm text-slate-600">System Name</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Stability Score</th>
                <th className="text-left py-3 px-4 text-sm text-slate-600">Last Upgrade</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => (
                <tr key={system.name} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{system.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                        system.status === "healthy"
                          ? "bg-green-100 text-green-700"
                          : system.status === "warning"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {system.status === "healthy" && "● Healthy"}
                      {system.status === "warning" && "● Warning"}
                      {system.status === "critical" && "● Critical"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-900">{system.stability}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{system.lastUpgrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}