import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Users, Activity, Loader2 } from 'lucide-react';

export default function SuperAdminView() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/super');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
        setActivities(data.activities || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admins.length >= 9) { // 1 super + 8 admins max
      alert('Maximum number of admins reached (1 Super + 8 Admins).');
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/super', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreate(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to create admin');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-bg-cream/50">Loading Super Admin Panel...</div>;
  }

  return (
    <div className="bg-brand-green border border-bg-beige/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl h-full">
      <div className="p-6 border-b border-bg-beige/10 flex justify-between items-center bg-brand-green/50 sticky top-0 z-10 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center text-red-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-bg-cream">Super Admin Command Center</h2>
            <p className="text-xs text-bg-cream/50 uppercase tracking-widest mt-0.5">Manage administrative access and track activities</p>
          </div>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-brand-gold text-brand-green px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-xl flex items-center gap-2 hover:bg-brand-gold/90 transition-all"
          >
            <Plus className="w-4 h-4" /> New Admin
          </button>
        )}
      </div>

      <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Admins List & Create Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-bg-beige/10 pb-3">
            <Users className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg text-bg-cream font-bold">Authorized Personnel</h3>
            <span className="text-[10px] ml-auto bg-bg-cream/10 px-2 rounded-full py-0.5">{admins.length} / 9</span>
          </div>

          {showCreate && (
            <form onSubmit={handleCreateAdmin} className="bg-bg-cream/5 border border-brand-gold/30 rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-brand-gold">Register New Administrator</h4>
              <input required type="text" placeholder="Full Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-brand-green border border-bg-beige/20 text-bg-cream text-xs rounded-xl px-4 py-2" />
              <input required type="email" placeholder="Email Address" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-brand-green border border-bg-beige/20 text-bg-cream text-xs rounded-xl px-4 py-2" />
              <input required type="password" placeholder="Temporary Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-brand-green border border-bg-beige/20 text-bg-cream text-xs rounded-xl px-4 py-2" />
              <div className="flex gap-2">
                <button type="submit" disabled={actionLoading} className="bg-brand-gold text-brand-green px-4 py-2 text-xs uppercase font-bold rounded-xl flex-1">{actionLoading ? 'Creating...' : 'Create Admin'}</button>
                <button type="button" onClick={() => setShowCreate(false)} className="bg-bg-cream/10 text-bg-cream px-4 py-2 text-xs uppercase font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {admins.map(admin => (
              <div key={admin.id} className="bg-bg-cream/5 border border-bg-beige/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h5 className="font-serif text-sm font-bold text-bg-cream flex items-center gap-2">
                    {admin.name} 
                    {admin.role === 'super_admin' && <span className="text-[9px] bg-red-900/50 text-red-400 px-1.5 rounded uppercase tracking-wider">Super</span>}
                  </h5>
                  <span className="text-[10px] text-bg-cream/50">{admin.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-bg-beige/10 pb-3">
            <Activity className="w-4 h-4 text-brand-gold" />
            <h3 className="font-serif text-lg text-bg-cream font-bold">Activity Surveillance</h3>
          </div>
          
          <div className="bg-bg-cream/5 border border-bg-beige/10 rounded-xl overflow-hidden">
            {activities.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto divide-y divide-bg-beige/5">
                {activities.map(act => (
                  <div key={act.id} className="p-4 hover:bg-bg-cream/5 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] uppercase text-brand-gold font-bold">{act.action}</span>
                      <span className="text-[9px] text-bg-cream/40">{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-bg-cream/90">{act.details}</p>
                    <p className="text-[10px] text-bg-cream/50 mt-1">By: {act.admin_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-bg-cream/40 text-center py-10 text-xs">No administrative activities logged yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
