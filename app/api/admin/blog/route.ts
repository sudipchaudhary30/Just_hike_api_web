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
      const forwardedFile = new File([buffer], imageFile.name, { type: imageFile.type });
      backendFormData.append('image', forwardedFile);
      backendFormData.append('blogImage', forwardedFile);
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': token } : {}),
      },
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to create blog post in backend';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        try {
          const text = await backendResponse.text();
          if (text) backendError = text;
        } catch {
          // ignore text parse failures
        }
      }

      return NextResponse.json(
        {
          error: backendError,
          backendStatus: backendResponse.status,
          backendPath: '/api/blogs',
        },
        { status: backendResponse.status }
      );
    }

    const backendData = await backendResponse.json();
    return NextResponse.json({ 
      message: 'Blog post created successfully', 
      blog: backendData.data || backendData.blog || backendData 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    );
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

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    const backendResponse = await fetch(`${API_BASE_URL}/api/blogs/admin/all?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
    });

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to fetch blogs';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();
    const list = backendData?.data || backendData?.blogs || backendData?.results || [];
    const pagination = backendData?.pagination || {
      page,
      limit,
      total: Array.isArray(list) ? list.length : 0,
      totalPages: Array.isArray(list) ? Math.ceil(list.length / limit) : 0,
    };

    return NextResponse.json(
      {
        data: Array.isArray(list) ? list : [],
        pagination,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
