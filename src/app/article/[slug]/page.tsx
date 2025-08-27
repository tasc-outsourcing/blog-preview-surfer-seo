import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | TAS Outsourcing Blog`,
    description: article.description,
    keywords: article.keywords?.join(', '),
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Generate table of contents from headings
  const tocItems = article.content.match(/^#{2,4}\s+.+$/gm) || [];
  const toc = tocItems.map(heading => {
    const level = (heading.match(/^#+/) || [''])[0].length;
    const text = heading.replace(/^#+\s+/, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return { level, text, id };
  });

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
              <button className="btn btn-primary text-sm">
                Export HTML
              </button>
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
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    📋 Copy HTML
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    📥 Download Markdown
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
                    🎨 View Styles
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded">
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