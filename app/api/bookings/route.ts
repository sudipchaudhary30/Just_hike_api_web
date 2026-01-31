import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/middleware/adminMiddleware';

/**
 * GET /api/bookings
 * Get bookings (admin sees all, users see their own)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    const user = authResult.user;
    
    // TODO: Fetch from database
    // If admin, fetch all bookings. If user, fetch only their bookings
    const bookings = [
      {
        id: '1',
        userId: user.id,
        trekPackageId: '1',
        numberOfPeople: 2,
        totalPrice: 2400,
        startDate: '2026-04-15',
        status: 'pending',
        specialRequests: 'Vegetarian meals preferred',
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+1-555-0123',
          relationship: 'Spouse',
        },
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      bookings,
      pagination: { page, limit, total: bookings.length, totalPages: Math.ceil(bookings.length / limit) },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/bookings
 * Create a new booking (authenticated users)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const bookingData = await request.json();
    const user = authResult.user;

    // TODO: Validate trek package exists and has available slots
    // TODO: Calculate total price
    // TODO: Save to database

    const newBooking = {
      id: Date.now().toString(),
      userId: user.id,
      ...bookingData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
  }
}
