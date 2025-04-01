import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { Advice } from '../models/Advice';

// Get all advice entries
export const getAllAdvice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const advice = await Advice.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      data: advice.map(entry => ({
        id: entry.id.toString(),
        name: entry.name,
        message: entry.message,
        role: entry.role || '',
        timestamp: entry.createdAt.getTime(),
      })),
    });
  } catch (error) {
    next(new AppError('Failed to get advice entries', 500));
  }
};

// Create a new advice entry
export const createAdvice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, message, role } = req.body;

    if (!name || !message) {
      return next(new AppError('Name and message are required', 400));
    }

    const advice = await Advice.create({
      name,
      message,
      role: role || '',
    });

    res.status(201).json({
      status: 'success',
      data: {
        id: advice.id.toString(),
        name: advice.name,
        message: advice.message,
        role: advice.role || '',
        timestamp: advice.createdAt.getTime(),
      },
    });
  } catch (error) {
    next(new AppError('Failed to create advice entry', 500));
  }
}; 