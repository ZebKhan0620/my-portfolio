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
  async getAllAdvice(locale = 'en'): Promise<AdviceEntry[]> {
    try {
      // Use locale-specific API endpoint if it's Japanese
      const endpoint = locale === 'ja' ? '/advice/ja' : '/advice';
      const response = await api.get(endpoint);
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
      const storedAdvice = localStorage.getItem(`advice_${locale}`);
      if (storedAdvice) {
        return JSON.parse(storedAdvice);
      }
      return [];
    }
  },

  async submitAdvice(entry: Omit<AdviceEntry, 'id' | 'timestamp'>, locale = 'en'): Promise<AdviceEntry> {
    try {
      if (!entry.name?.trim() || !entry.message?.trim()) {
        throw new Error('Name and message are required');
      }

      // Use locale-specific API endpoint if it's Japanese
      const endpoint = locale === 'ja' ? '/advice/ja' : '/advice';
      const response = await api.post(endpoint, entry);
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
      
      // Update localStorage with new entry, using locale-specific key
      const storageKey = `advice_${locale}`;
      const storedAdvice = localStorage.getItem(storageKey);
      const advice = storedAdvice ? JSON.parse(storedAdvice) : [];
      advice.push(formattedEntry);
      localStorage.setItem(storageKey, JSON.stringify(advice));
      
      return formattedEntry;
    } catch (error) {
      console.error('Error submitting advice:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to submit advice');
      }
      throw error;
    }
  },

  async deleteAdvice(id: string, locale = 'en'): Promise<void> {
    try {
      // Use locale-specific API endpoint if it's Japanese
      const endpoint = locale === 'ja' ? `/admin/advice/ja/${id}` : `/admin/advice/${id}`;
      const response = await api.delete(endpoint, {
        headers: addAdminKey()
      });
      
      if (!response.data?.success) {
        throw new Error('Failed to delete advice');
      }

      // Update localStorage by removing the deleted entry, using locale-specific key
      const storageKey = `advice_${locale}`;
      const storedAdvice = localStorage.getItem(storageKey);
      if (storedAdvice) {
        const advice = JSON.parse(storedAdvice);
        const updatedAdvice = advice.filter((entry: AdviceEntry) => entry.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updatedAdvice));
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