import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, PageHeader } from "../components/Section";

interface Project {
  id: string; name: string; type: string; status: string; progressPct: number;
}

const TYPE_COLOR: Record<string, string> = {
  studio: "text-gold border-gold/40 bg-gold/5",
  label: "text-violet border-violet/40 bg-violet/5",
  academy: "text-emerald border-emerald/40 bg-emerald/5",
  humanitarian: "text-amber border-amber/40 bg-amber/5",
  civic: "text-rose border-rose/40 bg-rose/5",
  creative: "text-ink-hi border-line bg-bg-elev"
};

const STATUS_DOT: Record<string, string> = {
  active: "bg-emerald", planning: "bg-amber", "on-hold": "bg-rose", done: "bg-ink-lo"
};

export function Projects() {
  const { data = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => api<Project[]>("/api/projects")
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title="Projects" action={
        <div className="flex gap-2">
          <button className="btn-ghost text-sm">Filter</button>
          <button className="btn-ghost text-sm">Sort</button>
          <button className="btn-primary text-sm">+ New Project</button>
        </div>
      } />

      <div className="grid md:grid-cols-2 gap-3">
        {data.map(p => (
          <Card key={p.id} accent className="hover:bg-bg-elev transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="font-medium">{p.name}</div>
              <span className={`pill border ${TYPE_COLOR[p.type] ?? TYPE_COLOR.creative}`}>{p.type}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-lo mb-3">
              <span className={`dot ${STATUS_DOT[p.status] ?? "bg-ink-lo"}`} />
              <span className="capitalize">{p.status}</span>
            </div>
            <div className="fader mb-2">
              <div className="fader-fill" style={{ width: `${p.progressPct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-bg-elev grid place-items-center text-[10px] text-gold">JW</div>
                <span className="text-ink-lo">You</span>
              </div>
              <span className="nums text-gold">{p.progressPct}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}