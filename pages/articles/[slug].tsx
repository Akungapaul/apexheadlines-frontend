import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { MainLayout } from '@/layouts/MainLayout';
import { ArticleCard } from '@/components/ArticleCard';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgressBar } from '@/components/ReadingProgressBar';
import { articlesAPI } from '@/api/articles';
import { categoriesAPI } from '@/api/categories';
import { defaultArticles } from '@/data/articles';
import { defaultCategories } from '@/data/categories';
import { formatDate, formatReadingTime } from '@/utils/formatters';
import { sanitizeHTML } from '@/utils/sanitize';
import { generateArticleSEO, generateArticleJsonLd } from '@/utils/seo';
import type { Article, Category } from '@/types';

interface ArticlePageProps {
  article: Article;
  relatedArticles: Article[];
  categories: Category[];
}

export default function ArticlePage({ article, relatedArticles, categories }: ArticlePageProps) {
  const seo = generateArticleSEO(article);
  const jsonLd = generateArticleJsonLd(article);
  const articleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${article.slug}`;

  useEffect(() => {
    // Increment view count
    articlesAPI.incrementViews(article.id).catch(console.error);
  }, [article.id]);

  return (
    <MainLayout title={seo.title} description={seo.description} categories={categories}>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <ReadingProgressBar />

      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <a
                href={`/categories/${article.category.slug}`}
                className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded hover:bg-primary-700 transition-colors"
              >
                {article.category.name}
              </a>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{article.excerpt}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                {article.author.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div>
                  <a
                    href={`/authors/${article.author.slug}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {article.author.name}
                  </a>
                </div>
              </div>

              <span>•</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              <span>•</span>
              <span>{formatReadingTime(article.readTime)}</span>
              <span>•</span>
              <span>{article.views.toLocaleString()} views</span>
            </div>

            <ShareButtons title={article.title} url={articleUrl} text={article.excerpt} />
          </header>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg dark:prose-dark max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <a
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Share Bottom */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-12">
            <ShareButtons title={article.title} url={articleUrl} text={article.excerpt} />
          </div>

          {/* Author Bio */}
          {article.author.bio && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-12">
              <div className="flex items-start space-x-4">
                {article.author.avatar && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={article.author.avatar}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    About {article.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{article.author.bio}</p>
                  <a
                    href={`/authors/${article.author.slug}`}
                    className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-semibold"
                  >
                    View all articles by {article.author.name} →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return { notFound: true };
  }

  try {
    const [article, categories] = await Promise.all([
      articlesAPI.getArticleBySlug(slug),
      categoriesAPI.getCategories(),
    ]);

    const relatedArticles = await articlesAPI.getRelatedArticles(article.id, 4);

    return {
      props: {
        article,
        relatedArticles,
        categories,
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);

    // Fallback to dummy data
    const article = defaultArticles.find((a) => a.slug === slug);
    if (!article) {
      return { notFound: true };
    }

    // Get related articles from the same category
    const relatedArticles = defaultArticles
      .filter((a) => a.category.slug === article.category.slug && a.id !== article.id)
      .slice(0, 4);

    return {
      props: {
        article,
        relatedArticles,
        categories: defaultCategories,
      },
    };
  }
};
