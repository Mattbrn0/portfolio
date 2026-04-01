# GitHub Webhook -> VPS -> PM2

Ce dépôt inclut un serveur webhook Node (déployé via PM2) qui :
- vérifie la signature GitHub (`X-Hub-Signature-256`)
- si l'événement est un `push` sur la branche `main`, exécute :
  - `git fetch/reset`
  - `npm install`
  - `npm run build`
  - `pm2 restart portfolio`

## 1) Sur le VPS : créer le secret

Dans le dossier du projet (où est `ecosystem.config.cjs`) :

```bash
cd ~/portfolio
echo -n "TON_WEBHOOK_SECRET" > .webhook_secret
chmod 600 .webhook_secret
```

## 2) Démarrer / redémarrer

```bash
pm2 start ecosystem.config.cjs
pm2 restart portfolio-webhook
pm2 save
```

Le webhook écoute en local sur `127.0.0.1:3001` et le chemin est :
`/github-webhook`

## 3) Exposer l’URL (Nginx recommandé)

Dans ton vhost Nginx pour `bricman-mathis.fr`, ajoute un `location` :

```nginx
location /github-webhook {
  proxy_pass http://127.0.0.1:3001;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

Puis :

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 4) Configurer GitHub

Sur GitHub (Settings -> Webhooks -> Add webhook) :
- Payload URL : `https://bricman-mathis.fr/github-webhook`
- Content type : `application/json`
- Secret : `TON_WEBHOOK_SECRET`
- Activez le webhook

## Notes
- Évite de laisser tourner GitHub Actions en même temps si tu veux un seul mécanisme (sinon tu peux déployer 2 fois).

