import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Sonde de santé : base joignable + volumétrie du corpus.
 * Utilisée par `scripts/dev-reset.sh` et par la vérification manuelle du déploiement.
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    const [plants, studies, claims] = await Promise.all([
      db.execute<{ total: string }>(sql`select count(*)::text as total from plants`),
      db.execute<{ total: string }>(sql`select count(*)::text as total from studies`),
      db.execute<{ total: string }>(sql`select count(*)::text as total from claims`),
    ]);
    const read = (result: { rows?: Array<{ total: string }> }) =>
      Number(result.rows?.[0]?.total ?? 0);

    return Response.json({
      ok: true,
      database: "up",
      latencyMs: Date.now() - startedAt,
      corpus: {
        plants: read(plants as unknown as { rows?: Array<{ total: string }> }),
        studies: read(studies as unknown as { rows?: Array<{ total: string }> }),
        claims: read(claims as unknown as { rows?: Array<{ total: string }> }),
      },
    });
  } catch (error) {
    return Response.json(
      { ok: false, database: "down", error: error instanceof Error ? error.message : "unknown" },
      { status: 500 },
    );
  }
}
