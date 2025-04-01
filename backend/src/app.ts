import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { configureSecurityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import blogRoutes from './routes/blogRoutes';
import projectRoutes from './routes/projectRoutes';
import contactRoutes from './routes/contactRoutes';
import adviceRoutes from './routes/adviceRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
// @ts-ignore
app.use(compression());

// Security middleware
configureSecurityMiddleware(app);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/advice', adviceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app; 