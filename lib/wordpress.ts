/**
 * WordPress REST API Client
 * Handles all WordPress API interactions and data transformations
 */

import type { Article, Category, Author, Tag, PaginatedResponse } from '@/types';

// WordPress REST API base URL
const WP_API_URL = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL
  ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2`
  : 'https://apexheadlines.com/wp-json/wp/v2';

// WordPress REST API Types
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  meta: {
    iawp_total_views?: number;
    [key: string]: unknown;
  };
  _embedded?: {
    author?: WPAuthor[];
    'wp:featuredmedia'?: WPMedia[];
    'wp:term'?: (WPCategory | WPTag)[][];
  };
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&hellip;/g, '...').replace(/&amp;/g, '&').trim();
}

// Helper to decode HTML entities
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '...');
}

// Calculate read time based on word count
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Transform WordPress post to Article type
export function transformWPPost(post: WPPost, categories?: WPCategory[], authors?: WPAuthor[]): Article {
  // Get embedded data if available
  const embeddedAuthor = post._embedded?.author?.[0];
  const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
  const embeddedTerms = post._embedded?.['wp:term'] || [];

  // Find category from embedded terms or provided categories
  const postCategory = embeddedTerms.flat().find(
    (term): term is WPCategory => term.taxonomy === 'category' && post.categories.includes(term.id)
  );
  const fallbackCategory = categories?.find(cat => post.categories.includes(cat.id));

  // Find author from embedded or provided authors
  const authorData = embeddedAuthor || authors?.find(a => a.id === post.author);

  // Find tags from embedded terms
  const postTags = embeddedTerms.flat().filter(
    (term): term is WPTag => term.taxonomy === 'post_tag' && post.tags.includes(term.id)
  );

  const category: Category = postCategory || fallbackCategory
    ? {
        id: String((postCategory || fallbackCategory)!.id),
        name: decodeHtmlEntities((postCategory || fallbackCategory)!.name),
        slug: (postCategory || fallbackCategory)!.slug,
        description: (postCategory || fallbackCategory)!.description || null,
        articleCount: (postCategory || fallbackCategory)!.count ?? 0,
      }
    : {
        id: '1',
        name: 'Uncategorized',
        slug: 'uncategorized',
        description: null,
        articleCount: 0,
      };

  const author: Author = authorData
    ? {
        id: String(authorData.id),
        name: authorData.name,
        slug: authorData.slug,
        bio: authorData.description || null,
        avatar: authorData.avatar_urls?.['96'] || authorData.avatar_urls?.['48'] || null,
      }
    : {
        id: '1',
        name: 'Apex Headlines',
        slug: 'apex-headlines',
        bio: null,
        avatar: null,
      };

  const tags: Tag[] = postTags.map(tag => ({
    id: String(tag.id),
    name: decodeHtmlEntities(tag.name),
    slug: tag.slug,
  }));

  return {
    id: String(post.id),
    title: decodeHtmlEntities(post.title.rendered),
    slug: post.slug,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    featuredImage: embeddedMedia?.source_url || '/images/placeholder.jpg',
    featuredImageAlt: embeddedMedia?.alt_text || decodeHtmlEntities(post.title.rendered),
    category,
    tags,
    author,
    publishedAt: post.date,
    updatedAt: post.modified,
    readTime: calculateReadTime(post.content.rendered),
    views: post.meta?.iawp_total_views || 0,
    likes: 0,
    commentsCount: 0,
    status: post.status === 'publish' ? 'published' : 'draft',
  };
}

// Transform WordPress category to Category type
export function transformWPCategory(cat: WPCategory): Category {
  return {
    id: String(cat.id),
    name: decodeHtmlEntities(cat.name),
    slug: cat.slug,
    description: cat.description || null,
    articleCount: cat.count ?? 0,
  };
}

// Transform WordPress author to Author type
export function transformWPAuthor(author: WPAuthor): Author {
  return {
    id: String(author.id),
    name: author.name,
    slug: author.slug,
    bio: author.description || null,
    avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'] || null,
    social: author.url ? { website: author.url } : null,
  };
}

// Generic fetch helper with error handling
async function wpFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${WP_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Get total pages from WordPress response headers
function getTotalFromHeaders(response: Response): { total: number; totalPages: number } {
  return {
    total: parseInt(response.headers.get('X-WP-Total') || '0', 10),
    totalPages: parseInt(response.headers.get('X-WP-TotalPages') || '0', 10),
  };
}

// WordPress API Functions
export const wordpressAPI = {
  /**
   * Get paginated posts
   */
  async getPosts(params?: {
    page?: number;
    perPage?: number;
    categories?: number[];
    tags?: number[];
    author?: number;
    search?: string;
    orderBy?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Article>> {
    const searchParams = new URLSearchParams();
    searchParams.set('_embed', 'author,wp:featuredmedia,wp:term');
    searchParams.set('per_page', String(params?.perPage || 10));
    searchParams.set('page', String(params?.page || 1));

    if (params?.categories?.length) {
      searchParams.set('categories', params.categories.join(','));
    }
    if (params?.tags?.length) {
      searchParams.set('tags', params.tags.join(','));
    }
    if (params?.author) {
      searchParams.set('author', String(params.author));
    }
    if (params?.search) {
      searchParams.set('search', params.search);
    }
    if (params?.orderBy) {
      searchParams.set('orderby', params.orderBy);
    }
    if (params?.order) {
      searchParams.set('order', params.order);
    }

    const url = `${WP_API_URL}/posts?${searchParams.toString()}`;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const posts: WPPost[] = await response.json();
    const { total, totalPages } = getTotalFromHeaders(response);
    const page = params?.page || 1;
    const pageSize = params?.perPage || 10;

    return {
      data: posts.map(post => transformWPPost(post)),
      pagination: {
        page,
        pageSize,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  },

  /**
   * Get single post by slug
   */
  async getPostBySlug(slug: string): Promise<Article | null> {
    const posts = await wpFetch<WPPost[]>(
      `/posts?slug=${encodeURIComponent(slug)}&_embed=author,wp:featuredmedia,wp:term`
    );

    if (posts.length === 0) {
      return null;
    }

    return transformWPPost(posts[0]);
  },

  /**
   * Get single post by ID
   */
  async getPostById(id: number): Promise<Article | null> {
    try {
      const post = await wpFetch<WPPost>(
        `/posts/${id}?_embed=author,wp:featuredmedia,wp:term`
      );
      return transformWPPost(post);
    } catch {
      return null;
    }
  },

  /**
   * Get all categories
   */
  async getCategories(params?: { hideEmpty?: boolean; parent?: number }): Promise<Category[]> {
    const searchParams = new URLSearchParams();
    searchParams.set('per_page', '100');

    if (params?.hideEmpty !== false) {
      searchParams.set('hide_empty', 'true');
    }
    if (params?.parent !== undefined) {
      searchParams.set('parent', String(params.parent));
    }

    const categories = await wpFetch<WPCategory[]>(`/categories?${searchParams.toString()}`);
    return categories.map(transformWPCategory);
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await wpFetch<WPCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`);

    if (categories.length === 0) {
      return null;
    }

    return transformWPCategory(categories[0]);
  },

  /**
   * Get all tags
   */
  async getTags(params?: { hideEmpty?: boolean }): Promise<Tag[]> {
    const searchParams = new URLSearchParams();
    searchParams.set('per_page', '100');

    if (params?.hideEmpty !== false) {
      searchParams.set('hide_empty', 'true');
    }

    const tags = await wpFetch<WPTag[]>(`/tags?${searchParams.toString()}`);
    return tags.map(tag => ({
      id: String(tag.id),
      name: decodeHtmlEntities(tag.name),
      slug: tag.slug,
    }));
  },

  /**
   * Get all authors (users who have published posts)
   */
  async getAuthors(): Promise<Author[]> {
    const authors = await wpFetch<WPAuthor[]>('/users?who=authors&per_page=100');
    return authors.map(transformWPAuthor);
  },

  /**
   * Get author by slug
   */
  async getAuthorBySlug(slug: string): Promise<Author | null> {
    const authors = await wpFetch<WPAuthor[]>(`/users?slug=${encodeURIComponent(slug)}`);

    if (authors.length === 0) {
      return null;
    }

    return transformWPAuthor(authors[0]);
  },

  /**
   * Get posts by category slug
   */
  async getPostsByCategory(
    categorySlug: string,
    params?: { page?: number; perPage?: number }
  ): Promise<PaginatedResponse<Article>> {
    // First get the category ID
    const category = await this.getCategoryBySlug(categorySlug);

    if (!category) {
      return {
        data: [],
        pagination: {
          page: 1,
          pageSize: params?.perPage || 10,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }

    return this.getPosts({
      ...params,
      categories: [parseInt(category.id, 10)],
    });
  },

  /**
   * Search posts
   */
  async searchPosts(
    query: string,
    params?: { page?: number; perPage?: number }
  ): Promise<PaginatedResponse<Article>> {
    return this.getPosts({
      ...params,
      search: query,
      orderBy: 'relevance',
    });
  },

  /**
   * Get featured/sticky posts
   */
  async getFeaturedPosts(limit = 5): Promise<Article[]> {
    const posts = await wpFetch<WPPost[]>(
      `/posts?sticky=true&per_page=${limit}&_embed=author,wp:featuredmedia,wp:term`
    );

    // If no sticky posts, get the latest posts
    if (posts.length === 0) {
      const latestPosts = await wpFetch<WPPost[]>(
        `/posts?per_page=${limit}&_embed=author,wp:featuredmedia,wp:term`
      );
      return latestPosts.map(post => transformWPPost(post));
    }

    return posts.map(post => transformWPPost(post));
  },

  /**
   * Get trending posts (by views or most recent)
   */
  async getTrendingPosts(limit = 10): Promise<Article[]> {
    // WordPress doesn't have built-in trending, so we'll get recent posts
    // If you have a views plugin, you could sort by that
    const posts = await wpFetch<WPPost[]>(
      `/posts?per_page=${limit}&orderby=date&order=desc&_embed=author,wp:featuredmedia,wp:term`
    );
    return posts.map(post => transformWPPost(post));
  },

  /**
   * Get related posts by category
   */
  async getRelatedPosts(articleId: string, limit = 4): Promise<Article[]> {
    // First get the article to find its categories
    const article = await this.getPostById(parseInt(articleId, 10));

    if (!article) {
      return [];
    }

    // Get posts from the same category, excluding the current article
    const searchParams = new URLSearchParams();
    searchParams.set('_embed', 'author,wp:featuredmedia,wp:term');
    searchParams.set('per_page', String(limit + 1)); // Get one extra in case current is included
    searchParams.set('exclude', articleId);

    if (article.category) {
      searchParams.set('categories', article.category.id);
    }

    const posts = await wpFetch<WPPost[]>(`/posts?${searchParams.toString()}`);
    return posts
      .filter(post => String(post.id) !== articleId)
      .slice(0, limit)
      .map(post => transformWPPost(post));
  },
};

export default wordpressAPI;
