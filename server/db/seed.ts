import { db } from "./client.js";
import { users, businessUnits, projects, mentees, catalogWorks, studioBookings } from "./schema.js";
import bcrypt from "bcrypt";
import { sql } from "drizzle-orm";

console.log("[wonda] seeding…");

// Idempotent: only seed if no users exist
const existing = await db.select({ count: sql<number>`count(*)::int` }).from(users);
if (existing[0].count > 0) {
  console.log("[wonda] already seeded, skipping");
  process.exit(0);
}

const ownerHash = await bcrypt.hash("wonda2026!", 10);
const asstHash = await bcrypt.hash("wonda-assistant", 10);
const finHash = await bcrypt.hash("wonda-finance", 10);

const [jerry] = await db.insert(users).values({
  email: "jerry@wolfpaqmarketing.com", passwordHash: ownerHash, name: "Jerry Duplessis", role: "owner"
}).returning();
const [sarah] = await db.insert(users).values({
  email: "sarah@wolfpaqmarketing.com", passwordHash: asstHash, name: "Sarah Mitchell", role: "assistant"
}).returning();
const [david] = await db.insert(users).values({
  email: "david@wolfpaqmarketing.com", passwordHash: finHash, name: "David Chen", role: "finance_manager"
}).returning();

const units = await db.insert(businessUnits).values([
  { name: "Platinum Sound Studios", slug: "platinum-sound", kind: "commercial" },
  { name: "Wonda Music", slug: "wonda-music", kind: "commercial" },
  { name: "Platinum Sound Academy", slug: "academy", kind: "commercial" },
  { name: "Haiti & Humanitarian", slug: "haiti", kind: "nonprofit" },
  { name: "Newark & Youth", slug: "newark", kind: "nonprofit" }
]).returning();

await db.insert(projects).values([
  { name: "Booga Basement Archive", type: "creative", status: "active", progressPct: 35, createdBy: jerry.id },
  { name: "Platinum Sound Academy — Summer Cohort", type: "academy", status: "active", progressPct: 72, createdBy: jerry.id },
  { name: "Haiti On The Go", type: "humanitarian", status: "active", progressPct: 58, createdBy: jerry.id },
  { name: "The Other Side of Newark", type: "civic", status: "active", progressPct: 64, createdBy: jerry.id },
  { name: "Music Mentorship Program", type: "civic", status: "active", progressPct: 81, createdBy: jerry.id },
  { name: "Wonda Music Catalog Admin", type: "label", status: "active", progressPct: 22, createdBy: jerry.id },
  { name: "Newark Symphony Hall Board", type: "civic", status: "active", progressPct: 40, createdBy: jerry.id },
  { name: "Vassar Haiti Project Board", type: "humanitarian", status: "active", progressPct: 50, createdBy: jerry.id }
]);

await db.insert(mentees).values([
  { name: "Marcus West", school: "West Side High", discipline: "Producer", mentorId: jerry.id },
  { name: "Zara Chen", school: "Arts High", discipline: "Engineer", mentorId: jerry.id },
  { name: "DeAndre Brown", school: "Barringer", discipline: "Songwriter", mentorId: jerry.id },
  { name: "Lila Romero", school: "East Side High", discipline: "Producer", mentorId: jerry.id },
  { name: "Jalen Pierce", school: "Newark Global Studies", discipline: "Artist", mentorId: jerry.id },
  { name: "Aaliyah Foster", school: "Technology High", discipline: "Engineer", mentorId: jerry.id }
]);

await db.insert(catalogWorks).values([
  { title: "Killing Me Softly", primaryArtist: "Fugees", album: "The Score", releaseYear: 1996, jerryRole: "co-producer", writerSharePct: "16.50", publisherSharePct: "16.50", proRegistered: true, proName: "ASCAP", iswc: "T-901.234.567-8" },
  { title: "Maria Maria", primaryArtist: "Santana", album: "Supernatural", releaseYear: 1999, jerryRole: "co-producer", writerSharePct: "12.00", publisherSharePct: "12.00", proRegistered: true, proName: "BMI" },
  { title: "Hips Don't Lie", primaryArtist: "Shakira feat. Wyclef Jean", album: "Oral Fixation Vol. 2", releaseYear: 2006, jerryRole: "co-producer", writerSharePct: "20.00", publisherSharePct: "20.00", proRegistered: true, proName: "ASCAP", iswc: "T-070.142.456-3" },
  { title: "My Love Is Your Love", primaryArtist: "Whitney Houston", album: "My Love Is Your Love", releaseYear: 1998, jerryRole: "co-writer", writerSharePct: "33.33", proRegistered: true, proName: "ASCAP" },
  { title: "U Smile", primaryArtist: "Justin Bieber", album: "My World 2.0", releaseYear: 2010, jerryRole: "producer", writerSharePct: "50.00", publisherSharePct: "50.00", proRegistered: true, proName: "ASCAP" },
  { title: "Million Voices", primaryArtist: "Hotel Rwanda Choir", album: "Hotel Rwanda OST", releaseYear: 2004, jerryRole: "co-writer", writerSharePct: "33.33", proRegistered: true, proName: "BMI" },
  { title: "Do You...", primaryArtist: "Miguel", album: "Kaleidoscope Dream", releaseYear: 2012, jerryRole: "producer", proRegistered: false, needsAttention: true, attentionReasons: ["PRO registration missing"] },
  { title: "Ghetto Superstar", primaryArtist: "Pras feat. ODB & Mýa", album: "Bulworth OST", releaseYear: 1998, jerryRole: "co-writer", proRegistered: true, proName: "ASCAP" }
]);

console.log("[wonda] seed complete");
console.log("\n  Owner login:         jerry@wolfpaqmarketing.com / wonda2026!");
console.log("  Assistant login:    sarah@wolfpaqmarketing.com / wonda-assistant");
console.log("  Finance Manager:    david@wolfpaqmarketing.com / wonda-finance\n");
process.exit(0);