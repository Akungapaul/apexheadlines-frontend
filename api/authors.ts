import { wordpressAPI } from '@/lib/wordpress';
import type { Author } from '@/types';

export const authorsAPI = {
  /**
   * Get all authors
   */
  getAuthors: async (): Promise<Author[]> => {
    return wordpressAPI.getAuthors();
  },

  /**
   * Get a single author by slug
   */
  getAuthorBySlug: async (slug: string): Promise<Author> => {
    const author = await wordpressAPI.getAuthorBySlug(slug);
    if (!author) {
      throw new Error(`Author not found: ${slug}`);
    }
    return author;
  },
};
