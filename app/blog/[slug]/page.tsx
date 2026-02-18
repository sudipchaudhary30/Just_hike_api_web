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
  publishedAt?: string;
  createdAt?: string;
  status: 'draft' | 'published';
}

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setBlog({
          id: b._id,
          title: b.title,
          content: b.content,
          excerpt: b.excerpt,
          tags: b.tags || [],
          imageUrl: b.imageUrl,
          thumbnailUrl: b.thumbnailUrl,
          authorName: b.author?.name || 'Admin',
          publishedAt: b.publishedAt || b.createdAt,
          createdAt: b.createdAt,
          status: b.status || 'published',
        });
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-900 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full animate-spin"></div>
          <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl block mb-4 font-bold">Not Found</span>
          <p className="text-slate-400 text-lg">Blog post not found</p>
          <Link href="/blog" className="text-green-400 hover:text-green-300 mt-6 inline-block font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 md:h-[28rem] overflow-hidden">
        {blog.imageUrl || blog.thumbnailUrl ? (
          <img
            src={blog.imageUrl || blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#45D1C1] to-[#3BC1B1]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 z-10 pb-12">
        {/* Content Card */}
        <article className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Back Link */}
          <Link href="/blog" className="text-[#45D1C1] hover:text-[#3BC1B1] mb-8 font-semibold flex items-center gap-2 hover:gap-3 transition-all w-fit">
            ← Back to Articles
          </Link>

          {/* Status Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded-full text-xs font-bold uppercase tracking-wide">
              {blog.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-8 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#45D1C1] to-[#3BC1B1] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {blog.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white">{blog.authorName}</p>
                <p className="text-sm text-slate-400">
                  {new Date(blog.publishedAt || blog.createdAt || new Date().toISOString()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>Read</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 leading-relaxed space-y-4">
              {blog.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
                      {paragraph.replace('# ', '')}
                    </h1>
                  );
                } else if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                } else if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.trim()) {
                  return (
                    <p key={index} className="text-slate-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-slate-700/50 text-slate-300 rounded-full text-sm hover:bg-[#45D1C1]/20 hover:text-[#45D1C1] transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Share Section */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Share this article</p>
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:border-[#45D1C1]/50 hover:bg-[#45D1C1]/20 transition-all text-xl">
              𝕏
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:border-[#45D1C1]/50 hover:bg-[#45D1C1]/20 transition-all text-xl">
              FB
            </button>
            <button className="w-12 h-12 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:border-[#45D1C1]/50 hover:bg-[#45D1C1]/20 transition-all text-xl">
              Link
            </button>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">More Articles</h2>
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 text-center">
            <span className="text-5xl block mb-4">🗞️</span>
            <p className="text-slate-400">More articles coming soon...</p>
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
