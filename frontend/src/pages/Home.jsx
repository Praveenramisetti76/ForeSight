import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative flex flex-col font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('/mesh-pattern.svg')] opacity-20"></div>
      </div>



      {/* Hero Section */}
      <main className="relative z-10 flex-grow flex items-center justify-center flex-col px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          <div className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold mb-4 backdrop-blur-sm">
            ✨ AI-Powered Risk Prediction is Here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            See the Future of Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-teal-400">Software Projects</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ForeSight analyzes project budgets, durations, and team sizes instantly to provide incredibly accurate risk assessments, ensuring you never run over budget again. 
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-blue-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2">
              Start Predicting Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:text-white transition-all backdrop-blur-sm flex items-center justify-center">
              Learn More
            </a>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-24 mb-16 px-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {[
            {
              title: "Precise Analytics",
              desc: "Train models with your historical data to match your team's specific capabilities.",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            },
            {
              title: "Admin Superpowers",
              desc: "Adjust risk thresholds and override AI decisions with ease from the Admin Portal.",
              icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
            },
            {
              title: "Comprehensive History",
              desc: "Keep an immutable log of all project estimations and generated predictions for your records.",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-colors">
              <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6 text-violet-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
