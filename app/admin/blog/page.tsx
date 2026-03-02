'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { toast } from 'react-hot-toast';

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

const pickBlogImage = (blog: any) => {
  return (
    blog?.imageUrl ||
    blog?.thumbnailUrl ||
    blog?.thumbnail ||
    blog?.thumb ||
    blog?.image ||
    blog?.featuredImage ||
    blog?.coverImage ||
    blog?.imagePath ||
    blog?.image_path ||
    blog?.bannerImage ||
    blog?.heroImage ||
    blog?.media?.thumbnailUrl ||
    blog?.media?.imageUrl ||
    blog?.media?.path ||
    blog?.images?.thumbnail ||
    blog?.images?.image ||
    blog?.images?.cover ||
    blog?.files?.image ||
    blog?.files?.thumbnail ||
    (blog?.imageFileName ? `/uploads/blog/${blog.imageFileName}` : undefined)
  );
};

function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogAdminItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFallbacks, setImageFallbacks] = useState<Record<string, boolean>>({});
  const ITEMS_PER_PAGE = 10;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredBlogs = blogs.filter((blog) => {
    if (!normalizedQuery) return true;

    return (
      blog.title.toLowerCase().includes(normalizedQuery) ||
      blog.authorName.toLowerCase().includes(normalizedQuery) ||
      blog.status.toLowerCase().includes(normalizedQuery)
    );
  });

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`/api/admin/blog?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      
      const data = await response.json();
      const list = data?.data || data?.blogs || data?.results || [];
      const pagination = data?.pagination || {};
      const resolvedTotalPages = Math.max(1, Number(pagination.totalPages) || 1);

      setTotalPages(resolvedTotalPages);

      if (page > resolvedTotalPages) {
        setCurrentPage(resolvedTotalPages);
        return;
      }

      const mapped: BlogAdminItem[] = (Array.isArray(list) ? list : []).map((blog: any) => ({
        id: blog._id || blog.id,
        title: blog.title,
        status: blog.status || (blog.isPublished ? 'published' : 'draft'),
        authorName: blog.author?.name || 'Admin',
        imageUrl: pickBlogImage(blog),
        thumbnailUrl: pickBlogImage(blog),
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
      }));
      setBlogs(mapped);
      setImageFallbacks({});
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      }
      setBlogs([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Blog post deleted successfully');
        setConfirmDeleteId(null);
        fetchBlogs(currentPage);
      } else {
        toast.error('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog post');
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedBlogForDelete = confirmDeleteId
    ? blogs.find((blog) => blog.id === confirmDeleteId)
    : null;

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

          <div className="mt-6">
            <label htmlFor="blog-search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search Blog Posts
            </label>
            <input
              id="blog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or status..."
              className="w-full md:max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1] focus:border-transparent transition-all duration-300"
            />
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
                      Status
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
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {blog.thumbnailUrl || blog.imageUrl ? (
                              <img
                                src={(imageFallbacks[blog.id] ? blog.thumbnailUrl : blog.imageUrl) || blog.thumbnailUrl}
                                alt={blog.title}
                                className="h-12 w-12 rounded object-cover"
                                onError={() => {
                                  if (!imageFallbacks[blog.id] && blog.imageUrl && blog.thumbnailUrl && blog.imageUrl !== blog.thumbnailUrl) {
                                    setImageFallbacks((prev) => ({ ...prev, [blog.id]: true }));
                                  }
                                }}
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
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status}
                        </span>
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
                          className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/blog/${blog.id}/edit`}
                          className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(blog.id)}
                          className="inline-block px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white rounded font-semibold hover:opacity-90 transition"
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

        {!isLoading && blogs.length > 0 && filteredBlogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-6">
            <p className="text-gray-600 text-lg font-medium">No matching blog posts found</p>
            <p className="text-gray-500 mt-2">Try a different keyword for your search.</p>
          </div>
        )}

        {!isLoading && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {getVisiblePages().map((page, index) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-[#45D1C1] hover:text-[#45D1C1]'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                if (!isDeleting) setConfirmDeleteId(null);
              }}
            />

            <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
              <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] rounded-full text-white text-xs font-semibold uppercase tracking-wide mb-4">
                Confirm Action
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete blog post?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone.
                {selectedBlogForDelete ? (
                  <>
                    {' '}You are deleting <span className="font-semibold text-gray-800">{selectedBlogForDelete.title}</span>.
                  </>
                ) : null}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] hover:opacity-90 disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
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
