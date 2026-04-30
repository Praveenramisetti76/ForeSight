import { useState, useEffect } from 'react';
import {
  Loader2, Trophy, UploadCloud, FileText, RefreshCw, X,
  Shield, Sliders, Activity, BarChart3,
} from 'lucide-react';
import api from '../api';
import CustomSelect from '../components/CustomSelect';
import RiskResultCard from '../components/RiskResultCard';

const Dashboard = ({ user }) => {
  const role = user?.role || localStorage.getItem('role');
  const [form, setForm] = useState({
    project_type: 'Web Application', team_size: '', budget: '',
    duration: '', stakeholder_count: '', methodology: 'Agile', team_experience: 'Mixed'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [isRetraining, setIsRetraining] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (role === 'admin') {
      api.get('/admin/model-info').then(res => setModelInfo(res.data)).catch(() => {});
    }
  }, [role, isRetraining]);

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const handlePredict = async (e) => {
    e.preventDefault();
    const dur = parseInt(form.duration), bud = parseFloat(form.budget);
    const ts = parseInt(form.team_size), sc = parseInt(form.stakeholder_count);
    if (!form.duration || !form.budget || !form.team_size || !form.stakeholder_count) return setError('All numerical fields are required');
    if (isNaN(dur) || dur <= 0) return setError('Duration must be a positive integer');
    if (isNaN(bud) || bud <= 0) return setError('Budget must be a positive number');
    if (isNaN(ts) || ts <= 0) return setError('Team size must be a positive integer');
    if (isNaN(sc) || sc <= 0) return setError('Stakeholder count must be a positive integer');
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/projects/predict', {
        project_type: form.project_type, duration: dur, budget: bud,
        team_size: ts, stakeholder_count: sc, methodology: form.methodology, team_experience: form.team_experience
      });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.detail || 'Prediction failed'); }
    finally { setLoading(false); }
  };

  const handleUploadCSV = async () => {
    if (!csvFile) return;
    setUploadMsg(''); setIsRetraining(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const res = await api.post('/admin/upload-dataset', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadMsg(res.data.message); setCsvFile(null);
    } catch (err) { setUploadMsg('Upload failed'); }
    finally { setIsRetraining(false); }
  };

  const classReport = modelInfo?.classification_report;
  const confMatrix = modelInfo?.confusion_matrix;
  const labelNames = modelInfo?.label_names || ['High', 'Low', 'Medium'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
      {role === 'admin' && <AdminPanel csvFile={csvFile} setCsvFile={setCsvFile} uploadMsg={uploadMsg}
        isRetraining={isRetraining} handleUploadCSV={handleUploadCSV} modelInfo={modelInfo}
        classReport={classReport} confMatrix={confMatrix} labelNames={labelNames} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PredictionForm form={form} handleChange={handleChange} handlePredict={handlePredict}
          error={error} loading={loading} role={role} />
        <ResultPanel loading={loading} result={result} role={role} />
      </div>
    </div>
  );
};

/* ── Admin Panel Sub-component ── */
const AdminPanel = ({ csvFile, setCsvFile, uploadMsg, isRetraining, handleUploadCSV, modelInfo, classReport, confMatrix, labelNames }) => (
  <div className="mb-12 animate-slide-up">
    <div className="mb-8">
      <div className="flex items-center gap-2.5">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-slate-100">Admin Panel</h2>
      </div>
      <p className="text-sm font-medium text-slate-500 mt-1">Manage settings and view metrics.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* CSV Upload */}
      <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl lg:col-span-1 h-full flex flex-col relative z-10">
        <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2 uppercase tracking-wide">
          <RefreshCw className="w-4 h-4 text-blue-500 flex-shrink-0" /> Model Retraining
        </h3>
        <p className="text-xs font-medium text-slate-500 mb-5 leading-relaxed flex-shrink-0">Upload data to recalibrate the model.</p>
        <div className="flex-grow flex flex-col justify-start space-y-4 w-full items-stretch">
          <label className="relative w-full flex flex-col items-center justify-center p-6 flex-grow min-h-[160px] border-2 border-dashed border-slate-700 rounded-lg bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer overflow-hidden">
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={csvFile !== null} />
            {!csvFile ? (
              <div className="pointer-events-none flex flex-col items-center justify-center">
                <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-300">Drag and drop file</span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">or click to browse</span>
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full bg-slate-900 flex flex-col items-center justify-center z-20">
                <FileText className="w-6 h-6 text-blue-400 mb-2 flex-shrink-0" />
                <span className="text-xs font-bold text-blue-400 text-center px-4 max-w-full truncate">{csvFile.name}</span>
                <button onClick={(e) => { e.preventDefault(); setCsvFile(null); }} className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 z-30 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </label>
          <button onClick={handleUploadCSV} disabled={!csvFile || isRetraining}
            className="w-full py-2.5 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide">
            {isRetraining ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Recalibrating...</> : 'Upload & Recalibrate'}
          </button>
          {uploadMsg && <p className="text-xs font-semibold text-blue-400 text-center w-full">{uploadMsg}</p>}
        </div>
      </div>

      {/* Model Metrics */}
      <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl lg:col-span-2 relative overflow-hidden z-10">
        {isRetraining && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-30 animate-fade-in">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-3" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Recalibrating Model...</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Processing new dataset and updating weights</p>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Best Model: {modelInfo?.best_model || 'Loading...'}</h3>
          </div>
          <div className="text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
            Accuracy: {modelInfo?.test_accuracy ? (modelInfo.test_accuracy * 100).toFixed(2) : '--'}%
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <div className="flex flex-col h-full overflow-hidden">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex-shrink-0">Classification Report</h4>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-x-auto flex-grow flex flex-col justify-center">
              <table className="w-full text-xs text-left border-collapse h-full min-w-[420px]">
                <thead><tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px]">Class</th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Precision</th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Recall</th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">F1-Score</th>
                  <th className="py-3 px-3 font-semibold uppercase tracking-wider text-[10px] text-right">Support</th>
                </tr></thead>
                <tbody className="text-slate-300 font-medium">
                  {labelNames.map((label) => {
                    const data = classReport?.[label];
                    return (<tr key={label} className="border-b border-slate-800/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{label}</td>
                      <td className="py-2.5 px-3 text-right">{data?.precision?.toFixed(2) ?? '--'}</td>
                      <td className="py-2.5 px-3 text-right">{data?.recall?.toFixed(2) ?? '--'}</td>
                      <td className="py-2.5 px-3 text-right">{data?.['f1-score']?.toFixed(2) ?? '--'}</td>
                      <td className="py-2.5 px-3 text-right">{data?.support ?? '--'}</td>
                    </tr>);
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col h-full overflow-hidden">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-3 flex-shrink-0">Confusion Matrix</h4>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-x-auto flex-grow flex flex-col justify-center">
              <table className="w-full text-[11px] font-medium text-center border-collapse h-full min-w-[320px]">
                <thead><tr>
                  <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">Act \ Pred</th>
                  {labelNames.map(l => <th key={l} className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider">{l}</th>)}
                </tr></thead>
                <tbody className="text-slate-300">
                  {labelNames.map((label, i) => (
                    <tr key={label}>
                      <th className="p-3 border border-slate-800 bg-slate-900/80 text-slate-400 font-semibold text-left">{label}</th>
                      {labelNames.map((_, j) => {
                        const val = confMatrix?.[i]?.[j];
                        return <td key={j} className={`p-3 border border-slate-800 ${i === j ? 'font-bold text-slate-100 bg-blue-500/20' : val === 0 ? 'text-slate-500' : ''}`}>{val ?? '--'}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Prediction Form Sub-component ── */
const PredictionForm = ({ form, handleChange, handlePredict, error, loading, role }) => (
  <div className="animate-slide-up" style={{ animationDelay: role === 'admin' ? '200ms' : '0ms' }}>
    <div className="mb-8">
      <div className="flex items-center gap-2.5">
        <Sliders className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-slate-100">Project Parameters</h2>
      </div>
      <p className="text-sm font-medium text-slate-500 mt-1">Configure scope to assess risk.</p>
    </div>
    <div className="glass rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xl relative z-10">
      {error && <div className="mb-5 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium animate-fade-in">{error}</div>}
      <form onSubmit={handlePredict} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">PROJECT TYPE</label>
          <CustomSelect name="project_type" value={form.project_type} onChange={handleChange}
            options={["Web Application","Mobile App","ERP Implementation","Data Analytics Platform","Cloud Migration","IoT Development","E-Commerce Platform","CRM System","Cybersecurity Solution","AI / ML Project"]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">TEAM SIZE</label>
            <input type="number" name="team_size" value={form.team_size} onChange={handleChange} min="1" placeholder="0" className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">BUDGET (₹)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} min="1" placeholder="0" className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">DURATION (MO)</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange} min="1" placeholder="0" className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">STAKEHOLDER COUNT</label>
            <input type="number" name="stakeholder_count" value={form.stakeholder_count} onChange={handleChange} min="1" placeholder="0" className="w-full px-3 py-2.5 rounded-md bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">METHODOLOGY</label>
            <CustomSelect name="methodology" value={form.methodology} onChange={handleChange} options={["Waterfall","Agile","Hybrid","Scrum","Kanban"]} />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">TEAM EXPERIENCE</label>
            <CustomSelect name="team_experience" value={form.team_experience} onChange={handleChange} options={["Junior","Senior","Mixed"]} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 mt-4 rounded-md bg-blue-600 text-white text-sm font-bold uppercase tracking-wide hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> ANALYZING...</> : 'RUN ANALYSIS'}
        </button>
      </form>
    </div>
  </div>
);

/* ── Result Panel Sub-component ── */
const ResultPanel = ({ loading, result, role }) => (
  <div className="animate-slide-up flex flex-col" style={{ animationDelay: role === 'admin' ? '300ms' : '100ms' }}>
    <div className="mb-8">
      <div className="flex items-center gap-2.5">
        <Activity className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-slate-100">Risk Score</h2>
      </div>
      <p className="text-sm font-medium text-slate-500 mt-1">AI risk assessment and confidence.</p>
    </div>
    {loading ? (
      <div className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center h-full min-h-[300px] border border-slate-800 shadow-xl border-dashed animate-fade-in relative z-10">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-100">Analyzing Parameters...</h3>
        <p className="text-xs font-medium text-slate-400 mt-2 text-center max-w-[250px] leading-relaxed">Consulting ML model to calculate project failure probability.</p>
      </div>
    ) : result ? (
      <RiskResultCard result={result} />
    ) : (
      <div className="glass rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center h-full min-h-[300px] border border-slate-800 shadow-xl border-dashed animate-fade-in relative z-10">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <BarChart3 className="w-5 h-5 text-slate-500 flex-shrink-0" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-300">Awaiting Data</h3>
        <p className="text-xs font-medium text-slate-500 mt-2 text-center max-w-[200px]">Enter parameters to generate a predictive risk model.</p>
      </div>
    )}
  </div>
);

export default Dashboard;
