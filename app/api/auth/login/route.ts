import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
    const body = await request.json();

    const upstream = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = upstream.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await upstream.json()
      : await upstream.text();

    return NextResponse.json(payload, { status: upstream.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reach backend' },
      { status: 502 }
    );
  }
}
