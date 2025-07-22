# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Department of AIsiCs (Кафедра ШІзики) is an AI education platform built with Astro that provides multilingual (English/Ukrainian) educational content about artificial intelligence topics. The platform fetches markdown content from GitHub and presents it in a modern, searchable interface with category-based navigation.

## Development Commands

```bash
# Navigate to the src directory first - the Astro app is in src/
cd src

# Install dependencies
npm install

# Start development server at localhost:4321
npm run dev

# Build for production to ./dist/
npm run build

# Preview production build locally
npm run preview
```

## Architecture

### Content Architecture
The repository follows a dual-structure approach:
1. **Content directories** (root level): `/Basics`, `/CV`, `/Deep Learning`, `/Ethics`, `/Machine Learning`, `/NLP`, `/Neural Networks`, `/Tutorials` - each containing language subdirectories (`en/`, `uk/`) with markdown files
2. **Web application** (`/src`): Astro-based frontend that fetches and displays content

### Key Components

**GitHub Integration** (`src/src/utils/github.ts`):
- Fetches markdown content from the `aisics/department-of-aisics` GitHub repository
- Parses metadata from markdown files to generate article metadata
- Currently uses sample data (getSampleArticles()) - production should fetch real GitHub content

**Internationalization** (`src/src/utils/i18n.ts`):
- Manages English and Ukrainian translations
- Uses cookie-based language persistence
- Translations stored in `src/locales/en.json` and `src/locales/uk.json`

**Page Routing**:
- `/` - Homepage with hero section and features (src/src/pages/index.astro)
- `/article/[slug]` - Dynamic article pages (src/src/pages/article/[slug].astro)

**Component Structure**:
- `Header` - Navigation bar with language selector
- `Sidebar` - Category navigation with icons from metadata.json
- `ArticleCard` / `FeaturedArticle` - Article display components
- `SearchBox` - Article search functionality
- `LanguageSelector` - Language switching UI

### Styling
- Tailwind CSS with custom configuration
- Dark theme with gradient accents
- Typography plugin for markdown content
- Custom color palette: primary (purple) and accent (blue)

## Important Considerations

1. **Directory Structure**: The Astro application lives in `/src`, not the root. Always `cd src` before running npm commands.

2. **Content Fetching**: The app is designed to fetch content from GitHub API. The github.ts utility needs to be connected to real GitHub content instead of using sample data.

3. **Localization**: The app supports UK (Ukrainian) and EN (English). Default language is Ukrainian. Language files were recently moved from root `/locales` to `/src/locales`.

4. **Server-Side Rendering**: Configured for SSR (`output: 'server'` in astro.config.mjs), which affects deployment considerations.

5. **Category Metadata**: Categories are defined in `/metadata.json` with icons and paths that map to content directories.

## Current State Notes

Based on git status:
- Localization files were recently migrated to src/locales/
- Several components have been modified for improved i18n support
- The project is actively being developed with recent localization improvements