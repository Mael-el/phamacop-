import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export type StudyType =
  | "IN_VITRO"
  | "IN_VIVO"
  | "MIXED_PRECLINICAL"
  | "CLINICAL"
  | "OBSERVATIONAL"
  | "REVIEW"
  | "ETHNOBOTANICAL";

export type EvidenceLevel =
  | "HIGH"
  | "MODERATE"
  | "PRECLINICAL"
  | "ETHNOBOTANICAL"
  | "INSUFFICIENT"
  | "RISK_SIGNAL";

export type NameRecord = { language: string; name: string; region?: string };
export type CandidateStatus = "PENDING_REVIEW" | "APPROVED" | "REJECTED";

export const plants = pgTable(
  "plants",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    scientificName: varchar("scientific_name", { length: 255 }).notNull().unique(),
    botanicalAuthor: varchar("botanical_author", { length: 255 }),
    family: varchar("family", { length: 160 }).notNull(),
    commonNames: jsonb("common_names").$type<NameRecord[]>().notNull().default(sql`'[]'::jsonb`),
    synonyms: text("synonyms").array().notNull().default(sql`'{}'::text[]`),
    summary: text("summary").notNull(),
    sourceRegions: text("source_regions").array().notNull().default(sql`'{}'::text[]`),
    partsUsed: text("parts_used").array().notNull().default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("plants_family_idx").on(table.family),
    index("plants_search_idx").using(
      "gin",
      sql`to_tsvector('french', ${table.scientificName} || ' ' || ${table.family} || ' ' || ${table.summary})`, 
    ),
  ],
);

export const mechanisms = pgTable(
  "mechanisms",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: text("description").notNull(),
    readingText: text("reading_text").notNull(),
  },
  (table) => [
    index("mechanisms_search_idx").using(
      "gin",
      sql`to_tsvector('french', ${table.name} || ' ' || ${table.description} || ' ' || ${table.readingText})`,
    ),
  ],
);

export const pathologies = pgTable(
  "pathologies",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    summary: text("summary").notNull(),
    scopeNote: text("scope_note").notNull(),
  },
  (table) => [
    index("pathologies_search_idx").using(
      "gin",
      sql`to_tsvector('french', ${table.name} || ' ' || ${table.summary} || ' ' || ${table.scopeNote})`,
    ),
  ],
);

export const studies = pgTable(
  "studies",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    title: text("title").notNull(),
    authors: varchar("authors", { length: 500 }).notNull(),
    journal: varchar("journal", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    studyType: text("study_type").$type<StudyType>().notNull(),
    doi: varchar("doi", { length: 255 }),
    pmid: varchar("pmid", { length: 32 }),
    sourceUrl: text("source_url").notNull(),
    abstractSummary: text("abstract_summary").notNull(),
    keyResults: text("key_results").notNull(),
    limitations: text("limitations").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("studies_require_doi_or_pmid", sql`${table.doi} is not null or ${table.pmid} is not null`),
    uniqueIndex("studies_doi_idx").on(table.doi),
    uniqueIndex("studies_pmid_idx").on(table.pmid),
    index("studies_year_idx").on(table.year),
    index("studies_search_idx").using(
      "gin",
      sql`to_tsvector('french', ${table.title} || ' ' || ${table.abstractSummary} || ' ' || ${table.keyResults})`,
    ),
  ],
);

export const plantStudies = pgTable(
  "plant_studies",
  {
    plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
    studyId: integer("study_id").notNull().references(() => studies.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.plantId, table.studyId] })],
);

export const traditionalUses = pgTable("traditional_uses", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  region: varchar("region", { length: 255 }).notNull(),
  community: varchar("community", { length: 255 }),
  partReported: varchar("part_reported", { length: 255 }),
  preparationReported: text("preparation_reported"),
  sourceStudyId: integer("source_study_id").notNull().references(() => studies.id),
  sourceContext: text("source_context").notNull(),
});

export const compounds = pgTable(
  "compounds",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    chemicalFamily: varchar("chemical_family", { length: 255 }).notNull(),
    description: text("description").notNull(),
  },
  (table) => [
    index("compounds_search_idx").using(
      "gin",
      sql`to_tsvector('french', ${table.name} || ' ' || ${table.chemicalFamily} || ' ' || ${table.description})`,
    ),
  ],
);

export const plantCompounds = pgTable(
  "plant_compounds",
  {
    plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
    compoundId: integer("compound_id").notNull().references(() => compounds.id, { onDelete: "cascade" }),
    studyId: integer("study_id").notNull().references(() => studies.id),
  },
  (table) => [primaryKey({ columns: [table.plantId, table.compoundId, table.studyId] })],
);

export const claims = pgTable(
  "claims",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    plantId: integer("plant_id").notNull().references(() => plants.id, { onDelete: "cascade" }),
    mechanismId: integer("mechanism_id").references(() => mechanisms.id, { onDelete: "set null" }),
    pathologyId: integer("pathology_id").references(() => pathologies.id, { onDelete: "set null" }),
    claimText: text("claim_text").notNull(),
    evidenceLevel: text("evidence_level").$type<EvidenceLevel>().notNull(),
    rationale: text("rationale").notNull(),
    limitations: text("limitations").notNull(),
    reviewerStatus: varchar("reviewer_status", { length: 160 }).notNull().default("À valider par un expert"),
    expertReviewer: varchar("expert_reviewer", { length: 255 }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("claims_plant_idx").on(table.plantId),
    index("claims_pathology_idx").on(table.pathologyId),
    index("claims_mechanism_idx").on(table.mechanismId),
  ],
);

export const claimStudies = pgTable(
  "claim_studies",
  {
    claimId: integer("claim_id").notNull().references(() => claims.id, { onDelete: "cascade" }),
    studyId: integer("study_id").notNull().references(() => studies.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.claimId, table.studyId] })],
);

export const plantSafety = pgTable("plant_safety", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull().unique().references(() => plants.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  riskSignal: boolean("risk_signal").notNull().default(false),
  riskRationale: text("risk_rationale"),
  precautions: text("precautions").notNull(),
  sourceStudyId: integer("source_study_id").references(() => studies.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const literatureCandidates = pgTable(
  "literature_candidates",
  {
    id: serial("id").primaryKey(),
    pmid: varchar("pmid", { length: 32 }).notNull().unique(),
    doi: varchar("doi", { length: 255 }),
    title: text("title").notNull(),
    authors: text("authors").notNull().default(""),
    journal: varchar("journal", { length: 255 }).notNull().default(""),
    publicationYear: integer("publication_year"),
    publicationTypes: text("publication_types").array().notNull().default(sql`'{}'::text[]`),
    abstractText: text("abstract_text"),
    sourceUrl: text("source_url").notNull(),
    status: text("status").$type<CandidateStatus>().notNull().default("PENDING_REVIEW"),
    reviewNote: text("review_note"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    discoveryCount: integer("discovery_count").notNull().default(1),
  },
  (table) => [
    index("literature_candidates_status_idx").on(table.status),
    index("literature_candidates_last_seen_idx").on(table.lastSeenAt),
  ],
);
