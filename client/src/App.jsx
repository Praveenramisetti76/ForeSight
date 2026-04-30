import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Settings from './pages/Settings';

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
