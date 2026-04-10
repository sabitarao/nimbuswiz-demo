import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  Server,
  ScanLine,
  Lightbulb,
  Sparkles,
  Rocket,
  Activity,
  Code,
  Cog,
  Wrench,
  Settings,
  Play,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useDemoData } from "../contexts/DemoDataContext";
import { useUserRole } from "../contexts/UserRoleContext";
import { useOnboardingTour } from "../contexts/OnboardingTourContext";
import OnboardingTour from "./OnboardingTour";
import SkipToContent from "./SkipToContent";
import GlossaryModal from "./GlossaryModal";
import { useState } from "react";

const navigation = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "Systems", path: "/systems", icon: Server },
  { name: "System Assessment", path: "/assessment", icon: ScanLine },
  { name: "Modernization Advisor", path: "/advisor", icon: Lightbulb },
  { name: "Modernization", path: "/modernization", icon: Sparkles },
  { name: "Deployment", path: "/deployment", icon: Rocket },
  { name: "Monitoring", path: "/monitoring", icon: Activity },
  { name: "Developer Hub", path: "/developer", icon: Code },
  { name: "Automation", path: "/automation", icon: Cog },
  { name: "Troubleshooting", path: "/troubleshooting", icon: Wrench },
  { name: "Audit Logs", path: "/audit-logs", icon: FileText },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Root() {
  const { isDemoMode, toggleDemoMode } = useDemoData();
  const { role } = useUserRole();
  const { startTour } = useOnboardingTour();
  const [isGlossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <>
      <SkipToContent />
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col" role="navigation" aria-label="Main navigation">
          {/* Logo/Brand */}
          <div className="px-6 py-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-white">NimbusWiz</h1>
                <p className="text-xs text-slate-400 mt-1">Where Legacy Fleets Meet Muggle Ingenuity</p>
              </div>
              <button
                onClick={() => setGlossaryOpen(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Open glossary (keyboard shortcut: ?)"
                title="Glossary (?)"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700 space-y-3">
            {/* Start Tour Button */}
            <button
              onClick={startTour}
              className="w-full px-3 py-2 rounded-lg text-sm transition-colors bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center gap-2"
              aria-label="Start interactive product tour"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Start Product Tour
            </button>
            
            {/* Demo Mode Toggle */}
            <button
              onClick={toggleDemoMode}
              className={`w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                isDemoMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              aria-pressed={isDemoMode}
              aria-label={isDemoMode ? 'Demo mode active, click to use real data' : 'Click to use demo data'}
            >
              {isDemoMode ? '● Demo Mode Active' : 'Try Demo (Your Data Safe)'}
            </button>
            
            {/* Role Badge */}
            <div className="px-3 py-2 bg-slate-800 rounded-lg" role="status" aria-label="Current user role">
              <p className="text-xs text-slate-400 mb-1">Current Role</p>
              <p className="text-sm font-medium text-white capitalize">{role}</p>
            </div>
            
            <div className="text-xs text-slate-400">
              <div>NimbusWiz v2.4.1</div>
              <div className="mt-1">© 2026 NimbusWiz</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="flex-1 overflow-auto" role="main" aria-label="Main content">
          <Outlet />
        </main>
        
        {/* Onboarding Tour */}
        <OnboardingTour />
        
        {/* Glossary Modal */}
        <GlossaryModal isOpen={isGlossaryOpen} onClose={() => setGlossaryOpen(false)} />
      </div>
    </>
  );
}