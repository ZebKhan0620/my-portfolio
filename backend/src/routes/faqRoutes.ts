import { Router } from 'express';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for admin operations
const adminLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests. Please try again later.',
});

// Public routes
router.get('/', getFAQs);

// Admin routes (protected by rate limiting)
router.post('/', adminLimiter, createFAQ);
router.put('/:id', adminLimiter, updateFAQ);
router.delete('/:id', adminLimiter, deleteFAQ);

export default router; 