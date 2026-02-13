import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

// Simple helper to ensure mongoose connection is reused in development
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Prefer external backend auth when configured to get JWT token
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '';
    if (API_BASE_URL) {
      try {
        const ext = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const contentType = ext.headers.get('content-type') || '';
        const extPayload = contentType.includes('application/json') ? await ext.json() : null;

        if (ext.ok && extPayload) {
          return NextResponse.json(extPayload, { status: ext.status });
        }
      } catch (e) {
        console.error('External auth attempt failed:', e);
      }
    }

    await connectToDatabase();

    // Use a flexible schema to read the `users` collection
    const userModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const hashed = user.password;

    // Clean stored hash in case it has accidental whitespace or surrounding quotes
    const rawHash = String(hashed || '');
    const cleanedHash = rawHash.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

    // Try compare with cleaned hash
    let match = false;
    try {
      match = await bcrypt.compare(password, cleanedHash);
    } catch (e) {
      console.error('bcrypt compare error with cleanedHash:', e);
    }

    // Fallback: if not matched, also try original rawHash (some hashes may include odd chars)
    if (!match && rawHash !== cleanedHash) {
      try {
        match = await bcrypt.compare(password, rawHash);
      } catch (e) {
        console.error('bcrypt compare error with rawHash:', e);
      }
    }

    if (!match) {
      // Log non-sensitive debug info to help troubleshooting (do not expose full hash)
      console.error('Local auth failed for', email, '- storedHashPreview=', rawHash.substring(0, 10) + '...', 'len=', rawHash.length);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Remove sensitive fields
    const safeUser = { ...user };
    delete safeUser.password;
    if (safeUser._id) safeUser.id = String(safeUser._id);

    // Create a simple token (not a JWT) — sufficient for frontend cookie/storage
    const token = Buffer.from(`${safeUser.email}:${Date.now()}`).toString('base64');

    return NextResponse.json({ data: safeUser, token, message: 'Login successful' }, { status: 200 });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: error.message || 'Login failed' }, { status: 500 });
  }
}
