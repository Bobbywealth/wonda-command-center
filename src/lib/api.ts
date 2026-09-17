export type Role = "owner" | "assistant" | "finance_manager";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
  if (res.status === 401) {
    if (!path.includes("/auth/")) {
      window.location.href = "/login";
    }
    throw new Error("not_authenticated");
  }
  if (!res.ok) throw new Error((await res.json()).error ?? "request_failed");
  return res.json();
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  assistant: "Assistant",
  finance_manager: "Finance Manager"
};