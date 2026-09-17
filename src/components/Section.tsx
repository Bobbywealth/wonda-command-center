import type { ReactNode } from "react";

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">{title}</h2>
        {subtitle && <p className="text-xs text-ink-lo mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "", accent }: { children: ReactNode; className?: string; accent?: boolean }) {
  return (
    <div className={`card p-4 ${accent ? "hairline-top" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, date, action }: { title: string; date?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
        {date && <p className="text-xs text-ink-lo mt-1">{date}</p>}
      </div>
      {action}
    </div>
  );
}