import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    // TODO: Fetch from database and increment views
    const blog = {
      id: '1',
      title: 'Top 10 Trekking Tips for Beginners',
      slug: 'top-10-trekking-tips-for-beginners',
      content: `# Introduction

Trekking in the mountains is an incredible experience that combines physical challenge with breathtaking natural beauty. Whether you're planning your first trek or looking to improve your skills, these essential tips will help you prepare properly and enjoy your adventure safely.

## 1. Start with Proper Physical Preparation

Begin training at least 6-8 weeks before your trek. Focus on cardiovascular exercises like hiking, running, and cycling. Include strength training for your legs and core.

## 2. Invest in Quality Footwear

Your boots are the most important piece of equipment. Break them in thoroughly before your trek to avoid blisters.

## 3. Pack Smart and Light

Every extra pound matters. Stick to essentials and use lightweight gear when possible.

## 4. Stay Hydrated

Drink water regularly throughout the day, even before you feel thirsty. Dehydration at altitude can be dangerous.

## 5. Acclimatize Properly

Don't rush altitude gain. Follow the "climb high, sleep low" principle and take rest days.

## 6. Listen to Your Body

Know the signs of altitude sickness and don't hesitate to descend if symptoms appear.

## 7. Respect the Environment

Follow Leave No Trace principles and respect local customs and culture.

## 8. Hire a Guide

For your first trek, especially in remote areas, a qualified guide adds safety and enhances the experience.

## 9. Get Proper Insurance

Ensure your travel insurance covers high-altitude trekking and emergency evacuation.

## 10. Embrace the Journey

Focus on the experience, not just reaching the destination. Take time to enjoy the views and connect with fellow trekkers.

## Conclusion

With proper preparation and the right mindset, your first trekking adventure will be unforgettable. Start planning today and get ready for the journey of a lifetime!`,
      excerpt: 'Essential tips to prepare for your first trekking adventure in the mountains.',
      author: 'Admin User',
      authorId: '1',
      image: '/uploads/blog/tips.jpg',
      category: 'Tips & Guides',
      tags: ['trekking', 'beginners', 'tips'],
      isPublished: true,
      publishedAt: '2026-01-20T10:00:00Z',
      views: 150,
      createdAt: '2026-01-15T10:00:00Z',
      updatedAt: '2026-01-20T10:00:00Z',
    };

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
