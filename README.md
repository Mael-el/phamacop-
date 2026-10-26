# Herbier africain — pharmacopée végétale, preuves et sources

Base documentaire bilingue **français / fon** (Next.js 16 + PostgreSQL/Drizzle) consacrée à la
pharmacopée végétale africaine — plantes du Bénin et d’Afrique de l’Ouest : usages rapportés,
études publiées, niveaux de preuve, solutions documentées et limites.
Le site ne délivre ni diagnostic ni prescription : il documente ce que les sources publiées disent,
et ce qu’elles ne disent pas.

## Démarrage rapide

```bash
# 1. dépendances
npm install

# 2. base de données (PostgreSQL 14+ accessible via DATABASE_URL)
cp .env.example .env          # ajuster DATABASE_URL si nécessaire
npm run db:start              # démarre le cluster local et crée app_db si besoin
                              # (ou `createdb app_db` avec votre PostgreSQL habituel)

# 3. schéma + jeu de données scientifique
npm run db:push               # drizzle-kit push (synchro du schéma)
npm run db:seed               # 13 plantes, 19 études, 16 affirmations, 9 composés

# 4. lancement
npm run dev                   # http://localhost:3000
```

`scripts/db-start.sh` (alias `npm run db:start`) initialise si nécessaire un cluster
PostgreSQL 16 dans `$PGDATA` puis le démarre ; il utilise les binaires indiqués par
`PG_BIN` (par défaut l'installation locale `/home/user/.pgbin/bin`, issue du paquet
Python `pgserver`, sans dépendance à `apt`). Variables reconnues : `PG_BIN`, `PGDATA`,
`PGPORT`, `PGLOG`, `DATABASE_NAME`.

Variables d'environnement :

| Variable | Requis | Rôle |
| --- | --- | --- |
| `DATABASE_URL` | oui | Connexion PostgreSQL (`src/db/index.ts` échoue au démarrage si absente) |
| `NEXT_PUBLIC_SITE_URL` | non | URL canonique utilisée par `metadataBase` |
| `NCBI_EMAIL`, `NCBI_API_KEY` | non | Identification et quota pour les appels E-utilities PubMed |

## Scripts

| Script | Effet |
| --- | --- |
| `npm run dev` | serveur de développement (Turbopack) |
| `npm run build` / `npm start` | build et exécution en production |
| `npm run lint` | ESLint (config Next) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:start` | démarre le PostgreSQL local (et crée `app_db`) |
| `npm run db:push` | applique `src/db/schema.ts` à la base |
| `npm run db:seed` | insère / met à jour le corpus scientifique de démonstration |

## Architecture

```
src/
├── app/                     routes App Router (toutes en rendu dynamique)
│   ├── page.tsx             accueil : chiffres du corpus, plantes, solutions et études en avant
│   ├── solutions/           vue « solutions documentées » par sujet (plante, mécanisme, preuve, sources)
│   ├── langue/[locale]/     bascule de langue par cookie + redirection relative
│   ├── plantes/             liste + fiche espèce (noms fon, usages, solutions, composés, sécurité)
│   ├── pathologies/         liste + fiche pathologie, mécanismes associés
│   ├── mecanismes/          liste + fiche mécanisme / axe de recherche
│   ├── composes/            liste + fiche composé chimique
│   ├── publications/        bibliographie consolidée (ancres #slug)
│   ├── recherche/           recherche plein texte + veille PubMed à la demande
│   ├── veille/              file de notices candidates à vérifier
│   ├── comprendre/, preuves/methodologie/, mentions-legales/
│   └── api/health/          sonde base de données (200/500)
├── components/              header/footer, sélecteur FR/FON, cartes plante-étude-affirmation, badges
├── db/                      pool Drizzle, schéma (12 tables), seed scientifique
└── lib/                     i18n (dictionnaires fr/fon), catalog, pubmed, discovery, literature
```

### Modèle de données (`src/db/schema.ts`)

`plants`, `mechanisms`, `pathologies`, `compounds` décrivent le référentiel ;
`studies` (DOI **ou** PMID obligatoire, contrainte `check`) porte les sources primaires ;
`plant_studies`, `plant_compounds`, `traditional_uses`, `plant_safety`, `claims`
et `claim_studies` relient référentiel et preuves ; `literature_candidates` sert de file de
veille séparée, volontairement **hors** du corpus validé.

Chaque affirmation porte un `evidenceLevel`
(`HIGH`, `MODERATE`, `PRECLINICAL`, `ETHNOBOTANICAL`, `INSUFFICIENT`, `RISK_SIGNAL`),
une justification, des limites et un statut de relecture (`À valider par un expert` par défaut).
Recherche : index GIN `to_tsvector('french', …)` sur plantes, mécanismes, pathologies,
composés et études.

### Veille PubMed

`/recherche?q=…` interroge le catalogue local *et*, si la requête fait ≥ 3 caractères,
E-utilities (esearch → esummary → efetch) via `src/lib/pubmed.ts` (débit limité à ~3 req/s,
timeout 8 s). Les notices trouvées sont enregistrées en `literature_candidates` avec
`PENDING_REVIEW` : jamais publiées automatiquement, jamais transformées en niveau de preuve.
La panne réseau est gérée : la recherche locale reste servie et le statut `unavailable`
est affiché (`src/lib/discovery.ts`).

## Bilingue français / fon

- **Sélecteur FR / FON** dans l’en-tête (`src/components/locale-switcher.tsx`) : deux liens internes
  vers `/langue/{fr|fon}?next=<page courante>`. La route `src/app/langue/[locale]/route.ts` pose le
  cookie `pharmacopee_langue` (un an, `SameSite=Lax`) puis redirige en **chemin relatif** — donc sans
  JavaScript et sans dépendre de l’hôte (proxy de prévisualisation inclus).
- **Dictionnaires** : `src/lib/i18n.ts` expose les clés FR et fon (`dictionaries`), la langue active
  (`getDictionary`) et l’attribut `lang` du document (`fon` = code ISO 639-3).
- **Contenu** : toute l’interface est traduite ; les textes fon sont signalés comme
  « version de travail » par un bandeau, en attente de relecture par un locuteur natif.
- **Noms de plantes en fon** : la fiche espèce affiche un bloc « Nom en fon » (recherche sur
  `commonNames` avec `language: "fon"`). Noms déjà renseignés dans le seed :
  *Nauclea latifolia* → **nimon**, *Vernonia amygdalina* → **amanvivè**, *Ocimum gratissimum* →
  **tchiayo**, *Moringa oleifera* → **kpatinman**. Chaque nom est accompagné de sa variante et
  d’une mention invitant à confirmation par un locuteur natif.
- Les publications et résumés d’études restent dans leur langue d’origine (sources primaires) :
  aucune traduction automatique n’est injectée dans le corpus scientifique.

## Solutions documentées

`/solutions` rassemble, sujet par sujet, les plantes étudiées, le mécanisme mesuré, le niveau de
preuve, ce que le résultat ne prouve pas et les sources (DOI/PMID). Les affirmations non rattachées
à un dossier de pathologie ne sont pas masquées : elles apparaissent dans « Autres pistes
documentées ». **Aucune dose ni posologie n’est publiée**, par construction.

## État vérifié

- `npm run typecheck` et `npm run lint` : aucune erreur.
- Toutes les routes publiques et toutes les fiches détail du corpus répondent en HTTP 200.
- `GET /api/health` renvoie `{"ok":true}` lorsque PostgreSQL répond.
- Les appels PubMed peuvent être indisponibles en environnement sans accès sortant :
  le site reste fonctionnel, la collecte est simplement désactivée.

## Principes éditoriaux

1. Aucune affirmation sans source primaire identifiée (DOI/PMID) et sans mention de ses limites.
2. Distinguer systématiquement usage traditionnel, résultat préclinique et preuve clinique.
3. La veille automatique ne vaut pas validation : la relecture experte est obligatoire.
4. Pas de posologie, pas de recommandation thérapeutique, pas de substitution à un avis médical.
