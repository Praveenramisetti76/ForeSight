const riskBadge = {
  Low: 'bg-green-100 text-green-800 border border-green-300',
  Medium: 'bg-amber-100 text-amber-800 border border-amber-300',
  High: 'bg-red-100 text-red-800 border border-red-300',
};

export default function HistoryTable({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-1">No predictions yet</h3>
        <p className="text-sm text-slate-500">Your prediction history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Size</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {records.map((record, index) => (
              <tr
                key={record.project_id}
                className="hover:bg-slate-700/20 transition-colors duration-150"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-300">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{record.duration} mo</td>
                <td className="px-6 py-4 text-sm text-slate-300">₹{Number(record.budget).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{record.team_size}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${riskBadge[record.risk_level] || riskBadge.Medium}`}>
                    {record.risk_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{(record.risk_score * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {new Date(record.timestamp).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
