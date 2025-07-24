import categoriesData from '../data/categories.json';

export interface CategoryMetadata {
  name: string;
  path: string;
  icon: string;
}

// Get categories
export function getCategories(): CategoryMetadata[] {
  return categoriesData.categories;
}