import { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Shield,
  Key,
  Camera,
  Check,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import SEO from '../../components/SEO';

export default function Profile() {
  const { user, profile, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');

  // Effect to sync fullName when profile changes (e.g., after initial load)
  useEffect(() => {
    if (profile?.full_name && !isEditing) {
      setFullName(profile.full_name);
    }
  }, [profile?.full_name, isEditing]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaved(false);

    try {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        full_name: fullName,
        updated_at: new Date().toISOString()
      });

      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Profile save error:', err);
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const displayRole = role === 'platform_owner' ? 'Admin' : (role || 'Candidate');

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <SEO title="Profile" noindex />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
           <User className="text-purple-400" size={32} />
          Profile
        </h1>
        <p className="text-slate-400 font-medium mt-1 uppercase tracking-widest text-[10px]">
          Manage your account details
        </p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-10">
        {/* Sidebar / Avatar */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                <div className="w-full h-full rounded-[1.25rem] bg-slate-950 flex items-center justify-center text-white text-3xl font-black">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <button 
                title="Change Avatar"
                aria-label="Change avatar"
                className="absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={14} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">{profile?.full_name || 'Nova User'}</h3>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">{displayRole}</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">ACCOUNT_STATUS</span>
                <span className="text-emerald-400 font-mono text-[10px]">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">SUBSCRIPTION</span>
                <span className="text-blue-400 font-mono text-[10px]">{profile?.subscription_tier || 'Free'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Details</h2>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Check size={12} /> Saved
                  </span>
                )}
                <button 
                  title={isEditing ? 'Cancel editing' : 'Edit profile'}
                  aria-label={isEditing ? 'Cancel editing' : 'Edit profile'}
                  onClick={() => {
                    if (isEditing) {
                      setFullName(profile?.full_name || '');
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-300 transition-colors"
                >
                  {isEditing ? 'CANCEL' : 'EDIT'}
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label htmlFor="identity_email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">EMAIL</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    id="identity_email"
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    title="Email (cannot be changed)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="full_name" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">FULL NAME</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={16} />
                  <input 
                    id="full_name"
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={!isEditing}
                    title="Full Name"
                    placeholder="Enter your full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="role_display" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">ROLE</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      id="role_display"
                      type="text" 
                      value={displayRole}
                      disabled 
                      title="Role (system managed)"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="access_key" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">USER ID</label>
                  <div className="relative group">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      id="access_key"
                      type="text" 
                      value={user?.uid?.slice(0, 12) + '...' || ''} 
                      disabled 
                      title="User ID"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-400 font-mono focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
