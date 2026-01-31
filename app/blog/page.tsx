'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogListItem {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  authorName: string;
  publishedAt?: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const response = await fetch(`${API_BASE_URL}/api/blogs`);
      const data = await response.json();
      const mappedBlogs: BlogListItem[] = (data.data || []).map((blog: any) => ({
        id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        tags: blog.tags || [],
        imageUrl: blog.imageUrl,
        thumbnailUrl: blog.thumbnailUrl,
        authorName: blog.author?.name || 'Admin',
        publishedAt: blog.publishedAt || blog.createdAt,
      }));
      setBlogs(mappedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Trek Stories & Insights
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Discover expert tips, trail guides, and inspiring adventure stories from our community
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105">
                Latest Articles ✍️
              </button>
              <button className="px-8 py-3 border border-green-500/30 text-green-400 rounded-lg font-semibold hover:border-green-400 hover:bg-green-500/10 transition-all duration-300">
                Browse Categories 📚
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
            </div>
          </div>
        ) : blogs.length > 0 ? (
          <>
            {/* Featured Blog */}
            {blogs.length > 0 && (
              <div className="mb-16">
                <Link href={`/blog/${blogs[0].id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl h-96 md:h-[28rem]">
                      {blogs[0].thumbnailUrl || blogs[0].imageUrl ? (
                        <img
                          src={blogs[0].thumbnailUrl || blogs[0].imageUrl}
                          alt={blogs[0].title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-8xl">📝</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-4 py-2 bg-green-500/90 backdrop-blur-md text-white rounded-full text-sm font-semibold mb-4">
                          ⭐ Featured
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
                          {blogs[0].title}
                        </h2>
                        <p className="text-slate-200 line-clamp-2 mb-4">
                          {blogs[0].excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">
                            By {blogs[0].authorName} • {blogs[0].publishedAt ? new Date(blogs[0].publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </span>
                          <span className="text-green-400 font-semibold group-hover:translate-x-2 transition-transform">Read →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Blog Grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-8">Latest Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(1).map((blog) => (
                  <Link href={`/blog/${blog.id}`} key={blog.id}>
                    <div className="group cursor-pointer h-full">
                      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 h-full flex flex-col hover:shadow-lg hover:shadow-green-500/20">
                        {/* Blog Image */}
                        <div className="relative h-48 overflow-hidden">
                          {blog.thumbnailUrl || blog.imageUrl ? (
                            <img
                              src={blog.thumbnailUrl || blog.imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-5xl">📝</span>
                            </div>
                          )}
                        </div>

                        {/* Blog Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full font-semibold">
                              Article
                            </span>
                            <span className="text-xs text-slate-400">
                              {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-green-400 transition-colors">
                            {blog.title}
                          </h3>

                          <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                            <span className="text-xs text-slate-400">
                              By {blog.authorName}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {blog.tags.slice(0, 1).map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-slate-700/50 text-slate-300 rounded">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📖</span>
            <p className="text-slate-400 text-lg">No blog posts found</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
