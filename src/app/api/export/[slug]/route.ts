import { NextRequest, NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await getArticleBySlug(params.slug);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Generate Laravel Blade template
    const bladeTemplate = generateBladeTemplate(article);
    
    // Generate PHP model data
    const phpModel = generatePHPModel(article);
    
    // Generate migration
    const migration = generateMigration(article);

    return NextResponse.json({
      success: true,
      article: {
        title: article.title,
        slug: article.slug,
        description: article.description,
        keywords: article.keywords,
        author: article.author,
        date: article.date,
        category: article.category,
      },
      exports: {
        blade: bladeTemplate,
        model: phpModel,
        migration: migration,
        htmlContent: article.htmlContent,
        rawMarkdown: article.content,
      },
      styles: getRequiredStyles(),
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export article' },
      { status: 500 }
    );
  }
}

function generateBladeTemplate(article: any): string {
  return `@extends('layouts.blog')

@section('title', '${article.title}')
@section('description', '${article.description}')
@section('keywords', '${article.keywords?.join(', ')}')

@section('content')
<article class="blog-article">
    <header class="article-header">
        <h1>{{ $article->title }}</h1>
        <div class="article-meta">
            <span class="author">{{ $article->author }}</span>
            <span class="date">{{ $article->formatted_date }}</span>
            <span class="reading-time">{{ $article->read_time }}</span>
        </div>
        @if($article->keywords)
            <div class="article-tags">
                @foreach($article->keywords as $keyword)
                    <span class="tag">{{ $keyword }}</span>
                @endforeach
            </div>
        @endif
    </header>

    <div class="article-content">
        {!! $article->html_content !!}
    </div>
</article>
@endsection`;
}

function generatePHPModel(article: any): string {
  return `<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BlogArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'html_content',
        'author',
        'category',
        'keywords',
        'published_at',
        'read_time',
        'featured',
        'status',
    ];

    protected $casts = [
        'keywords' => 'array',
        'published_at' => 'datetime',
        'featured' => 'boolean',
    ];

    public function getFormattedDateAttribute()
    {
        return $this->published_at->format('F j, Y');
    }

    public function getExcerptAttribute()
    {
        return \Str::limit($this->description, 160);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }
}`;
}

function generateMigration(article: any): string {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  
  return `<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('blog_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->longText('content');
            $table->longText('html_content');
            $table->string('author')->default('TAS Outsourcing');
            $table->string('category')->nullable();
            $table->json('keywords')->nullable();
            $table->string('read_time')->nullable();
            $table->boolean('featured')->default(false);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index('slug');
            $table->index('status');
            $table->index('featured');
            $table->index('published_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('blog_articles');
    }
};`;
}

function getRequiredStyles(): string {
  return `/* Blog Article Styles for Laravel */

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
}`;
}