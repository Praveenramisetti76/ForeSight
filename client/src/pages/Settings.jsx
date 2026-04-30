import { useState } from 'react';
import { Settings as SettingsIcon, Loader2 } from 'lucide-react';
import api from '../api';

const Settings = ({ user, setUser, setPage }) => {
  const [form, setForm] = useState({ name: user?.name || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage(''); setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage(''); setError('');
    try {
      await api.put('/auth/settings', form);
      const updatedUser = { ...user, name: form.name };
      localStorage.setItem('userName', form.name);
      setUser(updatedUser);
      setMessage('Settings saved successfully.');
    } catch (err) {
      setError('Failed to update settings.');
    } finally { setLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This will delete your account forever.")) {
      try {
        await api.delete('/auth/account');
      } catch (err) { /* ignore */ }
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
      setUser(null);
      setPage('home');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-slide-up w-full">
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <SettingsIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-slate-100">Account Settings</h2>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage your profile and application preferences.</p>
      </div>

      <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl relative z-10 mb-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
          <img
            src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user?.name || 'User'}&backgroundColor=0f172a`}
            alt={user?.name || 'User'}
            className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 shadow-sm"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-100">{user?.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">
              {user?.role === 'admin' ? 'Administrator' : 'Project Manager'}
            </p>
          </div>
        </div>

        {message && <div className="mb-5 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-fade-in">{message}</div>}
        {error && <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">{error}</div>}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">DISPLAY NAME</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">NEW PASSWORD (OPTIONAL)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-md hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> SAVING...</> : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass rounded-xl p-6 sm:p-8 border border-rose-500/20 bg-rose-500/5 shadow-xl relative z-10">
        <h3 className="text-rose-400 font-bold text-base mb-2 uppercase tracking-wide">Danger Zone</h3>
        <p className="text-slate-400 text-sm font-medium mb-6">Once you delete your account, there is no going back. All your predictive risk logs will be lost permanently.</p>
        <button onClick={handleDeleteAccount}
          className="px-6 py-2.5 border border-rose-500/50 text-rose-400 text-sm font-bold uppercase tracking-wide rounded-md hover:bg-rose-500/10 transition-colors">
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
};

export default Settings;
