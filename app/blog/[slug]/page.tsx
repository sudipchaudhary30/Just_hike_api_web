'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BlogDetail {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  thumbnailUrl?: string;
  authorName: string;
  authorImage?: string;
  publishedAt?: string;
  createdAt?: string;
  status: 'draft' | 'published';
}

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      setIsLoading(true);
      if (!blogId) {
        setBlog(null);
        return;
      }
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}`);
      const data = await response.json();
      const b = data.data;
      if (b) {
        // Try multiple possible author image field names
        let authorImg = b.author?.image || b.author?.profileImage || b.author?.avatar || b.author?.photo;
        
        // If image exists and is relative path, prepend API URL
        if (authorImg && !authorImg.startsWith('http')) {
          authorImg = `${API_BASE_URL}${authorImg.startsWith('/') ? '' : '/'}${authorImg}`;
        }
        
        setBlog({
          id: b._id,
          title: b.title,
          content: b.content,
          excerpt: b.excerpt,
          tags: b.tags || [],
          imageUrl: b.imageUrl,
          thumbnailUrl: b.thumbnailUrl,
          authorName: b.author?.name || 'Admin',
          authorImage: authorImg,
          publishedAt: b.publishedAt || b.createdAt,
          createdAt: b.createdAt,
          status: b.status || 'published',
        });
        setImageError(false);
      } else {
        setBlog(null);
      }
    } catch (error) {
      console.error('Error fetching blog details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4 font-bold text-slate-900">Not Found</span>
          <p className="text-slate-500 text-lg">Blog post not found</p>
          <Link href="/blog" className="text-[#45D1C1] hover:text-[#3BC1B1] mt-6 inline-block font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(69, 209, 193, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 193, 177, 0.05) 0%, transparent 50%)'
        }}></div>
      </div>

      {/* Hero Image with Premium Styling */}
      <div className="relative h-96 md:h-[32rem] overflow-hidden">
        {blog.imageUrl || blog.thumbnailUrl ? (
          <img
            src={blog.imageUrl || blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#45D1C1] via-[#3BC1B1] to-[#2BA59F]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 z-10 pb-16">
        {/* Content Card - Premium Styling */}
        <article className="bg-white rounded-3xl p-8 md:p-14 border border-slate-100 drop-shadow-xl hover:drop-shadow-2xl transition-all duration-300">
          {/* Back Link - Premium Style */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#45D1C1] hover:text-[#3BC1B1] mb-8 font-semibold transition-all hover:gap-3 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Articles
          </Link>

          {/* Status Badge - Premium */}
          <div className="mb-8">
            <span className="inline-block px-3.5 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded-full text-xs font-bold uppercase tracking-widest drop-shadow-md">
              {blog.status === 'published' ? '✓ Published' : '◯ Draft'}
            </span>
          </div>

          {/* Title - Premium Typography */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-2 leading-tight tracking-tight">
            {blog.title}
          </h1>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full mb-8"></div>

          {/* Author & Date - Premium Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              {blog.authorImage && !imageError ? (
                <img
                  src={blog.authorImage}
                  alt={blog.authorName}
                  className="w-16 h-16 rounded-full object-cover drop-shadow-lg border-2 border-[#45D1C1]"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-[#45D1C1] to-[#3BC1B1] rounded-full flex items-center justify-center text-white font-bold text-xl drop-shadow-lg">
                  {blog.authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900 text-lg">{blog.authorName}</p>
                <p className="text-sm text-slate-500 font-medium">
                  {new Date(blog.publishedAt || blog.createdAt || new Date().toISOString()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-slate-600 text-sm font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#45D1C1]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 2a1 1 0 100 2v4a1 1 0 100-2v-4z" clipRule="evenodd"/></svg>
                <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Content - Enhanced Readability */}
          <div className="prose max-w-none mt-10">
            <div className="text-slate-700 leading-8 space-y-6">
              {blog.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-4xl font-bold text-slate-900 mt-10 mb-4 pt-2">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                } else if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-slate-900 mt-8 mb-4 pt-2 border-l-4 border-[#45D1C1] pl-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Tags - Premium Style */}
          <div className="mt-14 pt-10 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-widest">Topics Covered</h3>
            <div className="flex flex-wrap gap-3">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-[#45D1C1]/5 to-[#3BC1B1]/5 text-slate-700 rounded-full text-sm font-semibold hover:from-[#45D1C1]/15 hover:to-[#3BC1B1]/15 hover:text-[#45D1C1] transition-all cursor-pointer border border-[#45D1C1]/20 hover:border-[#45D1C1]/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Share Section - Premium Design */}
        <div className="mt-16 pt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-600 mb-1 font-semibold">Share this article</p>
            <p className="text-slate-500 text-sm mb-8">Help others discover this story</p>
            <div className="flex justify-center gap-3">
              <button className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:border-[#45D1C1] hover:bg-[#45D1C1] hover:text-white hover:scale-110 transition-all duration-300 font-bold text-lg drop-shadow-md">
                𝕏
              </button>
              <button className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:border-[#45D1C1] hover:bg-[#45D1C1] hover:text-white hover:scale-110 transition-all duration-300 font-bold text-base drop-shadow-md">
                f
              </button>
              <button className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center hover:border-[#45D1C1] hover:bg-[#45D1C1] hover:text-white hover:scale-110 transition-all duration-300 font-bold text-lg drop-shadow-md">
                🔗
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts - Premium */}
        <div className="mt-20 pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">More Articles</h2>
          <p className="text-slate-600 mb-8 font-medium">Continue reading our latest stories</p>
          <div className="bg-gradient-to-br from-[#45D1C1]/5 to-[#3BC1B1]/5 border border-[#45D1C1]/20 rounded-2xl p-12 text-center hover:border-[#45D1C1]/50 transition-all">
            <span className="text-6xl block mb-4">🗞️</span>
            <p className="text-slate-600 font-semibold">More articles coming soon...</p>
            <p className="text-slate-500 text-sm mt-2">Check back later for fresh content</p>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}
