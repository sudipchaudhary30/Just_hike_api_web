import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/just_hike';

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

async function enrichAuthor(blog: any) {
  const authorField = blog?.author;
  const authorId =
    typeof authorField === 'string'
      ? authorField
      : String(authorField?._id || authorField?.id || '');

  if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
    return blog;
  }

  try {
    await connectToDatabase();
    const UserModel =
      mongoose.models.User ||
      mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    const userDoc = await UserModel.findById(authorId).select('name profilePicture image').lean();
    if (!userDoc) return blog;

    return {
      ...blog,
      author: {
        ...(typeof authorField === 'object' && authorField ? authorField : {}),
        _id: authorId,
        name: userDoc.name || blog?.authorName || 'Admin',
        profilePicture: userDoc.profilePicture || userDoc.image || undefined,
        image: userDoc.image || userDoc.profilePicture || undefined,
      },
    };
  } catch {
    return blog;
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';

    const bySlugResponse = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (bySlugResponse.ok) {
      const payload = await bySlugResponse.json();
      const blog = payload?.data || payload?.blog || payload;
      const enrichedBlog = await enrichAuthor(blog);
      return NextResponse.json({ data: enrichedBlog }, { status: 200 });
    }

    const listResponse = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (listResponse.ok) {
      const payload = await listResponse.json();
      const list = payload?.data || payload?.blogs || payload?.results || [];
      const found = Array.isArray(list)
        ? list.find((item: any) => {
            const id = String(item?._id || item?.id || '');
            const itemSlug = String(item?.slug || '');
            return id === slug || itemSlug === slug;
          })
        : null;

      if (found) {
        const enrichedBlog = await enrichAuthor(found);
        return NextResponse.json({ data: enrichedBlog }, { status: 200 });
      }
    }

    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
