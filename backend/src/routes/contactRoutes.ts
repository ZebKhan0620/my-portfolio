import { Router } from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController';
import { validateRequest } from '../middleware/validateRequest';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: 'Too many contact form submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Send contact email
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('message').notEmpty().withMessage('Message is required'),
  ],
  validateRequest,
  contactController.sendContactEmail
);

router.get('/messages', contactController.getMessages);
router.patch('/messages/:id/status', contactController.updateMessageStatus);

export default router; 