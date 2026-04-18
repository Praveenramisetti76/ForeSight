const riskStyles = {
  Low: {
    badge: 'bg-green-100 text-green-800 border border-green-300',
    glow: 'shadow-green-500/20',
    icon: '✓',
    gradient: 'from-green-500 to-emerald-500',
  },
  Medium: {
    badge: 'bg-amber-100 text-amber-800 border border-amber-300',
    glow: 'shadow-amber-500/20',
    icon: '⚠',
    gradient: 'from-amber-500 to-orange-500',
  },
  High: {
    badge: 'bg-red-100 text-red-800 border border-red-300',
    glow: 'shadow-red-500/20',
    icon: '✕',
    gradient: 'from-red-500 to-rose-500',
  },
};

export default function RiskResultCard({ result }) {
  if (!result) return null;

  const style = riskStyles[result.risk_level] || riskStyles.Medium;
  const confidencePercent = (result.risk_score * 100).toFixed(1);

  return (
    <div className={`glass rounded-2xl p-6 animate-slide-up shadow-xl ${style.glow}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Prediction Result</h3>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${style.badge}`}>
          {style.icon} {result.risk_level} Risk
        </span>
      </div>

      {/* Confidence meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-400">Model Confidence</span>
          <span className="text-sm font-semibold text-white">{confidencePercent}%</span>
        </div>
        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${style.gradient} transition-all duration-1000 ease-out`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Project details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{result.duration}</div>
          <div className="text-xs text-slate-400 mt-1">Months</div>
        </div>
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">₹{Number(result.budget).toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400 mt-1">Budget</div>
        </div>
        <div className="glass-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{result.team_size}</div>
          <div className="text-xs text-slate-400 mt-1">Team Size</div>
        </div>
      </div>
    </div>
  );
}
