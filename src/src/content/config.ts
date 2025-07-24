import { defineCollection, z } from 'astro:content';

const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
    readingTime: z.number(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    category: z.string(),
    prerequisites: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([])
  })
});

export const collections = {
  'articles': articlesCollection
};