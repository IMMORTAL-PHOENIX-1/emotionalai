import React from 'react';

const MOODS = [
  { emoji: '😁', label: 'Excited', score: 10, bg: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' },
  { emoji: '😊', label: 'Happy', score: 8, bg: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' },
  { emoji: '😐', label: 'Neutral', score: 5, bg: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  { emoji: '😴', label: 'Tired', score: 4, bg: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' },
  { emoji: '😰', label: 'Anxious', score: 3, bg: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' },
  { emoji: '😢', label: 'Sad', score: 2, bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
  { emoji: '😤', label: 'Angry', score: 2, bg: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
  { emoji: '😔', label: 'Depressed', score: 1, bg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' },
];

export default function MoodSelector({ onSelectMood }) {
  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in px-4">
      <div className="card max-w-2xl w-full p-8 sm:p-10 flex flex-col items-center text-center shadow-md bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          How are you feeling right now?
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
          Logging your mood helps me better understand and support you today.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
          {MOODS.map((mood) => (
            <button
              key={mood.label}
              onClick={() => onSelectMood(`${mood.emoji} ${mood.label}`, mood.score)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 ${mood.bg}`}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="font-medium text-sm">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
