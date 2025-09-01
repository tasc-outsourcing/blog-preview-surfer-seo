# TAS Outsourcing Blog Preview System with Surfer SEO Export

A modern staging and preview environment for SEO-optimized blog articles, built with Next.js 15 and Tailwind CSS, featuring direct export to Surfer SEO.

## 🚀 Features

- **Live Preview**: Real-time preview of markdown articles with proper formatting
- **Surfer SEO Export**: One-click HTML export optimized for Surfer SEO's content editor
- **Quick Copy to Clipboard**: Instant copy HTML for pasting into SEO tools
- **SEO Optimization**: Metadata extraction and SEO-friendly rendering
- **Callout Boxes**: Beautiful styled callout boxes for important information
- **Auto-Refresh**: Hot reload when markdown files are edited
- **Laravel Export**: API endpoints to export articles for Laravel integration
- **Responsive Design**: Mobile-friendly interface
- **Article Statistics**: Word count, reading time, and featured articles

## 📋 Getting Started

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd blog-preview

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000 to see the preview system.

## 📝 Creating Articles

Articles are stored as markdown files in the parent `articles/` directory.

### With Frontmatter (Optional)

```yaml
---
title: "Complete Guide to Business Setup in Saudi Arabia"
description: "Everything you need to know about setting up a business"
keywords: ["saudi", "business", "setup"]
featured: true
---

# Your Article Content
```

## 🎯 Surfer SEO Export

### Method 1: Download HTML File
1. Navigate to any article
2. Click **"📥 Export for Surfer SEO"** button in the top-right
3. HTML file downloads automatically
4. Upload to Surfer SEO's content editor

### Method 2: Quick Copy to Clipboard
1. Navigate to any article
2. Click **"📋 Quick Copy"** button
3. Paste directly into Surfer SEO (Ctrl/Cmd + V)

### Testing Export
Open `test-export.html` in your browser to test the export API directly.

## 🎨 Callout Boxes

Use special prefixes for styled callout boxes:

- `ℹ️` or `INFO:` → Blue information box
- `⚠️` or `WARNING:` → Yellow warning box
- `✅` or `TIP:` → Green success box
- `🔴` or `IMPORTANT:` → Red alert box
- `📝` or `NOTE:` → Gray note box

## 🚀 Deploy on Vercel

The easiest way to deploy is using [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Import your GitHub repository
3. Deploy automatically

---

Built for **TAS Outsourcing** - [tascoutsourcing.sa](https://tascoutsourcing.sa)
