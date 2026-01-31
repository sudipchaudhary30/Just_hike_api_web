import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/blog
 * Public endpoint to get published blog posts
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const category = searchParams.get('category') || '';

    // TODO: Fetch from database (only published posts)
    const blogs = [
      {
        id: '1',
        title: 'Top 10 Trekking Tips for Beginners',
        slug: 'top-10-trekking-tips-for-beginners',
        excerpt: 'Essential tips to prepare for your first trekking adventure in the mountains.',
        author: 'Admin User',
        image: '/uploads/blog/tips.jpg',
        category: 'Tips & Guides',
        tags: ['trekking', 'beginners', 'tips'],
        publishedAt: '2026-01-20T10:00:00Z',
        views: 150,
      },
      {
        id: '2',
        title: 'Best Time to Visit Everest Base Camp',
        slug: 'best-time-to-visit-everest-base-camp',
        excerpt: 'Discover the optimal seasons for trekking to Everest Base Camp and what to expect.',
        author: 'Admin User',
        image: '/uploads/blog/everest-season.jpg',
        category: 'Destinations',
        tags: ['everest', 'nepal', 'seasons'],
        publishedAt: '2026-01-15T10:00:00Z',
        views: 203,
      },
      {
        id: '3',
        title: 'Essential Gear for High Altitude Trekking',
        slug: 'essential-gear-for-high-altitude-trekking',
        excerpt: 'Complete packing list for high altitude treks to ensure safety and comfort.',
        author: 'Admin User',
        image: '/uploads/blog/gear.jpg',
        category: 'Tips & Guides',
        tags: ['gear', 'equipment', 'packing'],
        publishedAt: '2026-01-10T10:00:00Z',
        views: 178,
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
