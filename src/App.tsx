import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import { Shell } from "./components/Shell";

const Overview = lazy(() => import("./pages/Overview").then(m => ({ default: m.Overview })));
const Projects = lazy(() => import("./pages/Projects").then(m => ({ default: m.Projects })));
const Mentorship = lazy(() => import("./pages/Mentorship").then(m => ({ default: m.Mentorship })));
const Tasks = lazy(() => import("./pages/Tasks").then(m => ({ default: m.Tasks })));
const Calendar = lazy(() => import("./pages/Calendar").then(m => ({ default: m.Calendar })));
const Social = lazy(() => import("./pages/Social").then(m => ({ default: m.Social })));
const Finance = lazy(() => import("./pages/Finance").then(m => ({ default: m.Finance })));
const Team = lazy(() => import("./pages/Team").then(m => ({ default: m.Team })));
const Settings = lazy(() => import("./pages/Settings").then(m => ({ default: m.Settings })));

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 bg-bg-elev rounded animate-pulse" />
      <div className="h-32 bg-bg-panel rounded-xl animate-pulse" />
      <div className="h-32 bg-bg-panel rounded-xl animate-pulse" />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Shell />}>
        <Route path="/" element={<Suspense fallback={<PageFallback />}><Overview /></Suspense>} />
        <Route path="/projects" element={<Suspense fallback={<PageFallback />}><Projects /></Suspense>} />
        <Route path="/mentorship" element={<Suspense fallback={<PageFallback />}><Mentorship /></Suspense>} />
        <Route path="/tasks" element={<Suspense fallback={<PageFallback />}><Tasks /></Suspense>} />
        <Route path="/calendar" element={<Suspense fallback={<PageFallback />}><Calendar /></Suspense>} />
        <Route path="/social" element={<Suspense fallback={<PageFallback />}><Social /></Suspense>} />
        <Route path="/finance" element={<Suspense fallback={<PageFallback />}><Finance /></Suspense>} />
        <Route path="/team" element={<Suspense fallback={<PageFallback />}><Team /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<PageFallback />}><Settings /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}