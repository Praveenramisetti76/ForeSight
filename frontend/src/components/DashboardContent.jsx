import { useState } from 'react';
import api from '../api';
import RiskResultCard from './RiskResultCard';

export default function DashboardContent() {
  const role = localStorage.getItem('role');
  const [form, setForm] = useState({ duration: '', budget: '', team_size: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin state
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [rules, setRules] = useState({ low_threshold: '', high_threshold: '' });
  const [rulesMsg, setRulesMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    const dur = parseInt(form.duration);
    const bud = parseFloat(form.budget);
    const ts = parseInt(form.team_size);

    if (!form.duration || !form.budget || !form.team_size) {
      return 'All fields are required';
    }
    if (isNaN(dur) || dur <= 0) return 'Duration must be a positive integer';
    if (isNaN(bud) || bud <= 0) return 'Budget must be a positive number';
    if (isNaN(ts) || ts <= 0) return 'Team size must be a positive integer';
    if (ts > 500) return 'Team size cannot exceed 500';
    return null;
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/projects/predict', {
        duration: parseInt(form.duration),
        budget: parseFloat(form.budget),
        team_size: parseInt(form.team_size),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCSV = async () => {
    if (!csvFile) return;
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      const res = await api.post('/admin/upload-dataset', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg(res.data.message);
      setCsvFile(null);
    } catch (err) {
      setUploadMsg(err.response?.data?.detail || 'Upload failed');
    }
  };

  const handleSaveRules = async () => {
    setRulesMsg('');
    try {
      const res = await api.put('/admin/risk-rules', {
        low_threshold: parseFloat(rules.low_threshold),
        high_threshold: parseFloat(rules.high_threshold),
      });
      setRulesMsg(res.data.message);
    } catch (err) {
      setRulesMsg(err.response?.data?.detail || 'Failed to save rules');
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div className="animate-slide-up">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              Project Details
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handlePredict} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Project Duration <span className="text-slate-500">(months)</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 12"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Budget <span className="text-slate-500">(₹)</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="e.g. 50000"
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Team Size <span className="text-slate-500">(max 500)</span>
                </label>
                <input
                  type="number"
                  name="team_size"
                  value={form.team_size}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  min="1"
                  max="500"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Predict Risk
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Result Card */}
        <div>
          {result ? (
            <RiskResultCard result={result} />
          ) : (
            <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center h-full min-h-[300px] animate-fade-in">
              <div className="w-20 h-20 rounded-2xl bg-slate-700/30 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-400">No Prediction Yet</h3>
              <p className="text-sm text-slate-500 mt-1 text-center">
                Fill in the project details and click<br />
                &quot;Predict Risk&quot; to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      {role === 'admin' && (
        <div className="mt-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Admin Panel
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSV Upload */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-white mb-4">Upload Dataset</h3>
              <p className="text-sm text-slate-400 mb-4">
                Upload a new CSV file to replace the training dataset and retrain the model.
              </p>
              <div className="space-y-3">
                <label className="block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-violet-500/20 file:text-violet-300 hover:file:bg-violet-500/30 file:cursor-pointer file:transition-all"
                  />
                </label>
                <button
                  onClick={handleUploadCSV}
                  disabled={!csvFile}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Upload & Retrain
                </button>
                {uploadMsg && (
                  <p className="text-sm text-emerald-400 animate-fade-in">{uploadMsg}</p>
                )}
              </div>
            </div>

            {/* Risk Rules */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-md font-semibold text-white mb-4">Risk Thresholds</h3>
              <p className="text-sm text-slate-400 mb-4">
                Override model output based on confidence score thresholds.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Low Threshold</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={rules.low_threshold}
                    onChange={(e) => setRules({ ...rules, low_threshold: e.target.value })}
                    placeholder="e.g. 0.3"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">High Threshold</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={rules.high_threshold}
                    onChange={(e) => setRules({ ...rules, high_threshold: e.target.value })}
                    placeholder="e.g. 0.8"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={handleSaveRules}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
                >
                  Save Rules
                </button>
                {rulesMsg && (
                  <p className="text-sm text-emerald-400 animate-fade-in">{rulesMsg}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
