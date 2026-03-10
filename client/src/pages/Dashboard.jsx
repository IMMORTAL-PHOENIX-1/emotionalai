import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Smile, Calendar, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/chat/mood-history');
        setHistory(data.reverse()); // Chronological order for chart
      } catch (err) {
        console.error('Failed to fetch mood history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const chartData = useMemo(() => {
    return history.map(session => ({
      date: new Date(session.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      score: session.moodScore,
      mood: session.mood,
      title: session.title
    }));
  }, [history]);

  const stats = useMemo(() => {
    if (!history.length) return { avgScore: 0, totalSessions: 0, topMood: 'N/A' };
    
    const avgScore = (history.reduce((acc, curr) => acc + curr.moodScore, 0) / history.length).toFixed(1);
    
    const moodCounts = history.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});
    
    const topMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '');

    return { avgScore, totalSessions: history.length, topMood };
  }, [history]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">{label}</p>
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{payload[0].payload.title}</p>
          <div className="flex items-center gap-2">
             <span className="text-lg">{payload[0].payload.mood.split(' ')[0]}</span>
             <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Score: {payload[0].value}/10</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
            Your Wellness Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your mood trends and conversation history over time.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : history.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center">
             <Activity size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
             <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm">
               Start chatting and logging your mood to see your wellness trends appear here.
             </p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl text-green-600 dark:text-green-400">
                    <Activity size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Average Mood</h3>
                </div>
                <div className="mt-auto relative z-10">
                  <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{stats.avgScore}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">/ 10</span>
                </div>
              </div>

              <div className="card p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                    <Calendar size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Check-ins</h3>
                </div>
                <div className="mt-auto relative z-10">
                  <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{stats.totalSessions}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">sessions</span>
                </div>
              </div>

              <div className="card p-6 flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl text-purple-600 dark:text-purple-400">
                    <Smile size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">Frequent State</h3>
                </div>
                <div className="mt-auto relative z-10">
                  <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.topMood}</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card p-6 sm:p-8 border-t-4 border-t-emerald-500">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                 <Activity className="text-emerald-500" size={20} /> Mood Trend Over Time
              </h3>
              <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="opacity-50 dark:opacity-20" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      domain={[1, 10]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
