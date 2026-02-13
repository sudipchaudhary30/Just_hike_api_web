import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '@/lib/utils/email';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * POST /api/auth/forgot-password
 * Generate a password reset token and send it via email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Find user by email
    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json(
        { 
          message: 'If an account exists with that email, a reset link has been sent.' 
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = require('crypto')
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with reset token
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetTokenHash,
          resetPasswordExpiry: resetTokenExpiry,
        },
      }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('Forgot password debug:', {
        email: email.toLowerCase(),
        tokenHashPrefix: resetTokenHash.substring(0, 10) + '...',
        resetPasswordExpiry: resetTokenExpiry,
      });
    }

    // Generate reset link
    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${email}`;
    
    // Send email
    try {
      await sendPasswordResetEmail(email, resetLink);
      console.log('Password reset email sent to:', email);
    } catch (emailError: any) {
      console.error('Failed to send email:', emailError);
      // Still log the link for development
      console.log('[Forgot Password] Reset link:', resetLink);
      
      // In development, return the link even if email fails
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            message: 'Email service error. Reset link is displayed in console for development.',
            resetLink
          },
          { status: 200 }
        );
      }
      
      // In production, throw error
      throw new Error('Failed to send reset email. Please try again later.');
    }

    // Return success message
    return NextResponse.json(
      { 
        message: 'If an account exists with that email, a reset link has been sent.',
        // In development, also return the token for testing
        ...(process.env.NODE_ENV === 'development' && { resetLink })
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process forgot password request' },
      { status: 500 }
    );
  }
}
