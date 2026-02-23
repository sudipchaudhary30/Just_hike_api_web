import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/adminMiddleware';
import mongoose from 'mongoose';
import { parseFormData, saveFile } from '@/lib/utils/multer';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * PUT /api/auth/:id
 * Update user's own profile (Authenticated users)
 * Supports image upload via multipart/form-data
 * Users can only update their own profile
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;
    const authenticatedUser = authResult.user || {};

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Resolve authenticated user id (from token/cookie) or look up by email
    const authId = String(authenticatedUser.id || authenticatedUser._id || '');
    const authEmail = authenticatedUser.email ? String(authenticatedUser.email).toLowerCase() : '';

    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    let resolvedAuthUserId = authId;
    let resolvedRole = authenticatedUser.role;
    if ((!resolvedAuthUserId || !mongoose.Types.ObjectId.isValid(resolvedAuthUserId)) && authEmail) {
      const authUserDoc = await UserModel.findOne({ email: authEmail }).select('_id role').lean();
      if (authUserDoc?._id) resolvedAuthUserId = String(authUserDoc._id);
      if (!resolvedRole && authUserDoc?.role) resolvedRole = authUserDoc.role;
    }

    // Ensure users can only update their own profile (unless admin)
    if (resolvedAuthUserId !== userId && resolvedRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own profile' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let updateData: any = {};
    let imageUrl: string | null = null;

    // Handle multipart/form-data (with image)
    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      updateData = fields;

      // Save the uploaded image if present
      if (file) {
        imageUrl = await saveFile(file, 'user');
        updateData.profilePicture = imageUrl;
      }
    } else {
      // Handle JSON data (without image)
      updateData = await request.json();
    }

    // Prevent users from changing their role (unless they're admin)
    if (updateData.role && resolvedRole !== 'admin') {
      delete updateData.role;
    }

    // Don't allow email changes without verification (optional security measure)
    // You can remove this if you want to allow email changes
    if (updateData.email && updateData.email !== authenticatedUser.email) {
      // Implement email verification logic here
      // For now, we'll allow it but you should add verification
    }

    let updatedUserDoc = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      updatedUserDoc = await UserModel.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, lean: true }
      );
    }

    if (!updatedUserDoc && authEmail) {
      updatedUserDoc = await UserModel.findOneAndUpdate(
        { email: authEmail },
        { ...updateData, updatedAt: new Date() },
        { new: true, lean: true }
      );
    }

    if (!updatedUserDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = {
      id: String(updatedUserDoc._id),
      name: updatedUserDoc.name,
      email: updatedUserDoc.email,
      role: updatedUserDoc.role,
      phoneNumber: updatedUserDoc.phoneNumber,
      profilePicture: updatedUserDoc.profilePicture,
      createdAt: updatedUserDoc.createdAt,
      updatedAt: updatedUserDoc.updatedAt,
    };

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/:id
 * Get user's own profile or any profile if admin
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;
    const authenticatedUser = authResult.user || {};

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Resolve authenticated user id or look up by email
    const authId = String(authenticatedUser.id || authenticatedUser._id || '');
    const authEmail = authenticatedUser.email ? String(authenticatedUser.email).toLowerCase() : '';

    await connectToDatabase();
    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    let resolvedAuthUserId = authId;
    let resolvedRole = authenticatedUser.role;
    if ((!resolvedAuthUserId || !mongoose.Types.ObjectId.isValid(resolvedAuthUserId)) && authEmail) {
      const authUserDoc = await UserModel.findOne({ email: authEmail }).select('_id role').lean();
      if (authUserDoc?._id) resolvedAuthUserId = String(authUserDoc._id);
      if (!resolvedRole && authUserDoc?.role) resolvedRole = authUserDoc.role;
    }

    // Ensure users can only view their own profile (unless admin)
    if (resolvedAuthUserId !== userId && resolvedRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own profile' },
        { status: 403 }
      );
    }

    let userDoc = null;
    if (mongoose.Types.ObjectId.isValid(userId)) {
      userDoc = await UserModel.findById(userId).select('-password').lean();
    }

    if (!userDoc && authEmail) {
      userDoc = await UserModel.findOne({ email: authEmail }).select('-password').lean();
    }

    const user = userDoc
      ? {
          id: String(userDoc._id),
          name: userDoc.name,
          email: userDoc.email,
          role: userDoc.role,
          phoneNumber: userDoc.phoneNumber,
          profilePicture: userDoc.profilePicture,
          createdAt: userDoc.createdAt,
          updatedAt: userDoc.updatedAt,
        }
      : null;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
