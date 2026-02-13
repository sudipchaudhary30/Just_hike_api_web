import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { createHash } from 'crypto';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * POST /api/auth/reset-password
 * Reset user password using the reset token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, email, password, confirmPassword } = await request.json();

    // Validate inputs
    if (!token || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Hash the token to match what we stored
    const resetTokenHash = createHash('sha256').update(token).digest('hex');

    console.log('Reset password attempt:', {
      email: email.toLowerCase(),
      tokenHash: resetTokenHash.substring(0, 10) + '...',
      currentTime: new Date()
    });

    if (process.env.NODE_ENV === 'development') {
      const userByEmail = await UserModel.findOne({ email: email.toLowerCase() });
      if (!userByEmail) {
        console.log('No user found for email (debug)');
      } else {
        console.log('Reset token debug:', {
          hasResetToken: Boolean(userByEmail.resetPasswordToken),
          storedTokenPrefix: userByEmail.resetPasswordToken
            ? String(userByEmail.resetPasswordToken).substring(0, 10) + '...'
            : null,
          resetPasswordExpiry: userByEmail.resetPasswordExpiry || null,
        });
      }
    }

    // Find user with valid reset token
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: resetTokenHash,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      console.log('No user found with valid token');
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    console.log('Valid token found for user:', email);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return NextResponse.json(
      { message: 'Password reset successfully. Please login with your new password.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reset password' },
      { status: 500 }
    );
  }
}
