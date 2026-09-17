import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, PageHeader, SectionHeader } from "../components/Section";

interface OverviewData {
  greeting: string;
  kpis: { studioUtilization: number; activeProjects: number; openTasks: number; socialReach7d: number };
  legacyStrip: string[];
}

const BUSINESS_TILES = [
  { name: "Platinum Sound Studios", status: "Bookings healthy — Atmos room at 71% utilization", dot: "emerald" as const },
  { name: "Wonda Music", status: "Catalog admin ongoing — 12 statements to reconcile", dot: "amber" as const },
  { name: "Platinum Sound Academy", status: "Summer cohort in week 6 of 9", dot: "emerald" as const },
  { name: "Haiti & Humanitarian", status: "Yéle Haiti transfer pending — Clara following up", dot: "amber" as const },
  { name: "Newark & Youth", status: "West Side HS gear delivery completed", dot: "emerald" as const }
];

export function Overview() {
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => api<OverviewData>("/api/overview")
  });

  const kpis = data?.kpis;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title={data?.greeting ?? "Welcome back, Jerry"} date="Thursday, Sep 17, 2026" action={
        <button className="btn-primary">+ Quick Add</button>
      } />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Kpi label="STUDIO UTILIZATION" value={kpis ? `${kpis.studioUtilization}%` : "—"} delta="+4%" tone="emerald" />
        <Kpi label="ACTIVE PROJECTS" value={kpis ? String(kpis.activeProjects) : "—"} delta="+2" tone="emerald" />
        <Kpi label="OPEN TASKS" value={kpis ? String(kpis.openTasks) : "—"} delta="3 overdue" tone="rose" />
        <Kpi label="SOCIAL REACH 7D" value={kpis ? `${(kpis.socialReach7d/1_000_000).toFixed(1)}M` : "—"} delta="+8%" tone="emerald" />
      </div>

      {/* Empire tiles */}
      <SectionHeader title="The Empire" subtitle="Status across all five businesses" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {BUSINESS_TILES.map(t => (
          <Card key={t.name} accent className="hover:bg-bg-elev transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium">{t.name}</div>
              <span className={`dot bg-${t.dot}`} />
            </div>
            <div className="text-xs text-ink-lo">{t.status}</div>
            <Sparkline />
          </Card>
        ))}
      </div>

      {/* Bottom row: chart + today */}
      <div className="grid md:grid-cols-3 gap-3 mb-8">
        <Card className="md:col-span-2">
          <SectionHeader title="Revenue vs Expenses" subtitle="Trailing 12 months" />
          <RevenueChart />
        </Card>
        <Card>
          <SectionHeader title="Today" />
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-1 self-stretch rounded bg-gold" />
              <div><div className="text-ink-lo text-xs">10:00 AM</div>Mentee session — Marcus</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 self-stretch rounded bg-violet" />
              <div><div className="text-ink-lo text-xs">11:30 AM</div>Review invoice for Platinum Sound</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 self-stretch rounded bg-rose" />
              <div><div className="text-ink-lo text-xs">1:00 PM</div>Call with Yéle Haiti team</div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1 self-stretch rounded bg-emerald" />
              <div><div className="text-ink-lo text-xs">5:00 PM</div>Studio check-in — Atmos buildout</div>
            </li>
          </ul>
        </Card>
      </div>

      {/* Legacy footer */}
      <div className="text-center text-[10px] tracking-[0.25em] text-ink-lo py-4">
        {(data?.legacyStrip ?? ["3 GRAMMYS","16+ NOMINATIONS","300M+ RECORDS","300+ CATALOG TITLES","1 DIAMOND ALBUM"]).join("  ·  ")}
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "emerald" | "rose" | "amber" }) {
  const toneClass = tone === "emerald" ? "text-emerald" : tone === "rose" ? "text-rose" : "text-amber";
  return (
    <Card accent>
      <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase mb-3">{label}</div>
      <div className="flex items-center gap-3">
        <VinylBacking />
        <div className="relative z-10">
          <div className="font-display text-3xl md:text-4xl nums">{value}</div>
          <div className={`text-[11px] mt-1 ${toneClass}`}>{delta}</div>
        </div>
      </div>
    </Card>
  );
}

function VinylBacking() {
  return <div className="absolute w-16 h-16 rounded-full vinyl pointer-events-none" />;
}

function Sparkline() {
  return (
    <svg viewBox="0 0 100 24" className="w-full h-6 mt-3">
      <polyline points="0,18 12,14 24,16 36,8 48,12 60,6 72,10 84,4 96,8"
        fill="none" stroke="#D4A544" strokeWidth="1.5" />
    </svg>
  );
}

function RevenueChart() {
  const months = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];
  const revenue = [32, 35, 38, 41, 36, 39, 44, 47, 42, 45, 48, 51];
  const expenses = [18, 20, 19, 22, 21, 20, 24, 23, 25, 24, 23, 26];
  const max = 60;
  return (
    <div className="flex items-end gap-1.5 h-32 mt-2">
      {months.map((m, i) => (
        <div key={m} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end gap-0.5 h-24">
            <div className="flex-1 bg-gold rounded-t" style={{ height: `${(revenue[i]/max)*100}%` }} />
            <div className="flex-1 bg-violet/60 rounded-t" style={{ height: `${(expenses[i]/max)*100}%` }} />
          </div>
          <div className="text-[9px] text-ink-lo">{m}</div>
        </div>
      ))}
    </div>
  );
}