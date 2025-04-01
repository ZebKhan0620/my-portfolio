import { Router } from 'express';
import { body, param } from 'express-validator';
import * as blogController from '../controllers/blogController';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Get all blog posts
router.get('/', blogController.getAllBlogs);

// Get single blog post
router.get(
  '/:id',
  [param('id').isInt().withMessage('Blog ID must be an integer')],
  validateRequest,
  blogController.getBlogById
);

// Create blog post
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('slug').notEmpty().withMessage('Slug is required'),
  ],
  validateRequest,
  blogController.createBlog
);

// Update blog post
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Blog ID must be an integer'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  ],
  validateRequest,
  blogController.updateBlog
);

// Delete blog post
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Blog ID must be an integer')],
  validateRequest,
  blogController.deleteBlog
);

export default router; 