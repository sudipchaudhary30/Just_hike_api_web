import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

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
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      guideData = fields;

      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.name);
        const filename = 'guide-' + uniqueSuffix + ext;
        
        const fs = require('fs').promises;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'guides');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);
        imageUrl = `/uploads/guides/${filename}`;
        guideData.image = imageUrl;
      }
    } else {
      guideData = await request.json();
    }

    // Parse expertise array
    if (typeof guideData.expertise === 'string') {
      guideData.expertise = JSON.parse(guideData.expertise);
    }

    // TODO: Save to database
    const newGuide = {
      id: Date.now().toString(),
      ...guideData,
      experience: parseInt(guideData.experience),
      isAvailable: guideData.isAvailable === 'true' || guideData.isAvailable === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: 'Guide created successfully', guide: newGuide }, { status: 201 });
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
