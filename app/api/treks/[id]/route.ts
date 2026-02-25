import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = params.id;
    const mongoose = require('mongoose');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }
    const TrekModel = mongoose.models.Trek || mongoose.model('Trek', new mongoose.Schema({}, { strict: false, collection: 'treks' }));
    const trekDoc = await TrekModel.findById(packageId).lean();
    if (!trekDoc) {
      return NextResponse.json({ error: 'Trek not found' }, { status: 404 });
    }
    // Ensure imageUrl is a full backend URL
    let imageUrl = trekDoc.imageUrl;
    if (imageUrl && !imageUrl.startsWith('http')) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      imageUrl = `${API_BASE_URL}${imageUrl}`;
    }
    let thumbnailUrl = trekDoc.thumbnailUrl;
    if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
      thumbnailUrl = `${API_BASE_URL}${thumbnailUrl}`;
    }
    const responsePackage = {
      ...trekDoc,
      id: trekDoc._id?.toString() || trekDoc.id,
      imageUrl,
      thumbnailUrl,
    };
    return NextResponse.json({ package: responsePackage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
