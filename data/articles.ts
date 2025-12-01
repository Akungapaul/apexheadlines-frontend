import type { Article } from '@/types';
import { defaultCategories } from './categories';

const categories = defaultCategories;

// Helper to generate articles
const generateArticle = (
  id: string,
  title: string,
  categoryIndex: number,
  daysAgo: number,
  featured: boolean = false
): Article => {
  const category = categories[categoryIndex];
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    id,
    title,
    slug,
    excerpt: `This is a compelling story about ${title.toLowerCase()}. Read more to discover the latest insights and analysis on this topic.`,
    content: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <h2>Key Highlights</h2>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <ul>
      <li>Important point about ${category.name}</li>
      <li>Analysis and insights</li>
      <li>Expert opinions</li>
    </ul>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
    featuredImage: `https://picsum.photos/seed/${id}/800/450`,
    featuredImageAlt: title,
    category,
    tags: [
      { id: `tag-${categoryIndex}-1`, name: category.name, slug: category.slug },
      { id: `tag-${categoryIndex}-2`, name: 'News', slug: 'news' },
    ],
    author: {
      id: `author-${(parseInt(id) % 5) + 1}`,
      name: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Thompson'][(parseInt(id) % 5)],
      slug: ['john-smith', 'sarah-johnson', 'mike-chen', 'emily-davis', 'alex-thompson'][(parseInt(id) % 5)],
      bio: 'Senior correspondent covering breaking news and in-depth analysis.',
      avatar: `https://i.pravatar.cc/150?u=${id}`,
    },
    publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    readTime: Math.floor(Math.random() * 8) + 3,
    views: Math.floor(Math.random() * 10000) + 500,
    likes: Math.floor(Math.random() * 500) + 50,
    commentsCount: Math.floor(Math.random() * 50) + 5,
    status: 'published',
  };
};

// Business Articles (Category Index 0)
const businessArticles: Article[] = [
  generateArticle('1', 'Stock Market Hits All-Time High Amid Economic Optimism', 0, 0, true),
  generateArticle('2', 'Federal Reserve Signals Potential Rate Cuts in 2025', 0, 1),
  generateArticle('3', 'Major Tech Companies Report Record Q4 Earnings', 0, 2),
  generateArticle('4', 'Global Supply Chain Crisis Shows Signs of Recovery', 0, 3),
  generateArticle('5', 'Startup Funding Rebounds After Two-Year Slowdown', 0, 4),
  generateArticle('6', 'Retail Sales Surge During Holiday Shopping Season', 0, 5),
  generateArticle('7', 'Oil Prices Stabilize as OPEC Reaches Production Agreement', 0, 6),
  generateArticle('8', 'Housing Market Cools as Mortgage Rates Remain Elevated', 0, 7),
  generateArticle('9', 'Small Businesses Adapt to New E-Commerce Trends', 0, 8),
  generateArticle('10', 'Corporate Mergers and Acquisitions Hit Record Numbers', 0, 9),
];

// Technology Articles (Category Index 1)
const technologyArticles: Article[] = [
  generateArticle('11', 'AI Revolution: How Machine Learning is Transforming Industries', 1, 0, true),
  generateArticle('12', 'Apple Unveils Next-Generation iPhone with Breakthrough Features', 1, 1),
  generateArticle('13', 'Cybersecurity Threats Rise as Hackers Target Major Corporations', 1, 2),
  generateArticle('14', 'Electric Vehicle Technology Advances with Solid-State Batteries', 1, 3),
  generateArticle('15', 'Cloud Computing Market Grows to $500 Billion Valuation', 1, 4),
  generateArticle('16', 'Quantum Computing Breakthrough Promises Faster Processing', 1, 5),
  generateArticle('17', '5G Networks Expand to Rural Areas Across the Country', 1, 6),
  generateArticle('18', 'Virtual Reality Gaming Enters New Era with Haptic Technology', 1, 7),
  generateArticle('19', 'Tech Giants Face New Regulations on Data Privacy', 1, 8),
  generateArticle('20', 'Robotics Innovation Transforms Manufacturing Sector', 1, 9),
];

// Crypto Articles (Category Index 2)
const cryptoArticles: Article[] = [
  generateArticle('21', 'Bitcoin Surges Past $100,000 Mark for First Time', 2, 0, true),
  generateArticle('22', 'Ethereum 2.0 Upgrade Promises Faster Transactions', 2, 1),
  generateArticle('23', 'SEC Approves Multiple Spot Bitcoin ETFs for Trading', 2, 2),
  generateArticle('24', 'DeFi Platforms See Massive Growth in User Adoption', 2, 3),
  generateArticle('25', 'NFT Market Evolves Beyond Digital Art Collectibles', 2, 4),
  generateArticle('26', 'Central Banks Explore Digital Currency Implementation', 2, 5),
  generateArticle('27', 'Crypto Exchange Launches Institutional Trading Platform', 2, 6),
  generateArticle('28', 'Blockchain Technology Disrupts Traditional Banking', 2, 7),
  generateArticle('29', 'Stablecoin Regulations Take Shape Globally', 2, 8),
  generateArticle('30', 'Mining Operations Shift to Renewable Energy Sources', 2, 9),
];

// Sports Articles (Category Index 3)
const sportsArticles: Article[] = [
  generateArticle('31', 'Championship Finals: Historic Victory Stuns the Sports World', 3, 0, true),
  generateArticle('32', 'Star Athlete Signs Record-Breaking Contract Extension', 3, 1),
  generateArticle('33', 'Olympics Preparations Underway for 2028 Los Angeles Games', 3, 2),
  generateArticle('34', 'Football Season Preview: Top Teams to Watch This Year', 3, 3),
  generateArticle('35', 'Tennis Grand Slam Delivers Shocking Upsets in Finals', 3, 4),
  generateArticle('36', 'Basketball League Announces Expansion to New Cities', 3, 5),
  generateArticle('37', 'Soccer World Cup Qualifiers Heat Up Across Continents', 3, 6),
  generateArticle('38', 'Golf Major Tournament Sees Record-Breaking Performance', 3, 7),
  generateArticle('39', 'E-Sports Industry Grows with Million Dollar Prize Pools', 3, 8),
  generateArticle('40', 'Baseball Team Clinches Division Title After Dramatic Win', 3, 9),
];

// Entertainment Articles (Category Index 4)
const entertainmentArticles: Article[] = [
  generateArticle('41', 'Blockbuster Film Breaks Box Office Records Worldwide', 4, 0, true),
  generateArticle('42', 'Streaming Wars Intensify as New Platforms Launch', 4, 1),
  generateArticle('43', 'Music Awards Show Celebrates Best Artists of the Year', 4, 2),
  generateArticle('44', 'Celebrity Couple Announces Engagement to Fans', 4, 3),
  generateArticle('45', 'Hit TV Series Returns for Highly Anticipated Final Season', 4, 4),
  generateArticle('46', 'Concert Tour Sells Out Stadiums Across the Globe', 4, 5),
  generateArticle('47', 'Indie Film Festival Showcases Emerging Talent', 4, 6),
  generateArticle('48', 'Podcast Industry Boom Continues with New Content', 4, 7),
  generateArticle('49', 'Video Game Release Breaks Sales Records on Launch Day', 4, 8),
  generateArticle('50', 'Broadway Show Revival Earns Rave Reviews from Critics', 4, 9),
];

// Politics Articles (Category Index 5)
const politicsArticles: Article[] = [
  generateArticle('51', 'Major Policy Reform Passes Congress with Bipartisan Support', 5, 0, true),
  generateArticle('52', 'Election Results Reshape Political Landscape Nationwide', 5, 1),
  generateArticle('53', 'International Summit Addresses Global Climate Challenges', 5, 2),
  generateArticle('54', 'Healthcare Legislation Debate Continues in Senate', 5, 3),
  generateArticle('55', 'Immigration Policy Changes Take Effect This Month', 5, 4),
  generateArticle('56', 'State Governors Meet to Discuss Infrastructure Priorities', 5, 5),
  generateArticle('57', 'Supreme Court Ruling Sets New Legal Precedent', 5, 6),
  generateArticle('58', 'Campaign Finance Reform Gains Momentum in Congress', 5, 7),
  generateArticle('59', 'Foreign Relations Shift Following Diplomatic Meetings', 5, 8),
  generateArticle('60', 'Local Elections See Record Voter Turnout Numbers', 5, 9),
];

// Export all articles
export const defaultArticles: Article[] = [
  ...businessArticles,
  ...technologyArticles,
  ...cryptoArticles,
  ...sportsArticles,
  ...entertainmentArticles,
  ...politicsArticles,
];

// Featured articles (first from each category)
export const defaultFeaturedArticles: Article[] = [
  businessArticles[0],
  technologyArticles[0],
  cryptoArticles[0],
  sportsArticles[0],
  entertainmentArticles[0],
  politicsArticles[0],
];

// Get trending (most views)
export const defaultTrendingArticles: Article[] = [...defaultArticles]
  .sort((a, b) => b.views - a.views)
  .slice(0, 10);

// Get latest (most recent)
export const defaultLatestArticles: Article[] = [...defaultArticles]
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .slice(0, 12);

// Get articles by category
export const getArticlesByCategory = (categorySlug: string): Article[] => {
  return defaultArticles.filter(article => article.category.slug === categorySlug);
};
