import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'investor';
  company: string | null;
  aum: number;
  status: 'pending' | 'approved' | 'rejected';
  phone_number: string | null;
  login_key: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string;
  action: string;
  details: Record<string, any> | null;
  created_at: string;
};

export type Investment = {
  id: string;
  user_id: string;
  symbol: string;
  name: string;
  shares: number;
  purchase_price: number;
  current_price: number;
  purchase_date: string;
  created_at: string;
  updated_at: string;
};

export type PortfolioSnapshot = {
  id: string;
  user_id: string;
  snapshot_date: string;
  total_invested: number;
  current_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  created_at: string;
};
