#!/usr/bin/env bash
# Exécuté sur le VPS après rsync du build standalone.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
fi
# shellcheck disable=SC1090
. "$NVM_DIR/nvm.sh"
nvm install 22
nvm use 22
nvm alias default 22

if ! command -v pm2 >/dev/null 2>&1; then
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
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

if pm2 describe portfolio >/dev/null 2>&1; then
  pm2 restart portfolio --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    break
  fi
  sleep 2
done
curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"

NGINX_TARGET="$(sudo grep -rl "bricman-mathis.fr" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | head -1 || true)"
if [ -z "${NGINX_TARGET}" ]; then
  echo "Aucun vhost nginx pour bricman-mathis.fr"
  exit 1
fi

if sudo grep -q "proxy_pass http://127.0.0.1:3000" "$NGINX_TARGET"; then
  echo "nginx déjà en reverse proxy ($NGINX_TARGET)"
else
  sudo cat "$NGINX_TARGET" > /tmp/portfolio-nginx-in.conf
  python3 - <<'PY'
import re
from pathlib import Path

text = Path("/tmp/portfolio-nginx-in.conf").read_text(errors="ignore")
proxy = """location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
        proxy_buffering off;
    }"""

updated = re.sub(
    r"location\s+/\s*\{(?:[^{}]|\n)*try_files[^}]*\}",
    proxy,
    text,
    count=1,
)
if "proxy_pass http://127.0.0.1:3000" not in updated:
    updated = re.sub(r"\}\s*$", proxy + "\n}\n", text, count=1)
if "proxy_pass http://127.0.0.1:3000" not in updated:
    raise SystemExit("Impossible d'injecter le reverse proxy nginx")

updated = re.sub(r"^(\s*root\s+[^;]*;)", r"# \1", updated, flags=re.M)
updated = re.sub(r"^(\s*index\s+index\.html;)", r"# \1", updated, flags=re.M)
Path("/tmp/portfolio-nginx.conf").write_text(updated)
PY
  sudo cp -a "$NGINX_TARGET" "${NGINX_TARGET}.bak-before-next"
  sudo cp /tmp/portfolio-nginx.conf "$NGINX_TARGET"
fi

sudo nginx -t
sudo systemctl reload nginx
