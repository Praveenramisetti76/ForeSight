import { ArrowRight, Sparkles } from 'lucide-react';
import ThreeModel from '../components/ThreeModel';

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

export default Home;
