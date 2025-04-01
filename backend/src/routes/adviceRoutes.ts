import express from 'express';
import { getAllAdvice, createAdvice } from '../controllers/adviceController';
import { rateLimit } from 'express-rate-limit';

// Set up rate limiting
const adviceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  message: 'Too many advice submissions from this IP, please try again after 15 minutes'
});

const router = express.Router();

// GET all advice
router.get('/', getAllAdvice);

// POST new advice (with rate limiting)
router.post('/', adviceLimiter, createAdvice);

export default router; 