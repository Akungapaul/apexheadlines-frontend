import React from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { MainLayout } from '@/layouts/MainLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { articlesAPI } from '@/api/articles';
import { authorsAPI } from '@/api/authors';
import { categoriesAPI } from '@/api/categories';
import type { Author, Article, Category, PaginatedResponse } from '@/types';

interface AuthorPageProps {
  author: Author;
  articles: PaginatedResponse<Article>;
  categories: Category[];
}

export default function AuthorPage({ author, articles, categories }: AuthorPageProps) {
  return (
    <MainLayout
      title={`${author.name} - ApexHeadlines`}
      description={author.bio || `Articles by ${author.name}`}
      categories={categories}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Author Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {author.avatar && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="128px"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {author.name}
              </h1>

              {author.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{author.bio}</p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{author.articleCount || articles.pagination.totalItems} articles</span>

                {author.social && (
                  <>
                    {author.social.twitter && (
                      <a
                        href={author.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Twitter
                      </a>
                    )}
                    {author.social.linkedin && (
                      <a
                        href={author.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        LinkedIn
                      </a>
                    )}
                    {author.social.website && (
                      <a
                        href={author.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        Website
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Articles by {author.name}
        </h2>

        {articles.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No articles yet.</p>
          </div>
        )}
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
    const [author, articles, categories] = await Promise.all([
      authorsAPI.getAuthorBySlug(slug),
      articlesAPI.getArticlesByAuthor(slug, { page: 1, pageSize: 12 }),
      categoriesAPI.getCategories(),
    ]);

    return {
      props: {
        author,
        articles,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching author page:', error);
    return { notFound: true };
  }
};
