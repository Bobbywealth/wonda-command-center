import {
  pgTable, pgEnum, uuid, text, timestamp, integer, boolean, jsonb, date, time,
  numeric, uniqueIndex, index, primaryKey
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["owner", "assistant", "finance_manager"]);
export const projectTypeEnum = pgEnum("project_type", ["studio", "label", "academy", "humanitarian", "civic", "creative"]);
export const projectStatusEnum = pgEnum("project_status", ["planning", "active", "on-hold", "done"]);
export const taskStatusEnum = pgEnum("task_status", ["backlog", "todo", "in_progress", "blocked", "done"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["draft", "sent", "partially_paid", "paid", "overdue", "void"]);
export const expenseStatusEnum = pgEnum("expense_status", ["pending", "approved", "rejected"]);
export const syncStatusEnum = pgEnum("sync_status", ["inquiry", "quoted", "negotiating", "licensed", "paid", "declined"]);
export const businessKindEnum = pgEnum("business_kind", ["commercial", "nonprofit"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: roleEnum("role").notNull(),
  timezone: text("timezone").notNull().default("America/New_York"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: projectTypeEnum("type").notNull(),
  description: text("description"),
  status: projectStatusEnum("status").notNull().default("planning"),
  progressPct: integer("progress_pct").notNull().default(0),
  businessUnitId: uuid("business_unit_id"),
  startDate: date("start_date"),
  targetDate: date("target_date"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  projectId: uuid("project_id").references(() => projects.id),
  assigneeId: uuid("assignee_id").references(() => users.id),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  status: taskStatusEnum("status").notNull().default("todo"),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  estimateMinutes: integer("estimate_minutes"),
  recurrenceRule: text("recurrence_rule"),
  recurrenceParentId: uuid("recurrence_parent_id"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const mentees = pgTable("mentees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  school: text("school"),
  discipline: text("discipline"),
  program: text("program"),
  mentorId: uuid("mentor_id").references(() => users.id),
  startDate: date("start_date"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const menteeSkills = pgTable("mentee_skills", {
  menteeId: uuid("mentee_id").notNull().references(() => mentees.id, { onDelete: "cascade" }),
  skill: text("skill").notNull(),
  level: integer("level").notNull().default(0)
}, (t) => ({ pk: primaryKey({ columns: [t.menteeId, t.skill] }) }));

export const menteeSessions = pgTable("mentee_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  menteeId: uuid("mentee_id").notNull().references(() => mentees.id, { onDelete: "cascade" }),
  mentorId: uuid("mentor_id").notNull().references(() => users.id),
  sessionDate: timestamp("session_date", { withTimezone: true }).notNull(),
  durationMin: integer("duration_min").notNull().default(60),
  notes: text("notes"),
  workLinks: jsonb("work_links").$type<string[]>().default([])
});

export const calendarAccounts = pgTable("calendar_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull().default("google"),
  label: text("label").notNull(),
  externalAccountId: text("external_account_id").notNull(),
  refreshTokenEncrypted: text("refresh_token_encrypted"),
  syncToken: text("sync_token"),
  calendarIds: jsonb("calendar_ids").$type<string[]>().default([]),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  allDay: boolean("all_day").notNull().default(false),
  location: text("location"),
  source: text("source").notNull().default("internal"),
  externalEventId: text("external_event_id"),
  calendarAccountId: uuid("calendar_account_id").references(() => calendarAccounts.id),
  projectId: uuid("project_id").references(() => projects.id),
  taskId: uuid("task_id").references(() => tasks.id),
  menteeSessionId: uuid("mentee_session_id").references(() => menteeSessions.id),
  color: text("color"),
  createdBy: uuid("created_by").references(() => users.id)
});

export const socialAccounts = pgTable("social_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  displayName: text("display_name"),
  status: text("status").notNull().default("disconnected"),
  accessTokenEncrypted: text("access_token_encrypted"),
  connectedBy: uuid("connected_by").references(() => users.id)
});

export const socialPosts = pgTable("social_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: text("body").notNull(),
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]),
  targetPlatforms: jsonb("target_platforms").$type<string[]>().notNull(),
  perPlatformOverrides: jsonb("per_platform_overrides").$type<Record<string, string>>().default({}),
  status: text("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  approvedBy: uuid("approved_by").references(() => users.id),
  externalIds: jsonb("external_ids").$type<Record<string, string>>().default({}),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const socialMetrics = pgTable("social_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  socialAccountId: uuid("social_account_id").notNull().references(() => socialAccounts.id, { onDelete: "cascade" }),
  capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
  followers: integer("followers").notNull().default(0),
  reach: integer("reach").notNull().default(0),
  engagements: integer("engagements").notNull().default(0),
  postCount: integer("post_count").notNull().default(0)
});

// FINANCE
export const businessUnits = pgTable("business_units", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  kind: businessKindEnum("kind").notNull().default("commercial"),
  fiscalNotes: text("fiscal_notes")
});

export const studioBookings = pgTable("studio_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  room: text("room").notNull(),
  clientName: text("client_name").notNull(),
  projectId: uuid("project_id").references(() => projects.id),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("confirmed"),
  rate: numeric("rate", { precision: 12, scale: 2 }),
  rateType: text("rate_type").default("hourly"),
  isComped: boolean("is_comped").notNull().default(false),
  compReason: text("comp_reason"),
  invoiceId: uuid("invoice_id"),
  notes: text("notes")
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  businessUnitId: uuid("business_unit_id").notNull().references(() => businessUnits.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientAddress: text("client_address"),
  projectId: uuid("project_id").references(() => projects.id),
  studioBookingId: uuid("studio_booking_id").references(() => studioBookings.id),
  status: invoiceStatusEnum("status").notNull().default("draft"),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  currency: text("currency").notNull().default("USD"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  discountAmount: numeric("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  amountPaid: numeric("amount_paid", { precision: 12, scale: 2 }).notNull().default("0"),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  terms: text("terms"),
  notes: text("notes"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitRate: numeric("unit_rate", { precision: 12, scale: 2 }).notNull().default("0"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull().default("0"),
  sortOrder: integer("sort_order").notNull().default(0)
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  paidOn: date("paid_on").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method"),
  reference: text("reference"),
  notes: text("notes")
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessUnitId: uuid("business_unit_id").notNull().references(() => businessUnits.id),
  projectId: uuid("project_id").references(() => projects.id),
  expenseDate: date("expense_date").notNull(),
  vendor: text("vendor").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  fxRate: numeric("fx_rate", { precision: 10, scale: 4 }),
  category: text("category").notNull(),
  paymentMethod: text("payment_method"),
  receiptUrl: text("receipt_url"),
  notes: text("notes"),
  isReimbursable: boolean("is_reimbursable").notNull().default(false),
  reimbursedToUserId: uuid("reimbursed_to_user_id").references(() => users.id),
  approvalStatus: expenseStatusEnum("approval_status").notNull().default("pending"),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  recurrenceRule: text("recurrence_rule"),
  recurrenceParentId: uuid("recurrence_parent_id"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: text("scope").notNull(),
  scopeId: uuid("scope_id").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  totalCap: numeric("total_cap", { precision: 12, scale: 2 }).notNull(),
  categoryCaps: jsonb("category_caps").$type<Record<string, number>>().default({}),
  notes: text("notes")
});

export const catalogWorks = pgTable("catalog_works", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  primaryArtist: text("primary_artist").notNull(),
  album: text("album"),
  releaseYear: integer("release_year"),
  jerryRole: text("jerry_role").notNull(),
  writerSharePct: numeric("writer_share_pct", { precision: 5, scale: 2 }),
  publisherSharePct: numeric("publisher_share_pct", { precision: 5, scale: 2 }),
  coWriters: jsonb("co_writers").$type<{ name: string; sharePct: number }[]>().default([]),
  publisher: text("publisher"),
  proRegistered: boolean("pro_registered").notNull().default(false),
  proName: text("pro_name"),
  iswc: text("iswc"),
  isrcs: jsonb("isrcs").$type<string[]>().default([]),
  territoryNotes: text("territory_notes"),
  needsAttention: boolean("needs_attention").notNull().default(false),
  attentionReasons: jsonb("attention_reasons").$type<string[]>().default([])
});

export const royaltyStatements = pgTable("royalty_statements", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(),
  sourceType: text("source_type").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  receivedDate: date("received_date").notNull(),
  grossAmount: numeric("gross_amount", { precision: 12, scale: 2 }).notNull(),
  adminFee: numeric("admin_fee", { precision: 12, scale: 2 }).notNull().default("0"),
  netAmount: numeric("net_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  fileUrl: text("file_url"),
  reconciled: boolean("reconciled").notNull().default(false),
  notes: text("notes")
});

export const royaltyLines = pgTable("royalty_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  royaltyStatementId: uuid("royalty_statement_id").notNull().references(() => royaltyStatements.id, { onDelete: "cascade" }),
  catalogWorkId: uuid("catalog_work_id").references(() => catalogWorks.id),
  rawTitle: text("raw_title").notNull(),
  units: numeric("units", { precision: 12, scale: 0 }),
  grossAmount: numeric("gross_amount", { precision: 12, scale: 2 }).notNull(),
  netAmount: numeric("net_amount", { precision: 12, scale: 2 }).notNull(),
  territory: text("territory"),
  matched: boolean("matched").notNull().default(false)
});

export const syncLicenses = pgTable("sync_licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  catalogWorkId: uuid("catalog_work_id").notNull().references(() => catalogWorks.id),
  licensee: text("licensee").notNull(),
  mediaType: text("media_type").notNull(),
  territory: text("territory").notNull(),
  term: text("term"),
  status: syncStatusEnum("status").notNull().default("inquiry"),
  quotedFee: numeric("quoted_fee", { precision: 12, scale: 2 }),
  finalFee: numeric("final_fee", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("USD"),
  inquiryDate: date("inquiry_date").notNull(),
  decisionDate: date("decision_date"),
  notes: text("notes")
});

export const rateCards = pgTable("rate_cards", {
  id: uuid("id").primaryKey().defaultRandom(),
  room: text("room").notNull(),
  rateType: text("rate_type").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  effectiveFrom: date("effective_from").notNull(),
  effectiveTo: date("effective_to")
});

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: uuid("entity_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

// Enforce exactly one owner via partial unique index
export const usersOwnerIdx = uniqueIndex("users_one_owner").on(sql`((role))`).where(sql`role = 'owner'`);