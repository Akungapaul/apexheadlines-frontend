import { wordpressAPI } from '@/lib/wordpress';
import type { Category } from '@/types';

export const categoriesAPI = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    return wordpressAPI.getCategories({ hideEmpty: true });
  },

  /**
   * Get a single category by slug
   */
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const category = await wordpressAPI.getCategoryBySlug(slug);
    if (!category) {
      throw new Error(`Category not found: ${slug}`);
    }
    return category;
  },
};
