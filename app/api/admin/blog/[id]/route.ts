import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData } from '@/lib/utils/multer';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${API_BASE_URL}/api/blogs/${params.id}`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend blog service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to fetch blog';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();
    const blog = backendData?.data || backendData?.blog || backendData;
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
    let incomingImageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      updateData = fields;
      incomingImageFile = file;
    } else {
      updateData = await request.json();
    }

    if (typeof updateData.tags === 'string') {
      const rawTags = updateData.tags.trim();
      if (!rawTags) {
        updateData.tags = [];
      } else {
        updateData.tags = rawTags
          .split(',')
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(updateData.tags)) {
      updateData.tags = [];
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    const backendFormData = new FormData();
    if (updateData.title !== undefined) backendFormData.append('title', String(updateData.title));
    if (updateData.excerpt !== undefined) backendFormData.append('excerpt', String(updateData.excerpt));
    if (updateData.content !== undefined) backendFormData.append('content', String(updateData.content));
    if (updateData.isPublished !== undefined) backendFormData.append('isPublished', String(updateData.isPublished));
    backendFormData.append('tags', updateData.tags.join(', '));

    if (incomingImageFile) {
      const bytes = await incomingImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      backendFormData.append('image', new File([buffer], incomingImageFile.name, { type: incomingImageFile.type }));
    }

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${API_BASE_URL}/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
        body: backendFormData,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend blog service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to update blog';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();
    return NextResponse.json(
      {
        message: 'Blog post updated successfully',
        blog: backendData?.data || backendData?.blog || backendData,
      },
      { status: 200 }
    );
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

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${API_BASE_URL}/api/blogs/${params.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend blog service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to delete blog';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

