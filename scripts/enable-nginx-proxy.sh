#!/usr/bin/env bash
# À lancer UNE FOIS sur le VPS, avec le mot de passe sudo :
#   sudo bash /home/VOTRE_USER/portfolio-next/enable-nginx-proxy.sh
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Relance avec : sudo bash $0"
  exit 1
fi

mapfile -t files < <(grep -rl "bricman-mathis.fr" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null || true)
if [ "${#files[@]}" -eq 0 ]; then
  echo "Aucun vhost nginx pour bricman-mathis.fr"
  exit 1
fi

TARGET="${files[0]}"
echo "vhost: ${TARGET}"

if grep -q "proxy_pass http://127.0.0.1:3000" "$TARGET"; then
  echo "Déjà en reverse proxy."
  nginx -t
  systemctl reload nginx
  exit 0
fi

cp -a "$TARGET" "${TARGET}.bak-before-next"
python3 - "$TARGET" <<'PY'
import re
import sys
from pathlib import Path

target = Path(sys.argv[1])
text = target.read_text(errors="ignore")
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
    raise SystemExit("Impossible d'injecter le reverse proxy")

updated = re.sub(r"^(\s*root\s+[^;]*;)", r"# \1", updated, flags=re.M)
updated = re.sub(r"^(\s*index\s+index\.html;)", r"# \1", updated, flags=re.M)
target.write_text(updated)
print(f"écrit {target}")
PY

nginx -t
systemctl reload nginx
echo "nginx pointe vers Next.js (127.0.0.1:3000)."
echo "Ouvre https://bricman-mathis.fr"
