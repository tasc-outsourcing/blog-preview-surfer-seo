'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Article {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  content: string;
  htmlContent: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    // Fetch article data from API
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${slug}`);
        
        if (!response.ok) {
          router.push('/404');
          return;
        }
        
        const data = await response.json();
        
        if (data.success && data.article) {
          setArticle(data.article);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, router]);

  // Generate table of contents from headings
  const getToc = () => {
    if (!article) return [];
    
    const tocItems = article.content.match(/^#{2,4}\s+.+$/gm) || [];
    return tocItems.map(heading => {
      const level = (heading.match(/^#+/) || [''])[0].length;
      const text = heading.replace(/^#+\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { level, text, id };
    });
  };

  const handleExportHTML = async () => {
    setExporting(true);
    setExportSuccess(false);
    
    try {
      const response = await fetch(`/api/export/${slug}`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Create optimized HTML for Surfer SEO
        // Surfer SEO prefers clean, semantic HTML without excessive styling
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article?.title || 'Article'}</title>
    <meta name="description" content="${article?.description || ''}">
    <meta name="keywords" content="${article?.keywords?.join(', ') || ''}">
    <style>
        /* Minimal styling for better Surfer SEO compatibility */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #000;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 { font-size: 2em; margin: 0.67em 0; }
        h2 { font-size: 1.5em; margin: 0.83em 0; }
        h3 { font-size: 1.17em; margin: 1em 0; }
        h4 { font-size: 1em; margin: 1.33em 0; }
        h5 { font-size: 0.83em; margin: 1.67em 0; }
        h6 { font-size: 0.67em; margin: 2.33em 0; }
        p { margin: 1em 0; }
        ul, ol { margin: 1em 0; padding-left: 40px; }
        li { margin: 0.5em 0; }
        strong, b { font-weight: bold; }
        em, i { font-style: italic; }
        blockquote { 
            margin: 1em 0;
            padding-left: 1em;
            border-left: 3px solid #ccc;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .callout {
            margin: 1em 0;
            padding: 1em;
            background: #f5f5f5;
            border-left: 4px solid #333;
        }
    </style>
</head>
<body>
    <article>
        <!-- Article content only - no metadata for cleaner Surfer SEO import -->
        ${data.exports.htmlContent || article?.htmlContent || ''}
    </article>
</body>
</html>`;
        
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}-surfer-seo.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      } else {
        throw new Error(data.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Failed to export HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyHTML = async () => {
    try {
      const response = await fetch(`/api/export/${slug}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Copy only the article HTML content for Surfer SEO
        // Remove any wrapper divs and keep only semantic HTML
        const htmlContent = data.exports.htmlContent || article?.htmlContent || '';
        
        // Clean the HTML for better Surfer SEO compatibility
        const cleanedHTML = htmlContent
          .replace(/<div class="article-content">/g, '')
          .replace(/<\/div>$/g, '')
          .trim();
        
        await navigator.clipboard.writeText(cleanedHTML);
        
        // Show success message with more detail
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        `;
        tempDiv.textContent = '✓ HTML copied to clipboard - ready for Surfer SEO!';
        document.body.appendChild(tempDiv);
        
        setTimeout(() => {
          tempDiv.style.animation = 'slideOut 0.3s ease-in';
          setTimeout(() => document.body.removeChild(tempDiv), 300);
        }, 3000);
        
        // Add animation styles if not already present
        if (!document.getElementById('copy-animations')) {
          const style = document.createElement('style');
          style.id = 'copy-animations';
          style.textContent = `
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
              from { transform: translateX(0); opacity: 1; }
              to { transform: translateX(100%); opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
      } else {
        throw new Error(data.error || 'Failed to get content');
      }
    } catch (error) {
      console.error('Copy failed:', error);
      alert(`Failed to copy HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDownloadMarkdown = () => {
    if (!article) return;
    
    const blob = new Blob([article.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSEOAnalysis = () => {
    alert('SEO Analysis feature coming soon!');
  };

  const handleViewStyles = () => {
    const styleWindow = window.open('', '_blank', 'width=800,height=600');
    if (styleWindow) {
      styleWindow.document.write(`
        <html>
          <head><title>Article Styles</title></head>
          <body>
            <h1>Required CSS Styles</h1>
            <pre style="background: #f5f5f5; padding: 20px; overflow: auto;">
/* Copy these styles to your main CSS file */

.article-content {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #374151;
}

/* Callout Boxes */
.callout {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  display: flex;
  gap: 0.75rem;
}

.callout-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.callout-content {
  flex: 1;
}

.callout-info {
  background-color: #EFF6FF;
  border-color: #60A5FA;
  color: #1E3A8A;
}

.callout-warning {
  background-color: #FEF3C7;
  border-color: #FCD34D;
  color: #92400E;
}

.callout-success {
  background-color: #D1FAE5;
  border-color: #34D399;
  color: #065F46;
}

.callout-danger {
  background-color: #FEE2E2;
  border-color: #F87171;
  color: #991B1B;
}

.callout-note {
  background-color: #F9FAFB;
  border-color: #9CA3AF;
  color: #111827;
}

/* Tables */
.table-wrapper {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.table-wrapper table {
  min-width: 100%;
  border-collapse: collapse;
}

.table-wrapper th,
.table-wrapper td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E5E7EB;
}

.table-wrapper thead {
  background-color: #F9FAFB;
}

.table-wrapper tbody tr:nth-child(even) {
  background-color: #F9FAFB;
}
            </pre>
          </body>
        </html>
      `);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  const toc = getToc();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Articles</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="badge badge-primary">Preview Mode</span>
              <div className="flex gap-2">
                <button 
                  onClick={handleExportHTML}
                  disabled={exporting}
                  className={`btn btn-primary text-sm ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Download HTML file optimized for Surfer SEO"
                >
                  {exporting ? 'Exporting...' : exportSuccess ? '✓ Exported!' : '📥 Export for Surfer SEO'}
                </button>
                <button 
                  onClick={handleCopyHTML}
                  className="btn btn-secondary text-sm"
                  title="Copy HTML to clipboard for quick paste into Surfer SEO"
                >
                  📋 Quick Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-6 text-blue-100">
            <div className="flex items-center gap-1">
              <UserIcon className="w-5 h-5" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-5 h-5" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-5 h-5" />
              <span>{article.readTime}</span>
            </div>
          </div>
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {article.keywords.map((keyword, idx) => (
                <span key={idx} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                  <h2 className="font-semibold text-gray-900 mb-3">Table of Contents</h2>
                  <nav className="space-y-2">
                    {toc.map((item, idx) => (
                      <a
                        key={idx}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-blue-600 transition-colors ${
                          item.level === 2 ? 'pl-0' : item.level === 3 ? 'pl-4' : 'pl-8'
                        } text-gray-600`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Article Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={handleCopyHTML}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    📋 Copy HTML
                  </button>
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    📥 Download Markdown
                  </button>
                  <button 
                    onClick={handleViewStyles}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    🎨 View Styles
                  </button>
                  <button 
                    onClick={handleSEOAnalysis}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                  >
                    📊 SEO Analysis
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">Metadata</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Category</dt>
                    <dd className="text-gray-900 font-medium">{article.category}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Word Count</dt>
                    <dd className="text-gray-900 font-medium">
                      {parseInt(article.readTime?.split(' ')[0] || '0') * 200}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className="badge badge-primary">Preview</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
              {/* Description */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 italic">{article.description}</p>
              </div>

              {/* Article HTML Content */}
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-2">Preview Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                This article is in preview mode. The formatting, callout boxes, and styles shown here 
                will be applied when published to your Laravel site.
              </p>
              <div className="flex gap-3">
                <button className="btn btn-primary">Publish to Production</button>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit Article
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 TAS Outsourcing - SEO Article Preview System
          </p>
        </div>
      </footer>
    </div>
  );
}