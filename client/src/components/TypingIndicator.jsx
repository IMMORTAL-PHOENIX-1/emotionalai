export default function TypingIndicator() {
  return (
    <div className="flex w-full justify-start animate-fade-in pl-2 sm:pl-12 my-2">
      <div className="chat-bubble-bot py-4 px-5 inline-flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 typing-dot"></div>
      </div>
    </div>
  );
}
