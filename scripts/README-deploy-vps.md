# Déploiement automatique (GitHub Actions -> VPS + PM2)

Ce dépôt inclut la workflow GitHub `deploy-vps.yml`.

## Secrets GitHub à ajouter
Dans `Settings > Secrets and variables > Actions > New repository secret`, crée :

- `VPS_HOST` : IP ou hostname du VPS (ex: `135.125.102.27`)
- `VPS_USER` : utilisateur SSH sur le VPS (ex: `ubuntu`)
- `VPS_PATH` : chemin vers le dossier du repo sur le VPS (ex: `/var/www/portfolio`)
- `VPS_SSH_KEY` : clé privée SSH (contenu complet), qui doit être autorisée sur le VPS (dans `~/.ssh/authorized_keys`)

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

Ensuite, dans GitHub, colle la clé privée :

```bash
cat ~/.ssh/github-actions-vps
```
Copie tout le contenu et colle-le dans `VPS_SSH_KEY`.

## Première exécution sur le VPS
Une fois pour démarrer :

```bash
cd /var/www/portfolio
pm2 start ecosystem.config.cjs
pm2 save
```

Après ça, les `push` sur `main` déclencheront automatiquement :
`verify (lint/build)` -> `deploy (ssh)` -> `npm ci` -> `npm run build` -> `pm2 restart`.

