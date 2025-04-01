import api from './api';

export interface AdviceEntry {
  id: string;
  name: string;
  message: string;
  role: string;
  timestamp: number;
}

export interface AdviceInput {
  name: string;
  message: string;
  role?: string;
}

const adviceService = {
  // Get all advice entries
  getAllAdvice: async (): Promise<AdviceEntry[]> => {
    try {
      const response = await api.get('/advice');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching advice:', error);
      // If API fails, fall back to localStorage
      const storedAdvice = localStorage.getItem('portfolioAdvice');
      return storedAdvice ? JSON.parse(storedAdvice) : [];
    }
  },

  // Submit a new advice entry
  submitAdvice: async (adviceData: AdviceInput): Promise<AdviceEntry> => {
    try {
      const response = await api.post('/advice', adviceData);
      
      // Update localStorage with the new entry
      const storedAdvice = localStorage.getItem('portfolioAdvice');
      const currentAdvice = storedAdvice ? JSON.parse(storedAdvice) : [];
      const updatedAdvice = [response.data.data, ...currentAdvice];
      localStorage.setItem('portfolioAdvice', JSON.stringify(updatedAdvice));
      
      return response.data.data;
    } catch (error) {
      console.error('Error submitting advice:', error);
      
      // Fallback: Store directly in localStorage if API fails
      const newEntry: AdviceEntry = {
        id: Date.now().toString(),
        name: adviceData.name,
        role: adviceData.role || '',
        message: adviceData.message,
        timestamp: Date.now(),
      };
      
      const storedAdvice = localStorage.getItem('portfolioAdvice');
      const currentAdvice = storedAdvice ? JSON.parse(storedAdvice) : [];
      const updatedAdvice = [newEntry, ...currentAdvice];
      localStorage.setItem('portfolioAdvice', JSON.stringify(updatedAdvice));
      
      return newEntry;
    }
  },
};

export default adviceService; 