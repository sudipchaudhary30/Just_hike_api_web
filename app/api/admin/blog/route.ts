import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

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
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      blogData = fields;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.name);
        const filename = 'blog-' + uniqueSuffix + ext;
        
        const fs = require('fs').promises;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);
        imageUrl = `/uploads/blog/${filename}`;
        blogData.image = imageUrl;
      }
    } else {
      blogData = await request.json();
    }

    // Parse tags array
    if (typeof blogData.tags === 'string') {
      blogData.tags = JSON.parse(blogData.tags);
    }

    // Generate slug from title
    const slug = blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // TODO: Save to database
    const newBlog = {
      id: Date.now().toString(),
      ...blogData,
      slug,
      author: authResult.user.name,
      authorId: authResult.user.id,
      isPublished: blogData.isPublished === 'true' || blogData.isPublished === true,
      publishedAt: blogData.isPublished ? new Date().toISOString() : null,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: 'Blog post created successfully', blog: newBlog }, { status: 201 });
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
