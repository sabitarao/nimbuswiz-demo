import { useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Shield,
  Key,
  Lock,
  Zap,
  Globe,
  Plug,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  BarChart3,
  Send,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  Terminal,
  BookOpen,
  Webhook,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ============================================================
// TYPES
// ============================================================
type TabId = "overview" | "keys" | "usage" | "webhooks" | "integrations" | "reference";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  scopes: string[];
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
  createdBy: string;
  requestsToday: number;
}

interface WebhookEntry {
  id: string;
  url: string;
  events: string[];
  status: "active" | "failing" | "disabled";
  createdAt: string;
  successRate: number;
  lastDelivery: { status: number; timestamp: string; duration_ms: number } | null;
  deliveries: { id: string; event: string; status: number; timestamp: string; duration_ms: number }[];
}

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  description: string;
  request?: string;
  response: string;
  errorCodes: { code: number; message: string; description: string }[];
}

// ============================================================
// MOCK DATA
// ============================================================
const apiKeys: ApiKey[] = [
  {
    id: "key-001",
    name: "Flight Operations",
    key: "nbcs_live_a8f2d9e1b4c76f3a2e9d",
    prefix: "nbcs_live_a8f2",
    scopes: ["fleet:read", "fleet:write", "deployments:read", "deployments:write"],
    created: "2026-01-15",
    lastUsed: "2 hours ago",
    status: "active",
    createdBy: "kay.bell@nimbuswiz.io",
    requestsToday: 4821,
  },
  {
    id: "key-002",
    name: "Training Grounds (Read Only)",
    key: "nbcs_live_f3e8a1d6c9b24e7f1a3c",
    prefix: "nbcs_live_f3e8",
    scopes: ["fleet:read", "deployments:read"],
    created: "2026-02-10",
    lastUsed: "1 day ago",
    status: "active",
    createdBy: "mark.flint@nimbuswiz.io",
    requestsToday: 1203,
  },
  {
    id: "key-003",
    name: "CI/CD Pipeline",
    key: "nbcs_live_c7b4e9a2d1f86d3b5a8e",
    prefix: "nbcs_live_c7b4",
    scopes: ["fleet:read", "deployments:read", "deployments:write", "webhooks:read"],
    created: "2026-03-01",
    lastUsed: "3 days ago",
    status: "active",
    createdBy: "angie.johnson@nimbuswiz.io",
    requestsToday: 687,
  },
  {
    id: "key-004",
    name: "Legacy Migration (Revoked)",
    key: "nbcs_live_d9a3f7e2b1c48a6d2f5e",
    prefix: "nbcs_live_d9a3",
    scopes: ["fleet:read"],
    created: "2025-11-20",
    lastUsed: "45 days ago",
    status: "revoked",
    createdBy: "zach.smith@nimbuswiz.io",
    requestsToday: 0,
  },
];

const usageData7d = [
  { day: "Mar 28", calls: 11420, errors: 34, latency: 145 },
  { day: "Mar 29", calls: 9870, errors: 22, latency: 138 },
  { day: "Mar 30", calls: 13210, errors: 41, latency: 152 },
  { day: "Mar 31", calls: 12650, errors: 28, latency: 141 },
  { day: "Apr 1", calls: 14390, errors: 53, latency: 162 },
  { day: "Apr 2", calls: 13840, errors: 31, latency: 148 },
  { day: "Apr 3", calls: 12847, errors: 26, latency: 143 },
];

const topEndpoints = [
  { endpoint: "GET /v1/fleet", calls: 28420, avgLatency: 92, errorRate: 0.08 },
  { endpoint: "GET /v1/fleet/{id}/status", calls: 18340, avgLatency: 78, errorRate: 0.04 },
  { endpoint: "POST /v1/fleet/scan", calls: 8910, avgLatency: 245, errorRate: 0.31 },
  { endpoint: "GET /v1/deployments/{id}", calls: 7620, avgLatency: 105, errorRate: 0.12 },
  { endpoint: "POST /v1/deployments", calls: 3240, avgLatency: 312, errorRate: 0.22 },
];

const errorDistribution = [
  { name: "400 Bad Request", value: 42, color: "#f59e0b" },
  { name: "401 Unauthorized", value: 18, color: "#ef4444" },
  { name: "404 Not Found", value: 28, color: "#8b5cf6" },
  { name: "409 Conflict", value: 8, color: "#3b82f6" },
  { name: "429 Rate Limited", value: 12, color: "#ec4899" },
  { name: "500 Server Error", value: 4, color: "#64748b" },
];

const webhooks: WebhookEntry[] = [
  {
    id: "whk-001",
    url: "https://hooks.slack.com/services/T0NIMBUS/B0ALERTS/xyzSecret123",
    events: ["deployment.started", "deployment.completed", "deployment.failed", "deployment.rollback"],
    status: "active",
    createdAt: "2026-01-20",
    successRate: 99.8,
    lastDelivery: { status: 200, timestamp: "2026-04-03T14:22:00Z", duration_ms: 145 },
    deliveries: [
      { id: "del-001", event: "deployment.stage_completed", status: 200, timestamp: "2026-04-03T14:22:00Z", duration_ms: 145 },
      { id: "del-002", event: "deployment.started", status: 200, timestamp: "2026-04-03T13:10:00Z", duration_ms: 132 },
      { id: "del-003", event: "system.assessment_complete", status: 200, timestamp: "2026-04-03T11:45:00Z", duration_ms: 198 },
      { id: "del-004", event: "deployment.completed", status: 200, timestamp: "2026-04-02T16:30:00Z", duration_ms: 121 },
      { id: "del-005", event: "deployment.failed", status: 200, timestamp: "2026-04-01T09:15:00Z", duration_ms: 156 },
    ],
  },
  {
    id: "whk-002",
    url: "https://api.pagerduty.com/nimbuswiz/incidents",
    events: ["deployment.failed", "system.health_critical", "deployment.rollback"],
    status: "active",
    createdAt: "2026-02-05",
    successRate: 100,
    lastDelivery: { status: 202, timestamp: "2026-04-01T09:15:00Z", duration_ms: 89 },
    deliveries: [
      { id: "del-006", event: "deployment.failed", status: 202, timestamp: "2026-04-01T09:15:00Z", duration_ms: 89 },
      { id: "del-007", event: "system.health_critical", status: 202, timestamp: "2026-03-28T22:10:00Z", duration_ms: 95 },
    ],
  },
  {
    id: "whk-003",
    url: "https://jenkins.nimbuswiz.internal/generic-webhook-trigger/invoke",
    events: ["deployment.completed", "system.assessment_complete"],
    status: "failing",
    createdAt: "2026-03-10",
    successRate: 72.4,
    lastDelivery: { status: 503, timestamp: "2026-04-03T11:45:00Z", duration_ms: 5012 },
    deliveries: [
      { id: "del-008", event: "system.assessment_complete", status: 503, timestamp: "2026-04-03T11:45:00Z", duration_ms: 5012 },
      { id: "del-009", event: "deployment.completed", status: 503, timestamp: "2026-04-02T16:30:00Z", duration_ms: 5008 },
      { id: "del-010", event: "deployment.completed", status: 200, timestamp: "2026-04-01T14:22:00Z", duration_ms: 342 },
    ],
  },
];

const availableEvents = [
  { name: "deployment.started", description: "A deployment has been initiated" },
  { name: "deployment.stage_completed", description: "A deployment stage finished successfully" },
  { name: "deployment.completed", description: "Full deployment completed" },
  { name: "deployment.failed", description: "Deployment encountered a failure" },
  { name: "deployment.rollback", description: "A rollback was triggered" },
  { name: "system.assessment_complete", description: "System assessment scan finished" },
  { name: "system.health_critical", description: "System health dropped below threshold" },
  { name: "system.certification_expiring", description: "Safety certification expiring within 30 days" },
];

const integrations = [
  { name: "GitHub Actions", category: "CI/CD", status: "connected" as const, description: "Trigger deployments from workflow completions. Auto-maps repos to fleet systems.", logo: "🔄", connectedSince: "2026-01-15", lastSync: "2 hours ago" },
  { name: "Datadog", category: "Monitoring", status: "connected" as const, description: "Ingest stability metrics, error rates, and latency data. Powers the Monitoring dashboard.", logo: "📊", connectedSince: "2026-01-20", lastSync: "5 min ago" },
  { name: "Slack", category: "Notifications", status: "connected" as const, description: "Real-time deployment alerts, rollback notifications, and health warnings.", logo: "💬", connectedSince: "2026-01-20", lastSync: "14 min ago" },
  { name: "Jenkins", category: "CI/CD", status: "available" as const, description: "Connect Jenkins pipelines for continuous deployment integration.", logo: "🔧" },
  { name: "PagerDuty", category: "Incident Mgmt", status: "available" as const, description: "Route critical system alerts to on-call responders automatically.", logo: "🚨" },
  { name: "Terraform", category: "Infrastructure", status: "available" as const, description: "Provision and manage cloud infrastructure for deployment targets.", logo: "🏗️" },
  { name: "GitLab CI", category: "CI/CD", status: "available" as const, description: "Trigger deployments from GitLab pipeline events.", logo: "🦊" },
  { name: "Prometheus", category: "Monitoring", status: "available" as const, description: "Scrape custom metrics endpoints and feed into NimbusWiz monitoring.", logo: "🔥" },
];

const externalEndpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/v1/fleet",
    summary: "List all registered systems",
    description: "Returns a paginated list of all systems in the fleet. Supports filtering by status, usage type, and location. Results include summary health metrics.",
    response: JSON.stringify({
      data: [
        { id: "nmb-2024-1147", name: "nimbus-lion", status: "operational", stability_score: 94, usage_type: "Racing", flight_hours: 1247 },
        { id: "nmb-2023-0892", name: "nimbus-phoenix", status: "degraded", stability_score: 71, usage_type: "Training", flight_hours: 3420 },
      ],
      total: 6, page: 1, per_page: 20,
    }, null, 2),
    errorCodes: [
      { code: 401, message: "unauthorized", description: "Missing or invalid API key" },
      { code: 429, message: "rate_limit_exceeded", description: "Retry after duration in Retry-After header" },
    ],
  },
  {
    method: "POST",
    path: "/v1/fleet/scan",
    summary: "Initiate system scan",
    description: "Triggers a compatibility and health scan. Returns a scan job ID for async polling. Scans complete in 30-90 seconds.",
    request: JSON.stringify({ system_id: "nmb-2024-1147", scan_type: "full", include_dependencies: true }, null, 2),
    response: JSON.stringify({ scan_id: "scn_8a2f4e6b1d3c", system_id: "nmb-2024-1147", status: "in_progress", estimated_duration_sec: 45, created_at: "2026-04-03T14:22:00Z" }, null, 2),
    errorCodes: [
      { code: 404, message: "system_not_found", description: "No system found with the provided ID" },
      { code: 409, message: "scan_in_progress", description: "A scan is already running for this system" },
    ],
  },
  {
    method: "POST",
    path: "/v1/deployments",
    summary: "Create deployment",
    description: "Creates a new staged deployment. Supports canary, blue/green, and immediate strategies with configurable rollback thresholds.",
    request: JSON.stringify({ system_id: "nmb-2024-1147", upgrade_plan_id: "plan_3c7a9f2e", strategy: "staged", rollback_on_failure: true }, null, 2),
    response: JSON.stringify({ deployment_id: "dep_4b8e2a1f6c9d", status: "initiated", strategy: "staged", current_stage: "canary", progress_pct: 0, created_at: "2026-04-03T14:30:00Z" }, null, 2),
    errorCodes: [
      { code: 409, message: "deployment_active", description: "An active deployment already exists" },
      { code: 422, message: "assessment_required", description: "System must pass assessment first" },
    ],
  },
  {
    method: "GET",
    path: "/v1/deployments/{id}",
    summary: "Get deployment status",
    description: "Returns current status, progress, stage details, and real-time health metrics for a deployment.",
    response: JSON.stringify({ deployment_id: "dep_4b8e2a1f6c9d", status: "in_progress", current_stage: "partial", progress_pct: 62, health: { stability_score: 94, error_rate: 0.02 }, rollback_eligible: true }, null, 2),
    errorCodes: [
      { code: 404, message: "deployment_not_found", description: "No deployment found with the provided ID" },
    ],
  },
  {
    method: "POST",
    path: "/v1/deployments/{id}/rollback",
    summary: "Rollback deployment",
    description: "Initiates an immediate rollback. Only available before deployment reaches 'completed' status. Requires a reason for audit trail.",
    request: JSON.stringify({ reason: "Elevated error rate in partial stage", force: false }, null, 2),
    response: JSON.stringify({ rollback_id: "rbk_9d3f7a2e1b4c", deployment_id: "dep_4b8e2a1f6c9d", status: "rolling_back", initiated_by: "mark.flint@nimbuswiz.io", estimated_duration_sec: 120 }, null, 2),
    errorCodes: [
      { code: 400, message: "reason_required", description: "A rollback reason is required for audit compliance" },
      { code: 409, message: "already_completed", description: "Cannot rollback a completed deployment" },
    ],
  },
];

// ============================================================
// SHARED COMPONENTS
// ============================================================
function CopyButton({ text, size = "sm" }: { text: string; size?: "sm" | "xs" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors ${size === "xs" ? "p-0.5" : "p-1"}`} title="Copy">
      {copied ? <Check className={`${size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} text-emerald-500`} /> : <Copy className={`${size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"}`} />}
    </button>
  );
}

function CodeBlock({ code, language = "json", compact = false }: { code: string; language?: string; compact?: boolean }) {
  return (
    <div className="relative group">
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800/60 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono uppercase">{language}</span>
          <CopyButton text={code} size="xs" />
        </div>
        <pre className={`${compact ? "p-3 text-xs" : "p-4 text-sm"} overflow-x-auto leading-relaxed`}>
          <code className="text-slate-100 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-50 border-emerald-200 text-emerald-700",
    POST: "bg-blue-50 border-blue-200 text-blue-700",
    PUT: "bg-amber-50 border-amber-200 text-amber-700",
    DELETE: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-semibold ${colors[method] || colors.GET}`}>
      {method}
    </span>
  );
}

function StatusDot({ status }: { status: "active" | "failing" | "disabled" | "revoked" }) {
  const colors = {
    active: "bg-emerald-500",
    failing: "bg-red-500 animate-pulse",
    disabled: "bg-slate-400",
    revoked: "bg-slate-400",
  };
  return <span className={`w-2 h-2 rounded-full ${colors[status]}`} />;
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-lg border border-slate-200 ${className}`}>{children}</div>;
}

// ============================================================
// TAB: OVERVIEW
// ============================================================
function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "API Calls (24h)", value: "12,847", sub: "+8.2% vs yesterday", color: "text-slate-900" },
          { label: "Active Keys", value: "3", sub: "1 revoked", color: "text-emerald-600" },
          { label: "Success Rate", value: "99.7%", sub: "Last 7 days", color: "text-emerald-600" },
          { label: "Avg Latency", value: "143ms", sub: "p99: 312ms", color: "text-blue-600" },
        ].map((stat) => (
          <SectionCard key={stat.label} className="p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </SectionCard>
        ))}
      </div>

      {/* Getting Started */}
      <SectionCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Terminal className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Quick Start</h2>
            <p className="text-sm text-slate-500 mt-1">
              The NimbusWiz API lets you automate system scanning, manage deployments, and monitor fleet health programmatically.
              All requests use the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">https://api.nimbuswiz.io/v1</code> base URL.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">1. Authenticate</h3>
                <CodeBlock
                  compact
                  language="bash"
                  code={`curl https://api.nimbuswiz.io/v1/fleet \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">2. Response</h3>
                <CodeBlock
                  compact
                  code={`{
  "data": [
    {
      "id": "nmb-2024-1147",
      "name": "nimbus-lion",
      "status": "operational",
      "stability_score": 94
    }
  ],
  "total": 6
}`}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Key Concepts */}
      <div className="grid grid-cols-3 gap-4">
        <SectionCard className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Key className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Authentication</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bearer token auth with scoped API keys. Generate keys with granular permissions from the API Keys tab. Keys can be rotated without downtime.
          </p>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Rate Limits</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            1,000 requests/minute per key, burst of 50 req/sec. Rate limit info included in <code className="text-xs bg-slate-100 px-1 rounded font-mono">X-RateLimit-*</code> response headers.
          </p>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">Webhooks</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Subscribe to deployment and system health events. Payloads signed with HMAC-SHA256. Failed deliveries retry 3 times with exponential backoff.
          </p>
        </SectionCard>
      </div>

      {/* Common Workflows */}
      <SectionCard className="p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Common Workflows</h2>
        <div className="space-y-3">
          {[
            { flow: "CI/CD Deployment", steps: ["POST /v1/fleet/scan", "GET scan status until complete", "POST /v1/deployments", "Poll deployment status", "Handle webhooks for completion"], icon: "🔄" },
            { flow: "Fleet Health Check", steps: ["GET /v1/fleet", "GET /v1/fleet/{id}/status for each system", "Compare stability_score against thresholds"], icon: "🏥" },
            { flow: "Emergency Rollback", steps: ["GET /v1/deployments/{id} to confirm active", "POST /v1/deployments/{id}/rollback with reason", "Monitor rollback status"], icon: "⚡" },
          ].map((wf) => (
            <div key={wf.flow} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-lg mt-0.5">{wf.icon}</span>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-slate-900">{wf.flow}</h4>
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {wf.steps.map((step, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <code className="text-xs bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600">{step}</code>
                      {i < wf.steps.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================
// TAB: API KEYS
// ============================================================
function ApiKeysTab() {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const toggleKey = (id: string) => {
    const next = new Set(visibleKeys);
    next.has(id) ? next.delete(id) : next.add(id);
    setVisibleKeys(next);
  };

  const maskKey = (key: string) => key.slice(0, 14) + "••••••••••";

  const allScopes = ["fleet:read", "fleet:write", "deployments:read", "deployments:write", "webhooks:read", "webhooks:write", "admin"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">API Keys</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage keys with scoped permissions. Keys authenticate all API requests via Bearer token.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(!showCreateModal)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Generate Key
        </button>
      </div>

      {/* Create Key Panel */}
      {showCreateModal && (
        <SectionCard className="p-5 border-blue-200 bg-blue-50/30">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Generate New API Key</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Key Name</label>
              <input type="text" placeholder="e.g., Production CI/CD" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Expiration</label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Never</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Scopes</label>
            <div className="flex flex-wrap gap-2">
              {allScopes.map((scope) => (
                <label key={scope} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-blue-300 transition-colors">
                  <input type="checkbox" className="rounded" defaultChecked={scope.includes("read")} />
                  <code className="font-mono">{scope}</code>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Generate</button>
            <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
          </div>
        </SectionCard>
      )}

      {/* Keys Table */}
      <SectionCard className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Key</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Scopes</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Last Used</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Today</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((k) => (
              <tr key={k.id} className={`border-b border-slate-100 last:border-0 ${k.status === "revoked" ? "opacity-50" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <StatusDot status={k.status} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{k.name}</p>
                      <p className="text-xs text-slate-400">{k.createdBy} · {k.created}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {visibleKeys.has(k.id) ? k.key : maskKey(k.key)}
                    </code>
                    <button onClick={() => toggleKey(k.id)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      {visibleKeys.has(k.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <CopyButton text={k.key} size="xs" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {k.scopes.slice(0, 2).map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-mono rounded">{s}</span>
                    ))}
                    {k.scopes.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">+{k.scopes.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{k.lastUsed}</td>
                <td className="px-5 py-4 text-sm font-mono text-slate-700">{k.requestsToday.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {k.status === "active" && (
                      <>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50" title="Rotate key">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" title="Revoke key">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

// ============================================================
// TAB: USAGE
// ============================================================
function UsageTab() {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const totalCalls = usageData7d.reduce((s, d) => s + d.calls, 0);
  const totalErrors = usageData7d.reduce((s, d) => s + d.errors, 0);
  const avgLatency = Math.round(usageData7d.reduce((s, d) => s + d.latency, 0) / usageData7d.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">API Usage</h2>
          <p className="text-sm text-slate-500 mt-0.5">Request volume, error rates, and latency metrics across all endpoints.</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {(["7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {r === "7d" ? "7 Days" : "30 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: totalCalls.toLocaleString(), icon: <BarChart3 className="w-4 h-4" /> },
          { label: "Total Errors", value: totalErrors.toLocaleString(), icon: <XCircle className="w-4 h-4" /> },
          { label: "Error Rate", value: ((totalErrors / totalCalls) * 100).toFixed(2) + "%", icon: <AlertTriangle className="w-4 h-4" /> },
          { label: "Avg Latency", value: avgLatency + "ms", icon: <Clock className="w-4 h-4" /> },
        ].map((s) => (
          <SectionCard key={s.label} className="p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">{s.icon}<span className="text-xs text-slate-500">{s.label}</span></div>
            <p className="text-xl font-semibold text-slate-900">{s.value}</p>
          </SectionCard>
        ))}
      </div>

      {/* Request Volume Chart */}
      <SectionCard className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Request Volume</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={usageData7d}>
            <defs>
              <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Area type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={2} fill="url(#callsGrad)" name="Requests" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-2 gap-4">
        {/* Top Endpoints */}
        <SectionCard className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Top Endpoints</h3>
          <div className="space-y-3">
            {topEndpoints.map((ep) => (
              <div key={ep.endpoint} className="flex items-center justify-between">
                <code className="text-xs font-mono text-slate-700">{ep.endpoint}</code>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{ep.calls.toLocaleString()} calls</span>
                  <span>{ep.avgLatency}ms</span>
                  <span className={ep.errorRate > 0.2 ? "text-amber-600" : "text-slate-400"}>{ep.errorRate}% err</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Error Distribution */}
        <SectionCard className="p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Error Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={errorDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" stroke="none">
                  {errorDistribution.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {errorDistribution.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: e.color }} />
                    <span className="text-slate-600">{e.name}</span>
                  </div>
                  <span className="font-mono text-slate-700">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Latency Chart */}
      <SectionCard className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Average Latency (ms)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={usageData7d}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Bar dataKey="latency" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Latency (ms)" />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}

// ============================================================
// TAB: WEBHOOKS
// ============================================================
function WebhooksTab() {
  const [expandedWebhook, setExpandedWebhook] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Webhooks</h2>
          <p className="text-sm text-slate-500 mt-0.5">Receive real-time notifications for deployment and system events. Payloads signed with HMAC-SHA256.</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* Create Panel */}
      {showCreate && (
        <SectionCard className="p-5 border-blue-200 bg-blue-50/30">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">New Webhook Endpoint</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Endpoint URL</label>
              <input type="url" placeholder="https://your-server.com/webhooks/nimbuswiz" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Subscribe to Events</label>
              <div className="grid grid-cols-2 gap-2">
                {availableEvents.map((ev) => (
                  <label key={ev.name} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer hover:border-blue-300 transition-colors">
                    <input type="checkbox" className="rounded" />
                    <div>
                      <code className="font-mono text-slate-700">{ev.name}</code>
                      <p className="text-slate-400 mt-0.5">{ev.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create Webhook</button>
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Webhook List */}
      <div className="space-y-3">
        {webhooks.map((wh) => (
          <SectionCard key={wh.id} className="overflow-hidden">
            <button
              onClick={() => setExpandedWebhook(expandedWebhook === wh.id ? null : wh.id)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors text-left"
            >
              {expandedWebhook === wh.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              <StatusDot status={wh.status} />
              <div className="flex-1 min-w-0">
                <code className="text-sm font-mono text-slate-800 truncate block">{wh.url}</code>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-400">{wh.events.length} events</span>
                  <span className="text-xs text-slate-400">Created {wh.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className={`text-sm font-medium ${wh.successRate >= 99 ? "text-emerald-600" : wh.successRate >= 90 ? "text-amber-600" : "text-red-600"}`}>{wh.successRate}%</p>
                  <p className="text-xs text-slate-400">success rate</p>
                </div>
                {wh.lastDelivery && (
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${wh.lastDelivery.status < 300 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                    {wh.lastDelivery.status}
                  </span>
                )}
              </div>
            </button>

            {expandedWebhook === wh.id && (
              <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/40 space-y-4">
                {/* Events */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subscribed Events</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {wh.events.map((ev) => (
                      <span key={ev} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-600">{ev}</span>
                    ))}
                  </div>
                </div>

                {/* Signing Secret */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Signing Secret</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded">whsec_••••••••••••••••••••</code>
                    <CopyButton text="whsec_example_secret_key" size="xs" />
                    <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Rotate secret">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Recent Deliveries */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Deliveries</h4>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                      <Send className="w-3 h-3" /> Send Test
                    </button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase">Status</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase">Event</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase">Timestamp</th>
                          <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase">Duration</th>
                          <th className="text-right px-3 py-2 font-semibold text-slate-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wh.deliveries.map((d) => (
                          <tr key={d.id} className="border-b border-slate-50 last:border-0">
                            <td className="px-3 py-2.5">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono ${d.status < 300 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                {d.status < 300 ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {d.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 font-mono text-slate-600">{d.event}</td>
                            <td className="px-3 py-2.5 text-slate-500">{new Date(d.timestamp).toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-slate-500">{d.duration_ms}ms</td>
                            <td className="px-3 py-2.5 text-right">
                              {d.status >= 300 && (
                                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ml-auto">
                                  <RefreshCw className="w-3 h-3" /> Retry
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    {wh.status === "disabled" ? "Enable" : "Disable"}
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        ))}
      </div>

      {/* Delivery Payload Example */}
      <SectionCard className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Example Webhook Payload</h3>
        <p className="text-xs text-slate-500 mb-3">All payloads include a signature header for verification.</p>
        <CodeBlock
          compact
          code={JSON.stringify({
            event: "deployment.stage_completed",
            deployment_id: "dep_4b8e2a1f6c9d",
            system_id: "nmb-2024-1147",
            stage: "canary",
            status: "completed",
            health: { stability_score: 96, error_rate: 0.01 },
            next_stage: "partial",
            timestamp: "2026-04-03T15:00:00Z",
          }, null, 2)}
        />
      </SectionCard>
    </div>
  );
}

// ============================================================
// TAB: INTEGRATIONS
// ============================================================
function IntegrationsTab() {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(integrations.map((i) => i.category)))];
  const filtered = filter === "all" ? integrations : integrations.filter((i) => i.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
          <p className="text-sm text-slate-500 mt-0.5">Connect NimbusWiz to your CI/CD pipelines, monitoring platforms, and cloud infrastructure.</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${filter === c ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Connected */}
      {filtered.some((i) => i.status === "connected") && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Connected</h3>
          <div className="grid grid-cols-3 gap-4">
            {filtered.filter((i) => i.status === "connected").map((integration) => (
              <SectionCard key={integration.name} className="p-5 border-emerald-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.logo}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{integration.name}</h4>
                      <span className="text-xs text-slate-400">{integration.category}</span>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{integration.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pt-2 border-t border-slate-100">
                  <span>Connected since {integration.connectedSince}</span>
                  <span>Synced {integration.lastSync}</span>
                </div>
                <button className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Configure
                </button>
              </SectionCard>
            ))}
          </div>
        </div>
      )}

      {/* Available */}
      {filtered.some((i) => i.status === "available") && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Available</h3>
          <div className="grid grid-cols-3 gap-4">
            {filtered.filter((i) => i.status === "available").map((integration) => (
              <SectionCard key={integration.name} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{integration.logo}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{integration.name}</h4>
                    <span className="text-xs text-slate-400">{integration.category}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{integration.description}</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Connect
                </button>
              </SectionCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB: API REFERENCE
// ============================================================
function ApiReferenceTab() {
  const [expandedIdx, setExpandedIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = externalEndpoints.filter(
    (ep) =>
      ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">API Reference</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Quick reference for external API endpoints. Base URL: <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">https://api.nimbuswiz.io/v1</code>
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Auth Reminder */}
      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Shield className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800">
          All endpoints require a Bearer token. Include <code className="font-mono bg-amber-100 px-1 rounded">Authorization: Bearer YOUR_API_KEY</code> in every request.
        </p>
      </div>

      {/* Endpoints */}
      <div className="space-y-3">
        {filtered.map((ep, i) => (
          <SectionCard key={i} className="overflow-hidden">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? -1 : i)}
              className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors text-left"
            >
              {expandedIdx === i ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
              <MethodBadge method={ep.method} />
              <code className="text-sm font-mono text-slate-800 font-medium">{ep.path}</code>
              <span className="text-sm text-slate-500 ml-auto">{ep.summary}</span>
            </button>

            {expandedIdx === i && (
              <div className="border-t border-slate-100 px-5 py-5 bg-slate-50/40 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">{ep.description}</p>

                {ep.request && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Request Body</h4>
                    <CodeBlock code={ep.request} compact />
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Response <span className="text-emerald-500 font-normal normal-case">200 OK</span>
                  </h4>
                  <CodeBlock code={ep.response} compact />
                </div>

                {ep.errorCodes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Errors</h4>
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase w-16">Code</th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase w-44">Error</th>
                            <th className="text-left px-3 py-2 font-semibold text-slate-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ep.errorCodes.map((err, j) => (
                            <tr key={j} className="border-b border-slate-50 last:border-0">
                              <td className="px-3 py-2">
                                <span className={`px-1.5 py-0.5 rounded font-mono font-semibold ${err.code >= 500 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                                  {err.code}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-mono text-slate-700">{err.message}</td>
                              <td className="px-3 py-2 text-slate-600">{err.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No endpoints match "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Zap className="w-4 h-4" /> },
  { id: "keys", label: "API Keys", icon: <Key className="w-4 h-4" /> },
  { id: "usage", label: "Usage", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "webhooks", label: "Webhooks", icon: <Webhook className="w-4 h-4" /> },
  { id: "integrations", label: "Integrations", icon: <Plug className="w-4 h-4" /> },
  { id: "reference", label: "API Reference", icon: <BookOpen className="w-4 h-4" /> },
];

export default function DeveloperHub() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Developer Hub</h1>
          <p className="text-slate-500 mt-1">API keys, usage analytics, webhooks, integrations, and endpoint reference</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Systems Operational
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-mono text-slate-600">v1.0</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1" aria-label="Developer Hub sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "keys" && <ApiKeysTab />}
      {activeTab === "usage" && <UsageTab />}
      {activeTab === "webhooks" && <WebhooksTab />}
      {activeTab === "integrations" && <IntegrationsTab />}
      {activeTab === "reference" && <ApiReferenceTab />}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">NimbusWiz Developer Hub — Mock data for demonstration</p>
        <p className="text-xs text-slate-400">Last updated: April 3, 2026</p>
      </div>
    </div>
  );
}
