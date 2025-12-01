# ApexHeadlines Frontend

Modern, responsive news/magazine blog frontend built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Features

- Server-side rendering (SSR) for optimal SEO
- Responsive design (mobile-first approach)
- Dark mode support with system preference detection
- Reading progress indicator
- Social sharing functionality
- Newsletter subscription
- Lazy image loading with Next.js Image optimization
- Accessibility-compliant (WCAG 2.2 AA)
- Performance optimized (Core Web Vitals)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **API Client**: Axios
- **Content Sanitization**: DOMPurify
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

### Linting & Type Checking

```bash
npm run lint
npm run type-check
```

## Project Structure

```
src/frontend/
├── api/              # API client and endpoints
├── components/       # Reusable React components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts
├── pages/            # Next.js pages
├── styles/           # Global styles
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Pages

- **Home** (`/`) - Featured articles, latest news, trending sidebar
- **Article** (`/articles/[slug]`) - Individual article with reading progress
- **Category** (`/categories/[slug]`) - Articles by category
- **Author** (`/authors/[slug]`) - Author profile and articles
- **Search** (`/search`) - Search results

## Performance Targets

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Bundle size < 200KB (gzipped)

## Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Proper ARIA labels
- Focus management

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT
