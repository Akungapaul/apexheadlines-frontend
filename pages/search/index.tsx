import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { MainLayout } from '@/layouts/MainLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { articlesAPI } from '@/api/articles';
import { categoriesAPI } from '@/api/categories';
import type { Article, Category, PaginatedResponse } from '@/types';

interface SearchPageProps {
  initialResults: PaginatedResponse<Article>;
  query: string;
  categories: Category[];
}

export default function SearchPage({ initialResults, query, categories }: SearchPageProps) {
  const router = useRouter();
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const loadMore = async () => {
    if (!results.pagination.hasNext || loading) return;

    setLoading(true);
    try {
      const response = await articlesAPI.searchArticles(query, {
        page: results.pagination.page + 1,
        pageSize: 12,
      });

      setResults({
        data: [...results.data, ...response.data],
        pagination: response.pagination,
      });
    } catch (error) {
      console.error('Error loading more results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout
      title={`Search: ${query} - ApexHeadlines`}
      description={`Search results for "${query}"`}
      categories={categories}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Search Results
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          <p className="text-gray-600 dark:text-gray-400">
            Found <strong>{results.pagination.totalItems}</strong> results for "
            <strong>{query}</strong>"
          </p>
        </div>

        {/* Results */}
        {results.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More */}
            {results.pagination.hasNext && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More Results'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Results Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Try different keywords or browse our categories
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query: params }) => {
  const query = (params.q as string) || '';

  if (!query) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const [initialResults, categories] = await Promise.all([
      articlesAPI.searchArticles(query, { page: 1, pageSize: 12 }),
      categoriesAPI.getCategories(),
    ]);

    return {
      props: {
        initialResults,
        query,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching search results:', error);
    return {
      props: {
        initialResults: { data: [], pagination: { page: 1, pageSize: 12, totalPages: 0, totalItems: 0, hasNext: false, hasPrevious: false } },
        query,
        categories: [],
      },
    };
  }
};
