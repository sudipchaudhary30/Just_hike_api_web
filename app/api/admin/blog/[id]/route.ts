import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // TODO: Fetch from database
    const blog = { id: params.id, title: 'Sample Blog', content: 'Content here...' };
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      updateData = fields;

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
        updateData.image = `/uploads/blog/${filename}`;
      }
    } else {
      updateData = await request.json();
    }

    if (typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }

    // TODO: Update in database
    return NextResponse.json({ message: 'Blog post updated successfully', blog: { id: params.id, ...updateData } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // TODO: Delete from database
    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
