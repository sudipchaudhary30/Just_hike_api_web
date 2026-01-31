import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/adminMiddleware';
import { parseFormData, saveFile } from '@/lib/utils/multer';

/**
 * GET /api/admin/users/:id
 * Get a specific user by ID (Admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
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

/**
 * PUT /api/admin/users/:id
 * Update a user by ID (Admin only)
 * Supports image upload via multipart/form-data
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
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

    // TODO: Replace with your actual database update
    // Example: const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: updateData
    // });
    
    // Mock response for demonstration
    const updatedUser = {
      id: userId,
      ...updateData,
      password: undefined, // Don't return password
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: 'User updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/:id
 * Delete a user by ID (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = params.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual database deletion
    // Example: await prisma.user.delete({ where: { id: userId } });
    
    // Optional: Delete user's profile image from filesystem
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (user?.image) {
    //   const fs = require('fs').promises;
    //   const imagePath = path.join(process.cwd(), 'public', user.image);
    //   await fs.unlink(imagePath).catch(() => {});
    // }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
