import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { PageHeader } from "../components/Section";

interface MyDay {
  progress: { done: number; total: number };
  items: Array<{ id: string; time: string; title: string; status: string; accent: string; label: string }>;
}

const ACCENT: Record<string, string> = {
  gold: "bg-gold", violet: "bg-violet", rose: "bg-rose", emerald: "bg-emerald"
};

export function Tasks() {
  const { data } = useQuery({
    queryKey: ["myday"],
    queryFn: () => api<MyDay>("/api/tasks/my-day")
  });

  const items = data?.items ?? [];
  const done = data?.progress.done ?? 0;
  const total = data?.progress.total ?? items.length;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <PageHeader title="My Day" date="Thursday, Sep 17, 2026" action={
        <button className="btn-ghost text-sm">View All Tasks</button>
      } />

      <div className="card p-4 mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-ink-lo">{done} of {total} tasks done today</span>
          <span className="nums text-gold">{Math.round((done/total)*100)}%</span>
        </div>
        <div className="fader">
          <div className="fader-fill" style={{ width: `${(done/total)*100}%` }} />
        </div>
      </div>

      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id}
              className={`card p-3 flex items-center gap-3 ${item.status === "done" ? "opacity-50" : ""} ${item.status === "overdue" ? "border-rose/40" : ""}`}>
            <span className={`w-1 self-stretch rounded ${ACCENT[item.accent] ?? "bg-gold"}`} />
            <span className="text-xs text-ink-lo nums w-16">{item.time}</span>
            <input type="checkbox"
              defaultChecked={item.status === "done"}
              className="accent-gold w-5 h-5"
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm ${item.status === "done" ? "line-through" : ""}`}>{item.title}</div>
              {item.status === "overdue" && <div className="text-[11px] text-rose">Overdue</div>}
            </div>
            <span className="pill border border-line bg-bg-elev text-ink-lo text-[10px]">{item.label}</span>
          </li>
        ))}
      </ul>

      <button className="fixed bottom-24 md:bottom-6 right-4 md:right-6 w-14 h-14 rounded-full bg-gold text-bg-base shadow-lg grid place-items-center text-2xl font-bold">
        +
      </button>
    </div>
  );
}