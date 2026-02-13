import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * GET /api/admin/trek-packages/:id
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const packageId = params.id;

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const trekDoc = await TrekModel.findById(packageId).lean();
    if (!trekDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }

    const trekPackage = {
      ...trekDoc,
      id: trekDoc._id?.toString() || trekDoc.id,
    };

    return NextResponse.json({ package: trekPackage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/trek-packages/:id
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const packageId = params.id;
    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      updateData = fields;

      if (file) {
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
        updateData.imageUrl = imageUrl;
        updateData.thumbnailUrl = imageUrl;
      }
    } else {
      updateData = await request.json();
    }

    // Parse array fields
    if (typeof updateData.inclusions === 'string') {
      updateData.inclusions = JSON.parse(updateData.inclusions);
    }
    if (typeof updateData.exclusions === 'string') {
      updateData.exclusions = JSON.parse(updateData.exclusions);
    }

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const normalized = {
      ...updateData,
      title: updateData.title || updateData.name,
      name: updateData.name || updateData.title,
      durationDays: updateData.durationDays ? Number(updateData.durationDays) : undefined,
      price: updateData.price ? Number(updateData.price) : undefined,
      maxGroupSize: updateData.maxGroupSize ? Number(updateData.maxGroupSize) : undefined,
      availableSlots: updateData.availableSlots ? Number(updateData.availableSlots) : undefined,
      isActive: updateData.isActive === 'true' || updateData.isActive === true,
      updatedAt: new Date(),
    };

    const updatedDoc = await TrekModel.findByIdAndUpdate(packageId, normalized, { new: true, lean: true });
    if (!updatedDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }

    const updatedPackage = {
      ...updatedDoc,
      id: updatedDoc._id?.toString() || updatedDoc.id,
    };

    return NextResponse.json({ message: 'Trek package updated successfully', package: updatedPackage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/trek-packages/:id
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const packageId = params.id;

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const deleted = await TrekModel.findByIdAndDelete(packageId);
    if (!deleted) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Trek package deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
