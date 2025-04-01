import { Router } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

const router = Router();

// Get all projects
router.get('/', getAllProjects);

// Get project by ID
router.get('/:id', getProjectById);

// Create new project
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('technologies').isArray().withMessage('Technologies must be an array'),
    body('imageUrl').isURL().withMessage('Please provide a valid image URL'),
    body('projectUrl').isURL().withMessage('Please provide a valid project URL'),
    validateRequest,
  ],
  createProject
);

// Update project
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('technologies').optional().isArray().withMessage('Technologies must be an array'),
    body('imageUrl').optional().isURL().withMessage('Please provide a valid image URL'),
    body('projectUrl').optional().isURL().withMessage('Please provide a valid project URL'),
    validateRequest,
  ],
  updateProject
);

// Delete project
router.delete('/:id', deleteProject);

export default router; 