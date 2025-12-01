import React from 'react';
import { GetServerSideProps } from 'next';
import { MainLayout } from '@/layouts/MainLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { articlesAPI } from '@/api/articles';
import { categoriesAPI } from '@/api/categories';
import { defaultCategories } from '@/data/categories';
import { defaultFeaturedArticles, defaultLatestArticles, defaultTrendingArticles } from '@/data/articles';
import type { Article, Category } from '@/types';

interface HomePageProps {
  featuredArticle: Article | null;
  latestArticles: Article[];
  trendingArticles: Article[];
  categories: Category[];
}

export default function HomePage({
  featuredArticle,
  latestArticles,
  trendingArticles,
  categories,
}: HomePageProps) {
  return (
    <MainLayout categories={categories}>
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
              Latest Articles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
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
                Trending Now
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
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    {category.name}
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [featuredArticles, latestResponse, trendingArticles, categories] = await Promise.all([
      articlesAPI.getFeaturedArticles(1),
      articlesAPI.getArticles({ page: 1, pageSize: 8 }),
      articlesAPI.getTrendingArticles(5),
      categoriesAPI.getCategories(),
    ]);

    return {
      props: {
        featuredArticle: featuredArticles[0] || null,
        latestArticles: latestResponse.data,
        trendingArticles,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      props: {
        featuredArticle: defaultFeaturedArticles[0] || null,
        latestArticles: defaultLatestArticles.slice(0, 8),
        trendingArticles: defaultTrendingArticles.slice(0, 5),
        categories: defaultCategories,
      },
    };
  }
};
