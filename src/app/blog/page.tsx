'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

// Create excerpt from content
const createExcerpt = (content: string, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiBlogs = await blogService.getAllBlogs();
        setBlogs(apiBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-screen-xl">
          {/* Page header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">Blog</span></h1>
            <p className="mt-3 sm:mt-4 md:mt-6 text-white/70 text-base sm:text-lg">
              Thoughts, stories and ideas about web development and design
            </p>
            
            {/* Error message display */}
            {error && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 mx-auto max-w-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center min-h-[30vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          )}

          {/* No blogs message */}
          {!loading && blogs.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-white/60 text-xl">No blog posts available at the moment.</p>
              <Link
                href="/"
                className="inline-flex items-center mt-6 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-emerald-400 hover:bg-emerald-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>
          )}

          {/* Blog grid */}
          {!loading && blogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogs.map((blog) => (
                <Link 
                  href={`/blog/${blog.slug}`} 
                  key={blog.id}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-colors duration-300 flex flex-col h-full transform hover:-translate-y-1 transition-transform"
                >
                  {/* Blog image */}
                  <div className="aspect-video relative overflow-hidden">
                    {blog.imageUrl ? (
                      <Image
                        src={blog.imageUrl}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-sky-600/20 flex items-center justify-center">
                        <span className="text-white/30 text-xl">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80"></div>
                  </div>
                  
                  {/* Blog content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow">
                    <div className="text-emerald-400 text-xs sm:text-sm font-medium mb-2">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif mb-2 group-hover:text-emerald-400 transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-white/60 text-sm sm:text-base mb-4 flex-grow">
                      {createExcerpt(blog.content)}
                    </p>
                    <div className="flex items-center mt-auto pt-4 border-t border-white/10">
                      <span className="text-emerald-400 font-medium text-sm group-hover:underline">Read article</span>
                      <svg 
                        className="w-4 h-4 ml-1 text-emerald-400 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Back to home */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 