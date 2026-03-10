import { useState, useEffect } from 'react';
import { Wind, X } from 'lucide-react';

export default function BreathingExercise({ onClose }) {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
  const [countdown, setCountdown] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Switch phases
          if (phase === 'inhale') {
            setPhase('hold');
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 8;
          } else {
            setPhase('inhale');
            setCycles((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('inhale');
      setCountdown(4);
      setCycles(0);
    }
    setIsActive(!isActive);
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      default: return 'Ready?';
    }
  };

  const getScaleClass = () => {
    switch (phase) {
      case 'inhale': return 'scale-150 bg-green-200/50 dark:bg-green-500/20';
      case 'hold': return 'scale-150 bg-teal-200/50 dark:bg-teal-500/20';
      case 'exhale': return 'scale-100 bg-emerald-100/50 dark:bg-emerald-500/10';
      default: return 'scale-100 bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 card p-6 w-80 shadow-2xl animate-slide-up border-emerald-200 dark:border-emerald-900/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X size={20} />
      </button>
      
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2 text-emerald-500">
          <Wind size={28} />
        </div>
        <h3 className="font-bold text-lg mb-1">4-7-8 Breathing</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">A calming technique to reduce anxiety.</p>
      </div>

      <div className="relative h-48 flex items-center justify-center mb-6">
        <div className={`absolute w-32 h-32 rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center ${isActive ? getScaleClass() : 'bg-slate-100 dark:bg-slate-800'}`}>
          <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center shadow-sm z-10">
            {isActive ? (
              <>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{getInstructions()}</span>
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 table-cell">{countdown}</span>
              </>
            ) : (
              <Wind className="text-slate-300 dark:text-slate-600" size={32} />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={toggleExercise}
          className={`btn-primary w-full ${isActive ? 'from-slate-500 to-slate-600 shadow-slate-500/25' : ''}`}
        >
          {isActive ? 'Stop Exercise' : 'Start Breathing'}
        </button>
      </div>
      
      {cycles > 0 && !isActive && (
        <p className="text-center text-xs text-emerald-600 dark:text-emerald-400 mt-4 font-medium animate-fade-in">
          Great job! You completed {cycles} cycle{cycles > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  );
}
