import { apiClient } from './client';
import type { Comment, PaginatedResponse } from '@/types';

export const commentsAPI = {
  /**
   * Get comments for an article
   */
  getComments: async (
    articleId: string,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResponse<Comment>> => {
    return apiClient.get<PaginatedResponse<Comment>>(`/articles/${articleId}/comments`, {
      params: { page, pageSize },
    });
  },

  /**
   * Post a comment
   */
  postComment: async (
    articleId: string,
    data: {
      author: { name: string; email: string };
      content: string;
      parentId?: string;
    }
  ): Promise<Comment> => {
    return apiClient.post<Comment>(`/articles/${articleId}/comments`, data);
  },

  /**
   * Delete a comment (requires auth)
   */
  deleteComment: async (commentId: string): Promise<void> => {
    return apiClient.delete(`/comments/${commentId}`);
  },
};
