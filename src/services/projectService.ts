import api from './api';

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  projectUrl: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectInput {
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  imageUrl?: string;
}

const projectService = {
  // Get all projects
  getAllProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get featured projects
  getFeaturedProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects?featured=true');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (id: number): Promise<Project> => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  // Create a new project (admin only)
  createProject: async (projectData: ProjectInput): Promise<Project> => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update a project (admin only)
  updateProject: async (id: number, projectData: Partial<ProjectInput>): Promise<Project> => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  // Delete a project (admin only)
  deleteProject: async (id: number): Promise<void> => {
    try {
      await api.delete(`/projects/${id}`);
      return;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

export default projectService; 