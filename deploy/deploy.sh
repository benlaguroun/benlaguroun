#!/usr/bin/env bash
# One command to ship an update on the machine that runs the site:  ./deploy/deploy.sh
# It pulls the latest code, installs, updates the database, rebuilds and restarts.
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
npm ci
npm run db:generate
# Applies schema changes. If it warns that data would be lost, stop and read it first.
npm run db:push
npm run build

if pm2 describe brand-web >/dev/null 2>&1; then
  pm2 reload brand-web --update-env
else
  pm2 start deploy/ecosystem.config.cjs
fi
pm2 save
echo "Deployed. Check https://benlaguroun.com and Admin -> Errors."
