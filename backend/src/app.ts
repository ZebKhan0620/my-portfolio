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
import healthRoutes from './routes/healthRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-portfolio-site.vercel.app', // Add your Vercel domain
    /\.vercel\.app$/, // Allow all vercel.app subdomains
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
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
app.use('/api/health', healthRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app; 