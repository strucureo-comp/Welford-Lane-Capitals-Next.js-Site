import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, snapshotDate, totalInvested, currentValue, adminId } = await request.json();

    if (!userId || !snapshotDate || totalInvested === undefined || currentValue === undefined || !adminId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const profitLoss = currentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    // Insert or update snapshot
    const { data, error } = await supabase
      .from('portfolio_snapshots')
      .upsert({
        user_id: userId,
        snapshot_date: snapshotDate,
        total_invested: totalInvested,
        current_value: currentValue,
        profit_loss: profitLoss,
        profit_loss_percentage: profitLossPercent,
      }, {
        onConflict: 'user_id,snapshot_date'
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      snapshot: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const adminId = searchParams.get('adminId');

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Verify admin
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();

    if (!adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    let query = supabase
      .from('portfolio_snapshots')
      .select('*')
      .order('snapshot_date', { ascending: true });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      snapshots: data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

