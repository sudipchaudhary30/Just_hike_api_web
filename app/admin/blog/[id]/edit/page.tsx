'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { getAuthHeaders } from '@/lib/auth';

function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const blogId = params?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    isPublished: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) return;

      setIsFetching(true);
      try {
        const headers = getAuthHeaders();
        const response = await fetch(`/api/admin/blog/${blogId}`, {
          method: 'GET',
          headers,
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || 'Failed to load blog post');
          router.push('/admin/blog');
          return;
        }

        const blog = data.blog || {};
        setFormData({
          title: blog.title || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
          isPublished: blog.isPublished || false,
        });
      } catch (error) {
        console.error('Error loading blog:', error);
        alert('Failed to load blog post');
        router.push('/admin/blog');
      } finally {
        setIsFetching(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0] || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogId) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('content', formData.content);
      submitData.append('isPublished', formData.isPublished.toString());

      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      submitData.append('tags', tagsArray.join(', '));

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const headers = getAuthHeaders();
      const response = await fetch(`/api/admin/blog/${blogId}`, {
        method: 'PUT',
        headers,
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Blog post updated successfully!');
        router.push('/admin/blog');
      } else {
        alert(data.error || data.message || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          Loading blog post...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-600 mt-2">Update blog article details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="Enter blog post title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="Write a brief excerpt for the blog post"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="Write the full blog post content"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated) *
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
              placeholder="tips, guides, hiking"
            />
            <p className="text-sm text-gray-500 mt-1">Enter multiple tags separated by commas</p>
          </div>

          {/* Published */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-[#45D1C1] rounded focus:ring-2 focus:ring-[#45D1C1] cursor-pointer"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Publish this post</span>
            </label>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#45D1C1]"
            />
            <p className="text-sm text-gray-500 mt-1">Upload a new image only if you want to replace the current one</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#45D1C1] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Updating...' : 'Update Post'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditBlogPageWrapper() {
  return (
    <ProtectedRoute requireAdmin>
      <EditBlogPage />
    </ProtectedRoute>
  );
}
