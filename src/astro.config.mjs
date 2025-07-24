import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeCopyCode } from './src/utils/rehype-copy-code.js';

export default defineConfig({
  output: 'static',
  integrations: [
    tailwind(),
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeCopyCode
      ],
      shikiConfig: {
        theme: 'github-light',
        wrap: true,
        transformers: []
      }
    })
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeCopyCode
    ],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
      transformers: []
    }
  },
  server: {
    host: true
  }
});