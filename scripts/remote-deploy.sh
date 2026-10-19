#!/usr/bin/env bash
# Démarre Next.js via PM2. Nginx se bascule à part (sudo interactif sur le VPS).
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

echo "== app dir: ${APP_DIR} =="

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "== install nvm =="
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22
echo "== node $(node -v)  $(which node) =="

if ! command -v pm2 >/dev/null 2>&1; then
  echo "== install pm2 =="
  npm i -g pm2
fi

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

export NODE_ENV=production
export PORT="${PORT:-3000}"
export HOST="${HOST:-0.0.0.0}"
export HOSTNAME=0.0.0.0

echo "== pm2 =="
pm2 delete portfolio >/dev/null 2>&1 || true
pm2 start ecosystem.config.cjs --interpreter "$(which node)" --update-env
pm2 save

echo "== healthcheck :${PORT} =="
ok=0
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    ok=1
    echo "ok after ${i} try"
    break
  fi
  sleep 2
done
if [ "$ok" -ne 1 ]; then
  echo "Next.js ne répond pas sur 127.0.0.1:${PORT}"
  pm2 logs portfolio --nostream --lines 80 || true
  exit 1
fi

echo "== Next.js est en ligne sur :${PORT} =="
echo "Pour le publier sur bricman-mathis.fr, sur le VPS :"
echo "  sudo bash ${APP_DIR}/enable-nginx-proxy.sh"
