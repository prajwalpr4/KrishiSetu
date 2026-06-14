import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: items, error: itemsError } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('farmer_id', profile.id)
      .order('created_at', { ascending: false });

    if (itemsError) throw itemsError;

    const { data: transactions, error: txError } = await supabase
      .from('inventory_transactions')
      .select('id, item_id, type, quantity, reason, created_at')
      .eq('farmer_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (txError) throw txError;

    // Enhance transactions with item names for UI
    const txWithNames = transactions.map(tx => {
      const item = items?.find(i => i.id === tx.item_id);
      return {
        id: tx.id,
        item_name: item?.name || 'Unknown Item',
        type: tx.type,
        quantity: tx.quantity,
        reason: tx.reason,
        date: tx.created_at.split('T')[0],
      };
    });

    return NextResponse.json({ items: items || [], transactions: txWithNames || [] });
  } catch (error: any) {
    console.error('Inventory GET Error:', error);
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

    if (action === 'add_item') {
      const { name, category, quantity, unit, purchase_price, low_stock_alert, supplier } = body;
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          farmer_id: profile.id,
          name,
          category,
          quantity,
          unit,
          purchase_price,
          low_stock_alert,
          supplier
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, item: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Inventory POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const { action, item_id, type, amount } = body;

    if (action === 'adjust_stock') {
      // Get current item
      const { data: item, error: fetchError } = await supabase
        .from('inventory_items')
        .select('quantity, name')
        .eq('id', item_id)
        .eq('farmer_id', profile.id)
        .single();

      if (fetchError || !item) throw fetchError || new Error('Item not found');

      const newQty = type === 'in' ? item.quantity + amount : Math.max(0, item.quantity - amount);

      // Update item
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', item_id);

      if (updateError) throw updateError;

      // Log transaction
      const { data: tx, error: txError } = await supabase
        .from('inventory_transactions')
        .insert({
          farmer_id: profile.id,
          item_id: item_id,
          type: type,
          quantity: amount,
          reason: type === 'in' ? 'Stock added' : 'Used'
        })
        .select()
        .single();

      if (txError) throw txError;

      return NextResponse.json({ 
        success: true, 
        new_quantity: newQty,
        transaction: {
          id: tx.id,
          item_name: item.name,
          type: tx.type,
          quantity: tx.quantity,
          reason: tx.reason,
          date: tx.created_at.split('T')[0]
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Inventory PATCH Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
