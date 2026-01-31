import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/adminMiddleware';
import { parseFormData, saveFile } from '@/lib/utils/multer';

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
    const authenticatedUser = authResult.user;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Ensure users can only update their own profile
    if (authenticatedUser.id !== userId && authenticatedUser.role !== 'admin') {
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
        imageUrl = await saveFile(file);
        updateData.image = imageUrl;
      }
    } else {
      // Handle JSON data (without image)
      updateData = await request.json();
    }

    // Prevent users from changing their role (unless they're admin)
    if (updateData.role && authenticatedUser.role !== 'admin') {
      delete updateData.role;
    }

    // Don't allow email changes without verification (optional security measure)
    // You can remove this if you want to allow email changes
    if (updateData.email && updateData.email !== authenticatedUser.email) {
      // Implement email verification logic here
      // For now, we'll allow it but you should add verification
    }

    // TODO: Replace with your actual database update
    // Example: const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: updateData
    // });
    
    // Mock response for demonstration
    const updatedUser = {
      id: userId,
      ...authenticatedUser,
      ...updateData,
      password: undefined, // Don't return password
      updatedAt: new Date().toISOString(),
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
    const authenticatedUser = authResult.user;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Ensure users can only view their own profile (unless admin)
    if (authenticatedUser.id !== userId && authenticatedUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own profile' },
        { status: 403 }
      );
    }

    // TODO: Replace with your actual database query
    // Example: const user = await prisma.user.findUnique({ where: { id: userId } });
    
    // Mock response for demonstration
    const user = {
      id: userId,
      name: 'Name',
      email: 'john@example.com',
      role: 'user',
      image: '/uploads/users/user-123.png',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
