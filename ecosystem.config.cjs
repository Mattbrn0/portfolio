/**
 * Configuration PM2 pour le portfolio (VPS).
 * Sur le serveur : npm run build && pm2 start ecosystem.config.cjs
 */
module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "node_modules/.bin/serve",
      args: ["-s", "dist", "-l", "3000"],
      interpreter: "none",
      exec_mode: "fork",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "portfolio-webhook",
      script: "server/github-webhook-server.mjs",
      args: [],
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "50M",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
        REPO_PATH: __dirname,
        DEPLOY_SCRIPT: "scripts/deploy-vps.sh",
        WEBHOOK_SECRET_FILE: ".webhook_secret",
        WEBHOOK_PATH: "/github-webhook",
      },
    },
  ],
};
