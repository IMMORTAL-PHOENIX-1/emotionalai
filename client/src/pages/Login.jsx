import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MessageCircleHeart, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login(email, password)) {
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card p-8 sm:p-10 text-center glass">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white mb-6 shadow-lg shadow-green-500/30">
            <MessageCircleHeart size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign in to continue your mindful journey.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/50 flex items-start text-left">
              <span className="flex-1">{error}</span>
              <button onClick={clearError} className="opacity-70 hover:opacity-100 text-red-600 ml-2">&times;</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 ml-1 text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full mt-6 py-3.5 text-base"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 dark:text-green-400 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
