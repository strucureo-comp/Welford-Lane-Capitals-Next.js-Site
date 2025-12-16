'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/supabase';
import { LogOut, User } from 'lucide-react';

type ActiveTab = 'requests' | 'portfolios' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('requests');
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get current user session (middleware already verified auth)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        // This shouldn't happen since middleware protects this route
        console.error('No session found in admin page');
        setLoading(false);
        return;
      }

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('Profile error:', profileError);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      console.log('Admin session user ID:', session.user.id);
      console.log('Admin profile role:', profileData.role);

      // Get pending users
      console.log('Fetching pending users...');
      const { data: pendingData, error: pendingError, status, statusText } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('Pending users query result:', { 
        count: pendingData?.length, 
        error: pendingError,
        status,
        statusText,
        data: pendingData 
      });

      if (!pendingError && pendingData) {
        console.log('Setting pending users:', pendingData.length, 'users');
        setPendingUsers(pendingData);
      } else if (pendingError) {
        console.error('Error fetching pending users:', pendingError);
        console.error('Error details:', JSON.stringify(pendingError, null, 2));
      } else {
        console.log('No error but no data either');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: string) {
    if (!confirm('Are you sure you want to approve this user? An email with credentials will be sent to them.')) {
      return;
    }

    setProcessingUserId(userId);
    try {
      const response = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve user');
      }

      // Show success message with credentials
      alert(
        `✅ User approved successfully!\n\n` +
        `📧 Email sent to: ${data.email}\n` +
        `🔑 Temporary password: ${data.temporaryPassword}\n\n` +
        `The user will receive their login credentials via email.`
      );

      // Reload data
      await loadData();
    } catch (error: any) {
      alert('❌ Error: ' + (error.message || 'Failed to approve user'));
    } finally {
      setProcessingUserId(null);
    }
  }

  async function handleReject(userId: string) {
    if (!confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      return;
    }

    setProcessingUserId(userId);
    try {
      const response = await fetch('/api/admin/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject user');
      }

      alert('✅ User rejected successfully');

      // Reload data
      await loadData();
    } catch (error: any) {
      alert('❌ Error: ' + (error.message || 'Failed to reject user'));
    } finally {
      setProcessingUserId(null);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">WLC.</h1>
            
            {/* Navigation Tabs */}
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'requests'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Requests
              </button>
              <button
                onClick={() => setActiveTab('portfolios')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'portfolios'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Portfolios
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Settings
              </button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Admin Panel</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'requests' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Pending Access Requests</h2>

            {pendingUsers.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No pending access requests</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Applicant Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Contact Info
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date Applied
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {user.email}
                            {user.phone_number && (
                              <span className="text-gray-500"> | {user.phone_number}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(user.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            disabled={processingUserId === user.id}
                            className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingUserId === user.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            disabled={processingUserId === user.id}
                            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Portfolios</h2>
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-500">Portfolio management coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>
            <div className="bg-white rounded-lg shadow p-8">
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Portfolio Management Component
function PortfolioManagementView({ 
  users, 
  investments, 
  snapshots,
  onUpdate 
}: { 
  users: Profile[], 
  investments: Investment[], 
  snapshots: PortfolioSnapshot[],
  onUpdate: () => void 
}) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    shares: '',
    purchase_price: '',
    current_price: '',
    purchase_date: '',
  });

  useEffect(() => {
    if (selectedUserId) {
      const userInv = investments.filter(inv => inv.user_id === selectedUserId);
      setUserInvestments(userInv);
    } else {
      setUserInvestments([]);
    }
  }, [selectedUserId, investments]);

  async function handleSaveInvestment() {
    if (!selectedUserId || !editingInvestment) return;

    try {
      const { error } = await supabase
        .from('investments')
        .update({
          symbol: formData.symbol,
          name: formData.name,
          shares: parseFloat(formData.shares),
          purchase_price: parseFloat(formData.purchase_price),
          current_price: parseFloat(formData.current_price),
          purchase_date: formData.purchase_date,
        })
        .eq('id', editingInvestment.id);

      if (error) throw error;
      setEditingInvestment(null);
      setShowAddDialog(false);
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to update investment');
    }
  }

  async function handleAddInvestment() {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from('investments')
        .insert({
          user_id: selectedUserId,
          symbol: formData.symbol,
          name: formData.name,
          shares: parseFloat(formData.shares),
          purchase_price: parseFloat(formData.purchase_price),
          current_price: parseFloat(formData.current_price),
          purchase_date: formData.purchase_date,
        });

      if (error) throw error;
      setFormData({
        symbol: '',
        name: '',
        shares: '',
        purchase_price: '',
        current_price: '',
        purchase_date: '',
      });
      setShowAddDialog(false);
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to add investment');
    }
  }

  async function handleDeleteInvestment(id: string) {
    if (!confirm('Are you sure you want to delete this investment?')) return;

    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onUpdate();
    } catch (error: any) {
      alert(error.message || 'Failed to delete investment');
    }
  }

  const selectedUserSnapshots = snapshots.filter(s => s.user_id === selectedUserId);
  const timelineData = selectedUserSnapshots.map(s => ({
    date: new Date(s.snapshot_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    invested: s.total_invested,
    value: s.current_value,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-carbon">Portfolio Management</h1>
        <div className="flex gap-4">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedUserId && (
            <Button onClick={() => {
              setEditingInvestment(null);
              setFormData({
                symbol: '',
                name: '',
                shares: '',
                purchase_price: '',
                current_price: '',
                purchase_date: '',
              });
              setShowAddDialog(true);
            }}>
              Add Investment
            </Button>
          )}
        </div>
      </div>

      {selectedUserId ? (
        <div className="space-y-8">
          {timelineData.length > 0 && (
            <div className="bg-white rounded-lg border border-grid-line p-6">
              <h2 className="text-xl font-bold mb-4">Investment Timeline</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${(value / 1e6).toFixed(2)}M`} />
                  <Legend />
                  <Area type="monotone" dataKey="invested" stroke="#8884d8" fillOpacity={1} fill="url(#colorInvested)" name="Amount Invested" />
                  <Area type="monotone" dataKey="value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorValue)" name="Current Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-lg border border-grid-line overflow-hidden">
            <div className="p-6 border-b border-grid-line">
              <h2 className="text-xl font-bold">Current Holdings</h2>
            </div>
            {userInvestments.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No investments for this user
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-grid-line">
                    <th className="text-left p-4 text-sm font-semibold">Symbol</th>
                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                    <th className="text-right p-4 text-sm font-semibold">Shares</th>
                    <th className="text-right p-4 text-sm font-semibold">Purchase Price</th>
                    <th className="text-right p-4 text-sm font-semibold">Current Price</th>
                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                    <th className="text-right p-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userInvestments.map(inv => (
                    <tr key={inv.id} className="border-b border-grid-line hover:bg-gray-50">
                      <td className="p-4 font-mono">{inv.symbol}</td>
                      <td className="p-4">{inv.name}</td>
                      <td className="p-4 text-right">{inv.shares.toLocaleString()}</td>
                      <td className="p-4 text-right">${inv.purchase_price.toFixed(2)}</td>
                      <td className="p-4 text-right">${inv.current_price.toFixed(2)}</td>
                      <td className="p-4">{new Date(inv.purchase_date).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
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
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvestment(inv.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-grid-line p-12 text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Select a user to manage their portfolio</p>
        </div>
      )}

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingInvestment ? 'Edit Investment' : 'Add Investment'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Symbol</Label>
              <Input
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
              />
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Apple Inc."
              />
            </div>
            <div>
              <Label>Shares</Label>
              <Input
                type="number"
                value={formData.shares}
                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label>Purchase Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                placeholder="150.00"
              />
            </div>
            <div>
              <Label>Current Price</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.current_price}
                onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                placeholder="175.00"
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
            <div className="flex gap-2">
              <Button onClick={editingInvestment ? handleSaveInvestment : handleAddInvestment} className="flex-1">
                {editingInvestment ? 'Save Changes' : 'Add Investment'}
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingInvestment(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Settings View Component
function SettingsView({ profile }: { profile: Profile | null }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-carbon mb-8">Settings</h1>
      <div className="bg-white rounded-lg border border-grid-line p-6">
        <h2 className="text-xl font-bold mb-4">Admin Account</h2>
        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={profile?.full_name || ''} disabled />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile?.email || ''} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
