import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { containsPattern, foldSql, foldText, rankSql } from "@/lib/search-text";
import { db } from "@/db";
import {
  claimPreparations,
  claimStudies,
  claimTargets,
  claims,
  compounds,
  mechanisms,
  pathologies,
  plantCompounds,
  plantSafety,
  plantStudies,
  plants,
  preparations,
  studies,
  targets,
  traditionalUses,
} from "@/db/schema";

export type PlantRecord = typeof plants.$inferSelect;
export type StudyRecord = typeof studies.$inferSelect;
export type PathologyRecord = typeof pathologies.$inferSelect;
export type MechanismRecord = typeof mechanisms.$inferSelect;
export type TargetRecord = typeof targets.$inferSelect;
export type PreparationRecord = typeof preparations.$inferSelect;
export type CompoundRecord = typeof compounds.$inferSelect;

export type PlantListItem = PlantRecord & { sourceCount: number };

/** Photo d’illustration empruntée à une espèce reliée (crédit affiché avec l’image). */
export type Illustration = {
  slug: string;
  scientificName: string;
  imageUrl: string | null;
  imageCredit: string | null;
  imageSourceUrl: string | null;
  imageNote: string | null;
};

export function illustrationOf(
  plantsLike: Array<{ slug: string; scientificName: string; imageUrl: string | null; imageCredit: string | null; imageSourceUrl: string | null; imageNote: string | null }>,
): Illustration | null {
  const withPhoto = plantsLike.find((item) => item.imageUrl);
  if (!withPhoto) return null;
  return {
    slug: withPhoto.slug,
    scientificName: withPhoto.scientificName,
    imageUrl: withPhoto.imageUrl,
    imageCredit: withPhoto.imageCredit,
    imageSourceUrl: withPhoto.imageSourceUrl,
    imageNote: withPhoto.imageNote,
  };
}

export type ClaimRecord = typeof claims.$inferSelect & {
  mechanism: MechanismRecord | null;
  pathology: PathologyRecord | null;
  sources: StudyRecord[];
};

export type PlantDetail = {
  plant: PlantRecord;
  traditionalUses: Array<{ use: typeof traditionalUses.$inferSelect; source: StudyRecord }>;
  studies: StudyRecord[];
  claims: ClaimRecord[];
  compounds: Array<{ compound: CompoundRecord; source: StudyRecord }>;
  safety: (typeof plantSafety.$inferSelect & { source: StudyRecord | null }) | null;
};

export type SearchResult = {
  href: string;
  title: string;
  category: "Plante" | "Pathologie" | "Mécanisme" | "Cible" | "Composé" | "Préparation" | "Publication";
  detail: string;
};

async function loadClaimRowsForPlant(plantId: number): Promise<ClaimRecord[]> {
  const rows = await db
    .select({ claim: claims, mechanism: mechanisms, pathology: pathologies })
    .from(claims)
    .leftJoin(mechanisms, eq(claims.mechanismId, mechanisms.id))
    .leftJoin(pathologies, eq(claims.pathologyId, pathologies.id))
    .where(eq(claims.plantId, plantId))
    .orderBy(asc(claims.id));

  if (rows.length === 0) return [];
  const claimIds = rows.map((row) => row.claim.id);
  const sourceRows = await db
    .select({ claimId: claimStudies.claimId, study: studies })
    .from(claimStudies)
    .innerJoin(studies, eq(claimStudies.studyId, studies.id))
    .where(inArray(claimStudies.claimId, claimIds))
    .orderBy(desc(studies.year));
  const sourcesByClaim = new Map<number, StudyRecord[]>();
  for (const row of sourceRows) {
    const current = sourcesByClaim.get(row.claimId) ?? [];
    current.push(row.study);
    sourcesByClaim.set(row.claimId, current);
  }

  const { targetsByClaim, preparationsByClaim } = await loadClaimGraph(claimIds);

  return rows.map((row) => ({
    ...row.claim,
    mechanism: row.mechanism,
    pathology: row.pathology,
    targets: targetsByClaim.get(row.claim.id) ?? [],
    preparations: preparationsByClaim.get(row.claim.id) ?? [],
    sources: sourcesByClaim.get(row.claim.id) ?? [],
  }));
}


/**
 * Chaînons « cible biologique » et « préparation » d’une liste d’affirmations.
 * Évite de répéter la jointure sur chaque page qui affiche des affirmations.
 */
async function loadClaimGraph(claimIds: number[]) {
  const targetsByClaim = new Map<number, TargetRecord[]>();
  const preparationsByClaim = new Map<number, PreparationRecord[]>();
  if (claimIds.length === 0) return { targetsByClaim, preparationsByClaim };

  const targetRows = await db
    .select({ claimId: claimTargets.claimId, target: targets })
    .from(claimTargets)
    .innerJoin(targets, eq(claimTargets.targetId, targets.id))
    .where(inArray(claimTargets.claimId, claimIds))
    .orderBy(asc(targets.name));
  for (const row of targetRows) {
    targetsByClaim.set(row.claimId, [...(targetsByClaim.get(row.claimId) ?? []), row.target]);
  }

  const preparationRows = await db
    .select({ claimId: claimPreparations.claimId, preparation: preparations })
    .from(claimPreparations)
    .innerJoin(preparations, eq(claimPreparations.preparationId, preparations.id))
    .where(inArray(claimPreparations.claimId, claimIds))
    .orderBy(asc(preparations.name));
  for (const row of preparationRows) {
    preparationsByClaim.set(row.claimId, [...(preparationsByClaim.get(row.claimId) ?? []), row.preparation]);
  }

  return { targetsByClaim, preparationsByClaim };
}

export async function getPlants(family?: string): Promise<PlantListItem[]> {
  const rows = await db
    .select()
    .from(plants)
    .where(family ? eq(plants.family, family) : undefined)
    .orderBy(asc(plants.scientificName));
  const counts = await db
    .select({ plantId: plantStudies.plantId, sources: count() })
    .from(plantStudies)
    .groupBy(plantStudies.plantId);
  const sourceCounts = new Map(counts.map((row) => [row.plantId, Number(row.sources)]));
  return rows.map((plant) => ({ ...plant, sourceCount: sourceCounts.get(plant.id) ?? 0 }));
}

export async function getPlantFamilies(): Promise<string[]> {
  const rows = await db.selectDistinct({ family: plants.family }).from(plants).orderBy(asc(plants.family));
  return rows.map((row) => row.family);
}

export async function getPlantBySlug(slug: string): Promise<PlantDetail | null> {
  const [plant] = await db.select().from(plants).where(eq(plants.slug, slug)).limit(1);
  if (!plant) return null;

  const [useRows, studyRows, compoundRows, safetyRows] = await Promise.all([
    db
      .select({ use: traditionalUses, source: studies })
      .from(traditionalUses)
      .innerJoin(studies, eq(traditionalUses.sourceStudyId, studies.id))
      .where(eq(traditionalUses.plantId, plant.id))
      .orderBy(asc(traditionalUses.id)),
    db
      .select({ study: studies })
      .from(plantStudies)
      .innerJoin(studies, eq(plantStudies.studyId, studies.id))
      .where(eq(plantStudies.plantId, plant.id))
      .orderBy(desc(studies.year)),
    db
      .select({ compound: compounds, source: studies })
      .from(plantCompounds)
      .innerJoin(compounds, eq(plantCompounds.compoundId, compounds.id))
      .innerJoin(studies, eq(plantCompounds.studyId, studies.id))
      .where(eq(plantCompounds.plantId, plant.id))
      .orderBy(asc(compounds.name)),
    db
      .select({ safety: plantSafety, source: studies })
      .from(plantSafety)
      .leftJoin(studies, eq(plantSafety.sourceStudyId, studies.id))
      .where(eq(plantSafety.plantId, plant.id))
      .limit(1),
  ]);

  return {
    plant,
    traditionalUses: useRows,
    studies: studyRows.map((row) => row.study),
    claims: await loadClaimRowsForPlant(plant.id),
    compounds: compoundRows,
    safety: safetyRows[0] ? { ...safetyRows[0].safety, source: safetyRows[0].source } : null,
  };
}

export async function getPathologies() {
  const rows = await db.select().from(pathologies).orderBy(asc(pathologies.name));
  const related = await db
    .select({ pathologyId: claims.pathologyId, total: count() })
    .from(claims)
    .where(sql`${claims.pathologyId} is not null`)
    .groupBy(claims.pathologyId);
  const counts = new Map(related.map((row) => [row.pathologyId, Number(row.total)]));
  const illustrations = await getIllustrationsByPathology();
  return rows.map((pathology) => ({
    ...pathology,
    claimCount: counts.get(pathology.id) ?? 0,
    illustration: illustrations.get(pathology.id) ?? null,
  }));
}

/** Première espèce illustrée d’un dossier de pathologie (photo documentaire). */
async function getIllustrationsByPathology() {
  const rows = await db
    .select({
      pathologyId: claims.pathologyId,
      slug: plants.slug,
      scientificName: plants.scientificName,
      imageUrl: plants.imageUrl,
      imageCredit: plants.imageCredit,
      imageSourceUrl: plants.imageSourceUrl,
      imageNote: plants.imageNote,
    })
    .from(claims)
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .where(sql`${claims.pathologyId} is not null and ${plants.imageUrl} is not null`)
    .orderBy(asc(plants.scientificName));
  const map = new Map<number, Illustration>();
  for (const row of rows) {
    if (row.pathologyId === null || map.has(row.pathologyId)) continue;
    map.set(row.pathologyId, illustrationOf([row])!);
  }
  return map;
}

/** Première espèce illustrée d’un axe expérimental. */
async function getIllustrationsByMechanism() {
  const rows = await db
    .select({
      mechanismId: claims.mechanismId,
      slug: plants.slug,
      scientificName: plants.scientificName,
      imageUrl: plants.imageUrl,
      imageCredit: plants.imageCredit,
      imageSourceUrl: plants.imageSourceUrl,
      imageNote: plants.imageNote,
    })
    .from(claims)
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .where(sql`${claims.mechanismId} is not null and ${plants.imageUrl} is not null`)
    .orderBy(asc(plants.scientificName));
  const map = new Map<number, Illustration>();
  for (const row of rows) {
    if (row.mechanismId === null || map.has(row.mechanismId)) continue;
    map.set(row.mechanismId, illustrationOf([row])!);
  }
  return map;
}

export async function getPathologyBySlug(slug: string) {
  const [pathology] = await db.select().from(pathologies).where(eq(pathologies.slug, slug)).limit(1);
  if (!pathology) return null;
  const rows = await db
    .select({ claim: claims, plant: plants, mechanism: mechanisms })
    .from(claims)
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .leftJoin(mechanisms, eq(claims.mechanismId, mechanisms.id))
    .where(eq(claims.pathologyId, pathology.id))
    .orderBy(asc(plants.scientificName));
  const ids = rows.map((row) => row.claim.id);
  const sourceRows = ids.length
    ? await db
        .select({ claimId: claimStudies.claimId, study: studies })
        .from(claimStudies)
        .innerJoin(studies, eq(claimStudies.studyId, studies.id))
        .where(inArray(claimStudies.claimId, ids))
        .orderBy(desc(studies.year))
    : [];
  const sourceMap = new Map<number, StudyRecord[]>();
  for (const row of sourceRows) {
    sourceMap.set(row.claimId, [...(sourceMap.get(row.claimId) ?? []), row.study]);
  }
  const graph = await loadClaimGraph(ids);
  return {
    pathology,
    illustration: illustrationOf(rows.map((row) => row.plant)),
    claims: rows.map((row) => ({
      ...row.claim,
      plant: row.plant,
      mechanism: row.mechanism,
      targets: graph.targetsByClaim.get(row.claim.id) ?? [],
      preparations: graph.preparationsByClaim.get(row.claim.id) ?? [],
      sources: sourceMap.get(row.claim.id) ?? [],
    })),
  };
}

export async function getMechanisms() {
  const rows = await db.select().from(mechanisms).orderBy(asc(mechanisms.name));
  const related = await db.select({ mechanismId: claims.mechanismId, total: count() }).from(claims).groupBy(claims.mechanismId);
  const counts = new Map(related.map((row) => [row.mechanismId, Number(row.total)]));
  const illustrations = await getIllustrationsByMechanism();
  return rows.map((mechanism) => ({
    ...mechanism,
    claimCount: counts.get(mechanism.id) ?? 0,
    illustration: illustrations.get(mechanism.id) ?? null,
  }));
}

export async function getMechanismBySlug(slug: string) {
  const [mechanism] = await db.select().from(mechanisms).where(eq(mechanisms.slug, slug)).limit(1);
  if (!mechanism) return null;
  const rows = await db
    .select({ claim: claims, plant: plants, pathology: pathologies })
    .from(claims)
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .leftJoin(pathologies, eq(claims.pathologyId, pathologies.id))
    .where(eq(claims.mechanismId, mechanism.id))
    .orderBy(asc(plants.scientificName));
  const ids = rows.map((row) => row.claim.id);
  const sourceRows = ids.length
    ? await db
        .select({ claimId: claimStudies.claimId, study: studies })
        .from(claimStudies)
        .innerJoin(studies, eq(claimStudies.studyId, studies.id))
        .where(inArray(claimStudies.claimId, ids))
        .orderBy(desc(studies.year))
    : [];
  const sourceMap = new Map<number, StudyRecord[]>();
  for (const row of sourceRows) {
    sourceMap.set(row.claimId, [...(sourceMap.get(row.claimId) ?? []), row.study]);
  }
  const graph = await loadClaimGraph(ids);
  return {
    mechanism,
    illustration: illustrationOf(rows.map((row) => row.plant)),
    claims: rows.map((row) => ({
      ...row.claim,
      plant: row.plant,
      pathology: row.pathology,
      targets: graph.targetsByClaim.get(row.claim.id) ?? [],
      preparations: graph.preparationsByClaim.get(row.claim.id) ?? [],
      sources: sourceMap.get(row.claim.id) ?? [],
    })),
  };
}

export async function getCompounds() {
  const rows = await db.select().from(compounds).orderBy(asc(compounds.name));
  const relations = await db
    .select({ compoundId: plantCompounds.compoundId, plantId: plantCompounds.plantId })
    .from(plantCompounds);
  const plantCounts = new Map<number, Set<number>>();
  for (const relation of relations) {
    const current = plantCounts.get(relation.compoundId) ?? new Set<number>();
    current.add(relation.plantId);
    plantCounts.set(relation.compoundId, current);
  }
  return rows.map((compound) => ({ ...compound, plantCount: plantCounts.get(compound.id)?.size ?? 0 }));
}

export async function getCompoundBySlug(slug: string) {
  const [compound] = await db.select().from(compounds).where(eq(compounds.slug, slug)).limit(1);
  if (!compound) return null;
  const rows = await db
    .select({ plant: plants, source: studies })
    .from(plantCompounds)
    .innerJoin(plants, eq(plantCompounds.plantId, plants.id))
    .innerJoin(studies, eq(plantCompounds.studyId, studies.id))
    .where(eq(plantCompounds.compoundId, compound.id))
    .orderBy(asc(plants.scientificName));
  return { compound, plants: rows };
}


export async function getTargets() {
  const rows = await db.select().from(targets).orderBy(asc(targets.targetType), asc(targets.name));
  const related = await db
    .select({ targetId: claimTargets.targetId, total: count() })
    .from(claimTargets)
    .groupBy(claimTargets.targetId);
  const counts = new Map(related.map((row) => [row.targetId, Number(row.total)]));
  return rows.map((target) => ({ ...target, claimCount: counts.get(target.id) ?? 0 }));
}

export async function getTargetBySlug(slug: string) {
  const [target] = await db.select().from(targets).where(eq(targets.slug, slug)).limit(1);
  if (!target) return null;

  const rows = await db
    .select({ claim: claims, plant: plants, mechanism: mechanisms, pathology: pathologies })
    .from(claimTargets)
    .innerJoin(claims, eq(claimTargets.claimId, claims.id))
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .leftJoin(mechanisms, eq(claims.mechanismId, mechanisms.id))
    .leftJoin(pathologies, eq(claims.pathologyId, pathologies.id))
    .where(eq(claimTargets.targetId, target.id))
    .orderBy(asc(plants.scientificName));

  const ids = rows.map((row) => row.claim.id);
  const sourceRows = ids.length
    ? await db
        .select({ claimId: claimStudies.claimId, study: studies })
        .from(claimStudies)
        .innerJoin(studies, eq(claimStudies.studyId, studies.id))
        .where(inArray(claimStudies.claimId, ids))
        .orderBy(desc(studies.year))
    : [];
  const sourceMap = new Map<number, StudyRecord[]>();
  for (const row of sourceRows) {
    sourceMap.set(row.claimId, [...(sourceMap.get(row.claimId) ?? []), row.study]);
  }
  const graph = await loadClaimGraph(ids);

  return {
    target,
    illustration: illustrationOf(rows.map((row) => row.plant)),
    claims: rows.map((row) => ({
      ...row.claim,
      plant: row.plant,
      mechanism: row.mechanism,
      pathology: row.pathology,
      preparations: graph.preparationsByClaim.get(row.claim.id) ?? [],
      sources: sourceMap.get(row.claim.id) ?? [],
    })),
  };
}

/** Parcours complet pathologie → mécanisme → cible → plante → préparation → étude → preuve. */
export async function getPathwayForPathology(slug: string) {
  const detail = await getPathologyBySlug(slug);
  if (!detail) return null;
  const links = detail.claims
    .filter((claim) => claim.targets.length > 0 || claim.preparations.length > 0)
    .map((claim) => ({
      claim,
      targets: claim.targets,
      preparations: claim.preparations,
    }));
  return { ...detail, pathway: links };
}

export async function getStudies() {
  const rows = await db.select().from(studies).orderBy(desc(studies.year), asc(studies.title));
  const plantRows = await db
    .select({ studyId: plantStudies.studyId, plant: plants })
    .from(plantStudies)
    .innerJoin(plants, eq(plantStudies.plantId, plants.id))
    .orderBy(asc(plants.scientificName));
  const plantMap = new Map<number, PlantRecord[]>();
  for (const row of plantRows) {
    plantMap.set(row.studyId, [...(plantMap.get(row.studyId) ?? []), row.plant]);
  }
  return rows.map((study) => ({ ...study, plants: plantMap.get(study.id) ?? [] }));
}

export async function getHomeData() {
  const [plantList, studyList, pathologyList, mechanismList, compoundList] = await Promise.all([
    getPlants(),
    getStudies(),
    getPathologies(),
    getMechanisms(),
    getCompounds(),
  ]);
  return {
    plants: plantList,
    studies: studyList,
    pathologies: pathologyList,
    mechanisms: mechanismList,
    compounds: compoundList,
    stats: {
      plants: plantList.length,
      studies: studyList.length,
      claims: (await db.select({ total: count() }).from(claims))[0]?.total ?? 0,
      compounds: compoundList.length,
    },
  };
}

export async function searchCatalog(rawQuery: string): Promise<SearchResult[]> {
  const query = rawQuery.trim().slice(0, 120);
  if (query.length < 2) return [];

  const folded = foldText(query);
  const pattern = containsPattern(query);
  const like = (expr: unknown) => sql`${foldSql(expr)} like ${pattern} escape '\\'`;

  const plantBlob = sql`${plants.scientificName} || ' ' || ${plants.family} || ' ' || ${plants.summary} || ' ' || ${plants.commonNames}::text || ' ' || ${plants.synonyms}::text`;
  const pathologyBlob = sql`${pathologies.name} || ' ' || ${pathologies.summary} || ' ' || ${pathologies.scopeNote}`;
  const mechanismBlob = sql`${mechanisms.name} || ' ' || ${mechanisms.description} || ' ' || ${mechanisms.readingText}`;
  const targetBlob = sql`${targets.name} || ' ' || coalesce(${targets.organism}, '') || ' ' || ${targets.description}`;
  const compoundBlob = sql`${compounds.name} || ' ' || ${compounds.chemicalFamily} || ' ' || ${compounds.description}`;
  const preparationBlob = sql`${preparations.name} || ' ' || ${preparations.partUsed} || ' ' || coalesce(${preparations.solvent}, '') || ' ' || ${preparations.form} || ' ' || ${preparations.notes}`;
  const studyBlob = sql`${studies.title} || ' ' || ${studies.authors} || ' ' || ${studies.journal} || ' ' || ${studies.abstractSummary} || ' ' || ${studies.keyResults}`;

  const [plantRows, pathologyRows, mechanismRows, targetRows, compoundRows, preparationRows, studyRows] =
    await Promise.all([
      db
        .select({ slug: plants.slug, name: plants.scientificName, family: plants.family, summary: plants.summary })
        .from(plants)
        .where(like(plantBlob))
        .orderBy(rankSql(plants.scientificName, folded), asc(plants.scientificName))
        .limit(10),
      db
        .select({ slug: pathologies.slug, name: pathologies.name, summary: pathologies.summary })
        .from(pathologies)
        .where(like(pathologyBlob))
        .orderBy(rankSql(pathologies.name, folded), asc(pathologies.name))
        .limit(6),
      db
        .select({ slug: mechanisms.slug, name: mechanisms.name, summary: mechanisms.description })
        .from(mechanisms)
        .where(like(mechanismBlob))
        .orderBy(rankSql(mechanisms.name, folded), asc(mechanisms.name))
        .limit(6),
      db
        .select({ slug: targets.slug, name: targets.name, organism: targets.organism, description: targets.description })
        .from(targets)
        .where(like(targetBlob))
        .orderBy(rankSql(targets.name, folded), asc(targets.name))
        .limit(6),
      db
        .select({ slug: compounds.slug, name: compounds.name, summary: compounds.description })
        .from(compounds)
        .where(like(compoundBlob))
        .orderBy(rankSql(compounds.name, folded), asc(compounds.name))
        .limit(6),
      db
        .select({
          slug: preparations.slug,
          name: preparations.name,
          plantSlug: plants.slug,
          plantName: plants.scientificName,
        })
        .from(preparations)
        .innerJoin(plants, eq(preparations.plantId, plants.id))
        .where(like(preparationBlob))
        .orderBy(rankSql(preparations.name, folded), asc(preparations.name))
        .limit(6),
      db
        .select({ slug: studies.slug, name: studies.title, journal: studies.journal, year: studies.year })
        .from(studies)
        .where(like(studyBlob))
        .orderBy(desc(studies.year), asc(studies.title))
        .limit(10),
    ]);

  return [
    ...plantRows.map((row) => ({
      href: `/plantes/${row.slug}`,
      title: row.name,
      category: "Plante" as const,
      detail: `${row.family} · ${row.summary}`,
    })),
    ...pathologyRows.map((row) => ({
      href: `/pathologies/${row.slug}`,
      title: row.name,
      category: "Pathologie" as const,
      detail: row.summary,
    })),
    ...mechanismRows.map((row) => ({
      href: `/mecanismes/${row.slug}`,
      title: row.name,
      category: "Mécanisme" as const,
      detail: row.summary,
    })),
    ...targetRows.map((row) => ({
      href: `/cibles/${row.slug}`,
      title: row.name,
      category: "Cible" as const,
      detail: row.organism ? `${row.organism} · ${row.description}` : row.description,
    })),
    ...compoundRows.map((row) => ({
      href: `/composes/${row.slug}`,
      title: row.name,
      category: "Composé" as const,
      detail: row.summary,
    })),
    ...preparationRows.map((row) => ({
      href: `/plantes/${row.plantSlug}`,
      title: row.name,
      category: "Préparation" as const,
      detail: `${row.plantName} · préparation testée en étude`,
    })),
    ...studyRows.map((row) => ({
      href: `/publications#${row.slug}`,
      title: row.name,
      category: "Publication" as const,
      detail: `${row.journal} · ${row.year}`,
    })),
  ];
}

export async function getPublicStats() {
  const [plantCount, studyCount, claimCount, compoundCount] = await Promise.all([
    db.select({ total: count() }).from(plants),
    db.select({ total: count() }).from(studies),
    db.select({ total: count() }).from(claims),
    db.select({ total: count() }).from(compounds),
  ]);
  return {
    plants: Number(plantCount[0]?.total ?? 0),
    studies: Number(studyCount[0]?.total ?? 0),
    claims: Number(claimCount[0]?.total ?? 0),
    compounds: Number(compoundCount[0]?.total ?? 0),
  };
}

export async function getStudiesForClaim(claimId: number): Promise<StudyRecord[]> {
  const rows = await db
    .select({ study: studies })
    .from(claimStudies)
    .innerJoin(studies, eq(claimStudies.studyId, studies.id))
    .where(eq(claimStudies.claimId, claimId))
    .orderBy(desc(studies.year));
  return rows.map((row) => row.study);
}

export async function getRecentStudies(limit = 3) {
  return db.select().from(studies).orderBy(desc(studies.year), asc(studies.title)).limit(limit);
}

export async function getFamilyNameCounts() {
  return db
    .select({ family: plants.family, total: count() })
    .from(plants)
    .groupBy(plants.family)
    .orderBy(asc(plants.family));
}

export async function getSearchCount(rawQuery: string) {
  const query = rawQuery.trim().slice(0, 120);
  if (query.length < 2) return 0;
  const [rows] = await Promise.all([
    db
      .select({ total: count() })
      .from(plants)
      .where(
        and(
          sql`to_tsvector('french', ${plants.scientificName} || ' ' || ${plants.family} || ' ' || ${plants.summary}) @@ plainto_tsquery('french', ${query})`,
        ),
      ),
  ]);
  return Number(rows[0]?.total ?? 0);
}

export type SolutionEntry = (typeof claims.$inferSelect) & {
  plant: PlantRecord;
  mechanism: MechanismRecord | null;
  sources: StudyRecord[];
};

export type SolutionGroup = {
  key: string;
  title: string;
  summary: string;
  scopeNote: string | null;
  href: string | null;
  entries: SolutionEntry[];
};

/**
 * Vue « solutions documentées » : pour chaque sujet, les plantes étudiées,
 * le mécanisme mesuré, le niveau de preuve et les sources.
 * Les affirmations sans sujet assigné sont regroupées à part, jamais masquées.
 * Aucune dose ni posologie n’est exposée ici, par construction.
 */
export async function getSolutionsOverview(): Promise<SolutionGroup[]> {
  const pathologyRows = await db.select().from(pathologies).orderBy(asc(pathologies.name));

  const claimRows = await db
    .select({ claim: claims, plant: plants, mechanism: mechanisms })
    .from(claims)
    .innerJoin(plants, eq(claims.plantId, plants.id))
    .leftJoin(mechanisms, eq(claims.mechanismId, mechanisms.id))
    .orderBy(asc(plants.scientificName));

  const claimIds = claimRows.map((row) => row.claim.id);
  const sourceRows = claimIds.length
    ? await db
        .select({ claimId: claimStudies.claimId, study: studies })
        .from(claimStudies)
        .innerJoin(studies, eq(claimStudies.studyId, studies.id))
        .where(inArray(claimStudies.claimId, claimIds))
        .orderBy(desc(studies.year))
    : [];
  const sourceMap = new Map<number, StudyRecord[]>();
  for (const row of sourceRows) {
    sourceMap.set(row.claimId, [...(sourceMap.get(row.claimId) ?? []), row.study]);
  }

  const entries = claimRows.map((row) => ({
    ...row.claim,
    plant: row.plant,
    mechanism: row.mechanism,
    sources: sourceMap.get(row.claim.id) ?? [],
  }));

  const groups: SolutionGroup[] = pathologyRows.map((pathology) => ({
    key: pathology.slug,
    title: pathology.name,
    summary: pathology.summary,
    scopeNote: pathology.scopeNote,
    href: `/pathologies/${pathology.slug}`,
    entries: entries.filter((entry) => entry.pathologyId === pathology.id),
  }));

  const orphans = entries.filter((entry) => entry.pathologyId === null);
  if (orphans.length > 0) {
    groups.push({
      key: "autres-pistes",
      title: "Autres pistes documentées",
      summary:
        "Affirmations sourcées qui ne sont rattachées à aucun dossier de pathologie : résultats expérimentaux, sécurité ou données insuffisantes.",
      scopeNote: null,
      href: null,
      entries: orphans,
    });
  }

  return groups.filter((group) => group.entries.length > 0);
}
