import { Search, Plus, ChevronRight, AlertCircle, CheckCircle, XCircle, X, Eye, Play, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useDemoData } from "../contexts/DemoDataContext";
import { useAnalytics } from "../contexts/AnalyticsContext";
import RegisterSystem from "./RegisterSystem";

const systems = [
  {
    id: "nimbus-lion",
    name: "nimbus-lion",
    status: "healthy",
    stability: 85,
    serialNumber: "NMB-2024-1147",
    version: "Nimbus2024",
    manufacturingYear: 2024,
    flightHours: 1247,
    maxVelocity: 87,
    handlingScore: 85,
    usageType: "Racing",
    location: "Facility A - Hangar 3",
    lastServiceDate: "2026-03-23",
    safetyCertification: "Valid",
    recommendation: "Performance Upgrade",
    recommendationConfidence: 87,
  },
  {
    id: "nimbus-eagle",
    name: "nimbus-eagle",
    status: "warning",
    stability: 72,
    serialNumber: "NMB-2022-0893",
    version: "Nimbus2022",
    manufacturingYear: 2022,
    flightHours: 2156,
    maxVelocity: 79,
    handlingScore: 72,
    usageType: "Training",
    location: "Facility B - Storage 1",
    lastServiceDate: "2026-03-20",
    safetyCertification: "Valid",
    recommendation: "Partial Modernization",
    recommendationConfidence: 74,
  },
  {
    id: "nimbus-badger",
    name: "nimbus-badger",
    status: "healthy",
    stability: 91,
    serialNumber: "NMB-2026-2341",
    version: "Nimbus2026",
    manufacturingYear: 2026,
    flightHours: 324,
    maxVelocity: 94,
    handlingScore: 91,
    usageType: "Racing",
    location: "Facility A - Hangar 1",
    lastServiceDate: "2026-03-24",
    safetyCertification: "Valid",
    recommendation: null,
    recommendationConfidence: null,
  },
  {
    id: "nimbus-dragon",
    name: "nimbus-dragon",
    status: "critical",
    stability: 58,
    serialNumber: "NMB-2020-0456",
    version: "Nimbus2020",
    manufacturingYear: 2020,
    flightHours: 4782,
    maxVelocity: 65,
    handlingScore: 58,
    usageType: "Transport",
    location: "Facility C - Maintenance Bay",
    lastServiceDate: "2026-03-11",
    safetyCertification: "Expired",
    recommendation: "Extended Operation",
    recommendationConfidence: 92,
  },
  {
    id: "nimbus-fawkes",
    name: "nimbus-fawkes",
    status: "healthy",
    stability: 88,
    serialNumber: "NMB-2025-1789",
    version: "Nimbus2025",
    manufacturingYear: 2025,
    flightHours: 892,
    maxVelocity: 90,
    handlingScore: 88,
    usageType: "Racing",
    location: "Facility A - Hangar 2",
    lastServiceDate: "2026-03-22",
    safetyCertification: "Valid",
    recommendation: null,
    recommendationConfidence: null,
  },
  {
    id: "nimbus-stag",
    name: "nimbus-stag",
    status: "warning",
    stability: 67,
    serialNumber: "NMB-2021-0634",
    version: "Nimbus2021",
    manufacturingYear: 2021,
    flightHours: 3421,
    maxVelocity: 71,
    handlingScore: 67,
    usageType: "Training",
    location: "Facility B - Hangar 4",
    lastServiceDate: "2026-03-18",
    safetyCertification: "Valid",
    recommendation: "Stable Upgrade",
    recommendationConfidence: 81,
  },
];

export default function SystemsList() {
  const { isDemoMode } = useDemoData();
  const { trackEvent } = useAnalytics();
  const [filteredSystems, setFilteredSystems] = useState(systems);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [usageTypeFilter, setUsageTypeFilter] = useState("All Usage Types");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut for search (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleChipClick = (chip: string) => {
    if (activeChips.includes(chip)) {
      setActiveChips(activeChips.filter(c => c !== chip));
      // Reset corresponding filter
      if (chip === 'Critical' || chip === 'Warning' || chip === 'Healthy') {
        setStatusFilter('All Statuses');
      }
      if (chip === 'Upgradable') {
        // Custom logic for upgradable
      }
    } else {
      setActiveChips([...activeChips, chip]);
      // Apply corresponding filter
      if (chip === 'Critical') setStatusFilter('Critical');
      if (chip === 'Warning') setStatusFilter('Warning');
      if (chip === 'Healthy') setStatusFilter('Healthy');
    }
  };

  useEffect(() => {
    let filtered = systems;

    if (searchTerm) {
      filtered = filtered.filter(
        (system) =>
          system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          system.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          system.version.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "All Statuses") {
      filtered = filtered.filter((system) => system.status === statusFilter.toLowerCase());
    }

    if (usageTypeFilter !== "All Usage Types") {
      filtered = filtered.filter((system) => system.usageType === usageTypeFilter);
    }

    setFilteredSystems(filtered);
  }, [searchTerm, statusFilter, usageTypeFilter]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Fleet Management</h1>
          <p className="text-slate-600 mt-1">Monitor and manage all legacy Nimbus systems</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setRegisterModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Register System
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, status, version, or tag (press / to focus)"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              ref={searchInputRef}
            />
          </div>
          <select
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Healthy</option>
            <option>Warning</option>
            <option>Critical</option>
          </select>
          <select
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={usageTypeFilter}
            onChange={(e) => setUsageTypeFilter(e.target.value)}
          >
            <option>All Usage Types</option>
            <option>Racing</option>
            <option>Training</option>
            <option>Transport</option>
          </select>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Quick filters:</span>
          <button
            onClick={() => handleChipClick('Critical')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeChips.includes('Critical')
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => handleChipClick('Warning')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeChips.includes('Warning')
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Warning
          </button>
          <button
            onClick={() => {
              const upgradableSystems = systems.filter(s => s.recommendation !== null);
              setFilteredSystems(upgradableSystems);
              if (!activeChips.includes('Upgradable')) {
                setActiveChips([...activeChips, 'Upgradable']);
              } else {
                setActiveChips(activeChips.filter(c => c !== 'Upgradable'));
                // Re-run filter logic
                setStatusFilter('All Statuses');
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeChips.includes('Upgradable')
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Upgradable
          </button>
          <button
            onClick={() => {
              const upToDateSystems = systems.filter(s => s.recommendation === null);
              setFilteredSystems(upToDateSystems);
              if (!activeChips.includes('Up to Date')) {
                setActiveChips([...activeChips, 'Up to Date']);
              } else {
                setActiveChips(activeChips.filter(c => c !== 'Up to Date'));
                setStatusFilter('All Statuses');
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeChips.includes('Up to Date')
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ✓ Up to Date
          </button>
        </div>
      </div>

      {/* Systems Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        {!isDemoMode && systems.length === 0 ? (
          // Empty State when no real systems
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Systems Registered Yet</h3>
            <p className="text-sm text-slate-600 mb-6">
              Try demo mode or connect your first system to get started
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Register First System
              </button>
              <button
                onClick={() => {
                  // Toggle demo mode - assume context provides this
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Play className="w-4 h-4" />
                Try Demo Mode
              </button>
            </div>
          </div>
        ) : filteredSystems.length === 0 ? (
          // Empty State when filters return no results
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Systems Match Your Filters</h3>
            <p className="text-sm text-slate-600 mb-4">
              Try adjusting your search term or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All Statuses');
                setUsageTypeFilter('All Usage Types');
                setActiveChips([]);
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">System Name</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Recommendation</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Stability Score</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Version</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Usage Type</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Flight Hours</th>
                  <th className="text-left py-3 px-4 text-sm text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSystems.map((system) => (
                  <tr key={system.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <Link
                        to={`/systems/${system.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {system.name}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                          system.status === "healthy"
                            ? "bg-green-100 text-green-700"
                            : system.status === "warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        ● {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {system.recommendation ? (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                            system.recommendationConfidence >= 80
                              ? "bg-green-100 text-green-700"
                              : system.recommendationConfidence >= 65
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {system.recommendation}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-50 text-green-700">
                          ✓ Up to Date
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${
                              system.stability >= 80
                                ? "bg-green-500"
                                : system.stability >= 65
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${system.stability}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-900">{system.stability}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-900">{system.version}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-700">
                        {system.usageType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">{system.flightHours.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/systems/${system.id}`}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Run Scan"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Total Systems</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">6</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Healthy</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">3</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Warning</p>
          <p className="text-2xl font-semibold text-yellow-600 mt-1">2</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Critical</p>
          <p className="text-2xl font-semibold text-red-600 mt-1">1</p>
        </div>
      </div>

      {/* Register System Modal */}
      <RegisterSystem isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} />
    </div>
  );
}