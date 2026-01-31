import { NextRequest, NextResponse } from 'next/server';
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
        imageUrl = await saveFile(file);
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
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    // TODO: Replace with your actual database query
    // Example: const users = await prisma.user.findMany({ 
    //   where: { ... },
    //   skip: (page - 1) * limit,
    //   take: limit
    // });
    
    // Mock response for demonstration
    const users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        image: '/uploads/users/default-avatar.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user',
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const total = users.length;

    return NextResponse.json(
      {
        users,
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
