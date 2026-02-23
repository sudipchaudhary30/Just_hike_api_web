import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import mongoose from 'mongoose';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

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
        packageData.imageUrl = imageUrl;
        packageData.thumbnailUrl = imageUrl;
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

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const now = new Date();
    const normalized = {
      ...packageData,
      title: packageData.title || packageData.name,
      name: packageData.name || packageData.title,
      durationDays: Number(packageData.durationDays || packageData.duration || 0),
      price: Number(packageData.price || 0),
      maxGroupSize: Number(packageData.maxGroupSize || 0),
      availableSlots: Number(packageData.availableSlots || packageData.maxGroupSize || 0),
      isActive: packageData.isActive === 'true' || packageData.isActive === true,
      createdAt: now,
      updatedAt: now,
    };

    const created = await TrekModel.create(normalized);
    const saved = created.toObject();
    const responsePackage = {
      ...saved,
      id: saved._id?.toString() || saved.id,
    };

    return NextResponse.json({ message: 'Trek package created successfully', package: responsePackage }, { status: 201 });
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

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const filter: any = {};
    if (difficulty) filter.difficulty = difficulty;
    if (isActive !== '') filter.isActive = isActive === 'true';

    const total = await TrekModel.countDocuments(filter);
    const packages = await TrekModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const transformed = packages.map((pkg: any) => ({
      ...pkg,
      id: pkg._id?.toString() || pkg.id,
    }));

        return NextResponse.json({
          total,
          packages: transformed,
          page,
          limit,
        }, { status: 200 });
      } catch (error: any) {
        console.error('Error fetching trek packages:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch trek packages' }, { status: 500 });
      }
    }
