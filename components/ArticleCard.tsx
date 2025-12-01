import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatReadingTime } from '@/utils/formatters';
import type { Article } from '@/types';
import clsx from 'clsx';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  priority?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  priority = false,
}) => {
  if (variant === 'featured') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group block relative h-[500px] rounded-lg overflow-hidden"
      >
        <Image
          src={article.featuredImage}
          alt={article.featuredImageAlt || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className="inline-block px-3 py-1 bg-primary-600 text-xs font-semibold rounded mb-3">
            {article.category.name}
          </span>
          <h2 className="text-3xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-200 mb-3 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center text-sm text-gray-300">
            <span>{article.author.name}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="mx-2">•</span>
            <span>{formatReadingTime(article.readTime)}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex space-x-4 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors"
      >
        <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {formatDate(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
            {article.category.name}
          </span>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              {article.author.avatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={article.author.avatar}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              )}
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{formatDate(article.publishedAt)}</span>
              <span>•</span>
              <span>{formatReadingTime(article.readTime)}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
