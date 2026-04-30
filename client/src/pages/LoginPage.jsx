import { useState } from 'react';
import { User } from 'lucide-react';
import LoginForm from '../components/LoginForm';

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

export default LoginPage;
