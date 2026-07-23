// PM2 process config for Lakshadweep Tourism App on Azure VM
// Use:  pm2 start ecosystem.config.cjs
//       pm2 save && pm2 startup     (one-time, persists across reboots)

module.exports = {
  apps: [{
    name: 'lakshadweep-tourism',
    script: 'server.js',
    instances: 1,                  // single instance — bump if VM has more cores
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // ANTHROPIC_API_KEY is loaded from /etc/environment or .env (set during deploy)
    },
    error_file: '/var/log/lakshadweep-tourism/error.log',
    out_file: '/var/log/lakshadweep-tourism/out.log',
    merge_logs: true,
    time: true,
  }],
}
