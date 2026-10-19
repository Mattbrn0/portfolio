/** PM2 — Next.js standalone (`server.js`) derrière nginx. */
module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOST: "0.0.0.0",
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
