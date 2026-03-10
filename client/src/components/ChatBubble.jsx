import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%]`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-200/50 dark:border-slate-600/50 hidden sm:flex">
            <Bot size={18} className="text-emerald-700 dark:text-emerald-400" />
          </div>
        )}
        
        <div className={`
          ${isUser ? 'chat-bubble-user' : message.sentiment === 'crisis' ? 'chat-bubble-crisis' : 'chat-bubble-bot'}
          text-[15px] leading-relaxed relative group
        `}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
             <ReactMarkdown 
               className="prose dark:prose-invert prose-sm max-w-none 
                 prose-p:my-1 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 
                 prose-strong:text-slate-800 dark:prose-strong:text-slate-200"
             >
               {message.content}
             </ReactMarkdown>
          )}
          
          <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity absolute ${isUser ? 'right-0 -bottom-5 text-slate-500' : 'left-0 -bottom-5 text-slate-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-500/20 hidden sm:flex">
            <User size={18} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
