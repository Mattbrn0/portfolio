# Déploiement automatique (GitHub Actions -> VPS + Nginx)

Ce dépôt inclut la workflow GitHub `deploy-vps.yml`.

## Secrets GitHub à ajouter
Dans `Settings > Secrets and variables > Actions > New repository secret`, crée :

- `VPS_HOST` : IP ou hostname du VPS (ex: `135.125.102.27`)
- `VPS_USER` : utilisateur SSH sur le VPS (ex: `ubuntu`)
- `VPS_PATH` : chemin vers le dossier du repo sur le VPS (ex: `/var/www/portfolio`)
- `VPS_PORT` : port SSH (ex: `22`) (optionnel)
- `VPS_SSH_KEY_B64` : clé privée SSH encodée en base64 (recommandé)

## Clé SSH (à préparer une fois)
Sur ta machine :

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions-vps -N ""
```

Puis ajoute la clé publique :

```bash
cat ~/.ssh/github-actions-vps.pub
```

Sur le VPS, ajoute-la dans :
`~/.ssh/authorized_keys`.

Ensuite, dans GitHub, colle la clé privée encodée en base64 :

```bash
base64 -i ~/.ssh/github-actions-vps
```
Copie tout le contenu et colle-le dans `VPS_SSH_KEY_B64`.

## Première exécution sur le VPS
Configurer Nginx une fois pour servir `dist/` (site statique).

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

À l’intérieur du bloc `server { ... }` (HTTPS), utilise :

```nginx
root /var/www/portfolio/dist;
index index.html;

location / {
  try_files $uri $uri/ /index.html;
}
```

Puis :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Après ça, les `push` sur `main` déclencheront automatiquement :
`verify (lint/build)` -> `deploy (ssh)` -> `npm ci` -> `npm run build` -> `reload nginx`.

