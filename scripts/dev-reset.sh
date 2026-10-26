#!/usr/bin/env bash
# Remet l'environnement de développement en état après une réinitialisation du bac à sable.
#
#   bash scripts/dev-reset.sh          # répare la base + dépendances, ne démarre pas Next.js
#   bash scripts/dev-reset.sh --serve  # … puis lance `next dev` sur 0.0.0.0:3000
#
# Idempotent : chaque étape est ignorée si elle est déjà en place.
set -euo pipefail

cd "$(dirname "$0")/.."

PG_INSTALL="/usr/local/lib/python3.11/dist-packages/pgserver/pginstall"
PG_LINK="/home/user/.pgbin"
DATABASE_URL_DEFAULT="postgresql://postgres:postgres@127.0.0.1:5432/app_db"

# 1. Binaires PostgreSQL (fournis par le paquet Python `pgserver`, aucun accès apt requis).
if [ ! -x "$PG_INSTALL/bin/pg_ctl" ]; then
  echo "→ installation de pgserver"
  pip install --break-system-packages -q pgserver
fi
if [ ! -e "$PG_LINK" ]; then
  echo "→ lien $PG_LINK → $PG_INSTALL"
  ln -sfn "$PG_INSTALL" "$PG_LINK"
fi

# 2. Variables d'environnement.
if [ ! -f .env ]; then
  echo "→ création de .env"
  printf 'DATABASE_URL=%s\n' "$DATABASE_URL_DEFAULT" > .env
fi

# 3. Cluster PostgreSQL + base applicative.
bash scripts/db-start.sh

# 4. Dépendances Node.
if [ ! -d node_modules ]; then
  echo "→ npm install"
  npm install
fi

# 5. Schéma Drizzle puis jeu de données documentaires.
echo "→ application du schéma"
npx drizzle-kit push --force
echo "→ chargement du corpus"
npx tsx src/db/seed.ts

# 6. Serveur de développement (facultatif).
if [ "${1:-}" = "--serve" ]; then
  echo "→ démarrage de Next.js sur 0.0.0.0:3000"
  exec npx next dev --hostname 0.0.0.0 --port 3000
fi

echo "→ prêt. Lancer : npx next dev --hostname 0.0.0.0 --port 3000"
