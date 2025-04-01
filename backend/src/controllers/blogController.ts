import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { BlogPost } from '../models/BlogPost';
import { Blog } from '../models/Blog';

interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
}

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await BlogPost.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    next(new AppError('Failed to fetch blog posts', 500));
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return next(new AppError('Blog post not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(new AppError('Failed to fetch blog post', 500));
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postData = req.body as BlogPostData;
    const post = await BlogPost.create(postData);
    res.status(201).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(new AppError('Failed to create blog post', 500));
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return next(new AppError('Blog post not found', 404));
    }
    const postData = req.body as Partial<BlogPostData>;
    await post.update(postData);
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (error) {
    next(new AppError('Failed to update blog post', 500));
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await BlogPost.findByPk(req.params.id);
    if (!post) {
      return next(new AppError('Blog post not found', 404));
    }
    await post.destroy();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(new AppError('Failed to delete blog post', 500));
  }
};

// Get all blogs
export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.findAll({
      where: { published: true },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(new AppError('Failed to get blogs', 500));
  }
};

// Get blog by ID
export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    next(new AppError('Failed to get blog', 500));
  }
};

// Create blog
export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.create(req.body);

    res.status(201).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    next(new AppError('Failed to create blog', 500));
  }
};

// Update blog
export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    await blog.update(req.body);

    res.status(200).json({
      status: 'success',
      data: blog,
    });
  } catch (error) {
    next(new AppError('Failed to update blog', 500));
  }
};

// Delete blog
export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return next(new AppError('Blog not found', 404));
    }

    await blog.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(new AppError('Failed to delete blog', 500));
  }
}; 