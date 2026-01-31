import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Replace with actual database query
    const packages = [
      {
        id: '1',
        name: 'Everest Base Camp Trek',
        description: 'Experience the ultimate Himalayan adventure with stunning views of Mt. Everest and surrounding peaks.',
        duration: 12,
        difficulty: 'Challenging',
        price: 1200,
        maxGroupSize: 12,
        location: 'Nepal, Himalayas',
        altitude: 5364,
        bestSeason: 'March-May, September-November',
        image: '/uploads/treks/everest.jpg',
        guideId: '1',
        availableSlots: 8,
        isActive: true,
      },
      {
        id: '2',
        name: 'Annapurna Circuit',
        description: 'Complete circuit around the Annapurna massif, crossing high mountain passes and diverse landscapes.',
        duration: 15,
        difficulty: 'Challenging',
        price: 1400,
        maxGroupSize: 10,
        location: 'Nepal, Annapurna',
        altitude: 5416,
        bestSeason: 'March-May, October-November',
        image: '/uploads/treks/annapurna.jpg',
        guideId: '2',
        availableSlots: 6,
        isActive: true,
      },
      {
        id: '3',
        name: 'Poon Hill Trek',
        description: 'Short and easy trek perfect for beginners, offering panoramic mountain views and cultural experiences.',
        duration: 5,
        difficulty: 'Easy',
        price: 400,
        maxGroupSize: 15,
        location: 'Nepal, Annapurna Region',
        altitude: 3210,
        bestSeason: 'Year-round',
        image: '/uploads/treks/poonhill.jpg',
        guideId: '1',
        availableSlots: 12,
        isActive: true,
      },
    ];

    return NextResponse.json({
      packages,
      pagination: { page, limit, total: packages.length, totalPages: Math.ceil(packages.length / limit) },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
