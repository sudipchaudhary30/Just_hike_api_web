import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData, saveFile } from '@/lib/utils/multer';

/**
 * POST /api/admin/users
 * Create a new user (Admin only)
 * Supports image upload via multipart/form-data
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let userData: any = {};
    let imageUrl: string | null = null;

    // Handle multipart/form-data (with image)
    if (contentType.includes('multipart/form-data')) {
      const { file, fields } = await parseFormData(request);
      userData = fields;

      // Save the uploaded image if present
      if (file) {
        imageUrl = await saveFile(file, 'user');
        userData.image = imageUrl;
      }
    } else {
      // Handle JSON data (without image)
      userData = await request.json();
    }

    // Validate required fields
    if (!userData.email || !userData.name || !userData.password) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, and password are required' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual database call
    // Example: const newUser = await prisma.user.create({ data: userData });
    
    // Mock response for demonstration
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: undefined, // Don't return password
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/users
 * Get all users (Admin only)
 * Supports pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      console.log('[Admin Users GET] Auth failed:', authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    console.log('[Admin Users GET] Auth successful');

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    // Connect to database
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    console.log('[Admin Users GET] Connected to database');

    const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Build filter query
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (role) {
      filter.role = role;
    }

    // Count total users matching filter
    const total = await UserModel.countDocuments(filter);

    // Fetch paginated users
    const users = await UserModel.find(filter)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform _id to id
    const transformedUsers = users.map((user: any) => ({
      ...user,
      id: user._id?.toString() || user.id,
    }));

    return NextResponse.json(
      {
        users: transformedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
