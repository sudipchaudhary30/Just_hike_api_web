import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'name, email and password are required' }, { status: 400 });
    }

    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Check existing user
    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(String(password), 10);
    const created = await UserModel.create({ name, email, password: hashed, role: 'user' });

    const safeUser = { ...created.toObject() };
    delete safeUser.password;
    if (safeUser._id) safeUser.id = String(safeUser._id);

    const token = Buffer.from(`${safeUser.email}:${Date.now()}`).toString('base64');

    return NextResponse.json({ data: safeUser, token, message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ message: error.message || 'Registration failed' }, { status: 500 });
  }
}
