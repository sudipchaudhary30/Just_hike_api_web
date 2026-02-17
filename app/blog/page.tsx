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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags || [])));
  const filteredBlogs = selectedTag
    ? blogs.filter(blog => blog.tags && blog.tags.includes(selectedTag))
    : blogs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-blue-50/50 pt-20 pb-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Trek Stories & Guides
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Expert tips, trail guides, and inspiring adventure stories from mountain enthusiasts
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white pt-0 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mb-16">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Filter by Topic</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedTag === null
                      ? 'bg-[#45D1C1] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Articles
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                      selectedTag === tag
                        ? 'bg-[#45D1C1] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45D1C1]"></div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              {/* Featured Blog */}
              {filteredBlogs.length > 0 && (
                <div className="mb-20">
                  <Link href={`/blog/${filteredBlogs[0].id}`}>
                    <div className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                        {/* Featured Image */}
                        <div className="relative h-80 lg:h-96 overflow-hidden">
                          {filteredBlogs[0].thumbnailUrl || filteredBlogs[0].imageUrl ? (
                            <img
                              src={filteredBlogs[0].thumbnailUrl || filteredBlogs[0].imageUrl}
                              alt={filteredBlogs[0].title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#45D1C1]/20 to-[#3BC1B1]/20 flex items-center justify-center">
                              <svg className="w-16 h-16 text-[#45D1C1]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 5.591 3.824 10.404 9 11.623m0-13c5.5 0 10-4.745 10-10.999C22 5.004 17.5.25 12 .25m0 13v13m0-13C6.5 30.253 2 25.498 2 19.495" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Featured Content */}
                        <div className="p-8 lg:p-12 flex flex-col justify-between">
                          <div>
                            <div className="inline-block px-3 py-1 bg-[#45D1C1]/20 text-[#45D1C1] rounded-full text-sm font-semibold mb-4">
                              Featured Article
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 line-clamp-3 group-hover:text-[#45D1C1] transition-colors">
                              {filteredBlogs[0].title}
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                              {filteredBlogs[0].excerpt}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-[#45D1C1]/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-[#45D1C1]">{filteredBlogs[0].authorName.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{filteredBlogs[0].authorName}</p>
                                <p className="text-gray-500 text-xs">
                                  {filteredBlogs[0].publishedAt
                                    ? new Date(filteredBlogs[0].publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : ''}
                                </p>
                              </div>
                            </div>
                            <button className="px-6 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-all duration-300 shadow hover:shadow-lg">
                              Read
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Blog Grid */}
              {filteredBlogs.length > 1 && (
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-12">Latest Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.slice(1).map((blog) => (
                      <Link href={`/blog/${blog.id}`} key={blog.id}>
                        <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                          {/* Blog Image */}
                          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#45D1C1]/20 to-[#3BC1B1]/20">
                            {blog.thumbnailUrl || blog.imageUrl ? (
                              <img
                                src={blog.thumbnailUrl || blog.imageUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-[#45D1C1]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 5.591 3.824 10.404 9 11.623m0-13c5.5 0 10-4.745 10-10.999C22 5.004 17.5.25 12 .25m0 13v13m0-13C6.5 30.253 2 25.498 2 19.495" />
                                </svg>
                              </div>
                            )}

                            {/* Tag Badge */}
                            {blog.tags && blog.tags.length > 0 && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-[#45D1C1]/90 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                  {blog.tags[0]}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Blog Info */}
                          <div className="p-6 flex flex-col justify-between flex-1">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#45D1C1] transition-colors">
                                {blog.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {blog.excerpt}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#45D1C1]/20 flex items-center justify-center">
                                  <span className="text-xs font-bold text-[#45D1C1]">{blog.authorName.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-900">{blog.authorName}</p>
                                  {blog.publishedAt && (
                                    <p className="text-xs text-gray-500">
                                      {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-all duration-300 shadow hover:shadow-lg">
                                Read
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600">No blog posts match your selection. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
