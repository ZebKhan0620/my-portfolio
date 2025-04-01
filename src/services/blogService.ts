import api from './api';

export interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogInput {
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
  published?: boolean;
}

const blogService = {
  // Get all published blog posts
  getAllBlogs: async (): Promise<Blog[]> => {
    const response = await api.get('/blogs');
    return response.data.data;
  },

  // Get blog post by ID
  getBlogById: async (id: number): Promise<Blog> => {
    const response = await api.get(`/blogs/${id}`);
    return response.data.data;
  },

  // Get blog post by slug
  getBlogBySlug: async (slug: string): Promise<Blog> => {
    const response = await api.get(`/blogs/slug/${slug}`);
    return response.data.data;
  },

  // Create a new blog post (admin only)
  createBlog: async (blogData: BlogInput): Promise<Blog> => {
    const response = await api.post('/blogs', blogData);
    return response.data.data;
  },

  // Update a blog post (admin only)
  updateBlog: async (id: number, blogData: Partial<BlogInput>): Promise<Blog> => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data.data;
  },

  // Delete a blog post (admin only)
  deleteBlog: async (id: number): Promise<void> => {
    await api.delete(`/blogs/${id}`);
    return;
  }
};

export default blogService; 