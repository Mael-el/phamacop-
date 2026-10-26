import { sql, type SQL } from "drizzle-orm";

/**
 * Recherche tolérante : casse, accents, mots partiels.
 *
 * PostgreSQL est utilisé sans l'extension `unaccent` (indisponible sur ce
 * déploiement) : les accents sont donc repliés par `translate()` côté SQL et
 * par `normalize()` côté JavaScript. Les deux replis doivent rester alignés.
 */
// 26 caractères accentués → 26 caractères ASCII (même longueur, exigence de translate()).
const ACCENTED = "àâäáãåéèêëíìîïóòôöõúùûüçñÿ";
const PLAIN = "aaaaaaeeeeiiiiooooouuuucny";

/** Repli identique à celui appliqué en SQL (minuscules + accents retirés). */
export function foldText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Échappe les caractères spéciaux de LIKE (`%`, `_`, `\`). */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

/** Motif « contient », déjà replié et échappé. */
export function containsPattern(raw: string): string {
  return `%${escapeLike(foldText(raw.trim()))}%`;
}

/** Motif « commence par », utilisé pour classer les résultats. */
export function startsWithPattern(raw: string): string {
  return `${escapeLike(foldText(raw.trim()))}%`;
}

/** Expression SQL repliée (minuscules, sans accents) pour une colonne ou un assemblage. */
export function foldSql(expression: SQL | unknown): SQL {
  return sql`translate(lower(${expression}), ${ACCENTED}, ${PLAIN})`;
}

/**
 * Classement : correspondance exacte, puis début de nom, puis le reste.
 * `folded` doit déjà être replié (voir `foldText`).
 */
export function rankSql(nameExpression: SQL | unknown, folded: string): SQL {
  return sql`case
    when ${foldSql(nameExpression)} = ${folded} then 0
    when ${foldSql(nameExpression)} like ${startsWithPattern(folded)} then 1
    else 2 end`;
}
