import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const articlesDirectory = path.join(process.cwd(), 'articles');

export interface ArticleMetadata {
  title: string;
  slug: string;
  description?: string;
  keywords?: string[];
  author?: string;
  date?: string;
  category?: string;
  readTime?: string;
  featured?: boolean;
}

export interface Article extends ArticleMetadata {
  content: string;
  htmlContent?: string;
}

// Get all article files
export function getAllArticles(): ArticleMetadata[] {
  try {
    // Check if articles directory exists
    if (!fs.existsSync(articlesDirectory)) {
      console.log('Articles directory not found, creating...');
      fs.mkdirSync(articlesDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const articles = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Extract title from frontmatter or first heading
        let title = data.title;
        if (!title) {
          const headingMatch = content.match(/^#\s+(.+)$/m);
          title = headingMatch ? headingMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        // Calculate read time
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);

        return {
          slug,
          title,
          description: data.description || content.substring(0, 160).replace(/[#\*\[\]\n]/g, '').trim() + '...',
          keywords: data.keywords || [],
          author: data.author || 'TAS Outsourcing',
          date: data.date || '2025-01-01',
          category: data.category || 'Business Setup',
          readTime: `${readTime} min read`,
          featured: data.featured || false,
        };
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      });

    return articles;
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

// Get single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Process markdown to HTML with enhanced formatting
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);
    
    let htmlContent = processedContent.toString();

    // Enhanced HTML processing for callouts and special formatting
    htmlContent = processEnhancedMarkdown(htmlContent);

    // Extract title from frontmatter or first heading
    let title = data.title;
    if (!title) {
      const headingMatch = content.match(/^#\s+(.+)$/m);
      title = headingMatch ? headingMatch[1] : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Calculate read time
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      slug,
      title,
      description: data.description || content.substring(0, 160).replace(/[#\*\[\]\n]/g, '').trim() + '...',
      keywords: data.keywords || [],
      author: data.author || 'TAS Outsourcing',
      date: data.date || '2025-01-01',
      category: data.category || 'Business Setup',
      readTime: `${readTime} min read`,
      featured: data.featured || false,
      content,
      htmlContent,
    };
  } catch (error) {
    console.error('Error reading article:', error);
    return null;
  }
}

// Process enhanced markdown for callouts, notes, and special formatting
function processEnhancedMarkdown(html: string): string {
  // Process info boxes (lines starting with ℹ️ or INFO:)
  html = html.replace(
    /<p>(?:ℹ️|INFO:)\s*(.+?)<\/p>/g,
    '<div class="callout callout-info"><svg class="callout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="callout-content">$1</div></div>'
  );

  // Process warning boxes (lines starting with ⚠️ or WARNING:)
  html = html.replace(
    /<p>(?:⚠️|WARNING:)\s*(.+?)<\/p>/g,
    '<div class="callout callout-warning"><svg class="callout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div class="callout-content">$1</div></div>'
  );

  // Process success/tip boxes (lines starting with ✅ or TIP:)
  html = html.replace(
    /<p>(?:✅|TIP:|💡)\s*(.+?)<\/p>/g,
    '<div class="callout callout-success"><svg class="callout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="callout-content">$1</div></div>'
  );

  // Process important/alert boxes (lines starting with 🔴 or IMPORTANT:)
  html = html.replace(
    /<p>(?:🔴|IMPORTANT:|❗)\s*(.+?)<\/p>/g,
    '<div class="callout callout-danger"><svg class="callout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><div class="callout-content">$1</div></div>'
  );

  // Process note boxes (lines starting with 📝 or NOTE:)
  html = html.replace(
    /<p>(?:📝|NOTE:)\s*(.+?)<\/p>/g,
    '<div class="callout callout-note"><svg class="callout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg><div class="callout-content">$1</div></div>'
  );

  // Add responsive tables
  html = html.replace(/<table>/g, '<div class="table-wrapper"><table>');
  html = html.replace(/<\/table>/g, '</table></div>');

  // Add syntax highlighting classes
  html = html.replace(/<pre><code class="language-/g, '<pre class="language-');
  html = html.replace(/<pre><code>/g, '<pre class="language-plaintext"><code>');

  return html;
}

export function searchArticles(query: string): ArticleMetadata[] {
  const articles = getAllArticles();
  const searchTerm = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description?.toLowerCase().includes(searchTerm) ||
    article.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm))
  );
}