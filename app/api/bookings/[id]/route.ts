import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/middleware/adminMiddleware';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

async function resolveAuthUser(authUser: any) {
  const rawId = String(authUser?.id || authUser?._id || '');
  const rawRole = authUser?.role;
  const email = authUser?.email ? String(authUser.email).toLowerCase() : '';

  let resolvedId = rawId;
  let resolvedRole = rawRole;

  if ((!resolvedId || !mongoose.Types.ObjectId.isValid(resolvedId) || !resolvedRole) && email) {
    const UserModel =
      mongoose.models.User ||
      mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));
    const authUserDoc = await UserModel.findOne({ email }).select('_id role').lean();
    if (authUserDoc?._id) resolvedId = String(authUserDoc._id);
    if (!resolvedRole && authUserDoc?.role) resolvedRole = authUserDoc.role;
  }

  return {
    id: resolvedId,
    role: resolvedRole,
  };
}

const normalizeStatusForStorage = (status: string) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'booked') return 'confirmed';
  if (normalized === 'cancel') return 'cancelled';
  if (normalized === 'confirmed' || normalized === 'cancelled' || normalized === 'pending' || normalized === 'completed') {
    return normalized;
  }
  return '';
};

const BookingModel = () =>
  mongoose.models.Booking ||
  mongoose.model('Booking', new mongoose.Schema({}, { strict: false, collection: 'bookings' }));

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const bookingId = params.id;
    const user = authResult.user;

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
    }

    await connectToDatabase();
    const bookingDoc = await BookingModel()
      .findById(bookingId)
      .populate('user', 'name email')
      .populate('trek trekPackage trekPackageId', 'title name')
      .lean();

    if (!bookingDoc) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingUserId = String((bookingDoc as any).user?._id || (bookingDoc as any).user || '');

    // Check if user owns this booking or is admin
    if (bookingUserId && bookingUserId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ booking: bookingDoc }, { status: 200 });
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

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
    }

    // Only admin can change status
    if (updateData.status && user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can change booking status' }, { status: 403 });
    }

    await connectToDatabase();
    const Booking = BookingModel();

    const bookingDoc = await Booking.findById(bookingId).lean();
    if (!bookingDoc) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (typeof updateData.status === 'string' || typeof updateData.bookingStatus === 'string') {
      const normalizedStatus = normalizeStatusForStorage(updateData.status || updateData.bookingStatus);
      if (!normalizedStatus) {
        return NextResponse.json({ error: 'Invalid booking status value' }, { status: 400 });
      }
      updatePayload.status = normalizedStatus;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { $set: updatePayload },
      { new: true, lean: true }
    );

    return NextResponse.json({ message: 'Booking updated successfully', booking: updatedBooking }, { status: 200 });
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

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 });
    }

    await connectToDatabase();
    const resolvedAuthUser = await resolveAuthUser(user);
    const Booking = BookingModel();

    const bookingDoc = await Booking.findById(bookingId).lean();
    if (!bookingDoc) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingUserId = String(
      (bookingDoc as any).user?._id ||
      (bookingDoc as any).user ||
      (bookingDoc as any).userId ||
      ''
    );

    if (bookingUserId && bookingUserId !== resolvedAuthUser.id && resolvedAuthUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Booking.findByIdAndDelete(bookingId);

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
