import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { literatureCandidates } from "@/db/schema";

export type LiteratureCandidateRecord = typeof literatureCandidates.$inferSelect;

export async function getPendingLiteratureCandidates(limit = 100): Promise<LiteratureCandidateRecord[]> {
  return db
    .select()
    .from(literatureCandidates)
    .where(eq(literatureCandidates.status, "PENDING_REVIEW"))
    .orderBy(desc(literatureCandidates.lastSeenAt))
    .limit(Math.min(Math.max(limit, 1), 200));
}
