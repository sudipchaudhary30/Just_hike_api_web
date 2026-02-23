import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageId = params.id;

    // TODO: Fetch from database with guide information
      const imagePath = '/uploads/treks/everest.jpg';
      let imageFileName = null;
      if (typeof imagePath === 'string') {
        const parts = imagePath.split('/');
        imageFileName = parts.length > 0 ? parts[parts.length - 1] : imagePath;
      }
      const trekPackage = {
        id: packageId,
        name: 'Everest Base Camp Trek',
        description: 'Experience the ultimate Himalayan adventure with stunning views of Mt. Everest and surrounding peaks. This iconic trek takes you through Sherpa villages, Buddhist monasteries, and breathtaking mountain scenery.',
        duration: 12,
        difficulty: 'Challenging',
        price: 1200,
        maxGroupSize: 12,
        location: 'Nepal, Himalayas',
        altitude: 5364,
        bestSeason: 'March-May, September-November',
        inclusions: [
          'Airport transfers',
          'Accommodation in teahouses',
          'All meals during trek',
          'Experienced guide and porter',
          'Trekking permits and fees',
          'First aid kit',
        ],
        exclusions: [
          'International flights',
          'Nepal visa fees',
          'Travel insurance',
          'Personal expenses',
          'Tips for guide and porter',
          'Extra meals in Kathmandu',
        ],
        itinerary: `Day 1: Arrival in Kathmandu
        Day 2: Fly to Lukla, trek to Phakding
        Day 3: Trek to Namche Bazaar
        Day 4: Acclimatization day in Namche
        Day 5: Trek to Tengboche
        Day 6: Trek to Dingboche
        Day 7: Acclimatization day in Dingboche
        Day 8: Trek to Lobuche
        Day 9: Trek to Everest Base Camp, return to Gorak Shep
        Day 10: Hike to Kala Patthar, trek to Pheriche
        Day 11: Trek to Namche Bazaar
        Day 12: Trek to Lukla, fly to Kathmandu`,
        image: imagePath,
        imageFileName,
        guideId: '1',
        guide: {
          id: '1',
          name: 'Tenzing Sherpa',
          experience: 15,
          expertise: ['High altitude trekking', 'Mountain rescue', 'First aid'],
          image: '/uploads/guides/tenzing.jpg',
        },
        availableSlots: 8,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    return NextResponse.json({ package: trekPackage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
