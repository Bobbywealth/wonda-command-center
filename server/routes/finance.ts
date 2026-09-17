import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const financeRouter = Router();

// Reject the assistant role entirely at the middleware layer
financeRouter.use(requireAuth, (req: AuthedRequest, res, next) => {
  if (req.user?.role === "assistant") {
    return res.status(403).json({ error: "forbidden", reason: "assistant_role_no_finance_access" });
  }
  next();
});

financeRouter.get("/dashboard", (_req, res) => {
  res.json({
    period: { start: "2026-01-01", end: "2026-09-17" },
    kpis: { revenue: 425000, expenses: 182000, netProfit: 243000, marginPct: 57 },
    deltas: { revenue: 12, expenses: -4, netProfit: 18, marginPct: 3 },
    byUnit: [
      { unit: "Platinum Sound Studios", revenue: 287000, expenses: 95000, net: 192000, margin: 67, kind: "commercial" },
      { unit: "Wonda Music", revenue: 98000, expenses: 22000, net: 76000, margin: 78, kind: "commercial" },
      { unit: "Platinum Sound Academy", revenue: 18000, expenses: 28000, net: -10000, margin: -56, kind: "commercial" },
      { unit: "Haiti & Humanitarian", fundsIn: 64000, programSpend: 58000, balance: 6000, kind: "nonprofit" },
      { unit: "Newark & Youth", fundsIn: 38000, programSpend: 41000, balance: -3000, kind: "nonprofit" }
    ],
    cash: { invoiced: 425000, collected: 312000, outstanding: 113000, overdue: 18000 }
  });
});

financeRouter.get("/invoices", (_req, res) => res.json([]));
financeRouter.get("/expenses", (_req, res) => res.json([]));
financeRouter.get("/budgets", (_req, res) => res.json([]));
financeRouter.get("/royalties", (_req, res) => res.json([]));
financeRouter.get("/studio-revenue", (_req, res) => res.json([]));