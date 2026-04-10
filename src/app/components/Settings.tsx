import { Users, Key, Shield, Bell, Globe, Database } from "lucide-react";
import { useState } from "react";

const users = [
  { name: "Kay Bell", email: "kay.bell@nimbuswiz.io", role: "Admin", status: "active", lastActive: "2 hours ago" },
  { name: "Mark Flint", email: "mark.flint@nimbuswiz.io", role: "Operator", status: "active", lastActive: "1 day ago" },
  { name: "Angie Johnson", email: "angie.johnson@nimbuswiz.io", role: "Viewer", status: "active", lastActive: "3 hours ago" },
  { name: "Zach Smith", email: "zach.smith@nimbuswiz.io", role: "Operator", status: "inactive", lastActive: "2 weeks ago" },
];

const auditLogs = [
  { timestamp: "2026-03-25 14:30:22", user: "kay.bell@nimbuswiz.io", action: "Applied upgrade profile to nimbus-lion", category: "deployment" },
  { timestamp: "2026-03-25 13:15:48", user: "mark.flint@nimbuswiz.io", action: "Generated new API key", category: "security" },
  { timestamp: "2026-03-25 11:42:17", user: "kay.bell@nimbuswiz.io", action: "Updated user permissions for angie.johnson", category: "access" },
  { timestamp: "2026-03-25 09:28:55", user: "angie.johnson@nimbuswiz.io", action: "Viewed system logs for nimbus-dragon", category: "audit" },
  { timestamp: "2026-03-24 16:33:12", user: "mark.flint@nimbuswiz.io", action: "Created deployment pipeline", category: "automation" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "users", label: "Users & Access", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "general", label: "General", icon: Globe },
    { id: "audit", label: "Audit Logs", icon: Database },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage platform configuration and security</p>
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
          {/* Users & Access Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Role-Based Access Control</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Invite User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Role</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Last Active</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-900 font-medium">{user.name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <select
                            defaultValue={user.role}
                            className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Viewer">Viewer</option>
                            <option value="Operator">Operator</option>
                            <option value="Admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{user.lastActive}</td>
                        <td className="py-3 px-4">
                          <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Viewer Role</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• View systems and metrics</li>
                    <li>• Read-only log access</li>
                    <li>• ⚠️ Cannot deploy or modify systems</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Operator Role</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• All Viewer permissions</li>
                    <li>• Deploy upgrade profiles</li>
                    <li>• Run diagnostics and scans</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Admin Role</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• All Operator permissions</li>
                    <li>• Manage users and roles</li>
                    <li>• Configure platform settings</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">API Key Rotation</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">Automatic API Key Rotation</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Enable automatic rotation of API keys every 90 days for enhanced security.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Two-Factor Authentication</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Require 2FA for all users</p>
                      <p className="text-xs text-slate-600 mt-1">Enhanced security for account access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900">SMS-based authentication</p>
                      <p className="text-xs text-slate-600 mt-1">Use SMS codes as backup method</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Management</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Session timeout</p>
                      <p className="text-xs text-slate-600 mt-1">Auto logout after inactivity</p>
                    </div>
                    <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Critical system alerts</p>
                    <p className="text-xs text-slate-600 mt-1">Immediate notifications for critical issues</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Deployment updates</p>
                    <p className="text-xs text-slate-600 mt-1">Status updates for deployments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Weekly summary reports</p>
                    <p className="text-xs text-slate-600 mt-1">Email digest of system health</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Maintenance notifications</p>
                    <p className="text-xs text-slate-600 mt-1">Scheduled maintenance reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Notification Channels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">Email</span>
                      <Key className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-slate-600">admin@nimbuswiz.io</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">Slack</span>
                      <Key className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-xs text-slate-600">#nimbus-alerts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="NimbusWiz Enterprise"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Default Timezone</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>UTC</option>
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Europe/London</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-2">Date Format</label>
                    <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>YYYY-MM-DD</option>
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Audit Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Timestamp</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">User</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Action</th>
                      <th className="text-left py-3 px-4 text-sm text-slate-600">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 text-sm text-slate-600">{log.timestamp}</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{log.user}</td>
                        <td className="py-3 px-4 text-sm text-slate-900">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-700">
                            {log.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}