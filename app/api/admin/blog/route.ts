import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';

/**
 * POST /api/admin/blog
 * Create a new blog post
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contentType = request.headers.get('content-type') || '';
    let blogData: any = {};
    let imageFile: any = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      blogData = fields;
      imageFile = file;
      // Save blog image if present
      if (imageFile) {
        const { saveFile } = await import('@/lib/utils/multer');
        const imageUrl = await saveFile(imageFile, 'blog');
        blogData.image = imageUrl;
      }
    } else {
      blogData = await request.json();
    }

    // Parse tags safely
    if (typeof blogData.tags === 'string') {
      const rawTags = blogData.tags.trim();
      if (!rawTags) {
        blogData.tags = [];
      } else {
        blogData.tags = rawTags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(blogData.tags)) {
      blogData.tags = [];
    }

    // Send to backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    const backendFormData = new FormData();
    backendFormData.append('title', blogData.title);
    backendFormData.append('excerpt', blogData.excerpt);
    backendFormData.append('content', blogData.content);
    backendFormData.append('status', blogData.isPublished === 'true' || blogData.isPublished === true ? 'published' : 'draft');
    backendFormData.append('tags', blogData.tags.join(', '));

    // Forward the image file directly if it exists
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      backendFormData.append('image', new File([buffer], imageFile.name, { type: imageFile.type }));
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': token } : {}),
      },
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      throw new Error(`Failed to create blog post in backend: ${backendResponse.statusText}`);
    }

    const backendData = await backendResponse.json();
    return NextResponse.json({ 
      message: 'Blog post created successfully', 
      blog: backendData.data || backendData.blog || backendData 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}

/**
 * GET /api/admin/blog
 * Get all blog posts (admin view)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // TODO: Fetch from database
    const blogs = [
      {
        id: '1',
        title: 'Top 10 Trekking Tips for Beginners',
        slug: 'top-10-trekking-tips-for-beginners',
        content: 'Detailed content here...',
        excerpt: 'Essential tips for your first trek',
        author: 'Admin User',
        authorId: '1',
        image: '/uploads/blog/blog-1.jpg',
        category: 'Tips & Guides',
        tags: ['trekking', 'beginners', 'tips'],
        isPublished: true,
        publishedAt: new Date().toISOString(),
        views: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      blogs,
      pagination: { page, limit, total: blogs.length, totalPages: Math.ceil(blogs.length / limit) },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
