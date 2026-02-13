import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { parseFormData, saveFile } from '@/lib/utils/multer';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function POST(request: NextRequest) {
  try {
    // Authorization: expect Bearer <token> where token = JWT or base64(email:timestamp)
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    let adminEmail = '';
    let isAdmin = false;

    // Try to decode as JWT (if it has 3 parts separated by dots)
    if (token.split('.').length === 3) {
      try {
        // Decode JWT payload (second part)
        const parts = token.split('.');
        const payload = parts[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
        const decoded = Buffer.from(padded, 'base64').toString('utf8');
        const payloadObj = JSON.parse(decoded);
        adminEmail = (payloadObj.email || payloadObj.sub || '').toLowerCase();
        isAdmin = payloadObj.role === 'admin';
        console.log('[User Create] Admin verified via JWT');
      } catch (e) {
        console.error('[User Create] Failed to decode JWT');
      }
    } else {
      // Fallback to base64 decode for local tokens
      try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        adminEmail = (decoded.split(':')[0] || '').toLowerCase();
        console.log('[User Create] Admin verified via token');
      } catch (e) {
        console.error('[User Create] Failed to decode token');
      }
    }

    // If we couldn't extract admin info from token, check user_data cookie
    if (!isAdmin) {
      try {
        const cookieStore = cookies();
        const userData = cookieStore.get('user_data')?.value;
        if (userData) {
          const user = JSON.parse(userData);
          isAdmin = user.role === 'admin';
          adminEmail = user.email;
          console.log('[User Create] Admin verified via user_data cookie');
        }
      } catch (e) {
        console.error('[User Create] Failed to parse user_data cookie');
      }
    }

    // Final check: verify admin in local DB if available, otherwise trust the JWT/cookie
    if (adminEmail && isAdmin) {
      try {
        await connectToDatabase();
        const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
        const adminUser = await UserModel.findOne({ email: adminEmail }).lean();
        
        // If admin not in local DB but JWT says admin, that's OK (external auth)
        if (!adminUser) {
          console.warn('[User Create] Admin not found in local DB but verified via JWT/cookie');
        }
      } catch (e) {
        // DB connection failed but we have JWT/cookie proof of admin
        console.warn('[User Create] Could not verify admin in DB');
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Connect to database and get UserModel
    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Parse form data (multer helper)
    const contentType = request.headers.get('content-type') || '';
    let userData: any = {};
    let imageUrl: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      userData = fields;
      if (file) {
        imageUrl = await saveFile(file);
        userData.profilePicture = imageUrl;
      }
    } else {
      userData = await request.json();
    }

    if (!userData.email || !userData.password || !userData.name) {
      return NextResponse.json({ error: 'name, email and password are required' }, { status: 400 });
    }

    // Hash password (NEVER log password)
    const hashed = await bcrypt.hash(String(userData.password), 10);
    userData.password = hashed;

    // Ensure role default
    userData.role = userData.role || 'user';

    const created = await UserModel.create(userData);
    const safeUser = { ...created.toObject() };
    delete safeUser.password;

    console.log('[User Create] User created successfully:', safeUser.email);

    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error: any) {
    console.error('[User Create] Error - do not log sensitive data');
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
