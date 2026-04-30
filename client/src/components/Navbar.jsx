import {
  ChevronDown,
  Settings as SettingsIcon,
  LogOut,
  Calculator,
  Activity,
  ClipboardList,
} from 'lucide-react';

const Navbar = ({ page, setPage, user, setUser }) => {
  const token = user?.token || localStorage.getItem('token');
  const userName = user?.name || localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    setUser(null);
    setPage('home');
  };

  const isActive = (path) => {
    if (path === '/') return page === 'home';
    return '/' + page === path;
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="flex items-center gap-2.5 group">
            <Calculator className="w-7 h-7 text-blue-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            <span className="text-xl font-bold text-slate-100 tracking-tight">ForeSight</span>
          </a>

          {token ? (
            <>
              {/* Authenticated Nav Links */}
              <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 p-1 rounded-lg hidden sm:flex">
                <button
                  onClick={() => setPage('dashboard')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-slate-800 text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setPage('history')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/history')
                      ? 'bg-slate-800 text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  History
                </button>
              </div>

              {/* User Dropdown */}
              <div className="relative group ml-auto sm:ml-2">
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${userName}&backgroundColor=0f172a`}
                    alt={userName}
                    className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700"
                  />
                  <span className="text-sm font-medium text-slate-300 hidden sm:block">
                    {userName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block flex-shrink-0" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block transition-all z-50">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden">
                    <button
                      onClick={() => setPage('dashboard')}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors border-b border-slate-800 flex items-center gap-2 sm:hidden"
                    >
                      <Activity className="w-4 h-4 flex-shrink-0" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => setPage('history')}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors border-b border-slate-800 flex items-center gap-2 sm:hidden"
                    >
                      <ClipboardList className="w-4 h-4 flex-shrink-0" />
                      History
                    </button>
                    <button
                      onClick={() => setPage('settings')}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800 text-sm font-medium text-slate-300 hover:text-white transition-colors border-b border-slate-800 flex items-center gap-2"
                    >
                      <SettingsIcon className="w-4 h-4 flex-shrink-0" />
                      Account Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-rose-500/10 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Unauthenticated User section */}
              <div className="flex items-center">
                <button onClick={() => setPage('login')} className="px-5 py-2.5 rounded-md text-sm font-medium text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-sm">
                  Log In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
