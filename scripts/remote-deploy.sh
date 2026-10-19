#!/usr/bin/env bash
# Exécuté sur le VPS après rsync du build standalone.
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
echo "== node $(node -v) =="

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
export HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "== pm2 =="
if pm2 describe portfolio >/dev/null 2>&1; then
  pm2 restart portfolio --update-env
else
  pm2 start ecosystem.config.cjs
fi
pm2 save

echo "== healthcheck :${PORT} =="
ok=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    ok=1
    break
  fi
  sleep 2
done
if [ "$ok" -ne 1 ]; then
  echo "Next.js ne répond pas sur :${PORT}"
  pm2 logs portfolio --nostream --lines 80 || true
  exit 1
fi

echo "== nginx reverse proxy =="
sudo -n nginx -T >/tmp/nginx-T.conf 2>/tmp/nginx-T.err || {
  echo "sudo nginx -T impossible"
  cat /tmp/nginx-T.err || true
  exit 1
}

NGINX_TARGET="$(awk '/^# configuration file .*bricman/{print $NF}' /tmp/nginx-T.err /tmp/nginx-T.conf | sed 's/://g' | head -1 || true)"
if [ -z "${NGINX_TARGET}" ]; then
  NGINX_TARGET="$(awk '/bricman-mathis.fr/ {found=1} found && /^# configuration file /{print $NF; exit}' /tmp/nginx-T.err | sed 's/://g' || true)"
fi
if [ -z "${NGINX_TARGET}" ]; then
  echo "Vhost bricman-mathis.fr introuvable dans nginx -T"
  grep -n "bricman" /tmp/nginx-T.conf /tmp/nginx-T.err || true
  exit 1
fi
echo "vhost: ${NGINX_TARGET}"

if sudo -n grep -q "proxy_pass http://127.0.0.1:3000" "$NGINX_TARGET" 2>/dev/null \
  || grep -q "proxy_pass http://127.0.0.1:3000" /tmp/nginx-T.conf; then
  echo "nginx déjà en reverse proxy"
  sudo -n nginx -t
  sudo -n systemctl reload nginx
  exit 0
fi

sudo -n cat "$NGINX_TARGET" > /tmp/portfolio-nginx-in.conf || {
  echo "Impossible de lire ${NGINX_TARGET} (sudo cat)."
  exit 1
}

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

sudo -n cp -a "$NGINX_TARGET" "${NGINX_TARGET}.bak-before-next" || true
if ! sudo -n tee "$NGINX_TARGET" >/dev/null < /tmp/portfolio-nginx.conf; then
  echo "sudo tee a échoué. Ajoute dans sudoers :"
  echo "  ${USER} ALL=(ALL) NOPASSWD: /usr/bin/tee, /usr/bin/cp, /usr/sbin/nginx, /bin/systemctl"
  exit 1
fi

sudo -n nginx -t
sudo -n systemctl reload nginx
echo "== nginx rechargé =="
