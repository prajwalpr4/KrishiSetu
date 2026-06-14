import { NextRequest, NextResponse } from 'next/server';
import { fetchMandiPrices } from '@/lib/mandi';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'Karnataka';
    const commodity = searchParams.get('commodity') || undefined;
    const featured = searchParams.get('featured') === 'true';

    const prices = await fetchMandiPrices(state, commodity);

    if (featured) {
      // Return only top featured crops
      const featuredCrops = ['Tomato', 'Onion', 'Potato', 'Ragi'];
      const featuredPrices = prices.filter((p) =>
        featuredCrops.some((c) => p.crop_name.toLowerCase().includes(c.toLowerCase()))
      );
      return NextResponse.json({ prices: featuredPrices.slice(0, 4) });
    }

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Mandi API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mandi prices' },
      { status: 500 }
    );
  }
}
