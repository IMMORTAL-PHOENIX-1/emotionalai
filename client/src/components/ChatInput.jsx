import { useState, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(resizeTextarea, [content]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && !disabled) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto relative flex items-end">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Share what's on your mind... (Shift+Enter for new line)"
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all resize-none overflow-hidden min-h-[50px] text-[15px] dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || disabled}
          className="absolute right-2 bottom-[6px] p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 group"
        >
          <SendHorizonal size={18} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
