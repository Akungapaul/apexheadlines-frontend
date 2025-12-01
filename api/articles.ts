import { wordpressAPI } from '@/lib/wordpress';
import type { Article, PaginatedResponse, SearchParams } from '@/types';

export const articlesAPI = {
  /**
   * Get paginated list of articles
   */
  getArticles: async (params?: SearchParams): Promise<PaginatedResponse<Article>> => {
    return wordpressAPI.getPosts({
      page: params?.page || 1,
      perPage: params?.pageSize || 10,
      orderBy: params?.sortBy === 'date' ? 'date' : undefined,
      order: params?.order,
    });
  },

  /**
   * Get a single article by slug
   */
  getArticleBySlug: async (slug: string): Promise<Article> => {
    const article = await wordpressAPI.getPostBySlug(slug);
    if (!article) {
      throw new Error(`Article not found: ${slug}`);
    }
    return article;
  },

  /**
   * Get featured articles
   */
  getFeaturedArticles: async (limit = 5): Promise<Article[]> => {
    return wordpressAPI.getFeaturedPosts(limit);
  },

  /**
   * Get trending articles
   */
  getTrendingArticles: async (limit = 10): Promise<Article[]> => {
    return wordpressAPI.getTrendingPosts(limit);
  },

  /**
   * Get related articles
   */
  getRelatedArticles: async (articleId: string, limit = 4): Promise<Article[]> => {
    return wordpressAPI.getRelatedPosts(articleId, limit);
  },

  /**
   * Search articles
   */
  searchArticles: async (query: string, params?: SearchParams): Promise<PaginatedResponse<Article>> => {
    return wordpressAPI.searchPosts(query, {
      page: params?.page || 1,
      perPage: params?.pageSize || 10,
    });
  },

  /**
   * Increment article views (no-op for WordPress - handled by plugin)
   */
  incrementViews: async (_articleId: string): Promise<void> => {
    // Views are typically tracked by WordPress plugins like JEEK Simple View Counter
    // This is a no-op on the frontend
    return;
  },

  /**
   * Like an article (no-op for WordPress - would need plugin)
   */
  likeArticle: async (_articleId: string): Promise<{ likes: number }> => {
    // Likes would need a WordPress plugin to track
    return { likes: 0 };
  },

  /**
   * Get articles by category
   */
  getArticlesByCategory: async (
    categorySlug: string,
    params?: SearchParams
  ): Promise<PaginatedResponse<Article>> => {
    return wordpressAPI.getPostsByCategory(categorySlug, {
      page: params?.page || 1,
      perPage: params?.pageSize || 10,
    });
  },

  /**
   * Get articles by author
   */
  getArticlesByAuthor: async (
    authorSlug: string,
    params?: SearchParams
  ): Promise<PaginatedResponse<Article>> => {
    // First get the author ID
    const author = await wordpressAPI.getAuthorBySlug(authorSlug);
    if (!author) {
      return {
        data: [],
        pagination: {
          page: 1,
          pageSize: params?.pageSize || 10,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    return wordpressAPI.getPosts({
      page: params?.page || 1,
      perPage: params?.pageSize || 10,
      author: parseInt(author.id, 10),
    });
  },

  /**
   * Get articles by tag
   */
  getArticlesByTag: async (
    tagSlug: string,
    params?: SearchParams
  ): Promise<PaginatedResponse<Article>> => {
    // First get all tags to find the ID
    const tags = await wordpressAPI.getTags();
    const tag = tags.find(t => t.slug === tagSlug);

    if (!tag) {
      return {
        data: [],
        pagination: {
          page: 1,
          pageSize: params?.pageSize || 10,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    return wordpressAPI.getPosts({
      page: params?.page || 1,
      perPage: params?.pageSize || 10,
      tags: [parseInt(tag.id, 10)],
    });
  },
};
