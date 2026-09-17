import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, ROLE_LABELS, type SessionUser } from "../lib/api";

const NAV_BY_ROLE = {
  owner: [
    { to: "/", label: "Overview", icon: "◐" },
    { to: "/projects", label: "Projects", icon: "▣" },
    { to: "/mentorship", label: "Mentorship", icon: "✦" },
    { to: "/tasks", label: "Tasks", icon: "✓" },
    { to: "/calendar", label: "Calendar", icon: "▦" },
    { to: "/social", label: "Social", icon: "◉" },
    { to: "/finance", label: "Finance", icon: "◆" },
    { to: "/team", label: "Team", icon: "◇" },
    { to: "/settings", label: "Settings", icon: "⚙" }
  ],
  assistant: [
    { to: "/", label: "Overview", icon: "◐" },
    { to: "/projects", label: "Projects", icon: "▣" },
    { to: "/mentorship", label: "Mentorship", icon: "✦" },
    { to: "/tasks", label: "Tasks", icon: "✓" },
    { to: "/calendar", label: "Calendar", icon: "▦" },
    { to: "/social", label: "Social", icon: "◉" },
    { to: "/settings", label: "Settings", icon: "⚙" }
  ],
  finance_manager: [
    { to: "/", label: "Overview", icon: "◐" },
    { to: "/finance", label: "Finance", icon: "◆" },
    { to: "/tasks", label: "Tasks", icon: "✓" },
    { to: "/calendar", label: "Calendar", icon: "▦" },
    { to: "/settings", label: "Settings", icon: "⚙" }
  ]
} as const;

export function Shell() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api<SessionUser>("/api/auth/me")
      .catch(() => navigate("/login", { replace: true }))
      .then(u => setUser(u));
  }, [navigate]);

  if (!user) {
    return <div className="min-h-full grid place-items-center text-ink-lo">Loading…</div>;
  }

  const navItems = NAV_BY_ROLE[user.role];

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-full flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-line bg-bg-panel">
        <div className="h-16 flex items-center px-5 border-b border-line">
          <img src="/brand/wonda-wordmark.svg" alt="Jerry Wonda" className="h-6" />
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${
                  isActive ? "bg-bg-elev text-ink-hi" : "text-ink-lo hover:text-ink-hi hover:bg-bg-elev/50"
                }`
              }>
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-gold rounded-r" />}
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-bg-elev grid place-items-center text-xs text-gold">
              {user.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm truncate">{user.name}</div>
              <div className="text-[11px] text-ink-lo">{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-ghost w-full mt-2 text-xs">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-line bg-bg-panel">
          <img src="/brand/wonda-wordmark.svg" alt="Jerry Wonda" className="h-5" />
          <button onClick={logout} className="text-xs text-ink-lo">Sign out</button>
        </header>

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet context={user} />
        </main>

        {/* Bottom tab bar — mobile only */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-line bg-bg-panel/95 backdrop-blur"
             style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
            {navItems.slice(0, 5).map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-2.5 text-[10px] gap-0.5 ${
                    isActive ? "text-gold" : "text-ink-lo"
                  }`
                }>
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}