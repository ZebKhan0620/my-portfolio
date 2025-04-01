import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { Project } from '../models/Project';

interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  projectUrl: string;
  featured: boolean;
}

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json({
      status: 'success',
      data: projects,
    });
  } catch (error) {
    next(new AppError('Failed to fetch projects', 500));
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(new AppError('Failed to fetch project', 500));
  }
};

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectData: ProjectData = {
      ...req.body,
      featured: req.body.featured ?? false,
    };
    const project = await Project.create(projectData);
    res.status(201).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(new AppError('Failed to create project', 500));
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    const projectData = req.body as Partial<ProjectData>;
    await project.update(projectData);
    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(new AppError('Failed to update project', 500));
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    await project.destroy();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(new AppError('Failed to delete project', 500));
  }
}; 