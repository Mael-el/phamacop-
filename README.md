# Herbier ouest-africain — pharmacopée végétale, preuves et sources

Base documentaire (Next.js 16 + PostgreSQL/Drizzle) consacrée à la pharmacopée végétale
ouest-africaine : plantes, usages rapportés, études publiées, niveaux de preuve et limites.
Le site ne délivre ni diagnostic ni prescription : il documente ce que les sources publiées disent,
et ce qu'elles ne disent pas.

## Démarrage rapide

```bash
# 1. dépendances
npm install

# 2. base de données (PostgreSQL 14+ accessible via DATABASE_URL)
cp .env.example .env          # ajuster DATABASE_URL si nécessaire
createdb app_db               # ou via psql / votre hébergeur

# 3. schéma + jeu de données scientifique
npm run db:push               # drizzle-kit push (synchro du schéma)
npm run db:seed               # 13 plantes, 19 études, 16 affirmations, 9 composés

# 4. lancement
npm run dev                   # http://localhost:3000
```

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
| `npm run db:push` | applique `src/db/schema.ts` à la base |
| `npm run db:seed` | insère / met à jour le corpus scientifique de démonstration |

## Architecture

```
src/
├── app/                     routes App Router (toutes en rendu dynamique)
│   ├── page.tsx             accueil : chiffres du corpus, plantes et études en avant
│   ├── plantes/             liste + fiche espèce (usages, composés, affirmations, sécurité)
│   ├── pathologies/         liste + fiche pathologie, mécanismes associés
│   ├── mecanismes/          liste + fiche mécanisme / axe de recherche
│   ├── composes/            liste + fiche composé chimique
│   ├── publications/        bibliographie consolidée (ancres #slug)
│   ├── recherche/           recherche plein texte + veille PubMed à la demande
│   ├── veille/              file de notices candidates à vérifier
│   ├── comprendre/, preuves/methodologie/, mentions-legales/
│   └── api/health/          sonde base de données (200/500)
├── components/              header/footer, cartes plante-étude-affirmation, badges, recherche
├── db/                      pool Drizzle, schéma (12 tables), seed scientifique
└── lib/                     catalog (requêtes + recherche), pubmed, discovery, literature
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
