# Portfolio – Bricman Mathis

Portfolio personnel (React, Tailwind, Three.js).

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Les fichiers statiques sont générés dans `dist/`.

## Déploiement (VPS avec PM2)

1. Cloner le dépôt sur le serveur :
   ```bash
   git clone https://github.com/TON_USERNAME/portfolio.git
   cd portfolio
   ```

2. Installer les dépendances et builder :
   ```bash
   npm install
   npm run build
   ```

3. Installer PM2 (si besoin) et lancer l’app :
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.cjs
   ```

4. Sauvegarder la config PM2 pour redémarrage auto :
   ```bash
   pm2 save
   pm2 startup
   ```

L’app écoute sur le port **3000**. Pour utiliser le port 80 ou un reverse proxy (Nginx), configure Nginx en proxy vers `http://127.0.0.1:3000`.

## Commandes utiles PM2

- `pm2 status` : état des processus
- `pm2 logs portfolio` : logs
- `pm2 restart portfolio` : redémarrage après un nouveau déploiement (`git pull && npm install && npm run build`)
