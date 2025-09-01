# 📚 Article Publishing Workflow

This guide explains how to add new articles to the live Vercel deployment.

## 🚀 Quick Start - Adding New Articles

### Method 1: Command Line (Fastest)

```bash
# 1. Create your article (example: my-article.md)
# 2. Add it to the project
npm run add-article ~/Desktop/my-article.md

# That's it! Article deploys automatically to Vercel
```

### Method 2: Manual Process

```bash
# 1. Add article to articles folder
cp ~/Desktop/my-article.md articles/

# 2. Deploy to live site
npm run deploy

# Article appears on Vercel in 1-2 minutes
```

### Method 3: GitHub Web Interface (No coding required)

1. Go to: https://github.com/tasc-outsourcing/blog-preview-surfer-seo
2. Navigate to `articles` folder
3. Click "Add file" → "Create new file"
4. Name: `your-article.md`
5. Paste content
6. Click "Commit new file"
7. Vercel auto-deploys!

## 📝 Article Format

Every article needs frontmatter at the top:

```markdown
---
title: "Your Article Title"
slug: "url-friendly-slug"
description: "Brief description for SEO"
keywords: ["keyword1", "keyword2", "keyword3"]
author: "Author Name"
date: "2025-01-29"
category: "Category"
readTime: "5 min read"
featured: true
---

# Your Article Content

Write your content here...
```

## 🔄 Workflow for Team Members

### For Writers (Non-Technical)

1. **Write article** in any markdown editor
2. **Send file** to developer
3. Developer runs: `npm run add-article article.md`
4. **Live in 2 minutes** on Vercel

### For Developers

1. **Pull latest**
   ```bash
   git pull
   ```

2. **Add multiple articles**
   ```bash
   cp articles-batch/*.md articles/
   npm run deploy
   ```

3. **Check deployment**
   - Visit: https://vercel.com/tasc-outsourcing/blog-preview-surfer-seo
   - Or check live site

## 🎯 From Parent Project to Live Site

If you're syncing from the parent Claude SEO project:

```bash
# 1. Copy from parent project
cp "../Claude SEO/articles/new-article.md" articles/

# 2. Deploy
npm run deploy

# 3. Article is live!
```

## 🔗 Important URLs

- **Live Site**: https://blog-preview-surfer-seo.vercel.app
- **GitHub Repo**: https://github.com/tasc-outsourcing/blog-preview-surfer-seo
- **Vercel Dashboard**: https://vercel.com/tasc-outsourcing/blog-preview-surfer-seo

## ⚡ Automation Tips

### Auto-sync from Parent Project

Create a sync script (`scripts/sync-articles.sh`):

```bash
#!/bin/bash
# Sync articles from parent project
cp "../Claude SEO/articles/"*.md articles/
git add articles/
git commit -m "Sync articles from parent project"
git push
```

### Batch Processing

Add multiple articles at once:

```bash
# Copy all .md files from a folder
cp ~/ArticleBatch/*.md articles/
npm run deploy
```

## 🛠️ Troubleshooting

### Article Not Showing?

1. **Check filename**: Must end with `.md`
2. **Check frontmatter**: Required fields must be present
3. **Wait 2 minutes**: Vercel needs time to rebuild
4. **Check build logs**: https://vercel.com/tasc-outsourcing/blog-preview-surfer-seo

### Deployment Failed?

1. Check Vercel dashboard for errors
2. Ensure article markdown is valid
3. No special characters in filename

## 📊 Monitoring Deployments

1. **Vercel Dashboard**: See all deployments
2. **GitHub Actions**: Watch commit status
3. **Live Site**: Refresh to see changes

## 🎉 That's It!

Adding articles is as simple as:
1. Create `.md` file with frontmatter
2. Add to `articles/` folder
3. Push to GitHub
4. Vercel auto-deploys!

Your content team can now easily publish articles that are immediately available for Surfer SEO export!