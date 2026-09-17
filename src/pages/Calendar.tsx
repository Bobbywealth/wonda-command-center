import { useState } from "react";
import { PageHeader } from "../components/Section";

const TODAY = 17;
const EVENTS: Record<number, Array<{ title: string; color: string }>> = {
  12: [{ title: "Studio Booking 2pm", color: "bg-gold" }],
  14: [{ title: "Mentee Session", color: "bg-violet" }],
  17: [{ title: "Studio", color: "bg-gold" }, { title: "Haiti 3pm", color: "bg-rose" }],
  19: [{ title: "Project meeting", color: "bg-emerald" }],
  22: [{ title: "Mentor session", color: "bg-violet" }, { title: "Studio 4pm", color: "bg-gold" }]
};

export function Calendar() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title="Calendar" action={
        <div className="flex gap-2">
          <button className="btn-ghost text-sm">‹</button>
          <button className="btn-soft text-sm">Today</button>
          <button className="btn-ghost text-sm">›</button>
          <div className="flex border border-line rounded-lg overflow-hidden ml-2">
            {(["month","week","day"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-2 text-xs capitalize ${view === v ? "bg-gold text-bg-base" : "text-ink-lo hover:text-ink-hi"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      } />

      <div className="card p-3">
        <div className="grid grid-cols-7 gap-1 text-[10px] text-ink-lo tracking-wider uppercase mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="px-2 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 4 + 1;
            const inMonth = day > 0 && day <= 30;
            const events = inMonth ? (EVENTS[day] ?? []) : [];
            const isToday = day === TODAY;
            return (
              <div key={i} className={`min-h-[88px] p-1.5 rounded border border-line/50 ${!inMonth ? "opacity-30" : ""} ${isToday ? "border-gold/60 bg-gold/5" : ""}`}>
                {inMonth && (
                  <>
                    <div className={`text-xs nums mb-1 ${isToday ? "text-gold font-semibold" : "text-ink-lo"}`}>
                      {isToday ? `● ${day}` : day}
                    </div>
                    <div className="space-y-0.5">
                      {events.map((e, j) => (
                        <div key={j} className={`text-[10px] px-1.5 py-0.5 rounded text-bg-base ${e.color}`}>{e.title}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}