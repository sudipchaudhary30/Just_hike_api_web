import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/middleware/adminMiddleware';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const bookingId = params.id;
    const user = authResult.user;

    // TODO: Fetch from database
    const booking = {
      id: bookingId,
      userId: user.id,
      trekPackageId: '1',
      numberOfPeople: 2,
      status: 'pending',
    };

    // Check if user owns this booking or is admin
    if (booking.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const bookingId = params.id;
    const updateData = await request.json();
    const user = authResult.user;

    // TODO: Fetch booking from database and verify ownership
    
    // Only admin can change status
    if (updateData.status && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can change booking status' }, { status: 403 });
    }

    // TODO: Update in database
    return NextResponse.json({ message: 'Booking updated successfully', booking: { id: bookingId, ...updateData } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const bookingId = params.id;
    const user = authResult.user;

    // TODO: Check ownership or admin role before deleting
    
    return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
