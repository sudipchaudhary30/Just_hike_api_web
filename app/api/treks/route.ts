import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

/**
 * GET /api/treks
 * Public endpoint to get all active trek packages
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const difficulty = searchParams.get('difficulty') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const search = searchParams.get('search') || '';

    await connectToDatabase();
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));

    const filter: any = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await TrekModel.countDocuments(filter);
    const packages = await TrekModel.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const transformed = packages.map((pkg: any) => ({
      ...pkg,
      id: pkg._id?.toString() || pkg.id,
      name: pkg.name || pkg.title,
      duration: pkg.duration || pkg.durationDays,
      image: pkg.image || pkg.imageUrl || pkg.thumbnailUrl,
    }));

    return NextResponse.json({
      packages: transformed,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
