import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/utils/email';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * POST /api/auth/send-verification-email
 * Send verification email to user
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      );
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationTokenHash = require('crypto')
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user with verification token
    user.emailVerificationToken = verificationTokenHash;
    user.emailVerificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Generate verification link
    const verificationLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}&email=${email}`;
    
    // Send email
    try {
      await sendVerificationEmail(email, verificationLink);
      console.log('[SUCCESS] Verification email sent to:', email);
    } catch (emailError: any) {
      console.error('[ERROR] Failed to send email:', emailError);
      // Still log the link for development
      console.log('[Email Verification] Verification link:', verificationLink);
      
      // In development, return the link even if email fails
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(
          { 
            message: 'Email service error. Verification link is displayed in console for development.',
            verificationLink
          },
          { status: 200 }
        );
      }
      
      // In production, throw error
      throw new Error('Failed to send verification email. Please try again later.');
    }

    return NextResponse.json(
      { 
        message: 'Verification email sent successfully',
        ...(process.env.NODE_ENV === 'development' && { verificationLink })
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
