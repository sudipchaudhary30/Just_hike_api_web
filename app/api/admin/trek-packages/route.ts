import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData, saveFile } from '@/lib/utils/multer';
import path from 'path';

/**
 * POST /api/admin/trek-packages
 * Create a new trek package with image upload
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contentType = request.headers.get('content-type') || '';
    let packageData: any = {};
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      packageData = fields;

      if (file) {
        // Save to trek-packages directory
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.name);
        const filename = 'trek-' + uniqueSuffix + ext;
        
        const fs = require('fs').promises;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'treks');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const filepath = path.join(uploadDir, filename);
        await fs.writeFile(filepath, buffer);
        imageUrl = `/uploads/treks/${filename}`;
        packageData.image = imageUrl;
      }
    } else {
      packageData = await request.json();
    }

    // Parse array fields if they're strings
    if (typeof packageData.inclusions === 'string') {
      packageData.inclusions = JSON.parse(packageData.inclusions);
    }
    if (typeof packageData.exclusions === 'string') {
      packageData.exclusions = JSON.parse(packageData.exclusions);
    }

    // TODO: Save to database
    const newPackage = {
      id: Date.now().toString(),
      ...packageData,
      availableSlots: parseInt(packageData.availableSlots) || parseInt(packageData.maxGroupSize),
      isActive: packageData.isActive === 'true' || packageData.isActive === true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: 'Trek package created successfully', package: newPackage }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating trek package:', error);
    return NextResponse.json({ error: error.message || 'Failed to create trek package' }, { status: 500 });
  }
}

/**
 * GET /api/admin/trek-packages
 * Get all trek packages with pagination and filtering
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
    const difficulty = searchParams.get('difficulty') || '';
    const isActive = searchParams.get('isActive') || '';

    // TODO: Replace with actual database query
    const packages = [
      {
        id: '1',
        name: 'Everest Base Camp Trek',
        description: 'Experience the ultimate Himalayan adventure with stunning views of Mt. Everest',
        duration: 12,
        difficulty: 'Challenging',
        price: 1200,
        maxGroupSize: 12,
        location: 'Nepal, Himalayas',
        altitude: 5364,
        bestSeason: 'March-May, September-November',
        inclusions: ['Accommodation', 'Meals', 'Permits', 'Guide'],
        exclusions: ['Flight tickets', 'Travel insurance', 'Personal expenses'],
        itinerary: 'Day-by-day trek itinerary...',
        image: '/uploads/treks/everest.jpg',
        guideId: '1',
        availableSlots: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      packages,
      pagination: { page, limit, total: packages.length, totalPages: Math.ceil(packages.length / limit) },
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching trek packages:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch trek packages' }, { status: 500 });
  }
}
