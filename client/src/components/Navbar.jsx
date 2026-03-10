import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, LayoutDashboard, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm">
          M
        </div>
        <span className="font-bold text-lg hidden sm:block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          MindfulBot
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <>
            <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
              <Link
                to="/chat"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  location.pathname === '/chat' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare size={16} /> Chat
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  location.pathname === '/dashboard' 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-green-600 dark:text-green-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block mx-2"></div>

            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block mr-2">
              Hi, {user.name.split(' ')[0]}
            </span>
          </>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-2 p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Log out"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium hidden sm:block pr-1">Out</span>
          </button>
        )}
      </div>
    </nav>
  );
}
