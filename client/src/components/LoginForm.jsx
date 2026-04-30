import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../api';

const LoginForm = ({ setUser, setPage, isLogin, setIsLogin }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userName', res.data.name);
        setUser({ token: res.data.access_token, role: res.data.role, name: res.data.name, email: res.data.email });
        setPage('dashboard');
      } else {
        if (!form.name.trim()) {
          setError('Name is required');
          setLoading(false);
          return;
        }
        await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'manager',
        });
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('userName', res.data.name);
        setUser({ token: res.data.access_token, role: res.data.role, name: res.data.name, email: res.data.email });
        setPage('dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle placed outside the main form container to match navbar pills */}
      <div className="flex justify-center mb-6 w-full">
        <div className="flex items-center w-full max-w-[280px] bg-slate-900/50 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              isLogin ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              !isLogin ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl relative z-10">
        {error && (
          <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="animate-fade-in space-y-1.5">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">DISPLAY NAME</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">EMAIL ADDRESS</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">PASSWORD</label>
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><Loader2 className="animate-spin h-4 w-4 flex-shrink-0" /> {isLogin ? 'LOGGING IN...' : 'CREATING ACCOUNT...'}</>
            ) : (
              isLogin ? 'LOG IN' : 'CREATE ACCOUNT'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
