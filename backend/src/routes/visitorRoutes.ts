import { Router } from 'express';
import { getVisitorCount, incrementVisitorCount } from '../controllers/visitorController';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for visitor count increments
const visitorLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request per minute
  message: 'Visitor count can only be incremented once per minute.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/count', getVisitorCount);
router.post('/increment', visitorLimiter, incrementVisitorCount);

export default router; 