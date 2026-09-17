// Production server entry — serves built React from dist/web and the API
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./env.js";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { tasksRouter } from "./routes/tasks.js";
import { calendarRouter } from "./routes/calendar.js";
import { mentorshipRouter } from "./routes/mentorship.js";
import { socialRouter } from "./routes/social.js";
import { financeRouter } from "./routes/finance.js";
import { teamRouter } from "./routes/team.js";
import { overviewRouter } from "./routes/overview.js";
import { settingsRouter } from "./routes/settings.js";
import { errorHandler } from "./middleware/error.js";
import { dbConfigured } from "./env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, "../web");

const app = express();
app.disable("x-powered-by");

app.use(cors({ origin: env.APP_BASE_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Security headers
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  time: new Date().toISOString(),
  db: dbConfigured ? "configured" : "mock-mode",
  env: env.NODE_ENV
}));

app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/mentorship", mentorshipRouter);
app.use("/api/social", socialRouter);
app.use("/api/finance", financeRouter);
app.use("/api/team", teamRouter);
app.use("/api/overview", overviewRouter);
app.use("/api/settings", settingsRouter);

app.use(express.static(webDir, { maxAge: "1y", immutable: true, index: false }));
app.get("*", (_req, res) => res.sendFile(path.join(webDir, "index.html")));

app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`[wonda] prod api listening on :${port}`);
  console.log(`[wonda] db: ${dbConfigured ? "configured" : "mock-mode (no DATABASE_URL)"}`);
});