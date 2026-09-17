import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function LoginPage() {
  const [email, setEmail] = useState("jerry@wolfpaqmarketing.com");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      navigate("/", { replace: true });
    } catch (e: any) {
      setErr(e.message === "invalid_credentials" ? "Email or password is incorrect." : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full grid place-items-center px-4 relative overflow-hidden">
      {/* Vinyl groove decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-50" aria-hidden>
        <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] rounded-full vinyl" />
        <div className="absolute -left-40 -top-40 w-[400px] h-[400px] rounded-full vinyl" />
      </div>

      <form onSubmit={onSubmit} className="card hairline-top w-full max-w-sm p-8 relative">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src="/brand/wonda-wordmark.svg" alt="Jerry Wonda" className="h-7" />
          <div className="text-[10px] tracking-[0.2em] text-ink-lo uppercase">Command Center</div>
        </div>

        <div className="mb-4">
          <label className="label">Email</label>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="mb-4">
          <label className="label">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="flex items-center justify-between mb-5 text-sm">
          <label className="flex items-center gap-2 text-ink-lo">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="accent-gold" />
            Remember me
          </label>
          <a href="#" className="text-ink-lo hover:text-ink-hi">Forgot password?</a>
        </div>

        {err && <div className="mb-4 text-sm text-rose">{err}</div>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <div className="mt-6 text-center text-[11px] text-ink-lo">Authorized personnel only</div>
      </form>
    </div>
  );
}