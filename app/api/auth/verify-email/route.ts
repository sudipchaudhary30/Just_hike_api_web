import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { createHash } from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * POST /api/auth/verify-email
 * Verify user's email using the verification token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Hash the token to match what we stored
    const verificationTokenHash = createHash('sha256').update(token).digest('hex');

    // Find user with valid verification token
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: verificationTokenHash,
      emailVerificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Mark email as verified and clear verification token
    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify email' },
      { status: 500 }
    );
  }
}
