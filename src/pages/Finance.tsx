import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, PageHeader, SectionHeader } from "../components/Section";

interface FinanceUnit {
  unit: string;
  kind: "commercial" | "nonprofit";
  revenue?: number;
  expenses?: number;
  net?: number;
  margin?: number;
  fundsIn?: number;
  programSpend?: number;
  balance?: number;
}

interface FinanceData {
  period: { start: string; end: string };
  kpis: { revenue: number; expenses: number; netProfit: number; marginPct: number };
  deltas: { revenue: number; expenses: number; netProfit: number; marginPct: number };
  byUnit: FinanceUnit[];
  cash: { invoiced: number; collected: number; outstanding: number; overdue: number };
}

const TABS = ["Dashboard","Invoices","Expenses","Budgets","Royalties","Studio Revenue"] as const;

const fmt = (n: number | undefined) => `$${(n ?? 0).toLocaleString()}`;

export function Finance() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Dashboard");
  const { data } = useQuery({ queryKey: ["finance"], queryFn: () => api<FinanceData>("/api/finance/dashboard") });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <PageHeader title="Finance" subtitle="Empire P&L and royalties" />

      <div className="flex gap-1 overflow-x-auto mb-6 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm whitespace-nowrap rounded-lg ${tab === t ? "bg-gold text-bg-base font-medium" : "text-ink-lo hover:text-ink-hi"}`}>
            {t}
          </button>
        ))}
      </div>

      {data && tab === "Dashboard" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card accent>
              <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase mb-2">Revenue</div>
              <div className="font-display text-2xl md:text-3xl nums">${(data.kpis.revenue/1000).toFixed(0)}K</div>
              <div className="text-[11px] text-emerald mt-1">+{data.deltas.revenue}% vs prev</div>
            </Card>
            <Card accent>
              <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase mb-2">Expenses</div>
              <div className="font-display text-2xl md:text-3xl nums">${(data.kpis.expenses/1000).toFixed(0)}K</div>
              <div className="text-[11px] text-emerald mt-1">{data.deltas.expenses}% vs prev</div>
            </Card>
            <Card accent>
              <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase mb-2">Net Profit</div>
              <div className="font-display text-2xl md:text-3xl nums">${(data.kpis.netProfit/1000).toFixed(0)}K</div>
              <div className="text-[11px] text-emerald mt-1">+{data.deltas.netProfit}% vs prev</div>
            </Card>
            <Card accent>
              <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase mb-2">Margin</div>
              <div className="font-display text-2xl md:text-3xl nums">{data.kpis.marginPct}%</div>
              <div className="text-[11px] text-emerald mt-1">+{data.deltas.marginPct} pts</div>
            </Card>
          </div>

          <SectionHeader title="P&L by Business Unit" />
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">
                <tr>
                  <th className="text-left py-2 pr-2">Unit</th>
                  {data.byUnit[0]?.kind === "commercial" ? (
                    <>
                      <th className="text-right py-2 px-2">Revenue</th>
                      <th className="text-right py-2 px-2">Expenses</th>
                      <th className="text-right py-2 px-2">Net</th>
                      <th className="text-right py-2 pl-2">Margin</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right py-2 px-2">Funds In</th>
                      <th className="text-right py-2 px-2">Program Spend</th>
                      <th className="text-right py-2 pl-2">Balance</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.byUnit.map(u => (
                  <tr key={u.unit} className="border-t border-line/40">
                    <td className="py-2 pr-2">{u.unit}</td>
                    {u.kind === "commercial" ? (
                      <>
                        <td className="text-right nums py-2 px-2">{fmt(u.revenue)}</td>
                        <td className="text-right nums py-2 px-2">{fmt(u.expenses)}</td>
                        <td className="text-right nums py-2 px-2 text-gold">{fmt(u.net)}</td>
                        <td className="text-right nums py-2 pl-2">{u.margin ?? 0}%</td>
                      </>
                    ) : (
                      <>
                        <td className="text-right nums py-2 px-2">{fmt(u.fundsIn)}</td>
                        <td className="text-right nums py-2 px-2">{fmt(u.programSpend)}</td>
                        <td className={`text-right nums py-2 pl-2 ${(u.balance ?? 0) < 0 ? "text-rose" : "text-emerald"}`}>
                          {fmt(u.balance)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="mt-6">
            <SectionHeader title="Revenue vs Expenses" subtitle="Last 12 months" />
            <Card>
              <div className="flex items-end gap-1.5 h-32">
                {["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"].map((m, i) => (
                  <div key={m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end gap-0.5 h-24">
                      <div className="flex-1 bg-gold rounded-t" style={{ height: `${[44,48,52,55,50,53,60,64,58,62,66,70][i]}%` }} />
                      <div className="flex-1 bg-violet/60 rounded-t" style={{ height: `${[25,28,26,30,29,28,32,31,34,33,32,35][i]}%` }} />
                    </div>
                    <div className="text-[9px] text-ink-lo">{m}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab !== "Dashboard" && (
        <Card>
          <div className="text-center py-12 text-ink-lo">
            <div className="text-3xl mb-2">▢</div>
            <div className="text-sm">{tab} module — wires up in Phase 7</div>
          </div>
        </Card>
      )}
    </div>
  );
}