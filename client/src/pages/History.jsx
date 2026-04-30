import { useState, useEffect } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import api from '../api';
import HistoryTable from '../components/HistoryTable';

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects/history')
      .then(r => { setRecords(r.data); setLoading(false); })
      .catch(() => setLoading(false));
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

export default History;
