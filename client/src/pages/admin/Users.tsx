import { useState, useEffect } from 'react';
import { Users, Shield, Search, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserProfile {
  id: string;
  full_name: string | null;
  email?: string;
  role: string;
  subscription_tier: string | null;
  created_at?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error);
        } else if (data) {
          setUsers(data);
        }
      } catch (err) {
        console.error('Users fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = searchQuery === '' || 
      (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: users.length,
    candidate: users.filter(u => u.role === 'candidate').length,
    employer: users.filter(u => u.role === 'employer').length,
    admin: users.filter(u => u.role === 'admin' || u.role === 'platform_owner').length,
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Users className="text-blue-400" size={32} />
          User Management
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Manage platform users and access
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', count: roleCounts.all, color: 'blue' },
          { label: 'Candidates', count: roleCounts.candidate, color: 'emerald' },
          { label: 'Employers', count: roleCounts.employer, color: 'purple' },
          { label: 'Admins', count: roleCounts.admin, color: 'red' },
        ].map(stat => (
          <div key={stat.label} className="p-5 rounded-2xl nova-glass-card hover:scale-105 transition-transform glow-uv">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full nova-input rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
          />
        </div>
        <div className="relative">
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            title="Filter by role"
            className="nova-input rounded-2xl px-5 py-3 pr-10 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors appearance-none min-w-[160px]"
          >
            <option value="all" className="bg-[#0F1114]">All Roles</option>
            <option value="candidate" className="bg-[#0F1114]">Candidates</option>
            <option value="employer" className="bg-[#0F1114]">Employers</option>
            <option value="admin" className="bg-[#0F1114]">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Loading users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-white/10 nova-glass-card rounded-[2rem] text-center">
          <Users className="mx-auto text-slate-600 mb-4" size={32} />
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">No users found</p>
        </div>
      ) : (
        <div className="rounded-[2rem] nova-glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan</th>
                  <th className="text-left p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-black">
                          {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{u.full_name || 'Unnamed'}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        u.role === 'admin' || u.role === 'platform_owner' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : u.role === 'employer' 
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-mono text-slate-400">
                        {u.subscription_tier || 'Free'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Shield size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
