export const productionConfig = {
  // Server settings
  port: process.env.PORT || 3000,
  nodeEnv: 'production',

  // Database settings
  database: {
    dialect: 'sqlite',
    storage: './data/portfolio.sqlite',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },

  // Email settings
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    from: process.env.SMTP_FROM,
  },

  // Security settings
  security: {
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100,
    corsOrigin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  // Logging settings
  logging: {
    level: 'info',
    format: 'json',
    errorLogPath: 'logs/error.log',
    combinedLogPath: 'logs/combined.log',
  },
}; 