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
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
