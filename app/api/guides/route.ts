import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/guides
 * Public endpoint to get all guides
 * Forwards to backend API
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search') || '';

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);

    // Forward to backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const backendResponse = await fetch(`${API_BASE_URL}/api/guides?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      console.warn(`Backend guides API returned ${backendResponse.status}: ${backendResponse.statusText}`);
      return NextResponse.json({
        data: [],
        pagination: { page: parseInt(page), limit: parseInt(limit), total: 0, totalPages: 0 },
      }, { status: 200 });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching guides from backend:', error);
    return NextResponse.json({
      error: error.message || 'Failed to fetch guides',
      data: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    }, { status: 200 });
  }
}
