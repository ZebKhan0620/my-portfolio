module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      max_memory_restart: '1G',
      error_file: 'logs/pm2/error.log',
      out_file: 'logs/pm2/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      log_type: 'json',
      max_restarts: 10,
      restart_delay: 4000,
      autorestart: true,
      exp_backoff_restart_delay: 100,
      time: true,
      // Health check endpoint
      wait_ready: true,
      listen_timeout: 8000,
      kill_timeout: 2000,
      // Graceful shutdown
      shutdown_with_message: true,
      treekill: false,
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: process.env.DEPLOY_HOST || 'localhost',
      ref: 'origin/main',
      repo: process.env.DEPLOY_REPO,
      path: '/var/www/portfolio',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
}; 