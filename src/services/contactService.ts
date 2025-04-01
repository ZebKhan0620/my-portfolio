import api from './api';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  status: string;
  message: string;
  data?: {
    id: number;
  };
}

const contactService = {
  // Submit contact form
  submitContactForm: async (formData: ContactFormData): Promise<ContactResponse> => {
    const response = await api.post('/contact', formData);
    return response.data;
  }
};

export default contactService; 