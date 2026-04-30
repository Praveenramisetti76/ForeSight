import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Settings as SettingsIcon, 
  LogOut, 
  Check, 
  AlertTriangle, 
  X, 
  Database, 
  BarChart3, 
  Loader2, 
  Trophy, 
  UploadCloud,
  Calculator,
  FileText,
  RefreshCw,
  Shield,
  Sliders,
  Activity,
  ClipboardList,
  Github,
  User,
  ArrowRight,
  Sparkles
} from 'lucide-react';

/** * DUMMY API SIMULATION */
const mockApi = {
  post: async (path, data) => {
    await new Promise(r => setTimeout(r, 800));
    if (path === '/auth/login') {
      if (data.email === 'admin@foresight.com' && data.password === '12345678') {
        return {
          data: {
            access_token: 'admin-token-' + Math.random(),
            role: 'admin',
            name: 'Admin',
            email: data.email
          }
        };
      }
      return {
        data: {
          access_token: 'dummy-token-' + Math.random(),
          role: data.email.includes('admin') ? 'admin' : 'manager',
          name: data.name || data.email.split('@')[0],
          email: data.email
        }
      };
    }
    if (path === '/auth/register') {
      return { data: { message: 'User registered successfully' } };
    }
    if (path === '/projects/predict') {
      await new Promise(r => setTimeout(r, 1500)); 
      const score = Math.random();
      let level = 'Low';
      if (score > 0.3) level = 'Medium';
      if (score > 0.7) level = 'High';
      return {
        data: {
          project_id: Math.random().toString(36).substr(2, 9),
          project_type: data.project_type,
          duration: data.duration,
          budget: data.budget,
          team_size: data.team_size,
          stakeholder_count: data.stakeholder_count,
          methodology: data.methodology,
          team_experience: data.team_experience,
          risk_level: level,
          risk_score: score,
          timestamp: new Date().toISOString()
        }
      };
    }
    if (path === '/admin/upload-dataset') {
      await new Promise(r => setTimeout(r, 1200)); 
      return { data: { message: 'Dataset uploaded and model retrained successfully!' } };
    }
    return { data: { message: 'Success' } };
  },
  get: async (path) => {
    await new Promise(r => setTimeout(r, 600));
    if (path === '/projects/history') {
      return {
        data: [
          { project_id: '1', project_type: 'ERP Implementation', duration: 12, budget: 500000, team_size: 15, stakeholder_count: 8, methodology: 'Waterfall', team_experience: 'Mixed', risk_level: 'Medium', risk_score: 0.45, timestamp: new Date().toISOString() },
          { project_id: '2', project_type: 'Web Application', duration: 6, budget: 150000, team_size: 5, stakeholder_count: 2, methodology: 'Agile', team_experience: 'Junior', risk_level: 'Low', risk_score: 0.12, timestamp: new Date(Date.now() - 86400000).toISOString() },
          { project_id: '3', project_type: 'Cloud Migration', duration: 24, budget: 2500000, team_size: 45, stakeholder_count: 12, methodology: 'Hybrid', team_experience: 'Senior', risk_level: 'High', risk_score: 0.88, timestamp: new Date(Date.now() - 172800000).toISOString() },
        ]
      };
    }
  },
  put: async (path, data) => {
    await new Promise(r => setTimeout(r, 500));
    return { data: { message: 'Settings updated successfully' } };
  }
};

// --- THREE.JS MODEL LOADER COMPONENT ---

const ThreeModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = false;
    script.onload = initThree;
    document.head.appendChild(script);

    let scene, camera, renderer, model;
    let mouseX = 0, mouseY = 0;

    function initThree() {
      const THREE = window.THREE;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(0x3b82f6, 1.5); 
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);
      
      const subtleLight = new THREE.PointLight(0x1e293b, 3); 
      subtleLight.position.set(-5, -5, 5);
      scene.add(subtleLight);

      // Direct procedural geometry
      const geometry = new THREE.IcosahedronGeometry(2.5, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.15 });
      model = new THREE.Mesh(geometry, material);
      scene.add(model);

      const animate = () => {
        requestAnimationFrame(animate);

        if (model) {
          model.rotation.x += (mouseY * 0.5 - model.rotation.x) * 0.05;
          model.rotation.y += (mouseX * 0.5 - model.rotation.y) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();
    }

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    };

    const onResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />;
};


// --- UI COMPONENTS ---

const CustomSelect = ({ value, onChange, options, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden py-2 max-h-60 overflow-y-auto animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt } });
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-800 ${
                value === opt ? 'text-blue-400 bg-slate-800/50' : 'text-slate-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

const RiskResultCard = ({ result }) => {
  if (!result) return null;

  const riskStyles = {
    Low: { 
      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', 
      fill: 'bg-emerald-500', icon: <Check className="w-8 h-8 text-emerald-400" />
    },
    Medium: { 
      color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', 
      fill: 'bg-amber-500', icon: <AlertTriangle className="w-8 h-8 text-amber-400" />
    },
    High: { 
      color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', 
      fill: 'bg-rose-500', icon: <X className="w-8 h-8 text-rose-400" />
    },
  };

  const style = riskStyles[result.risk_level] || riskStyles.Medium;
  const scorePercent = result.risk_score * 100;

  return (
    <div className={`glass rounded-xl p-6 sm:p-8 animate-slide-up border border-slate-800 shadow-xl bg-slate-900/40 h-full flex flex-col relative z-10`}>
      
      {/* Central Risk Display */}
      <div className="text-center flex flex-col items-center justify-center mb-8 pt-4">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${style.bg} ${style.border} border mb-4 relative`}>
          {style.icon}
        </div>
        <h3 className={`text-2xl font-bold uppercase tracking-widest ${style.color}`}>
          {result.risk_level} Risk
        </h3>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Classification based on project parameters
        </p>
      </div>

      {/* Confidence Score Bar */}
      <div className="mb-10 px-2 w-full">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Model Confidence</span>
          <span className={`text-lg font-bold ${style.color}`}>{scorePercent.toFixed(1)}%</span>
        </div>
        
        <div className="relative pt-1">
          <div className="flex h-2.5 rounded-full overflow-hidden bg-slate-800/80 border border-slate-700/50">
            <div 
              className={`h-full rounded-full ${style.fill} transition-all duration-1000 ease-out relative`} 
              style={{ width: `${scorePercent}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/20 rounded-r-full"></div>
            </div>
          </div>
          
          {/* Scale Labels */}
          <div className="flex justify-between mt-3 text-[10px] font-medium tracking-wider text-slate-500">
            <span>UNCERTAIN (0%)</span>
            <span>HIGHLY CONFIDENT (100%)</span>
          </div>
        </div>
      </div>

      {/* Parameter Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-auto">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-sm font-semibold text-slate-100 truncate" title={result.project_type}>{result.project_type}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">TYPE</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-sm font-semibold text-slate-100 truncate" title={result.methodology}>{result.methodology}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">METHOD</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-sm font-semibold text-slate-100">{result.team_experience}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">EXPERIENCE</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-base font-semibold text-slate-100">{result.duration} mo</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">DURATION</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-base font-semibold text-slate-100">₹{Number(result.budget).toLocaleString('en-IN')}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">BUDGET</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
          <div className="text-base font-semibold text-slate-100">{result.team_size}</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">TEAM SIZE</div>
        </div>
      </div>
    </div>
  );
};

const HistoryTable = ({ records }) => {
  const riskBadge = {
    Low: 'text-emerald-400',
    Medium: 'text-amber-400',
    High: 'text-rose-400',
  };

  if (!records || records.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center animate-fade-in border border-slate-800 shadow-xl relative z-10">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
          <Database className="w-6 h-6 text-slate-500 flex-shrink-0" />
        </div>
        <h3 className="text-sm font-medium text-slate-300 mb-1">No predictions yet</h3>
        <p className="text-xs text-slate-500">Your prediction history will appear here.</p>
      </div>
    );
  }

  // Removed internal bg-slate-900/50 wrapper, making table flush with glass borders.
  return (
    <div className="glass rounded-xl border border-slate-800 shadow-xl animate-fade-in relative z-10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30">
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Dur.</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Stakeholders</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Method</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Conf.</th>
              <th className="px-6 py-5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/20">
            {records.map((record, index) => (
              <tr key={record.project_id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 text-xs font-medium text-slate-400">{index + 1}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-300 truncate max-w-[120px]" title={record.project_type}>{record.project_type}</td>
                <td className="px-6 py-4 text-xs text-slate-300">{record.duration}mo</td>
                <td className="px-6 py-4 text-xs text-slate-300">₹{(record.budget/1000).toFixed(0)}k</td>
                <td className="px-6 py-4 text-xs text-slate-300">{record.team_size}</td>
                <td className="px-6 py-4 text-xs text-slate-300">{record.stakeholder_count || '-'}</td>
                <td className="px-6 py-4 text-xs text-slate-300 truncate max-w-[80px]">{record.methodology || '-'}</td>
                <td className="px-6 py-4 text-xs text-slate-300">{record.team_experience || '-'}</td>
                <td className="px-6 py-4 text-xs font-semibold">
                  <span className={`${riskBadge[record.risk_level] || riskBadge.Medium}`}>
                    {record.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">{(record.risk_score * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(record.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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
        const res = await mockApi.post('/auth/login', {
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
        await mockApi.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'manager', 
        });
        const res = await mockApi.post('/auth/login', {
          email: form.email,
          password: form.password,
          name: form.name
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

// --- PAGES ---

const Home = ({ setPage }) => (
  <div className="min-h-[calc(100vh-64px)] overflow-hidden relative flex flex-col font-sans">
    <ThreeModel />
    <div className="relative z-10 flex-grow flex items-center justify-center flex-col px-6 text-center py-20">
      <div className="max-w-4xl mx-auto animate-slide-up flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          AI-Powered Risk Assessment
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-100 tracking-tight leading-tight mb-8">
          See the Future of Your <br/>
          <span className="text-blue-500">Software Projects</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-10">
          ForeSight uses advanced machine learning models to predict delivery risks based on various project parameters. Prevent failures before they happen.
        </p>
        <button onClick={() => setPage('login')} className="flex items-center gap-2 px-8 py-3.5 rounded-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors uppercase tracking-wide">
          Get Started Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const Dashboard = ({ user }) => {
  const role = user?.role || localStorage.getItem('role');
  const [form, setForm] = useState({
    project_type: 'Web Application',
    team_size: '',
    budget: '',
    duration: '',
    stakeholder_count: '',
    methodology: 'Agile',
    team_experience: 'Mixed'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [csvFile, setCsvFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const dur = parseInt(form.duration);
    const bud = parseFloat(form.budget);
    const ts = parseInt(form.team_size);
    const sc = parseInt(form.stakeholder_count);

    if (!form.duration || !form.budget || !form.team_size || !form.stakeholder_count) {
      return setError('All numerical fields are required');
    }
    if (isNaN(dur) || dur <= 0) return setError('Duration must be a positive integer');
    if (isNaN(bud) || bud <= 0) return setError('Budget must be a positive number');
    if (isNaN(ts) || ts <= 0) return setError('Team size must be a positive integer');
    if (isNaN(sc) || sc <= 0) return setError('Stakeholder count must be a positive integer');

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await mockApi.post('/projects/predict', {
        project_type: form.project_type,
        duration: dur,
        budget: bud,
        team_size: ts,
        stakeholder_count: sc,
        methodology: form.methodology,
        team_experience: form.team_experience
      });
      setResult(res.data);
    } catch (err) {
      setError('Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCSV = async () => {
    if (!csvFile) return;
    setUploadMsg('');
    setIsRetraining(true);
    try {
      const res = await mockApi.post('/admin/upload-dataset', {});
      setUploadMsg(res.data.message);
      setCsvFile(null);
    } catch (err) { setUploadMsg('Upload failed'); }
    finally { setIsRetraining(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
      
      {/* Admin Panel */}
      {role === 'admin' && (
        <div className="mb-12 animate-slide-up">
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <h2 className="text-xl font-bold text-slate-100">Admin Panel</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage settings and view metrics.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CSV Upload Column */}
            <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl lg:col-span-1 h-full flex flex-col relative z-10">
              <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <RefreshCw className="w-4 h-4 text-blue-500 flex-shrink-0" /> Model Retraining
              </h3>
              <p className="text-xs font-medium text-slate-500 mb-5 leading-relaxed flex-shrink-0">
                Upload data to recalibrate the model.
              </p>
              
              <div className="flex-grow flex flex-col justify-start space-y-4 w-full items-stretch">
                <label className="relative w-full flex flex-col items-center justify-center p-6 flex-grow min-h-[160px] border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer overflow-hidden">
                  <input
                    type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={csvFile !== null}
                  />
                  {!csvFile ? (
                    <div className="pointer-events-none flex flex-col items-center justify-center">
                      <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                      <span className="text-xs font-semibold text-slate-300">Drag and drop file</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">or click to browse</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-slate-900 flex flex-col items-center justify-center z-20">
                      <FileText className="w-6 h-6 text-blue-400 mb-2 flex-shrink-0" />
                      <span className="text-xs font-bold text-blue-400 text-center px-4 max-w-full truncate">{csvFile.name}</span>
                      <button 
                        onClick={(e) => { e.preventDefault(); setCsvFile(null); }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 z-30 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </label>
                <button
                  onClick={handleUploadCSV} disabled={!csvFile || isRetraining}
                  className="w-full py-2.5 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  {isRetraining ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Recalibrating...</> : 'Upload & Recalibrate'}
                </button>
                {uploadMsg && <p className="text-xs font-semibold text-blue-400 text-center w-full">{uploadMsg}</p>}
              </div>
            </div>

            {/* Model Metrics Column */}
            <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl lg:col-span-2 relative overflow-hidden z-10">
              {isRetraining && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-30 animate-fade-in">
                  <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Recalibrating Model...</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Processing new dataset and updating weights</p>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Best Model: XGBoost</h3>
                </div>
                <div className="text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  Accuracy: 90.77%
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                {/* Classification Report Table */}
                <div className="flex flex-col h-full overflow-hidden">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex-shrink-0">Classification Report</h4>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-x-auto flex-grow flex flex-col justify-center">
                    <table className="w-full text-xs text-left border-collapse h-full min-w-[420px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px]">Class</th>
                          <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Precision</th>
                          <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Recall</th>
                          <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">F1-Score</th>
                          <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Support</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300 font-medium">
                        <tr className="border-b border-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-200">High</td>
                          <td className="py-2.5 px-3 text-right">0.92</td>
                          <td className="py-2.5 px-3 text-right">0.89</td>
                          <td className="py-2.5 px-3 text-right">0.91</td>
                          <td className="py-2.5 px-3 text-right">1039</td>
                        </tr>
                        <tr className="border-b border-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-200">Low</td>
                          <td className="py-2.5 px-3 text-right">0.90</td>
                          <td className="py-2.5 px-3 text-right">0.74</td>
                          <td className="py-2.5 px-3 text-right">0.81</td>
                          <td className="py-2.5 px-3 text-right">253</td>
                        </tr>
                        <tr className="border-b border-slate-800/50">
                          <td className="py-2.5 px-3 font-semibold text-slate-200">Medium</td>
                          <td className="py-2.5 px-3 text-right">0.90</td>
                          <td className="py-2.5 px-3 text-right">0.94</td>
                          <td className="py-2.5 px-3 text-right">0.92</td>
                          <td className="py-2.5 px-3 text-right">1708</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Confusion Matrix Table */}
                <div className="flex flex-col h-full overflow-hidden">
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex-shrink-0">Confusion Matrix</h4>
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-x-auto flex-grow flex flex-col justify-center">
                    <table className="w-full text-[11px] font-medium text-center border-collapse h-full min-w-[320px]">
                      <thead>
                        <tr>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Act \ Pred</th>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">High</th>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">Low</th>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">Medium</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold text-left">High</th>
                          <td className="p-3 border border-slate-800 font-bold text-slate-100 bg-blue-500/20">924</td>
                          <td className="p-3 border border-slate-800 text-slate-500">0</td>
                          <td className="p-3 border border-slate-800">115</td>
                        </tr>
                        <tr>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold text-left">Low</th>
                          <td className="p-3 border border-slate-800 text-slate-500">0</td>
                          <td className="p-3 border border-slate-800 font-bold text-slate-100 bg-blue-500/20">188</td>
                          <td className="p-3 border border-slate-800">65</td>
                        </tr>
                        <tr>
                          <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold text-left">Medium</th>
                          <td className="p-3 border border-slate-800">75</td>
                          <td className="p-3 border border-slate-800">22</td>
                          <td className="p-3 border border-slate-800 font-bold text-slate-100 bg-blue-500/20">1611</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Prediction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div className="animate-slide-up" style={{ animationDelay: role === 'admin' ? '200ms' : '0ms' }}>
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <h2 className="text-xl font-bold text-slate-100">Project Parameters</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Configure scope to assess risk.</p>
          </div>
          
          <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl relative z-10">
            {error && (
              <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handlePredict} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">PROJECT TYPE</label>
                <CustomSelect
                  name="project_type"
                  value={form.project_type}
                  onChange={handleChange}
                  options={[
                    "Web Application", "Mobile App", "ERP Implementation", 
                    "Data Analytics Platform", "Cloud Migration", "IoT Development", 
                    "E-Commerce Platform", "CRM System", "Cybersecurity Solution", "AI / ML Project"
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">TEAM SIZE</label>
                  <input
                    type="number" name="team_size" value={form.team_size} onChange={handleChange} min="1" placeholder="0"
                    className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">BUDGET (₹)</label>
                  <input
                    type="number" name="budget" value={form.budget} onChange={handleChange} min="1" placeholder="0"
                    className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">DURATION (MO)</label>
                  <input
                    type="number" name="duration" value={form.duration} onChange={handleChange} min="1" placeholder="0"
                    className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">STAKEHOLDER COUNT</label>
                  <input
                    type="number" name="stakeholder_count" value={form.stakeholder_count} onChange={handleChange} min="1" placeholder="0"
                    className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">METHODOLOGY</label>
                  <CustomSelect
                    name="methodology"
                    value={form.methodology}
                    onChange={handleChange}
                    options={["Waterfall", "Agile", "Hybrid", "Scrum", "Kanban"]}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">TEAM EXPERIENCE</label>
                  <CustomSelect
                    name="team_experience"
                    value={form.team_experience}
                    onChange={handleChange}
                    options={["Junior", "Senior", "Mixed"]}
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 mt-4 rounded-md bg-blue-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> ANALYZING...</> : 'RUN ANALYSIS'}
              </button>
            </form>
          </div>
        </div>

        {/* Result Card */}
        <div className="animate-slide-up flex flex-col" style={{ animationDelay: role === 'admin' ? '300ms' : '100ms' }}>
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <h2 className="text-xl font-bold text-slate-100">Risk Score</h2>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">AI risk assessment and confidence.</p>
          </div>
          
          {loading ? (
            <div className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center h-full min-h-[300px] border border-slate-800 shadow-xl border-dashed animate-fade-in relative z-10">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">Analyzing Parameters...</h3>
              <p className="text-xs font-medium text-slate-400 mt-2 text-center max-w-[250px] leading-relaxed">
                Consulting ML model to calculate project failure probability.
              </p>
            </div>
          ) : result ? (
            <RiskResultCard result={result} />
          ) : (
            <div className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center h-full min-h-[300px] border border-slate-800 shadow-xl border-dashed animate-fade-in relative z-10">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-slate-500 flex-shrink-0" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">Awaiting Data</h3>
              <p className="text-xs font-medium text-slate-500 mt-2 text-center max-w-[200px]">
                Enter parameters to generate a predictive risk model.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApi.get('/projects/history').then(r => { setRecords(r.data); setLoading(false); });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
      <div className="mb-8 animate-fade-in flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <ClipboardList className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <h2 className="text-xl font-bold text-slate-100">Prediction History</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">Review past inferences and model risk assessments.</p>
        </div>
        <div className="text-xs font-bold tracking-wider uppercase text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-800 mt-1">
          {records.length} Records
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-12 text-center border border-slate-800 shadow-xl relative z-10">
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-500 flex-shrink-0" />
          <p className="text-sm font-medium text-slate-500 mt-4 uppercase tracking-wide">Retrieving ledger...</p>
        </div>
      ) : (
        <HistoryTable records={records} />
      )}
    </div>
  );
};

const Settings = ({ user, setUser, setPage }) => {
  const [form, setForm] = useState({ name: user?.name || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
    setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await mockApi.put('/users/settings', form);
      const updatedUser = { ...user, name: form.name };
      localStorage.setItem('userName', form.name);
      setUser(updatedUser);
      setMessage('Settings saved successfully.');
    } catch (err) {
      setError('Failed to update settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This will delete your account forever.")) {
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
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1">{user?.role === 'admin' ? 'Administrator' : 'Project Manager'}</p>
          </div>
        </div>

        {message && (
          <div className="mb-5 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-fade-in">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">DISPLAY NAME</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">NEW PASSWORD (OPTIONAL)</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold uppercase tracking-wide rounded-md hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> SAVING...</> : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>

      <div className="glass rounded-xl p-6 sm:p-8 border border-rose-500/20 bg-rose-500/5 shadow-xl relative z-10">
        <h3 className="text-rose-400 font-bold text-base mb-2 uppercase tracking-wide">Danger Zone</h3>
        <p className="text-slate-400 text-sm font-medium mb-6">Once you delete your account, there is no going back. All your predictive risk logs will be lost permanently.</p>
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-2.5 border border-rose-500/50 text-rose-400 text-sm font-bold uppercase tracking-wide rounded-md hover:bg-rose-500/10 transition-colors"
        >
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
};

const LoginPage = ({ setUser, setPage }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-[420px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full relative">
      <div className="w-full relative z-10 animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
            <User className="w-6 h-6 text-blue-500 flex-shrink-0" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Join ForeSight'}
          </h2>
          <p className="text-sm font-medium text-slate-500 max-w-[280px]">
            {isLogin ? 'Log in to access your predictive tools.' : 'Create an account to start analyzing.'}
          </p>
        </div>
        <LoginForm setUser={setUser} setPage={setPage} isLogin={isLogin} setIsLogin={setIsLogin} />
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-10 pt-24 overflow-hidden mt-auto">
      <div className="flex flex-col items-center gap-6">
        
        <a href="https://github.com/123JUICE-BOY321/ForeSight" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 backdrop-blur-md group">
          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>

        <div className="text-slate-600 text-xs font-bold tracking-widest uppercase">
          &copy; {new Date().getFullYear()} FORESIGHT. All rights reserved.
        </div>

        <h1 className="text-[17vw] leading-none font-bold text-white/5 tracking-tighter select-none pointer-events-none">
          FORESIGHT
        </h1>
      </div>
    </footer>
  );
};

// --- MAIN APP ---

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('userName');
    
    if (token) {
      setUser({ token, role, name });
    }
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home': return <Home setPage={setPage} />;
      case 'login': return <LoginPage setUser={setUser} setPage={setPage} />;
      case 'dashboard': return <Dashboard user={user} />;
      case 'history': return <History />;
      case 'settings': return <Settings user={user} setUser={setUser} setPage={setPage} />;
      default: return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans selection:bg-blue-500/30 w-full overflow-x-hidden">
      <style>{`
        body { background-color: #09090b; }
        .glass { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.15s ease-out forwards; }
        @keyframes slideRight { from { transform: translateX(0%); } to { transform: translateX(200%); } }
        
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <Navbar page={page} setPage={setPage} user={user} setUser={setUser} />

      <main className="min-h-[calc(100vh-64px)] w-full relative flex flex-col">
        <div className="flex-grow flex flex-col">
          {renderPage()}
        </div>
        <Footer />
      </main>
    </div>
  );
}