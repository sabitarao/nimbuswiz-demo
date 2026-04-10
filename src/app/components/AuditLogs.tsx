import { CheckCircle, RotateCcw, AlertTriangle, User, Calendar, Filter, Download } from 'lucide-react';
import { useState } from 'react';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  role: 'admin' | 'operator' | 'viewer';
  action: 'apply' | 'rollback' | 'register' | 'delete' | 'simulate' | 'view';
  target: string;
  details: string;
  status: 'success' | 'failed' | 'pending';
  metadata?: {
    before?: string;
    after?: string;
    duration?: string;
    reason?: string;
  };
}

const sampleLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date('2026-04-02T14:32:15'),
    user: 'mark.flint@nimbuswiz.io',
    role: 'operator',
    action: 'apply',
    target: 'nimbus-lion',
    details: 'Applied Performance Upgrade profile',
    status: 'success',
    metadata: {
      before: 'Nimbus2020',
      after: 'Nimbus2024',
      duration: '8m 34s',
    },
  },
  {
    id: '2',
    timestamp: new Date('2026-04-02T13:15:22'),
    user: 'kay.bell@nimbuswiz.io',
    role: 'admin',
    action: 'rollback',
    target: 'nimbus-eagle',
    details: 'Rolled back Partial Modernization due to quirk conflicts',
    status: 'success',
    metadata: {
      before: 'Nimbus2024-beta',
      after: 'Nimbus2020',
      duration: '3m 12s',
      reason: 'Quirk conflict detected in dependency chain',
    },
  },
  {
    id: '3',
    timestamp: new Date('2026-04-02T11:48:03'),
    user: 'zach.smith@nimbuswiz.io',
    role: 'operator',
    action: 'simulate',
    target: 'nimbus-dragon',
    details: 'Ran dry-run simulation for Extended Operation profile',
    status: 'success',
    metadata: {
      duration: '32s',
    },
  },
  {
    id: '4',
    timestamp: new Date('2026-04-02T10:22:41'),
    user: 'kay.bell@nimbuswiz.io',
    role: 'admin',
    action: 'register',
    target: 'nimbus-phoenix',
    details: 'Registered new system to fleet',
    status: 'success',
  },
  {
    id: '5',
    timestamp: new Date('2026-04-02T09:05:18'),
    user: 'mark.flint@nimbuswiz.io',
    role: 'operator',
    action: 'apply',
    target: 'nimbus-badger',
    details: 'Applied Security Patch bundle',
    status: 'failed',
    metadata: {
      reason: 'Insufficient disk space (28.4 GB required, 21.1 GB available)',
    },
  },
  {
    id: '6',
    timestamp: new Date('2026-04-01T16:42:09'),
    user: 'kay.bell@nimbuswiz.io',
    role: 'admin',
    action: 'delete',
    target: 'nimbus-old-test',
    details: 'Removed decommissioned test system',
    status: 'success',
  },
];

export default function AuditLogs() {
  const [logs] = useState(sampleLogs);
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (filterUser !== 'all' && log.user !== filterUser) return false;
    return true;
  });

  const uniqueUsers = Array.from(new Set(logs.map((log) => log.user)));

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'apply':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'rollback':
        return <RotateCcw className="w-5 h-5 text-yellow-600" />;
      case 'simulate':
        return <AlertTriangle className="w-5 h-5 text-purple-600" />;
      case 'register':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'delete':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getActionColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'apply':
        return 'bg-blue-100 text-blue-700';
      case 'rollback':
        return 'bg-yellow-100 text-yellow-700';
      case 'simulate':
        return 'bg-purple-100 text-purple-700';
      case 'register':
        return 'bg-green-100 text-green-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600 mt-1">Complete history of all system operations and changes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          
          <select
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="apply">Apply</option>
            <option value="rollback">Rollback</option>
            <option value="simulate">Simulate</option>
            <option value="register">Register</option>
            <option value="delete">Delete</option>
          </select>

          <select
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="all">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          <div className="text-sm text-slate-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="text-sm text-slate-900">{log.user}</div>
                        <div className="text-xs text-slate-500 capitalize">{log.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded capitalize ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-slate-900">{log.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{log.details}</div>
                    {log.metadata && (
                      <div className="mt-1 space-y-0.5">
                        {log.metadata.before && log.metadata.after && (
                          <div className="text-xs text-slate-500">
                            {log.metadata.before} → {log.metadata.after}
                          </div>
                        )}
                        {log.metadata.duration && (
                          <div className="text-xs text-slate-500">Duration: {log.metadata.duration}</div>
                        )}
                        {log.metadata.reason && (
                          <div className="text-xs text-red-600">{log.metadata.reason}</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border capitalize ${getStatusColor(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-slate-600">Successful Operations</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {logs.filter((l) => l.status === 'success').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-slate-600">Failed Operations</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {logs.filter((l) => l.status === 'failed').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-slate-600">Rollbacks</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {logs.filter((l) => l.action === 'rollback').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-slate-600">Active Users</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{uniqueUsers.length}</p>
        </div>
      </div>
    </div>
  );
}