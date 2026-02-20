import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface DetectionData {
  id: string;
  image_name: string;
  status: boolean;
  type: string;
  confidence: {
    A: number;
    B: number;
    C: number;
  };
  timestamp: string;
  coordinates: string;
  lat: number;
  lng: number;
}

interface AnalyticsPageProps {
  detections: DetectionData[];
  onBack: () => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ detections, onBack }) => {
  // Process data for charts
  const typeDistribution = [
    { name: 'Small (A)', value: detections.filter(d => d.type === 'A').length, color: '#3b82f6' },
    { name: 'Medium (B)', value: detections.filter(d => d.type === 'B').length, color: '#f59e0b' },
    { name: 'Large (C)', value: detections.filter(d => d.type === 'C').length, color: '#ef4444' },
  ];

  const statusDistribution = [
    { name: 'Hazard', value: detections.filter(d => d.status).length, color: '#ef4444' },
    { name: 'Clear', value: detections.filter(d => !d.status).length, color: '#10b981' },
  ];

  // Mock time series data based on timestamps
  const timeSeriesData = detections.map((d, i) => ({
    time: d.timestamp.split(' ')[1],
    confidence: Math.max(d.confidence.A, d.confidence.B, d.confidence.C) * 100,
    index: i + 1
  })).sort((a, b) => a.time.localeCompare(b.time));

  const avgConfidence = (detections.reduce((acc, d) => 
    acc + Math.max(d.confidence.A, d.confidence.B, d.confidence.C), 0) / detections.length * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F5F5F3] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-[#141414]/10 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold">Detection Analytics</h1>
              <p className="text-xs text-[#141414]/40 font-medium uppercase tracking-wider">Mission Report: Flight 082</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#141414]/10 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <Calendar size={16} />
              Last 24 Hours
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-white rounded-xl text-sm font-medium hover:bg-[#141414]/90 transition-colors">
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <TrendingUp size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">{detections.length}</div>
            <div className="text-xs text-[#141414]/40 font-bold uppercase tracking-widest">Total Detections</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">High Priority</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">{detections.filter(d => d.type === 'C').length}</div>
            <div className="text-xs text-[#141414]/40 font-bold uppercase tracking-widest">Large Hazards</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Optimal</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">{avgConfidence}%</div>
            <div className="text-xs text-[#141414]/40 font-bold uppercase tracking-widest">Avg. Confidence</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-[#141414]/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Clock size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#141414]/40 bg-gray-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="text-2xl font-display font-bold mb-1">24m 12s</div>
            <div className="text-xs text-[#141414]/40 font-bold uppercase tracking-widest">Flight Duration</div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#141414]/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-display font-bold">Confidence Trend</h3>
                <p className="text-sm text-[#141414]/40">AI model certainty over mission timeline</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase text-[#141414]/40">Confidence %</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-3xl border border-[#141414]/10 shadow-sm"
          >
            <h3 className="text-lg font-display font-bold mb-1">Hazard Distribution</h3>
            <p className="text-sm text-[#141414]/40 mb-8">Classification breakdown</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {typeDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-[#141414]/60">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold">{((item.value / detections.length) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl border border-[#141414]/10 shadow-sm overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-[#141414]/10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold">Location Logs</h3>
              <p className="text-sm text-[#141414]/40">Complete mission data records</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-[#141414]/5">
                <Filter size={18} className="text-[#141414]/60" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">ID</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">Type</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">Confidence</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">Coordinates</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#141414]/40 border-b border-[#141414]/5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]/5">
                {detections.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-[#141414]">{d.id}</td>
                    <td className="px-8 py-4 text-xs text-[#141414]/60 font-mono">{d.timestamp}</td>
                    <td className="px-8 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        d.type === 'A' ? 'bg-blue-50 text-blue-600' : 
                        d.type === 'B' ? 'bg-amber-50 text-amber-600' : 
                        'bg-red-50 text-red-600'
                      }`}>
                        {d.type === 'A' ? 'Small' : d.type === 'B' ? 'Medium' : 'Large'}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${Math.max(d.confidence.A, d.confidence.B, d.confidence.C) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold">{(Math.max(d.confidence.A, d.confidence.B, d.confidence.C) * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs text-[#141414]/60 font-mono">{d.coordinates}</td>
                    <td className="px-8 py-4">
                      <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${d.status ? 'text-red-600' : 'text-emerald-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${d.status ? 'bg-red-600' : 'bg-emerald-600'}`} />
                        {d.status ? 'Hazard' : 'Clear'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
