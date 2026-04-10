import { Copy, Plus, Eye, EyeOff, Trash2, CheckCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

const apiKeys = [
  { id: "key-001", name: "Flight Operations API Key", key: "nbcs_flight_a8f2d9e1b4c7", created: "2026-01-15", lastUsed: "2 hours ago", status: "active" },
  { id: "key-002", name: "Training Grounds API Key", key: "nbcs_train_f3e8a1d6c9b2", created: "2026-02-10", lastUsed: "1 day ago", status: "active" },
  { id: "key-003", name: "Workshop Testing API Key", key: "nbcs_test_c7b4e9a2d1f8", created: "2026-03-01", lastUsed: "3 days ago", status: "active" },
];

const integrations = [
  {
    name: "GitHub Actions",
    category: "CI/CD",
    status: "connected",
    description: "Automated deployment workflows",
    logo: "🔄",
  },
  {
    name: "Datadog",
    category: "Monitoring",
    status: "connected",
    description: "Advanced metrics and logging",
    logo: "📊",
  },
  {
    name: "Slack",
    category: "Notifications",
    status: "connected",
    description: "Real-time alert notifications",
    logo: "💬",
  },
  {
    name: "Jenkins",
    category: "CI/CD",
    status: "available",
    description: "Continuous integration pipelines",
    logo: "🔧",
  },
  {
    name: "PagerDuty",
    category: "Monitoring",
    status: "available",
    description: "Incident management and on-call",
    logo: "🚨",
  },
  {
    name: "Terraform",
    category: "Infrastructure",
    status: "available",
    description: "Infrastructure as code",
    logo: "🏗️",
  },
];

export default function ApiIntegrations() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + "••••••••••••••••";
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">API & Integrations</h1>
        <p className="text-slate-600 mt-1">Manage API access and connect with external services</p>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Generate New Key
          </button>
        </div>
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">{apiKey.name}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                      {apiKey.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <code className="text-sm font-mono text-slate-900 bg-slate-50 px-3 py-1 rounded border border-slate-200">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
                      title={visibleKeys.has(apiKey.id) ? "Hide" : "Show"}
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="p-1 text-slate-600 hover:text-blue-600 transition-colors" title="Copy">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                <button className="p-2 text-slate-600 hover:text-red-600 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">API Documentation</h2>
        
        <div className="space-y-6">
          {/* Example Request */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Example API Request</h3>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-slate-100">
                <code>{`curl -X GET https://api.nimbuswiz.io/v1/fleet \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </div>

          {/* Example Response */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Example API Response</h3>
            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-slate-100">
                <code>{`{
  "data": [
    {
      "id": "nimbus-lion",
      "name": "nimbus-lion",
      "status": "healthy",
      "stability": 85,
      "version": "Nimbus2024",
      "serialNumber": "NMB-2024-1147",
      "flightHours": 1247,
      "maxVelocity": 87,
      "usageType": "Racing"
    }
  ],
  "total": 6,
  "page": 1,
  "per_page": 10
}`}</code>
              </pre>
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Available Endpoints</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">GET</span>
                  <code className="text-sm font-mono text-slate-900">/v1/fleet</code>
                  <span className="text-sm text-slate-600">List all registered systems</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">GET</span>
                  <code className="text-sm font-mono text-slate-900">/v1/fleet/:id</code>
                  <span className="text-sm text-slate-600">Get system details</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono rounded">POST</span>
                  <code className="text-sm font-mono text-slate-900">/v1/fleet/:id/inspection</code>
                  <span className="text-sm text-slate-600">Initiate safety inspection</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-mono rounded">POST</span>
                  <code className="text-sm font-mono text-slate-900">/v1/upgrades</code>
                  <span className="text-sm text-slate-600">Create upgrade plan</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-mono rounded">GET</span>
                  <code className="text-sm font-mono text-slate-900">/v1/flight-data</code>
                  <span className="text-sm text-slate-600">Retrieve performance metrics</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Available Integrations</h2>
        <div className="grid grid-cols-3 gap-4">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.logo}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
                    <span className="text-xs text-slate-500">{integration.category}</span>
                  </div>
                </div>
                {integration.status === "connected" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-3">{integration.description}</p>
              <button
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  integration.status === "connected"
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {integration.status === "connected" ? "Configure" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Webhooks</h2>
        <p className="text-sm text-slate-600 mb-4">
          Configure webhooks to receive real-time notifications about system events.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">No webhooks configured yet.</p>
        </div>
      </div>

      {/* API Usage Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">API Calls (24h)</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">12,847</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Active Keys</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Integrations</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">3/6</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Success Rate</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">99.8%</p>
        </div>
      </div>
    </div>
  );
}