interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

interface ArticleMetadata {
  title: string;
  description: string;
  category: string;
  tags: string[];
  slug: string;
  readingTime: number;
  lastModified: string;
  featured?: boolean;
}

// Configure your GitHub repository here
const GITHUB_OWNER = 'aisics'; // Replace with your GitHub username
const GITHUB_REPO = 'department-of-aisics'; // Replace with your repository name
const GITHUB_BRANCH = 'main'; // or 'master' depending on your default branch

interface CategoryMetadata {
  name: string;
  [key: string]: any;
}

export async function fetchRepositoryStructure(): Promise<GitHubFile[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents?ref=${GITHUB_BRANCH}`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch repository structure:', response.statusText);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching repository structure:', error);
    return [];
  }
}

export async function fetchCategoriesFromMetadata(): Promise<CategoryMetadata[]> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/metadata.json`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch metadata.json:', response.statusText);
      return [];
    }
    
    const metadata = await response.json();
    return metadata.categories || [];
  } catch (error) {
    console.error('Error fetching categories from metadata:', error);
    return [];
  }
}

export async function fetchMarkdownFiles(): Promise<GitHubFile[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`
    );
    
    if (!response.ok) {
      console.error('Failed to fetch markdown files:', response.statusText);
      return [];
    }
    
    const data = await response.json();
    
    return data.tree.filter((file: any) => 
      file.type === 'blob' && file.path.endsWith('.md')
    );
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    return [];
  }
}

export async function fetchFileContent(path: string): Promise<string> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch file content for ${path}:`, response.statusText);
      return '';
    }
    
    return await response.text();
  } catch (error) {
    console.error(`Error fetching file content for ${path}:`, error);
    return '';
  }
}

export function parseMarkdownMetadata(content: string, path: string): ArticleMetadata {
  const lines = content.split('\n');
  let title = 'Untitled Article';
  let description = '';
  let category = 'General';
  let tags: string[] = [];
  let featured = false;
  
  // Extract title from first # heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }
  
  // Extract description from first paragraph after title
  const paragraphs = content.split('\n\n');
  for (const paragraph of paragraphs) {
    const cleaned = paragraph.trim().replace(/^#+\s+/, '');
    if (cleaned && !cleaned.startsWith('#') && !cleaned.startsWith('```') && cleaned.length > 50) {
      description = cleaned.substring(0, 200) + (cleaned.length > 200 ? '...' : '');
      break;
    }
  }
  
  // Infer category from path
  const pathParts = path.split('/');
  if (pathParts.length > 1) {
    category = pathParts[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Extract tags from content (look for common AI/ML keywords)
  const keywords = [
    'machine learning', 'deep learning', 'neural network', 'ai', 'artificial intelligence',
    'python', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'reinforcement learning',
    'supervised learning', 'unsupervised learning', 'classification', 'regression',
    'neural networks', 'cnn', 'rnn', 'lstm', 'transformer', 'bert', 'gpt'
  ];
  
  const contentLower = content.toLowerCase();
  tags = keywords.filter(keyword => 
    contentLower.includes(keyword.toLowerCase())
  ).map(tag => tag.replace(/\s+/g, '-'));
  
  // Remove duplicates and limit to 5 tags
  tags = [...new Set(tags)].slice(0, 5);
  
  const slug = path.replace(/\.md$/, '').replace(/\//g, '-').toLowerCase();
  const readingTime = Math.ceil(content.split(' ').length / 200); // Assume 200 WPM
  
  return {
    title,
    description,
    category,
    tags,
    slug,
    readingTime,
    lastModified: new Date().toISOString(), // GitHub API would provide this
    featured
  };
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function fetchArticlesWithContent(lang: string = 'en'): Promise<ArticleMetadata[]> {
  try {
    const files = await fetchMarkdownFiles();
    const articles: ArticleMetadata[] = [];
    
    // Filter files by language
    const langFiles = files.filter((file: any) => {
      const pathParts = file.path.split('/');
      return pathParts.length >= 2 && pathParts[1] === lang;
    });
    
    // Fetch content for each file and parse metadata
    for (const file of langFiles) {
      const content = await fetchFileContent(file.path);
      if (content) {
        const metadata = parseMarkdownMetadata(content, file.path);
        articles.push(metadata);
      }
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles with content:', error);
    return getSampleArticles(); // Fallback to sample data
  }
}

export async function fetchArticleBySlug(slug: string, lang: string = 'en'): Promise<{ metadata: ArticleMetadata, content: string } | null> {
  try {
    const files = await fetchMarkdownFiles();
    
    // Find the file that matches the slug
    const matchingFile = files.find((file: any) => {
      const pathParts = file.path.split('/');
      if (pathParts.length >= 3 && pathParts[1] === lang) {
        const fileSlug = file.path.replace(/\.md$/, '').replace(/\//g, '-').toLowerCase();
        return fileSlug === slug || fileSlug.endsWith(`-${slug}`);
      }
      return false;
    });
    
    if (matchingFile) {
      const content = await fetchFileContent(matchingFile.path);
      if (content) {
        const metadata = parseMarkdownMetadata(content, matchingFile.path);
        return { metadata, content };
      }
    }
    
    // Fallback: try to find in any language
    const anyLangFile = files.find((file: any) => {
      const fileSlug = file.path.replace(/\.md$/, '').replace(/\//g, '-').toLowerCase();
      return fileSlug === slug || fileSlug.endsWith(`-${slug}`);
    });
    
    if (anyLangFile) {
      const content = await fetchFileContent(anyLangFile.path);
      if (content) {
        const metadata = parseMarkdownMetadata(content, anyLangFile.path);
        return { metadata, content };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Sample data for demonstration (remove when connecting to real GitHub repo)
export function getSampleArticles(): ArticleMetadata[] {
  return [
    {
      title: "Introduction to Machine Learning",
      description: "Learn the fundamentals of machine learning, including supervised and unsupervised learning techniques. This comprehensive guide covers everything from basic concepts to practical applications in real-world scenarios.",
      category: "Basics",
      tags: ["machine-learning", "basics", "supervised-learning", "unsupervised-learning"],
      slug: "introduction-to-machine-learning",
      readingTime: 8,
      lastModified: "2024-01-15T10:00:00Z",
      featured: true
    },
    {
      title: "Deep Learning with Neural Networks",
      description: "Explore the world of deep learning and neural networks. Understanding how artificial neural networks work and their applications in various domains like image recognition and natural language processing.",
      category: "Deep Learning",
      tags: ["deep-learning", "neural-networks", "tensorflow", "pytorch"],
      slug: "deep-learning-neural-networks",
      readingTime: 12,
      lastModified: "2024-01-14T14:30:00Z"
    },
    {
      title: "Natural Language Processing Fundamentals",
      description: "Dive into the basics of NLP and learn how computers understand human language. From tokenization to sentiment analysis, discover the key techniques used in modern NLP applications.",
      category: "NLP",
      tags: ["nlp", "text-processing", "sentiment-analysis", "tokenization"],
      slug: "nlp-fundamentals",
      readingTime: 10,
      lastModified: "2024-01-13T09:15:00Z"
    },
    {
      title: "Computer Vision with Python",
      description: "Learn computer vision techniques using Python and OpenCV. From basic image processing to advanced object detection, this guide covers essential computer vision concepts with practical examples.",
      category: "Computer Vision",
      tags: ["computer-vision", "python", "opencv", "object-detection"],
      slug: "computer-vision-python",
      readingTime: 15,
      lastModified: "2024-01-12T16:45:00Z"
    },
    {
      title: "Ethics in Artificial Intelligence",
      description: "Exploring the ethical implications of AI development and deployment. Discussing bias, fairness, transparency, and responsible AI practices that every AI practitioner should understand.",
      category: "Ethics",
      tags: ["ai-ethics", "bias", "fairness", "responsible-ai"],
      slug: "ethics-in-ai",
      readingTime: 6,
      lastModified: "2024-01-11T11:20:00Z"
    },
    {
      title: "Building Your First Chatbot",
      description: "Step-by-step tutorial on creating an intelligent chatbot using modern NLP techniques. Learn about intent recognition, entity extraction, and dialogue management in this hands-on guide.",
      category: "Tutorials",
      tags: ["chatbot", "tutorial", "nlp", "python"],
      slug: "building-first-chatbot",
      readingTime: 20,
      lastModified: "2024-01-10T13:00:00Z"
    }
  ];
}