import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET — fetch current user's profile
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ profile: data || null })
}

// POST — create profile (first time)
export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sanitizedBody = { ...body };
  if (sanitizedBody.age === '') sanitizedBody.age = null;
  else if (sanitizedBody.age) sanitizedBody.age = Number(sanitizedBody.age);
  
  if (sanitizedBody.gps_lat === '') sanitizedBody.gps_lat = null;
  if (sanitizedBody.gps_lng === '') sanitizedBody.gps_lng = null;

  if (!sanitizedBody.full_name) sanitizedBody.full_name = 'Farmer';
  if (!sanitizedBody.village_or_city) sanitizedBody.village_or_city = 'Not Provided';
  if (!sanitizedBody.district) sanitizedBody.district = 'Not Provided';
  if (!sanitizedBody.state) sanitizedBody.state = 'Not Provided';
  if (sanitizedBody.land_size_acres === '' || sanitizedBody.land_size_acres == null) sanitizedBody.land_size_acres = 0;
  else sanitizedBody.land_size_acres = Number(sanitizedBody.land_size_acres);

  Object.keys(sanitizedBody).forEach(key => {
    if (sanitizedBody[key] === '') {
      delete sanitizedBody[key];
    }
  });

  delete sanitizedBody.interests;

  const { data, error } = await supabase
    .from('farmer_profiles')
    .upsert({
      user_id: user.id,
      ...sanitizedBody,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    console.error("Supabase upsert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data }, { status: 201 })
}

// PUT — update specific fields
export async function PUT(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sanitizedBody = { ...body };
  if (sanitizedBody.age === '') sanitizedBody.age = null;
  else if (sanitizedBody.age) sanitizedBody.age = Number(sanitizedBody.age);
  
  if (sanitizedBody.gps_lat === '') sanitizedBody.gps_lat = null;
  if (sanitizedBody.gps_lng === '') sanitizedBody.gps_lng = null;

  if (!sanitizedBody.full_name) sanitizedBody.full_name = 'Farmer';
  if (!sanitizedBody.village_or_city) sanitizedBody.village_or_city = 'Not Provided';
  if (!sanitizedBody.district) sanitizedBody.district = 'Not Provided';
  if (!sanitizedBody.state) sanitizedBody.state = 'Not Provided';
  if (sanitizedBody.land_size_acres === '' || sanitizedBody.land_size_acres == null) sanitizedBody.land_size_acres = 0;
  else sanitizedBody.land_size_acres = Number(sanitizedBody.land_size_acres);

  Object.keys(sanitizedBody).forEach(key => {
    if (sanitizedBody[key] === '') {
      delete sanitizedBody[key];
    }
  });

  delete sanitizedBody.interests;

  const { data, error } = await supabase
    .from('farmer_profiles')
    .update({ ...sanitizedBody, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error("Supabase update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ profile: data })
}
