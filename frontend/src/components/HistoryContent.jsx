import { useState, useEffect } from 'react';
import api from '../api';
import HistoryTable from './HistoryTable';

export default function HistoryContent() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/projects/history');
        setRecords(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Prediction History</h1>
        <p className="text-slate-400 mt-1">
          View all your past risk prediction results
          {records.length > 0 && (
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
              {records.length} record{records.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </div>

      {loading ? (
        <div className="glass rounded-2xl p-12 text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-violet-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 mt-4">Loading history...</p>
        </div>
      ) : error ? (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <HistoryTable records={records} />
      )}
    </>
  );
}
