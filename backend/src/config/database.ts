import { Sequelize } from 'sequelize';
import { productionConfig } from './production';
import fs from 'fs';
import path from 'path';

const config = productionConfig.database;

// Ensure the data directory exists
const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: config.storage,
  logging: config.logging,
  pool: config.pool,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}; 