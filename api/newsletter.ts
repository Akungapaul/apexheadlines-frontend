import { apiClient } from './client';
import type { NewsletterSubscription } from '@/types';

export const newsletterAPI = {
  /**
   * Subscribe to newsletter
   */
  subscribe: async (data: NewsletterSubscription): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/newsletter/subscribe', data);
  },

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: async (email: string): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/newsletter/unsubscribe', { email });
  },
};
