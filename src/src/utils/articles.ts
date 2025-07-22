import matter from 'gray-matter';

export interface ArticleMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  slug: string;
  filePath: string;
  prerequisites: string[];
  relatedArticles: string[];
}

export interface CategoryMetadata {
  name: string;
  path: string;
  icon: string;
}

export interface SiteMetadata {
  categories: CategoryMetadata[];
  articles: {
    en: ArticleMetadata[];
    uk: ArticleMetadata[];
  };
}

// Fetch the metadata from the JSON file
export async function fetchSiteMetadata(): Promise<SiteMetadata> {
  try {
    const response = await fetch('/metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading site metadata:', error);
    // Return empty structure as fallback
    return {
      categories: [],
      articles: { en: [], uk: [] }
    };
  }
}

// Get all articles for a specific language
export async function fetchArticlesForLanguage(lang: string = 'en'): Promise<ArticleMetadata[]> {
  const metadata = await fetchSiteMetadata();
  return metadata.articles[lang as keyof typeof metadata.articles] || [];
}

// Get articles grouped by category for a specific language
export async function fetchArticlesByCategory(lang: string = 'en'): Promise<Record<string, ArticleMetadata[]>> {
  const articles = await fetchArticlesForLanguage(lang);
  
  return articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, ArticleMetadata[]>);
}

// Get a single article by slug
export async function fetchArticleBySlug(slug: string, lang: string = 'en'): Promise<{ metadata: ArticleMetadata, content: string } | null> {
  const articles = await fetchArticlesForLanguage(lang);
  const article = articles.find(a => a.slug === slug);
  
  if (!article) {
    return null;
  }
  
  try {
    // Fetch the actual markdown content from the file
    const response = await fetch(`/${article.filePath}`);
    if (!response.ok) {
      console.warn(`Could not fetch content for ${article.filePath}, using placeholder`);
      // Return placeholder content if file doesn't exist
      const placeholderContent = `# ${article.title}\n\n${article.description}\n\nContent for this article is being prepared...`;
      return { metadata: article, content: placeholderContent };
    }
    
    const fullContent = await response.text();
    
    // Parse front matter if it exists, otherwise use the full content
    const { content } = matter(fullContent);
    return { metadata: article, content };
  } catch (error) {
    console.error(`Error fetching article content for ${slug}:`, error);
    // Return placeholder content on error
    const placeholderContent = `# ${article.title}\n\n${article.description}\n\nContent for this article is being prepared...`;
    return { metadata: article, content: placeholderContent };
  }
}

// Get categories
export async function fetchCategories(): Promise<CategoryMetadata[]> {
  const metadata = await fetchSiteMetadata();
  return metadata.categories;
}

// Get featured articles for a language
export async function fetchFeaturedArticles(lang: string = 'en'): Promise<ArticleMetadata[]> {
  const articles = await fetchArticlesForLanguage(lang);
  return articles.filter(article => article.featured);
}

// Get articles by difficulty
export async function fetchArticlesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced', lang: string = 'en'): Promise<ArticleMetadata[]> {
  const articles = await fetchArticlesForLanguage(lang);
  return articles.filter(article => article.difficulty === difficulty);
}

// Search articles by title or description
export async function searchArticles(query: string, lang: string = 'en'): Promise<ArticleMetadata[]> {
  const articles = await fetchArticlesForLanguage(lang);
  const lowerQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}