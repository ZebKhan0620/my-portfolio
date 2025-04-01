'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import blogService, { Blog } from '@/services/blogService';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';

// Format date to readable string
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export default function BlogPostPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug || typeof slug !== 'string') {
        setError('Invalid blog slug');
        setLoading(false);
        return;
      }

      try {
        const blogData = await blogService.getBlogBySlug(slug);
        setBlog(blogData);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load the blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Split blog content into paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-6 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 max-w-md">
                <h2 className="text-xl font-semibold text-amber-400 mb-2">Error</h2>
                <p className="text-white/80 mb-6">{error}</p>
                <Link
                  href="/blog"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-emerald-400 hover:bg-emerald-500 transition-colors"
                >
                  Back to blog
                </Link>
              </div>
            </div>
          )}

          {/* Blog content */}
          {blog && !loading && (
            <article className="bg-gray-900/50 rounded-2xl p-6 sm:p-8 md:p-10 border border-white/5 shadow-xl">
              {/* Back button */}
              <div className="mb-8">
                <Link
                  href="/#blog"
                  className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all articles
                </Link>
              </div>

              {/* Blog header */}
              <header className="mb-10">
                <div className="flex items-center text-emerald-400 text-sm mb-3">
                  <time dateTime={blog.publishedAt || blog.createdAt || ''}>
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </time>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium mb-6">
                  {blog.title}
                </h1>
              </header>

              {/* Featured image */}
              {blog.imageUrl && (
                <div className="relative aspect-video mb-10 rounded-xl overflow-hidden">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
                  />
                </div>
              )}

              {/* Blog content */}
              <div className="prose prose-lg prose-invert max-w-none">
                {formatContent(blog.content)}
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 