import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TAS Outsourcing Blog</h1>
              <p className="text-sm text-gray-600 mt-1">Preview & Staging Environment</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="badge badge-primary">Preview Mode</span>
              <a 
                href="https://tascoutsourcing.sa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Production Site →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold mb-4">SEO Article Preview System</h2>
          <p className="text-xl opacity-90 mb-8">
            Preview your articles with proper formatting, callout boxes, and SEO optimization
          </p>
          <div className="flex gap-4">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              View Documentation
            </button>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-400 transition-colors">
              Export for Laravel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900">{articles.length}</h3>
            <p className="text-gray-600">Total Articles</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900">
              {articles.filter(a => a.featured).length}
            </h3>
            <p className="text-gray-600">Featured Articles</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-3xl font-bold text-gray-900">
              {articles.reduce((acc, article) => {
                const words = parseInt(article.readTime?.split(' ')[0] || '0') * 200;
                return acc + words;
              }, 0).toLocaleString()}
            </h3>
            <p className="text-gray-600">Total Words</p>
          </div>
        </div>

        {/* Article List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Filter
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Sort
              </button>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
              <p className="text-gray-500 mb-4">No articles found</p>
              <p className="text-sm text-gray-400">
                Create markdown files in the <code className="bg-gray-100 px-2 py-1 rounded">articles/</code> directory
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="article-card p-6 flex flex-col"
                >
                  {article.featured && (
                    <span className="badge badge-primary mb-3 self-start">Featured</span>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  {article.keywords && article.keywords.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <div className="flex gap-1 flex-wrap">
                        {article.keywords.slice(0, 3).map((keyword, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

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