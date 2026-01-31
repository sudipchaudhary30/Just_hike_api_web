import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

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
    // TODO: Fetch from database
    const trekPackage = {
      id: packageId,
      name: 'Everest Base Camp Trek',
      description: 'Experience the ultimate Himalayan adventure',
      duration: 12,
      difficulty: 'Challenging',
      price: 1200,
      image: '/uploads/treks/everest.jpg',
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
        updateData.image = imageUrl;
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

    // TODO: Update in database
    const updatedPackage = {
      id: packageId,
      ...updateData,
      updatedAt: new Date().toISOString(),
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
    // TODO: Delete from database

    return NextResponse.json({ message: 'Trek package deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
