import DashboardContent from '../components/DashboardContent';

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white">Risk Prediction</h1>
        <p className="text-slate-400 mt-1">Enter project details to predict the risk level</p>
      </div>

      <DashboardContent />
    </div>
  );
}
