'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentProfile, signOut, logActivity } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Profile, ActivityLog, PortfolioSnapshot, Investment } from '@/lib/supabase';
import { LogOut, User, Edit, Trash2, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CashFlow = {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  description: string;
};

export default function InvestorPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchase_price: '',
    current_price: '',
    purchase_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const profileData = await getCurrentProfile();
      if (!profileData || profileData.role !== 'investor') {
        router.push('/login');
        return;
      }
      setProfile(profileData);

      const { data: logsData } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: snapshotsData } = await supabase
        .from('portfolio_snapshots')
        .select('*')
        .eq('user_id', profileData.id)
        .order('snapshot_date', { ascending: true });

      const { data: investmentsData } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', profileData.id)
        .order('purchase_date', { ascending: false });

      const { data: cashFlowData } = await supabase
        .from('cash_flows')
        .select('*')
        .eq('user_id', profileData.id)
        .order('date', { ascending: true });

      setLogs(logsData || []);
      setSnapshots(snapshotsData || []);
      setInvestments(investmentsData || []);
      setCashFlows(cashFlowData || []);

      await logActivity('Investor dashboard viewed');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await logActivity('Investor signed out');
    await signOut();
    router.push('/login');
  }

  async function handleSaveInvestment() {
    if (!profile) return;

    try {
      const investmentData = {
        user_id: profile.id,
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        shares: parseFloat(formData.shares),
        purchase_price: parseFloat(formData.purchase_price),
        current_price: parseFloat(formData.current_price),
        purchase_date: formData.purchase_date,
      };

      if (editingInvestment) {
        const { error } = await supabase
          .from('investments')
          .update(investmentData)
          .eq('id', editingInvestment.id);

        if (error) throw error;
        await logActivity(`Updated investment: ${formData.symbol}`);
      } else {
        const { error } = await supabase
          .from('investments')
          .insert(investmentData);

        if (error) throw error;
        await logActivity(`Added investment: ${formData.symbol}`);
      }

      setShowAddDialog(false);
      setEditingInvestment(null);
      setFormData({
        symbol: '',
        name: '',
        shares: '',
        purchase_price: '',
        current_price: '',
        purchase_date: '',
      });
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to save investment');
    }
  }

  async function handleDeleteInvestment(id: string) {
    if (!confirm('Are you sure you want to delete this position?')) return;

    try {
      const investment = investments.find(inv => inv.id === id);
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (investment) {
        await logActivity(`Deleted investment: ${investment.symbol}`);
      }
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to delete investment');
    }
  }

  // Calculate portfolio metrics from actual investments
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchase_price), 0);
  const currentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.current_price), 0);
  const netProfit = currentValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((netProfit / totalInvested) * 100) : 0;

  // Prepare chart data showing cumulative portfolio value
  const chartData = investments.length > 0 ? investments
    .sort((a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime())
    .map((inv, idx) => {
      const cumulativeValue = investments
        .slice(0, idx + 1)
        .reduce((sum, i) => sum + (i.shares * i.current_price), 0);
      return {
        date: new Date(inv.purchase_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: cumulativeValue,
      };
    }) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-signal-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white border-b border-grid-line">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="font-display font-bold text-xl tracking-tighter">
            WLC<span className="text-signal-blue">.</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-carbon text-white flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-carbon">{profile?.full_name || 'Investor'}</div>
                <div className="text-xs text-gray-500">Investor</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 border border-grid-line rounded-lg hover:border-signal-blue transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-carbon mb-8">
          Portfolio Management: {profile?.full_name}
        </h1>

        {/* Portfolio Performance */}
        <div className="bg-white rounded-lg border border-grid-line p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Portfolio Performance (Profit/Loss)</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {chartData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p>No portfolio data yet</p>
                    <p className="text-sm mt-2">Add your first position to see the chart</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#9ca3af"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#82ca9d" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className={`text-4xl font-bold mb-4 ${profitPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitPercentage >= 0 ? '+' : ''}{profitPercentage.toFixed(1)}% (${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Current Value:</span>
                  <span className="font-semibold">${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Profit:</span>
                  <span className={`font-semibold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Stock Holdings */}
        <div className="bg-white rounded-lg border border-grid-line overflow-hidden mb-8">
          <div className="p-6 border-b border-grid-line flex items-center justify-between">
            <h2 className="text-xl font-bold">Current Stock Holdings</h2>
            <Button
              onClick={() => {
                setEditingInvestment(null);
                setFormData({
                  symbol: '',
                  name: '',
                  shares: '',
                  purchase_price: '',
                  current_price: '',
                  purchase_date: new Date().toISOString().split('T')[0],
                });
                setShowAddDialog(true);
              }}
              className="bg-carbon text-white hover:bg-signal-blue"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Position
            </Button>
          </div>
          {investments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No investments yet. Click "Add New Position" to get started.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-grid-line">
                  <th className="text-left p-4 font-semibold">Ticker</th>
                  <th className="text-left p-4 font-semibold">Company Name</th>
                  <th className="text-right p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Avg. Price</th>
                  <th className="text-right p-4 font-semibold">Current Value</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b border-grid-line hover:bg-gray-50">
                    <td className="p-4 font-mono font-semibold">{inv.symbol}</td>
                    <td className="p-4">{inv.name}</td>
                    <td className="p-4 text-right">{inv.shares}</td>
                    <td className="p-4 text-right">${inv.purchase_price.toFixed(2)}</td>
                    <td className="p-4 text-right font-semibold">
                      ${(inv.shares * inv.current_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingInvestment(inv);
                            setFormData({
                              symbol: inv.symbol,
                              name: inv.name,
                              shares: inv.shares.toString(),
                              purchase_price: inv.purchase_price.toString(),
                              current_price: inv.current_price.toString(),
                              purchase_date: inv.purchase_date,
                            });
                            setShowAddDialog(true);
                          }}
                          className="px-3 py-1.5 border border-grid-line rounded-lg hover:border-signal-blue transition-colors flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInvestment(inv.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:border-red-400 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Capital Flow History */}
        <div className="bg-white rounded-lg border border-grid-line p-6">
          <h2 className="text-xl font-bold mb-6">Capital Flow History</h2>
          {cashFlows.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No capital flow history available</div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300"></div>
              
              {/* Flow markers */}
              <div className="relative flex justify-between pt-8 pb-4">
                {cashFlows.map((flow) => (
                  <div key={flow.id} className="flex flex-col items-center" style={{ width: `${100 / cashFlows.length}%` }}>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      flow.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {flow.type === 'deposit' ? '+' : '-'}${Math.abs(flow.amount).toLocaleString()}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      flow.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(flow.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Investment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingInvestment ? 'Edit Position' : 'Add New Position'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Ticker Symbol</Label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Apple Inc."
              />
            </div>
            <div>
              <Label>Quantity (Shares)</Label>
              <Input
                type="number"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                placeholder="50"
              />
            </div>
            <div>
              <Label>Purchase Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                placeholder="175.50"
              />
            </div>
            <div>
              <Label>Current Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                placeholder="175.50"
              />
            </div>
            <div>
              <Label>Purchase Date</Label>
              <Input
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveInvestment} className="flex-1 bg-carbon text-white hover:bg-signal-blue">
                {editingInvestment ? 'Save Changes' : 'Add Position'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
