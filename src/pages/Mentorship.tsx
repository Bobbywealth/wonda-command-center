import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, PageHeader } from "../components/Section";

interface Mentee {
  id: string; name: string; school: string; discipline: string;
  sessions: number; lastSession: string;
  skills: { Production: number; Engineering: number; Songwriting: number; Business: number };
}

const SKILLS = ["Production", "Engineering", "Songwriting", "Business"] as const;

export function Mentorship() {
  const { data = [] } = useQuery({
    queryKey: ["mentees"],
    queryFn: () => api<Mentee[]>("/api/mentorship/mentees")
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title="Mentorship" subtitle="Music mentorship program" action={
        <div className="flex gap-2">
          <button className="btn-ghost text-sm">Cohort</button>
          <button className="btn-primary text-sm">+ Add Mentee</button>
        </div>
      } />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card><div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">Active</div><div className="font-display text-2xl nums">{data.length}</div></Card>
        <Card><div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">Sessions</div><div className="font-display text-2xl nums">{data.reduce((a,m) => a + m.sessions, 0)}</div></Card>
        <Card><div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">Equipment</div><div className="font-display text-2xl nums">$48K</div></Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.map(m => (
          <Card key={m.id} accent className="hover:bg-bg-elev transition-colors">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-ink-lo">{m.school} · {m.discipline}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {SKILLS.map(skill => (
                <div key={skill}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-ink-lo">{skill}</span>
                    <span className="nums">{m.skills[skill]}</span>
                  </div>
                  <div className="fader">
                    <div className="fader-fill" style={{ width: `${m.skills[skill]}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-ink-lo mt-4 pt-3 border-t border-line">
              <span>{m.sessions} sessions</span>
              <span>Last: {m.lastSession}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 rounded-full bg-gold text-bg-base shadow-lg grid place-items-center text-2xl font-bold hover:scale-105 transition-transform">
        +
      </button>
    </div>
  );
}