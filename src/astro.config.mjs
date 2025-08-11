import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeKatex from 'rehype-katex';
import { rehypeCopyCode } from './src/utils/rehype-copy-code.js';

export default defineConfig({
  output: 'static',
  // adapter: node({
  //   mode: 'standalone'
  // }),
  integrations: [
    tailwind(),
    mdx()
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeKatex,
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