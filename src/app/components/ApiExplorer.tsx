import { useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Server,
  Plug,
  Shield,
  Key,
  AlertTriangle,
  Lock,
  Zap,
} from "lucide-react";

// --- Types ---
interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  auth: "Bearer Token" | "API Key" | "Internal mTLS";
  request?: string;
  response: string;
  errorCodes: { code: number; message: string; description: string }[];
}

interface ApiSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  baseUrl: string;
  authScheme: string;
  authDescription: string;
  authExample: string;
  endpoints: Endpoint[];
  rateLimits?: string;
}

// --- Mock Data ---
const apiSections: ApiSection[] = [
  {
    id: "external",
    title: "NimbusCloud Deployment API",
    subtitle: "External / Customer-Facing",
    description:
      "Public REST API for automating system management, triggering deployments, and retrieving fleet status. Designed for CI/CD integration, scripting, and third-party platform connectivity.",
    icon: <Globe className="w-5 h-5" />,
    baseUrl: "https://api.nimbuswiz.io/v1",
    authScheme: "Bearer Token (API Key)",
    authDescription:
      "All requests require a valid API key passed as a Bearer token in the Authorization header. Keys are scoped to your organization and can be generated from the API & Integrations settings page. Tokens do not expire but can be revoked at any time.",
    authExample: `curl -X GET https://api.nimbuswiz.io/v1/fleet \\
  -H "Authorization: Bearer nbcs_flight_a8f2d9e1b4c7" \\
  -H "Content-Type: application/json" \\
  -H "X-Request-ID: req_7f3a2b1c"`,
    rateLimits: "1,000 requests/minute per key. Burst: 50 req/sec. Rate limit headers included in every response.",
    endpoints: [
      {
        method: "POST",
        path: "/fleet/scan",
        summary: "Initiate system scan",
        description:
          "Triggers a comprehensive compatibility and health scan on a registered system. Returns a scan job ID for polling results. Scans typically complete within 30-90 seconds depending on system complexity.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            system_id: "nmb-2024-1147",
            scan_type: "full",
            include_dependencies: true,
            notify_on_complete: true,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            scan_id: "scn_8a2f4e6b1d3c",
            system_id: "nmb-2024-1147",
            status: "in_progress",
            estimated_duration_sec: 45,
            created_at: "2026-04-03T14:22:00Z",
            _links: {
              self: "/v1/fleet/scans/scn_8a2f4e6b1d3c",
              system: "/v1/fleet/nmb-2024-1147",
            },
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "invalid_scan_type", description: "Scan type must be 'full', 'quick', or 'dependency_only'" },
          { code: 404, message: "system_not_found", description: "No system found with the provided system_id" },
          { code: 409, message: "scan_in_progress", description: "A scan is already running for this system" },
          { code: 429, message: "rate_limit_exceeded", description: "Too many requests. Retry after the duration in Retry-After header" },
        ],
      },
      {
        method: "POST",
        path: "/deployments",
        summary: "Create deployment",
        description:
          "Creates a new deployment for a modernized system. Supports staged rollout with configurable phases. A dry run can be requested to validate the deployment plan without executing changes.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            system_id: "nmb-2024-1147",
            upgrade_plan_id: "plan_3c7a9f2e",
            strategy: "staged",
            dry_run: false,
            stages: [
              { name: "canary", percentage: 10, duration_min: 30 },
              { name: "partial", percentage: 50, duration_min: 60 },
              { name: "full", percentage: 100 },
            ],
            rollback_on_failure: true,
            notification_channel: "slack",
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            deployment_id: "dep_4b8e2a1f6c9d",
            system_id: "nmb-2024-1147",
            status: "initiated",
            strategy: "staged",
            current_stage: "canary",
            progress_pct: 0,
            created_at: "2026-04-03T14:30:00Z",
            created_by: "kay.bell@nimbuswiz.io",
            estimated_completion: "2026-04-03T16:00:00Z",
            _links: {
              self: "/v1/deployments/dep_4b8e2a1f6c9d",
              rollback: "/v1/deployments/dep_4b8e2a1f6c9d/rollback",
              logs: "/v1/deployments/dep_4b8e2a1f6c9d/logs",
            },
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "invalid_strategy", description: "Strategy must be 'staged', 'blue_green', or 'immediate'" },
          { code: 404, message: "plan_not_found", description: "Upgrade plan does not exist or has expired" },
          { code: 409, message: "deployment_active", description: "An active deployment already exists for this system" },
          { code: 422, message: "assessment_required", description: "System must pass assessment before deployment" },
        ],
      },
      {
        method: "GET",
        path: "/deployments/{id}",
        summary: "Get deployment status",
        description:
          "Retrieves the current status, progress, and stage details of a specific deployment. Includes real-time metrics and rollback eligibility.",
        auth: "Bearer Token",
        response: JSON.stringify(
          {
            deployment_id: "dep_4b8e2a1f6c9d",
            system_id: "nmb-2024-1147",
            status: "in_progress",
            strategy: "staged",
            current_stage: "partial",
            progress_pct: 62,
            health: {
              stability_score: 94,
              error_rate: 0.02,
              latency_p99_ms: 180,
            },
            stages: [
              { name: "canary", status: "completed", started_at: "2026-04-03T14:30:00Z", completed_at: "2026-04-03T15:00:00Z" },
              { name: "partial", status: "in_progress", started_at: "2026-04-03T15:00:00Z", completed_at: null },
              { name: "full", status: "pending", started_at: null, completed_at: null },
            ],
            rollback_eligible: true,
            created_by: "kay.bell@nimbuswiz.io",
            updated_at: "2026-04-03T15:32:00Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 404, message: "deployment_not_found", description: "No deployment found with the provided ID" },
        ],
      },
      {
        method: "POST",
        path: "/deployments/{id}/rollback",
        summary: "Rollback deployment",
        description:
          "Initiates an immediate rollback to the pre-deployment state. Only available for deployments that have not yet reached 'completed' status. Preserves audit trail.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            reason: "Elevated error rate detected in partial stage",
            force: false,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            rollback_id: "rbk_9d3f7a2e1b4c",
            deployment_id: "dep_4b8e2a1f6c9d",
            status: "rolling_back",
            initiated_by: "mark.flint@nimbuswiz.io",
            initiated_at: "2026-04-03T15:35:00Z",
            estimated_duration_sec: 120,
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "reason_required", description: "A rollback reason is required for audit compliance" },
          { code: 409, message: "already_completed", description: "Cannot rollback a completed deployment" },
          { code: 409, message: "rollback_in_progress", description: "A rollback is already in progress" },
        ],
      },
      {
        method: "GET",
        path: "/fleet/{id}/status",
        summary: "Get system status",
        description:
          "Returns the current operational status, performance metrics, and certification status for a specific system in the fleet.",
        auth: "Bearer Token",
        response: JSON.stringify(
          {
            system_id: "nmb-2024-1147",
            serial_number: "NMB-2024-1147",
            name: "nimbus-lion",
            status: "operational",
            manufacturing_year: 2024,
            flight_hours: 1247,
            max_velocity_mph: 87,
            handling_score: 92,
            usage_type: "Racing",
            location: "Training Grounds - North Wing",
            safety_certification: {
              status: "valid",
              issued: "2026-01-15",
              expires: "2027-01-15",
              authority: "NimbusWiz Certification Board",
            },
            last_assessment: {
              date: "2026-03-28",
              compatibility_score: 88,
              risk_level: "low",
            },
            updated_at: "2026-04-03T14:00:00Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 404, message: "system_not_found", description: "No system found with the provided ID" },
          { code: 403, message: "insufficient_scope", description: "API key does not have read access to this system" },
        ],
      },
    ],
  },
  {
    id: "internal",
    title: "Platform Microservices",
    subtitle: "Internal Service APIs",
    description:
      "Internal service-to-service APIs that power the NimbusWiz platform. These endpoints are not publicly accessible and use mutual TLS (mTLS) for authentication between services. Documented here for platform transparency and developer reference.",
    icon: <Server className="w-5 h-5" />,
    baseUrl: "https://internal.nimbuswiz.svc.cluster.local",
    authScheme: "Mutual TLS (mTLS)",
    authDescription:
      "Internal services authenticate via mutual TLS certificates issued by the NimbusWiz internal CA. Service identity is derived from the client certificate's CN field. No API keys or bearer tokens are used for internal communication.",
    authExample: `# Internal service call (mTLS)
curl --cert /etc/nimbus/tls/client.crt \\
     --key /etc/nimbus/tls/client.key \\
     --cacert /etc/nimbus/tls/ca.crt \\
     https://discovery.nimbuswiz.svc.cluster.local/internal/systems/discover`,
    endpoints: [
      {
        method: "POST",
        path: "/discovery/systems/discover",
        summary: "Discovery Service: Scan system components",
        description:
          "Scans a system's architecture to identify all subsystems, dependencies, and compatibility markers. Used by the Assessment screen to generate compatibility scores.",
        auth: "Internal mTLS",
        request: JSON.stringify(
          {
            system_id: "nmb-2024-1147",
            depth: "full",
            include_transitive_deps: true,
            timeout_sec: 60,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            discovery_id: "dsc_2a4f6e8b1c3d",
            system_id: "nmb-2024-1147",
            components: [
              { name: "velocity_controller", version: "3.2.1", status: "compatible", upgrade_path: "3.2.1 -> 4.0.0" },
              { name: "stability_module", version: "2.8.0", status: "compatible", upgrade_path: "2.8.0 -> 3.1.0" },
              { name: "navigation_core", version: "1.4.3", status: "attention", upgrade_path: "1.4.3 -> 2.0.0", blockers: ["deprecated_compass_api"] },
            ],
            dependency_graph: {
              nodes: 14,
              edges: 22,
              circular_deps: 0,
            },
            completed_at: "2026-04-03T14:22:45Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 504, message: "discovery_timeout", description: "System discovery exceeded the configured timeout" },
          { code: 503, message: "service_unavailable", description: "Discovery service is temporarily unavailable" },
        ],
      },
      {
        method: "POST",
        path: "/transformation/plan",
        summary: "Transformation Service: Generate upgrade plan",
        description:
          "Analyzes discovery results and generates an optimal transformation plan with ordered upgrade steps, risk assessment, and estimated duration. Powers the Modernization Advisor.",
        auth: "Internal mTLS",
        request: JSON.stringify(
          {
            discovery_id: "dsc_2a4f6e8b1c3d",
            system_id: "nmb-2024-1147",
            strategy: "conservative",
            preserve_configurations: true,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            plan_id: "plan_3c7a9f2e",
            system_id: "nmb-2024-1147",
            strategy: "conservative",
            risk_level: "low",
            estimated_duration_min: 45,
            steps: [
              { order: 1, component: "navigation_core", action: "upgrade", from: "1.4.3", to: "2.0.0", risk: "medium", requires_restart: true },
              { order: 2, component: "stability_module", action: "upgrade", from: "2.8.0", to: "3.1.0", risk: "low", requires_restart: false },
              { order: 3, component: "velocity_controller", action: "upgrade", from: "3.2.1", to: "4.0.0", risk: "low", requires_restart: true },
            ],
            rollback_checkpoints: 3,
            generated_at: "2026-04-03T14:23:10Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "invalid_discovery", description: "Discovery results are stale (older than 24 hours) or incomplete" },
          { code: 422, message: "unresolvable_blockers", description: "System has blockers that prevent plan generation" },
        ],
      },
      {
        method: "POST",
        path: "/deployment-engine/execute",
        summary: "Deployment Service: Execute deployment",
        description:
          "Executes a transformation plan against a target system. Manages staged rollout, health checks between stages, and automatic rollback triggers. This is the internal engine behind the public /deployments endpoint.",
        auth: "Internal mTLS",
        request: JSON.stringify(
          {
            plan_id: "plan_3c7a9f2e",
            system_id: "nmb-2024-1147",
            execution_mode: "staged",
            health_check_interval_sec: 30,
            auto_rollback_threshold: {
              error_rate: 0.05,
              latency_p99_ms: 500,
            },
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            execution_id: "exe_6d9b3f2a1e4c",
            deployment_id: "dep_4b8e2a1f6c9d",
            status: "executing",
            current_step: 1,
            total_steps: 3,
            health_checks_passed: 0,
            started_at: "2026-04-03T14:30:00Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 409, message: "execution_conflict", description: "Another execution is in progress for this system" },
          { code: 500, message: "execution_failed", description: "Internal execution failure. Check deployment logs." },
        ],
      },
    ],
  },
  {
    id: "integration",
    title: "Integration APIs",
    subtitle: "Third-Party Connectors",
    description:
      "NimbusWiz integrates with CI/CD pipelines, cloud infrastructure providers, and monitoring platforms. These endpoints describe the webhook and callback contracts used by connected services to interact with the platform.",
    icon: <Plug className="w-5 h-5" />,
    baseUrl: "https://hooks.nimbuswiz.io/v1",
    authScheme: "Webhook Signature (HMAC-SHA256)",
    authDescription:
      "Inbound webhooks are verified using HMAC-SHA256 signatures. Each integration generates a unique signing secret. The signature is sent in the X-NimbusWiz-Signature header. Outbound callbacks include a shared secret for verification.",
    authExample: `# Verifying inbound webhook signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" | cut -d' ' -f2)

# Signature header format:
# X-NimbusWiz-Signature: sha256=a1b2c3d4e5f6...

# Outbound callback from NimbusWiz includes:
# X-NimbusWiz-Timestamp: 1712160000
# X-NimbusWiz-Signature: sha256=...`,
    endpoints: [
      {
        method: "POST",
        path: "/ci-cd/trigger",
        summary: "CI/CD Pipeline Trigger",
        description:
          "Receives deployment triggers from CI/CD platforms (GitHub Actions, Jenkins, GitLab CI). Maps pipeline events to NimbusWiz deployment workflows. Supports automatic system detection from repository metadata.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            source: "github_actions",
            event: "workflow_completed",
            repository: "nimbuswiz/fleet-configs",
            branch: "main",
            commit_sha: "a3f8d2e",
            system_mapping: {
              repository_path: "systems/nmb-2024-1147",
              system_id: "nmb-2024-1147",
            },
            trigger_deployment: true,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            webhook_id: "whk_7b3e9a1f4c2d",
            status: "accepted",
            matched_system: "nmb-2024-1147",
            deployment_triggered: true,
            deployment_id: "dep_4b8e2a1f6c9d",
            processed_at: "2026-04-03T14:28:00Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "unknown_source", description: "CI/CD source not recognized. Supported: github_actions, jenkins, gitlab_ci" },
          { code: 401, message: "invalid_signature", description: "Webhook signature verification failed" },
          { code: 422, message: "no_system_match", description: "Could not match repository to a registered system" },
        ],
      },
      {
        method: "POST",
        path: "/monitoring/ingest",
        summary: "Monitoring Data Ingest",
        description:
          "Receives health metrics and alert data from connected monitoring platforms (Datadog, PagerDuty, Prometheus). Normalizes metrics and feeds them into the NimbusWiz monitoring dashboard and automated response rules.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            source: "datadog",
            system_id: "nmb-2024-1147",
            metrics: [
              { name: "stability_score", value: 94, unit: "percent", timestamp: "2026-04-03T14:30:00Z" },
              { name: "response_latency_p99", value: 180, unit: "ms", timestamp: "2026-04-03T14:30:00Z" },
              { name: "error_rate", value: 0.02, unit: "percent", timestamp: "2026-04-03T14:30:00Z" },
            ],
            alert: null,
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            ingest_id: "ing_4a8f2e6b1c3d",
            status: "processed",
            metrics_accepted: 3,
            alerts_triggered: 0,
            automation_rules_evaluated: 2,
            processed_at: "2026-04-03T14:30:01Z",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "invalid_metrics", description: "One or more metric entries are malformed or missing required fields" },
          { code: 413, message: "payload_too_large", description: "Metrics batch exceeds maximum of 100 entries per request" },
        ],
      },
      {
        method: "POST",
        path: "/cloud/provision",
        summary: "Cloud Infrastructure Provisioning",
        description:
          "Triggers infrastructure provisioning through connected cloud providers (Terraform, CloudFormation). Creates or updates the compute environment required for a system deployment. Returns a provisioning job for status tracking.",
        auth: "Bearer Token",
        request: JSON.stringify(
          {
            provider: "terraform",
            system_id: "nmb-2024-1147",
            environment: "staging",
            config: {
              instance_type: "nimbus.large",
              region: "eu-west-1",
              auto_scaling: true,
              min_instances: 2,
              max_instances: 8,
            },
          },
          null,
          2
        ),
        response: JSON.stringify(
          {
            provision_id: "prv_5c9d3a7f2e1b",
            status: "provisioning",
            provider: "terraform",
            environment: "staging",
            resources_planned: 6,
            estimated_duration_sec: 180,
            created_at: "2026-04-03T14:32:00Z",
            _links: {
              status: "/v1/cloud/provisions/prv_5c9d3a7f2e1b",
              logs: "/v1/cloud/provisions/prv_5c9d3a7f2e1b/logs",
            },
          },
          null,
          2
        ),
        errorCodes: [
          { code: 400, message: "invalid_provider", description: "Provider must be 'terraform', 'cloudformation', or 'pulumi'" },
          { code: 403, message: "credentials_expired", description: "Cloud provider credentials have expired. Re-authenticate in Settings." },
          { code: 409, message: "environment_locked", description: "Target environment is locked by another provisioning job" },
        ],
      },
      {
        method: "POST",
        path: "/callbacks/deployment-status",
        summary: "Deployment Status Callback (Outbound)",
        description:
          "Outbound webhook sent by NimbusWiz to registered callback URLs when deployment status changes. Configure callback URLs in the Webhooks section of API & Integrations. This documents the payload your service will receive.",
        auth: "Bearer Token",
        response: JSON.stringify(
          {
            event: "deployment.stage_completed",
            deployment_id: "dep_4b8e2a1f6c9d",
            system_id: "nmb-2024-1147",
            stage: "canary",
            status: "completed",
            health: {
              stability_score: 96,
              error_rate: 0.01,
            },
            next_stage: "partial",
            timestamp: "2026-04-03T15:00:00Z",
            org_id: "org_nimbuswiz",
          },
          null,
          2
        ),
        errorCodes: [
          { code: 0, message: "Delivery retries", description: "NimbusWiz retries failed deliveries 3 times with exponential backoff (10s, 60s, 300s)" },
        ],
      },
    ],
  },
];

// --- Helpers ---
const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
  POST: { bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
  PUT: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
  DELETE: { bg: "bg-red-50 border-red-200", text: "text-red-700" },
  PATCH: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700" },
};

function MethodBadge({ method }: { method: string }) {
  const colors = methodColors[method] || methodColors.GET;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-mono font-semibold ${colors.bg} ${colors.text}`}
    >
      {method}
    </span>
  );
}

function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/60 border-b border-slate-700">
          <span className="text-xs text-slate-400 font-mono uppercase">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="text-slate-100 font-mono">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint, index }: { endpoint: Endpoint; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        )}
        <MethodBadge method={endpoint.method} />
        <code className="text-sm font-mono text-slate-800 font-medium">{endpoint.path}</code>
        <span className="text-sm text-slate-500 ml-auto">{endpoint.summary}</span>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-5 space-y-5 bg-slate-50/40">
          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">{endpoint.description}</p>

          {/* Auth */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Authentication: <span className="font-medium text-slate-700">{endpoint.auth}</span></span>
          </div>

          {/* Request */}
          {endpoint.request && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Request Body</h4>
              <CodeBlock code={endpoint.request} />
            </div>
          )}

          {/* Response */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {endpoint.request ? "Response" : "Response / Payload"} <span className="text-emerald-500 font-normal">200 OK</span>
            </h4>
            <CodeBlock code={endpoint.response} />
          </div>

          {/* Error Codes */}
          {endpoint.errorCodes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Error Responses</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase w-20">Code</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase w-48">Error</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.errorCodes.map((err, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                            err.code >= 500 ? "bg-red-50 text-red-700" :
                            err.code >= 400 ? "bg-amber-50 text-amber-700" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {err.code || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-slate-700">{err.message}</td>
                        <td className="px-4 py-2.5 text-slate-600">{err.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function ApiExplorer() {
  const [activeTab, setActiveTab] = useState("external");
  const section = apiSections.find((s) => s.id === activeTab)!;

  const tabMeta: { id: string; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "external", label: "External API", icon: <Globe className="w-4 h-4" />, count: apiSections[0].endpoints.length },
    { id: "internal", label: "Internal Services", icon: <Server className="w-4 h-4" />, count: apiSections[1].endpoints.length },
    { id: "integration", label: "Integrations", icon: <Plug className="w-4 h-4" />, count: apiSections[2].endpoints.length },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">API Explorer</h1>
          <p className="text-slate-500 mt-1">
            Authentication, endpoints, request/response examples, and error handling
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Systems Operational
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-mono text-slate-600">
            v1.0
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1" aria-label="API sections">
          {tabMeta.map((tab) => (
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
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600">
            {section.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-500">{section.subtitle}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed max-w-3xl">{section.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Zap className="w-3.5 h-3.5" />
                Base URL:
                <code className="font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded">{section.baseUrl}</code>
              </div>
              {section.rateLimits && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {section.rateLimits}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
          <Shield className="w-4.5 h-4.5 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Authentication</h3>
          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
            {section.authScheme}
          </span>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">{section.authDescription}</p>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Example</h4>
            <CodeBlock code={section.authExample} language="bash" />
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-4.5 h-4.5 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Endpoints</h3>
          <span className="text-xs text-slate-400">{section.endpoints.length} available</span>
        </div>
        <div className="space-y-3">
          {section.endpoints.map((endpoint, i) => (
            <EndpointCard key={`${section.id}-${i}`} endpoint={endpoint} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          NimbusWiz API Explorer -- Mock data for demonstration purposes
        </p>
        <p className="text-xs text-slate-400">
          Last updated: April 3, 2026
        </p>
      </div>
    </div>
  );
}
