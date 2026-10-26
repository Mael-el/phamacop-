#!/usr/bin/env bash
# Démarre (ou redémarre) le cluster PostgreSQL local utilisé pour le développement.
#
#   PG_BIN=/chemin/vers/bin ./scripts/db-start.sh
#
# Par défaut, PG_BIN pointe vers l'installation locale du bac à sable
# (/home/user/.pgbin/bin), qui contient PostgreSQL 16 fourni par le paquet
# Python `pgserver` (aucun accès apt requis).
set -euo pipefail

PG_BIN="${PG_BIN:-/home/user/.pgbin/bin}"
PGDATA="${PGDATA:-/home/user/.pgdata}"
PGPORT="${PGPORT:-5432}"
PGLOG="${PGLOG:-/home/user/.pgrun/pg.log}"
DATABASE_NAME="${DATABASE_NAME:-app_db}"

if [ ! -x "$PG_BIN/pg_ctl" ]; then
  echo "Binaires PostgreSQL introuvables dans $PG_BIN (définir PG_BIN)." >&2
  exit 1
fi

# Les bibliothèques partagées (libpq, libecpg, libpgtypes) sont livrées à côté.
export LD_LIBRARY_PATH="$(dirname "$PG_BIN")/lib:${LD_LIBRARY_PATH:-}"

mkdir -p "$PGDATA" "$(dirname "$PGLOG")"

if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "→ initialisation du cluster dans $PGDATA"
  "$PG_BIN/initdb" -D "$PGDATA" -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8 >/dev/null
fi

if "$PG_BIN/pg_isready" -h 127.0.0.1 -p "$PGPORT" >/dev/null 2>&1; then
  echo "→ PostgreSQL répond déjà sur 127.0.0.1:$PGPORT"
else
  "$PG_BIN/pg_ctl" -D "$PGDATA" \
    -o "-p $PGPORT -k $(dirname "$PGLOG") -c listen_addresses=127.0.0.1" \
    -l "$PGLOG" start >/dev/null
  sleep 1
fi

"$PG_BIN/pg_isready" -h 127.0.0.1 -p "$PGPORT"
"$PG_BIN/psql" -h 127.0.0.1 -p "$PGPORT" -U postgres -tAc \
  "select 1 from pg_database where datname = '$DATABASE_NAME'" | grep -q 1 || {
  "$PG_BIN/createdb" -h 127.0.0.1 -p "$PGPORT" -U postgres "$DATABASE_NAME"
  echo "→ base $DATABASE_NAME créée"
}
echo "→ prêt : postgresql://postgres:postgres@127.0.0.1:$PGPORT/$DATABASE_NAME"
