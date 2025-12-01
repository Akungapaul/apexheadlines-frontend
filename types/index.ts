// Global type definitions for the application

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt?: string;
  category: Category;
  tags: Tag[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
  status: 'draft' | 'published' | 'archived';
  seo?: SEOMetadata;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  articleCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  avatar?: string | null;
  social?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  } | null;
  articleCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
  parentId?: string;
  replies?: Comment[];
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  author?: string;
  sortBy?: 'date' | 'popularity' | 'views';
  order?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface NewsletterSubscription {
  email: string;
  preferences?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories?: string[];
  };
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface ReadingProgress {
  articleId: string;
  progress: number;
  lastRead: string;
}
