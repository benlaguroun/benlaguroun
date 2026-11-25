// Keeps the site running with pm2 and restarts it if it crashes or the machine reboots.
//   npm install -g pm2
//   pm2 start deploy/ecosystem.config.cjs
//   pm2 save && pm2 startup     (then run the one command it prints, so it starts at boot)
//
// The site listens on 127.0.0.1 only. The Cloudflare Tunnel reaches it from inside the
// machine, so nobody on your network can open it directly.
const path = require("path");

module.exports = {
  apps: [
    {
      name: "brand-web",
      cwd: path.join(__dirname, "..", "apps", "web"),
      script: "npm",
      args: "run start -- -H 127.0.0.1 -p 3000",
      env: { NODE_ENV: "production" },
      autorestart: true,
      max_memory_restart: "800M",
    },
  ],
};
