## 📚 Article Management

This site uses Astro Content Collections for type-safe article management. All articles are stored in the `src/content/articles/` directory.

### Adding a New Article

1. Create a new markdown file in the appropriate directory:
   ```
   src/content/articles/[Category]/[language]/[filename].md
   ```

2. Add required frontmatter to the article:
   ```yaml
   ---
   title: "Your Article Title"
   description: "Brief description of the article"
   author: "Author Name"
   date: 2025-07-24
   readingTime: 10
   tags: ["tag1", "tag2", "tag3"]
   featured: false
   difficulty: "beginner" # beginner | intermediate | advanced
   category: "Category Name"
   prerequisites: [] # Optional array of prerequisite topics
   relatedArticles: [] # Optional array of related article slugs
   ---
   ```

3. Write your content using standard Markdown with MDX support
4. Code blocks automatically get copy buttons via rehype plugin
5. Math expressions should use Markdown code blocks instead of LaTeX

### Directory Structure
```
src/content/articles/
├── Basics/
│   ├── en/
│   │   └── 01-vectors-in-ai.md
│   └── uk/
│       └── 01-vectors-in-ai.md
└── Tutorials/
    ├── en/
    │   ├── ai-cv-builder-guide.md
    │   └── ihor-kozak-cv-case-study.md
    └── uk/
        ├── ai-cv-builder-guide.md
        └── ihor-kozak-cv-case-study.md
```

### URL Structure and Redirects

Articles are accessible at: `/article/[category-lang-filename]`

If you change an article's URL, add a redirect to `public/_redirects`:
```
/old-path   /new-path   301
```

### Content Schema

All articles must include these frontmatter fields:
- `title`: Article title (string)
- `description`: Brief description (string)
- `author`: Author name (string)
- `date`: Publication date (YYYY-MM-DD)
- `readingTime`: Estimated reading time in minutes (number)
- `tags`: Array of relevant tags (string[])
- `featured`: Whether to feature on homepage (boolean, defaults to false)
- `difficulty`: Difficulty level (beginner/intermediate/advanced)
- `category`: Article category (string)
- `prerequisites`: Required prior knowledge (string[], optional)
- `relatedArticles`: Related article slugs (string[], optional)

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
