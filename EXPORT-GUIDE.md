# 📥 HTML Export Guide for Surfer SEO

## Overview
The article preview system now includes full HTML export functionality optimized specifically for Surfer SEO content optimization.

## Features

### 1. **Export for Surfer SEO** Button
- Located in the top-right corner of article pages
- Downloads a clean HTML file optimized for Surfer SEO
- Filename format: `[article-slug]-surfer-seo.html`
- Includes minimal, semantic styling for best compatibility

### 2. **Quick Copy** Button
- Also in the top-right corner
- Copies clean HTML directly to clipboard
- Ready to paste into Surfer SEO's content editor
- Shows success notification when copied

### 3. **Sidebar Actions**
Additional export options in the left sidebar:
- **📋 Copy HTML** - Alternative copy to clipboard
- **📥 Download Markdown** - Get the original markdown source
- **🎨 View Styles** - See required CSS for your site

## How to Use

### Method 1: Download HTML File
1. Navigate to any article at `http://localhost:3000`
2. Click on an article to view it
3. Click **"📥 Export for Surfer SEO"** button
4. File downloads automatically
5. Upload to Surfer SEO's content editor

### Method 2: Quick Copy & Paste
1. Navigate to any article
2. Click **"📋 Quick Copy"** button
3. See green success notification
4. Open Surfer SEO
5. Paste (Ctrl/Cmd + V) directly into the editor

## What's Exported

The export includes:
- ✅ Clean, semantic HTML structure
- ✅ All headings (H1-H6) properly formatted
- ✅ Paragraphs, lists, and tables
- ✅ Bold and italic text formatting
- ✅ Blockquotes and callout boxes
- ✅ Internal and external links
- ✅ Meta information (title, description, keywords)

## Surfer SEO Optimization

The exported HTML is specifically optimized for Surfer SEO:
- Minimal inline styles for better parsing
- Clean semantic structure
- No unnecessary wrapper divs
- Standard HTML elements that Surfer recognizes
- UTF-8 encoding for special characters

## Testing the Export

### Test Page
Open `test-export.html` in your browser to test the export API directly:
```bash
open test-export.html
```

### API Endpoint
The export API is available at:
```
GET /api/export/[article-slug]
```

Example:
```
http://localhost:3000/api/export/business-setup-saudi-arabia-jurisdictions
```

## Troubleshooting

### Export Button Not Working?
1. Ensure the dev server is running: `npm run dev`
2. Check browser console for errors (F12)
3. Verify article exists in `/articles` folder
4. Clear browser cache and reload

### Copy to Clipboard Issues?
- Some browsers require HTTPS for clipboard access
- Try using the download option instead
- Check if clipboard permissions are enabled

### Surfer SEO Not Recognizing Content?
- Use the "Quick Copy" feature for cleanest HTML
- Avoid copying from browser's "View Source"
- Ensure you're pasting in Surfer's HTML/Source mode

## File Structure

```
📁 blog-preview/
├── 📁 src/app/
│   ├── 📁 api/export/[slug]/
│   │   └── route.ts          # Export API endpoint
│   └── 📁 article/[slug]/
│       └── page.tsx           # Article page with export buttons
├── 📁 articles/               # Your markdown articles
└── test-export.html           # Test page for export functionality
```

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the article renders correctly before exporting
3. Try both download and copy methods
4. Test with the provided test-export.html page

---

Last Updated: January 2025