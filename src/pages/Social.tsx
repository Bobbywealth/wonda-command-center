import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, PageHeader, SectionHeader } from "../components/Section";

interface SocialAccount {
  id: string; platform: string; handle: string; status: string; followers: number;
}

const PLATFORMS = ["Instagram","X","TikTok","Threads","Facebook","YouTube","LinkedIn"];

export function Social() {
  const { data = [] } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: () => api<SocialAccount[]>("/api/social/accounts")
  });
  const [body, setBody] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ Instagram: true, X: true });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title="Social Command" />

      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <Card accent>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full bg-bg-base border border-line rounded-lg p-3 text-sm text-ink-hi placeholder:text-ink-lo outline-none focus:border-gold resize-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setEnabled(prev => ({ ...prev, [p]: !prev[p] }))}
                  className={`pill border ${enabled[p] ? "bg-gold/10 border-gold/40 text-gold" : "border-line text-ink-lo"}`}>
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-ink-lo nums">{body.length} / 280 (default)</span>
              <div className="flex gap-2">
                <button className="btn-soft text-sm">Save Draft</button>
                <button className="btn-primary text-sm">Schedule</button>
              </div>
            </div>
          </Card>

          <SectionHeader title="Approval Queue" />
          <Card>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <div><div>"Haiti relief concert — see you there"</div><div className="text-xs text-ink-lo">IG · scheduled 09/19 6pm</div></div>
                <div className="flex gap-1"><button className="btn-soft text-xs px-3">Edit</button><button className="btn-primary text-xs px-3">Approve</button></div>
              </li>
              <li className="flex items-center justify-between">
                <div><div>"Studio session with @wyclef yesterday"</div><div className="text-xs text-ink-lo">X · scheduled 09/18 noon</div></div>
                <div className="flex gap-1"><button className="btn-soft text-xs px-3">Edit</button><button className="btn-primary text-xs px-3">Approve</button></div>
              </li>
            </ul>
          </Card>
        </div>

        <div className="space-y-3">
          <Card>
            <SectionHeader title="Channels" />
            <ul className="space-y-2 text-sm">
              {data.map(a => (
                <li key={a.id} className="flex items-center justify-between">
                  <div>
                    <div className="capitalize">{a.platform}</div>
                    <div className="text-xs text-ink-lo">{a.handle}</div>
                  </div>
                  <span className={`pill text-[10px] ${a.status === "connected" ? "bg-emerald/10 text-emerald" : "border border-line text-ink-lo"}`}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionHeader title="Content Calendar" />
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {Array.from({length: 28}, (_, i) => (
                <div key={i} className={`aspect-square rounded border border-line/40 grid place-items-center text-ink-lo nums ${[18,22,25].includes(i+1) ? "border-gold text-gold" : ""}`}>{i+1}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}