import { useQuery } from "@tanstack/react-query";
import { api, ROLE_LABELS, type Role } from "../lib/api";
import { PageHeader } from "../components/Section";

interface Member {
  id: string; name: string; email: string; role: Role; status: string; avatarUrl: string | null;
}

export function Team() {
  const { data = [] } = useQuery({ queryKey: ["team"], queryFn: () => api<Member[]>("/api/team") });

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="Team" subtitle="Three-seat inner circle" action={
        <button className="btn-primary text-sm">+ Invite Team Member</button>
      } />

      <div className="card divide-y divide-line">
        {data.map(m => (
          <div key={m.id} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-bg-elev grid place-items-center text-sm text-gold">
              {m.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{m.name}</div>
              <div className="text-xs text-ink-lo">{ROLE_LABELS[m.role]} · {m.email}</div>
            </div>
            <span className={`pill text-[10px] ${m.status === "online" ? "bg-emerald/10 text-emerald" : "border border-line text-ink-lo"}`}>
              {m.status}
            </span>
            <button className="text-ink-lo hover:text-ink-hi px-2">⋯</button>
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] text-ink-lo mt-6">
        {data.length} of 3 seats used
      </div>
    </div>
  );
}