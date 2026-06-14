import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get farmer profile id
    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Fetch workers
    const { data: workers, error: workersError } = await supabase
      .from('farm_workers')
      .select('*')
      .eq('farmer_id', profile.id)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (workersError) throw workersError;

    // Fetch all attendance for reports and ledger
    const { data: attendance, error: attendanceError } = await supabase
      .from('worker_attendance')
      .select('*')
      .eq('farmer_id', profile.id)
      .order('attendance_date', { ascending: false });

    if (attendanceError) throw attendanceError;

    // Map attendance back to a dictionary { worker_id: { status, task } } for the UI to digest easily
    // Note: A worker can have multiple pending days, so we accumulate them
    const formattedAttendance: Record<string, any> = {};
    const pendingAmounts: Record<string, number> = {};

    attendance?.forEach(record => {
      // Keep track of total pending amounts
      if (!pendingAmounts[record.worker_id]) {
        pendingAmounts[record.worker_id] = 0;
      }
      pendingAmounts[record.worker_id] += record.wage_earned || 0;

      // For the UI, we just need the most recent status (or we can just store an array)
      // Since the UI only tracks "today's status" vs "past pending", we need to adapt it.
      // Let's pass the raw records and let the frontend calculate pending.
    });

    return NextResponse.json({ 
      workers: workers || [], 
      attendanceRecords: attendance || [] 
    });
  } catch (error: any) {
    console.error('GET Majdoor Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'add_worker') {
      const { name, phone, daily_wage, skill_type } = body;
      const { data, error } = await supabase
        .from('farm_workers')
        .insert({
          farmer_id: profile.id,
          name,
          phone,
          daily_wage,
          skill_type
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, worker: data });
    }

    if (action === 'save_attendance') {
      const { records } = body; 
      // records: [{ worker_id, status, task, wage_earned }]

      const inserts = records.map((r: any) => ({
        farmer_id: profile.id,
        worker_id: r.worker_id,
        attendance_date: new Date().toISOString().split('T')[0], // Today
        status: r.status,
        task: r.task,
        wage_earned: r.wage_earned,
        payment_status: 'pending'
      }));

      const { error } = await supabase
        .from('worker_attendance')
        .insert(inserts);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('POST Majdoor Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { action, worker_id } = body;

    if (action === 'mark_paid') {
      const { error } = await supabase
        .from('worker_attendance')
        .update({ 
          payment_status: 'paid', 
          paid_at: new Date().toISOString() 
        })
        .eq('farmer_id', profile.id)
        .eq('worker_id', worker_id)
        .eq('payment_status', 'pending');

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('PATCH Majdoor Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
