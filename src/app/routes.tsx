import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Dashboard from "./components/Dashboard";
import SystemsList from "./components/SystemsList";
import SystemDetail from "./components/SystemDetail";
import SystemAssessment from "./components/SystemAssessment";
import ModernizationAdvisor from "./components/ModernizationAdvisor";
import Modernization from "./components/Modernization";
import Deployment from "./components/Deployment";
import Monitoring from "./components/Monitoring";
import DeveloperHub from "./components/DeveloperHub";
import Automation from "./components/Automation";
import Troubleshooting from "./components/Troubleshooting";
import Settings from "./components/Settings";
import AuditLogs from "./components/AuditLogs";
import DevHubSketch from "./components/DevHubSketch";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "systems", Component: SystemsList },
      { path: "systems/:id", Component: SystemDetail },
      { path: "assessment", Component: SystemAssessment },
      { path: "advisor", Component: ModernizationAdvisor },
      { path: "modernization", Component: Modernization },
      { path: "deployment", Component: Deployment },
      { path: "monitoring", Component: Monitoring },
      { path: "developer", Component: DeveloperHub },
      { path: "automation", Component: Automation },
      { path: "troubleshooting", Component: Troubleshooting },
      { path: "audit-logs", Component: AuditLogs },
      { path: "developer-sketch", Component: DevHubSketch },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);