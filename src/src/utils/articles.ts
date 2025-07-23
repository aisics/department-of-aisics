import matter from 'gray-matter';
import siteMetadata from '../data/metadata.json';

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

// Get the metadata (now imported directly)
export function getSiteMetadata(): SiteMetadata {
  return siteMetadata as SiteMetadata;
}

// Get all articles for a specific language
export function getArticlesForLanguage(lang: string = 'en'): ArticleMetadata[] {
  const metadata = getSiteMetadata();
  return metadata.articles[lang as keyof typeof metadata.articles] || [];
}

// Get articles grouped by category for a specific language
export function getArticlesByCategory(lang: string = 'en'): Record<string, ArticleMetadata[]> {
  const articles = getArticlesForLanguage(lang);
  
  return articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {} as Record<string, ArticleMetadata[]>);
}

// Get a single article by slug
export async function getArticleBySlug(slug: string, lang: string = 'en'): Promise<{ metadata: ArticleMetadata, content: string } | null> {
  const articles = getArticlesForLanguage(lang);
  const article = articles.find(a => a.slug === slug);
  
  if (!article) {
    return null;
  }
  
  try {
    // In SSR context, we need to read the file directly
    if (typeof window === 'undefined') {
      // Server-side: try to read the file from filesystem
      try {
        const fs = await import('fs');
        const path = await import('path');
        
        const filePath = path.join(process.cwd(), 'public', article.filePath);
        const fullContent = fs.readFileSync(filePath, 'utf-8');
        
        // Parse front matter if it exists, otherwise use the full content
        const { content } = matter(fullContent);
        return { metadata: article, content };
      } catch (fsError) {
        console.warn(`Could not read file ${article.filePath}:`, fsError);
      }
    } else {
      // Client-side: fetch from public directory
      const response = await fetch(`/${article.filePath}`);
      if (response.ok) {
        const fullContent = await response.text();
        const { content } = matter(fullContent);
        return { metadata: article, content };
      }
    }
    
    // Fallback: return placeholder content
    const placeholderContent = `# ${article.title}\n\n${article.description}\n\nContent for this article is being prepared...`;
    return { metadata: article, content: placeholderContent };
  } catch (error) {
    console.error(`Error fetching article content for ${slug}:`, error);
    // Return placeholder content on error
    const placeholderContent = `# ${article.title}\n\n${article.description}\n\nContent for this article is being prepared...`;
    return { metadata: article, content: placeholderContent };
  }
}

// Get categories
export function getCategories(): CategoryMetadata[] {
  const metadata = getSiteMetadata();
  return metadata.categories;
}

// Get featured articles for a language
export function getFeaturedArticles(lang: string = 'en'): ArticleMetadata[] {
  const articles = getArticlesForLanguage(lang);
  return articles.filter(article => article.featured);
}

// Get articles by difficulty
export function getArticlesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced', lang: string = 'en'): ArticleMetadata[] {
  const articles = getArticlesForLanguage(lang);
  return articles.filter(article => article.difficulty === difficulty);
}

// Search articles by title or description
export function searchArticles(query: string, lang: string = 'en'): ArticleMetadata[] {
  const articles = getArticlesForLanguage(lang);
  const lowerQuery = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerQuery) ||
    article.description.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}