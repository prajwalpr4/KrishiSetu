import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropDisease } from '@/lib/gemini';
import type { Language } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const cropName = formData.get('cropName') as string | null;
    const language = (formData.get('language') as Language) || 'en';

    if (!image) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(image.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit.' },
        { status: 400 }
      );
    }

    // Convert to base64 for Gemini
    const arrayBuffer = await image.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Analyze with Gemini Vision
    const diagnosis = await analyzeCropDisease(
      base64,
      image.type,
      cropName || undefined,
      language
    );

    // Generate shopping recommendations
    const prescription = {
      products: diagnosis.chemical_treatment.map((t) => ({
        name: t.product,
        type: 'pesticide',
        quantity: t.dose,
        price_range: '₹200-₹800',
      })),
      nearby_shops: [],
    };

    return NextResponse.json({
      scanId: crypto.randomUUID(),
      diagnosis,
      prescription,
    });
  } catch (error: any) {
    console.error('Crop doctor API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze crop image' },
      { status: 500 }
    );
  }
}
