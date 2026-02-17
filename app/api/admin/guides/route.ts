import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';

/**
 * POST /api/admin/guides
 * Create a new guide with image upload
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contentType = request.headers.get('content-type') || '';
    let guideData: any = {};
    let imageFile: any = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      guideData = fields;
      imageFile = file;
    } else {
      guideData = await request.json();
    }

    // Parse languages array if string
    if (typeof guideData.languages === 'string') {
      guideData.languages = JSON.parse(guideData.languages);
    }

    // Send to backend API
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    const backendFormData = new FormData();
    backendFormData.append('name', guideData.name);
    backendFormData.append('email', guideData.email);
    backendFormData.append('phoneNumber', guideData.phoneNumber);
    backendFormData.append('bio', guideData.bio);
    backendFormData.append('experienceYears', guideData.experienceYears);
    backendFormData.append('languages', JSON.stringify(guideData.languages || []));

    // Forward the image file directly if it exists
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      backendFormData.append('image', new File([buffer], imageFile.name, { type: imageFile.type }));
    }

    const backendResponse = await fetch(`${API_BASE_URL}/api/guides`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': token } : {}),
      },
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      throw new Error(`Failed to create guide in backend: ${backendResponse.statusText}`);
    }

    const backendData = await backendResponse.json();
    return NextResponse.json({ 
      message: 'Guide created successfully', 
      guide: backendData.data || backendData.guide || backendData 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create guide' }, { status: 500 });
  }
}

/**
 * GET /api/admin/guides
 * Get all guides
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

    // TODO: Replace with actual database query
    const guides = [
      {
        id: '1',
        name: 'Tenzing Sherpa',
        email: 'tenzing@example.com',
        phone: '+977-9841234567',
        experience: 15,
        expertise: ['High altitude trekking', 'Mountain rescue', 'First aid'],
        bio: 'Experienced mountain guide with 15 years of expertise in Himalayan treks',
        image: '/uploads/guides/tenzing.jpg',
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      guides,
      pagination: { page, limit, total: guides.length, totalPages: Math.ceil(guides.length / limit) },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
