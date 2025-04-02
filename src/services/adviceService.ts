import axios from 'axios';

export interface AdviceEntry {
  id: string;
  name: string;
  message: string;
  role: string;
  timestamp: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add admin key to requests when needed
const addAdminKey = (headers: any = {}) => {
  const adminKey = localStorage.getItem('adminKey');
  if (adminKey) {
    headers['x-admin-key'] = adminKey;
  }
  return headers;
};

export const adviceService = {
  async getAllAdvice(): Promise<AdviceEntry[]> {
    try {
      const response = await api.get('/advice');
      if (!response.data?.data) {
        throw new Error('Invalid response format');
      }
      
      return response.data.data.map((entry: any) => ({
        id: entry._id?.toString() || entry.id,
        name: entry.name || '',
        message: entry.message || '',
        role: entry.role || '',
        timestamp: entry.timestamp || Date.now()
      }));
    } catch (error) {
      console.error('Error fetching advice:', error);
      // Fallback to localStorage if API fails
      const storedAdvice = localStorage.getItem('advice');
      if (storedAdvice) {
        return JSON.parse(storedAdvice);
      }
      return [];
    }
  },

  async submitAdvice(entry: Omit<AdviceEntry, 'id' | 'timestamp'>): Promise<AdviceEntry> {
    try {
      if (!entry.name?.trim() || !entry.message?.trim()) {
        throw new Error('Name and message are required');
      }

      const response = await api.post('/advice', entry);
      if (!response.data?.data) {
        throw new Error('Invalid response format');
      }

      const newEntry = response.data.data;
      const formattedEntry = {
        id: newEntry._id?.toString() || newEntry.id,
        name: newEntry.name || entry.name,
        message: newEntry.message || entry.message,
        role: newEntry.role || entry.role || '',
        timestamp: newEntry.timestamp || Date.now()
      };
      
      // Update localStorage with new entry
      const storedAdvice = localStorage.getItem('advice');
      const advice = storedAdvice ? JSON.parse(storedAdvice) : [];
      advice.push(formattedEntry);
      localStorage.setItem('advice', JSON.stringify(advice));
      
      return formattedEntry;
    } catch (error) {
      console.error('Error submitting advice:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to submit advice');
      }
      throw error;
    }
  },

  async deleteAdvice(id: string): Promise<void> {
    try {
      const response = await api.delete(`/admin/advice/${id}`, {
        headers: addAdminKey()
      });
      
      if (!response.data?.success) {
        throw new Error('Failed to delete advice');
      }

      // Update localStorage by removing the deleted entry
      const storedAdvice = localStorage.getItem('advice');
      if (storedAdvice) {
        const advice = JSON.parse(storedAdvice);
        const updatedAdvice = advice.filter((entry: AdviceEntry) => entry.id !== id);
        localStorage.setItem('advice', JSON.stringify(updatedAdvice));
      }
    } catch (error) {
      console.error('Error deleting advice:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to delete advice');
      }
      throw error;
    }
  }
}; 