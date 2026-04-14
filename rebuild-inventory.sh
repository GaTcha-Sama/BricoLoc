#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

docker compose down
docker compose build --no-cache inventory-service
docker compose up -d
docker compose logs -f inventory-service
