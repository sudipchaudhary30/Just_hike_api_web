'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';

interface BlogAdminItem {
  id: string;
  title: string;
  status: 'draft' | 'published';
  authorName: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  createdAt?: string;
}

function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_BASE_URL}/api/blogs/admin/all`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      
      const data = await response.json();
      const mapped: BlogAdminItem[] = (data.data || []).map((blog: any) => ({
        id: blog._id,
        title: blog.title,
        status: blog.status,
        authorName: blog.author?.name || 'Admin',
        imageUrl: blog.imageUrl,
        thumbnailUrl: blog.thumbnailUrl,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
      }));
      setBlogs(mapped);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        alert('Blog post deleted successfully');
        fetchBlogs();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: currentStatus ? 'draft' : 'published' }),
      });

      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
            Management
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-gray-600 mt-2 text-lg">Create, publish, and manage blog content</p>
            </div>
            <Link
              href="/admin/blog/create"
              className="bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              ＋ New Post
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="inline-flex animate-spin h-16 w-16 text-[#45D1C1] mb-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Loading blog posts...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publish
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {blog.thumbnailUrl || blog.imageUrl ? (
                              <img
                                src={blog.thumbnailUrl || blog.imageUrl}
                                alt={blog.title}
                                className="h-12 w-12 rounded object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                                DOC
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {blog.title}
                            </div>
                            <div className="text-xs text-gray-500">{blog.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.authorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(blog.id, blog.status === 'published')}
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          {blog.status === 'published' ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        —
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString()
                          : blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString()
                            : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/blog/${blog.id}`}
                          target="_blank"
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/blog/${blog.id}/edit`}
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#45D1C1] hover:bg-[#3BC1B1]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg mb-4">No blog posts found</p>
            <Link
              href="/admin/blog/create"
              className="inline-block bg-[#45D1C1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors"
            >
              Create First Blog Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminBlogPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminBlogPage />
    </ProtectedRoute>
  );
}
