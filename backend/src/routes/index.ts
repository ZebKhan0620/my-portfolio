import { Express } from 'express';
import contactRoutes from './contactRoutes';
import projectRoutes from './projectRoutes';
import blogRoutes from './blogRoutes';

export const setupRoutes = (app: Express): void => {
  // API routes
  app.use('/api/contact', contactRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/blog', blogRoutes);

  // Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
    });
  });
}; 