import { sequelize } from './database';
import { Project } from '../models/Project';

export const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Create initial data if needed
    const projectCount = await Project.count();
    if (projectCount === 0) {
      await Project.create({
        title: 'Sample Project',
        description: 'This is a sample project',
        technologies: ['Node.js', 'Express', 'TypeScript'],
        imageUrl: 'https://example.com/sample.jpg',
        projectUrl: 'https://github.com/yourusername/sample',
        featured: true,
      });
      console.log('Initial project created.');
    }

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}; 