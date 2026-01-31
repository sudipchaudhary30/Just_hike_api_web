import { NextRequest, NextResponse } from 'next/server';
import { setAuthToken, setUserData } from '@/lib/cookie';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userData } = body || {};

    if (!token || !userData) {
      return NextResponse.json(
        { error: 'token and userData are required' },
        { status: 400 }
      );
    }

    await setAuthToken(token);
    await setUserData(userData);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to set cookies' },
      { status: 500 }
    );
  }
}
