import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get statistics
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: adminCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    const { count: investorCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'investor');

    const { count: totalLogs } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true });

    // Get total AUM
    const { data: aumData } = await supabase
      .from('profiles')
      .select('aum')
      .eq('role', 'investor');

    const totalAUM = aumData?.reduce((sum, item) => sum + (Number(item.aum) || 0), 0) || 0;

    // Get recent activity count (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count: recentActivity } = await supabase
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString());

    return NextResponse.json({
      stats: {
        totalUsers,
        adminCount,
        investorCount,
        totalAUM,
        totalLogs,
        recentActivity,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
