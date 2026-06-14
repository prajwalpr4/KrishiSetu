import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const serviceClient = await createServiceClient();
    const { data: plans, error: plansError } = await serviceClient
      .from('crop_plans')
      .select('*')
      .eq('farmer_id', profile.id)
      .order('created_at', { ascending: false });

    if (plansError) throw plansError;

    return NextResponse.json({ plans: plans || [] });
  } catch (error: any) {
    console.error('Crop Planner GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await request.json();
    const { action } = body;

    if (action === 'add_plan') {
      const { crop_name, variety, field_name, area_acres, season, sowing_date, expected_harvest_date } = body;
      const serviceClient = await createServiceClient();
      const { data, error } = await serviceClient
        .from('crop_plans')
        .insert({
          farmer_id: profile.id,
          crop_name,
          variety,
          field_name,
          area_acres,
          season,
          sowing_date,
          expected_harvest_date,
          status: 'planned'
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, plan: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Crop Planner POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
