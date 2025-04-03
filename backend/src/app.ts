import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { configureSecurityMiddleware } from './middleware/security';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { compressionMiddleware } from './middleware/compression';
import contactRoutes from './routes/contactRoutes';
import adviceRoutes from './routes/adviceRoutes';
import visitorRoutes from './routes/visitorRoutes';
import faqRoutes from './routes/faqRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compressionMiddleware);

// Security middleware
configureSecurityMiddleware(app);

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/faq', faqRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app; 