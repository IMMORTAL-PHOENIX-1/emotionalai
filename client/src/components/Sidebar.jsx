import { PlusCircle, MessageSquare, Trash2 } from 'lucide-react';

export default function Sidebar({ sessions, currentSessionId, onSelectSession, onNewSession, onDeleteSession }) {
  return (
    <div className="w-64 flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col hidden md:flex transition-colors">
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full btn-primary flex justify-start pl-4"
        >
          <PlusCircle size={18} />
          <span>New Conversation</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 custom-scrollbar">
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2 mt-2">
          Your History
        </div>

        {sessions.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 px-2 italic">
            No previous sessions
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className="group relative flex items-center"
            >
              <button
                onClick={() => onSelectSession(session._id)}
                className={`sidebar-item flex-1 truncate pr-8 ${
                  currentSessionId === session._id ? 'sidebar-item-active' : ''
                }`}
              >
                <MessageSquare size={16} className="mt-0.5 flex-shrink-0 opacity-70" />
                <span className="truncate">{session.title}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session._id);
                }}
                className="absolute right-2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                title="Delete session"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
