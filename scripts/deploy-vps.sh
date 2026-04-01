#!/usr/bin/env bash
set -euo pipefail

cd "${VPS_PATH:-$HOME/portfolio}"

git fetch origin main
git reset --hard origin/main

npm install
npm run build

pm2 describe portfolio > /dev/null 2>&1 || pm2 start ecosystem.config.cjs
pm2 restart portfolio --update-env
pm2 save

