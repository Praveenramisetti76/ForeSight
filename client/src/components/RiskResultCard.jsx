import { Check, AlertTriangle, X } from 'lucide-react';

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

export default RiskResultCard;
