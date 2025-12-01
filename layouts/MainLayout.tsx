import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Category } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  categories?: Category[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'ApexHeadlines - Breaking News & In-Depth Analysis',
  description = 'Stay informed with the latest news, analysis, and insights from around the world.',
  categories = [],
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header categories={categories} />

        <main className="flex-1">
          {children}
        </main>

        <Footer categories={categories} />
      </div>
    </>
  );
};
