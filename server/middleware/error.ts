import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: "validation_failed", issues: err.issues });
  }
  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error("[wonda] unhandled error", err);
  res.status(500).json({ error: "internal_error" });
}