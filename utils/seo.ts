import type { Article, SEOMetadata } from '@/types';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate SEO metadata for pages
 */
export const generateSEO = (props: SEOProps) => {
  const {
    title = 'ApexHeadlines - Breaking News & In-Depth Analysis',
    description = 'Stay informed with the latest news, analysis, and insights from around the world.',
    image = '/images/og-default.jpg',
    url = 'https://apexheadlines.com',
    type = 'website',
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
  } = props;

  const siteTitle = 'ApexHeadlines';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: siteTitle,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      ...(author && { creator: author }),
    },
    ...(author && { authors: [author] }),
  };
};

/**
 * Generate SEO metadata from article
 */
export const generateArticleSEO = (article: Article, baseUrl = 'https://apexheadlines.com') => {
  const url = `${baseUrl}/articles/${article.slug}`;
  const keywords = [
    article.category.name,
    ...article.tags.map(tag => tag.name),
  ];

  return generateSEO({
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    image: article.featuredImage,
    url: article.seo?.canonicalUrl || url,
    type: 'article',
    keywords,
    author: article.author.name,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
  });
};

/**
 * Generate JSON-LD structured data for article
 */
export const generateArticleJsonLd = (article: Article, baseUrl = 'https://apexheadlines.com') => {
  const url = `${baseUrl}/articles/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: `${baseUrl}/authors/${article.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ApexHeadlines',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
};

/**
 * Generate breadcrumb JSON-LD
 */
export const generateBreadcrumbJsonLd = (
  items: Array<{ name: string; url: string }>,
  baseUrl = 'https://apexheadlines.com'
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
};
