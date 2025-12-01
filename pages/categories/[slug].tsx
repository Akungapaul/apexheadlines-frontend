import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { MainLayout } from '@/layouts/MainLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { articlesAPI } from '@/api/articles';
import { categoriesAPI } from '@/api/categories';
import { defaultCategories } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import type { Article, Category, PaginatedResponse } from '@/types';

interface CategoryPageProps {
  category: Category;
  featuredArticle: Article | null;
  latestArticles: Article[];
  trendingArticles: Article[];
  allCategories: Category[];
}

export default function CategoryPage({
  category,
  featuredArticle,
  latestArticles = [],
  trendingArticles = [],
  allCategories = [],
}: CategoryPageProps) {
  return (
    <MainLayout
      title={`${category.name} - ApexHeadlines`}
      description={category.description || `Latest ${category.name} news and articles`}
      categories={allCategories}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-12">
            <ArticleCard article={featuredArticle} variant="featured" priority />
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Latest in {category.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
              <a
                href="/articles"
                className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                View All Articles
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Newsletter */}
            <NewsletterSignup />

            {/* Trending Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Trending in {category.name}
              </h3>
              <div className="space-y-4">
                {trendingArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      cat.slug === category.slug
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  try {
    const [category, initialArticles, allCategories] = await Promise.all([
      categoriesAPI.getCategoryBySlug(slug),
      articlesAPI.getArticlesByCategory(slug, { page: 1, pageSize: 12 }),
      categoriesAPI.getCategories(),
    ]);

    const articles = initialArticles.data;
    const featuredArticle = articles[0] || null;
    const latestArticles = articles.slice(1, 9);
    const trendingArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

    return {
      props: {
        category,
        featuredArticle,
        latestArticles,
        trendingArticles,
        allCategories,
      },
    };
  } catch (error) {
    console.error('Error fetching category page:', error);

    // Fallback to dummy data
    const category = defaultCategories.find(c => c.slug === slug);
    if (!category) {
      return { notFound: true };
    }

    const categoryArticles = getArticlesByCategory(slug);
    const featuredArticle = categoryArticles[0] || null;
    const latestArticles = categoryArticles.slice(1, 9);
    const trendingArticles = [...categoryArticles].sort((a, b) => b.views - a.views).slice(0, 5);

    return {
      props: {
        category,
        featuredArticle,
        latestArticles,
        trendingArticles,
        allCategories: defaultCategories,
      },
    };
  }
};
