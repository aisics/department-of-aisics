// Legacy URL mappings for redirects
export const legacyRedirects: Record<string, string> = {
  // Basics articles
  'basics-en-vectors-in-ai': 'basics-en-01-vectors-in-ai',
  'basics-uk-vectors-in-ai': 'basics-uk-01-vectors-in-ai',
  
  // Tutorials articles - these might not have changed, but keeping for consistency
  'tutorials-en-ai-cv-builder-guide': 'tutorials-en-ai-cv-builder-guide',
  'tutorials-uk-ai-cv-builder-guide': 'tutorials-uk-ai-cv-builder-guide',
  'tutorials-en-ihor-kozak-cv-case-study': 'tutorials-en-ihor-kozak-cv-case-study',
  'tutorials-uk-ihor-kozak-cv-case-study': 'tutorials-uk-ihor-kozak-cv-case-study',
  
  // Add more legacy mappings as needed
  // Format: 'old-slug': 'new-slug'
};

export function getLegacyRedirect(oldSlug: string): string | null {
  return legacyRedirects[oldSlug] || null;
}