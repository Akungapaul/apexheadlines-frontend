import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { Cormorant, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';
import { useState } from 'react';

// Cormorant for body text (elegant, readable)
const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Cormorant Garamond for headings (classic editorial feel)
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant-garamond',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <main className={`${cormorant.variable} ${cormorantGaramond.variable}`}>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
