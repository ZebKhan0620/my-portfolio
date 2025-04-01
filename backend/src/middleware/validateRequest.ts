import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Get all error messages
    const errorMessages = errors.array().map((err: ValidationError) => err.msg);
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  
  next();
}; 