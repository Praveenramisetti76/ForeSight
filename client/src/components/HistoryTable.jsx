import { Database } from 'lucide-react';

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

export default HistoryTable;
