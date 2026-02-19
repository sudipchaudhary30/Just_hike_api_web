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
      backendResponse = await fetch(`${API_BASE_URL}/api/guides/${params.id}`, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend guide service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to fetch guide';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    const backendData = await backendResponse.json();
    const guide = backendData?.data || backendData?.guide || backendData;
    return NextResponse.json({ guide }, { status: 200 });
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

    if (typeof updateData.languages === 'string') {
      const rawLanguages = updateData.languages.trim();
      if (!rawLanguages) {
        updateData.languages = [];
      } else {
        updateData.languages = rawLanguages
          .split(',')
          .map((lang: string) => lang.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(updateData.languages)) {
      updateData.languages = [];
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const token = request.headers.get('authorization');

    const backendFormData = new FormData();
    if (updateData.name !== undefined) backendFormData.append('name', String(updateData.name));
    if (updateData.email !== undefined) backendFormData.append('email', String(updateData.email));
    if (updateData.phoneNumber !== undefined) backendFormData.append('phoneNumber', String(updateData.phoneNumber));
    if (updateData.bio !== undefined) backendFormData.append('bio', String(updateData.bio));
    if (updateData.experienceYears !== undefined) backendFormData.append('experienceYears', String(updateData.experienceYears));
    backendFormData.append('languages', updateData.languages.join(', '));

    if (incomingImageFile) {
      const bytes = await incomingImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      backendFormData.append('image', new File([buffer], incomingImageFile.name, { type: incomingImageFile.type }));
    }

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${API_BASE_URL}/api/guides/${params.id}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
        body: backendFormData,
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend guide service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to update guide';
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
        message: 'Guide updated successfully',
        guide: backendData?.data || backendData?.guide || backendData,
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
      backendResponse = await fetch(`${API_BASE_URL}/api/guides/${params.id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error?.message || 'Failed to reach backend guide service' },
        { status: 502 }
      );
    }

    if (!backendResponse.ok) {
      let backendError = backendResponse.statusText || 'Failed to delete guide';
      try {
        const payload = await backendResponse.json();
        backendError = payload?.message || payload?.error || backendError;
      } catch {
        // keep status text
      }

      return NextResponse.json({ error: backendError }, { status: backendResponse.status });
    }

    return NextResponse.json({ message: 'Guide deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
