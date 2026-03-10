import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import MoodSelector from '../components/MoodSelector';
import BreathingExercise from '../components/BreathingExercise';
import { Wind, Menu, X, PlusCircle } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial load
  useEffect(() => {
    fetchSessions();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/chat/sessions');
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      setIsLoading(true);
      const session = sessions.find(s => s._id === sessionId);
      setCurrentSession(session);
      setShowSidebarMobile(false);
      
      const { data } = await api.get(`/chat/sessions/${sessionId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    setCurrentSession({ temp: true, _id: 'temp', mood: null });
    setMessages([]);
    setShowSidebarMobile(false);
  };

  const handleMoodSelect = async (moodLabel, moodScore) => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/chat/sessions', {
        mood: moodLabel,
        moodScore,
      });
      
      setSessions([data.session, ...sessions]);
      setCurrentSession(data.session);
      setMessages([data.welcomeMessage]);
    } catch (err) {
      console.error('Failed to create session with mood', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentSession || currentSession.temp) return; // Must select mood first

    const tempMessage = {
      _id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      sentiment: 'neutral'
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setIsTyping(true);

    try {
      const { data } = await api.post(`/chat/sessions/${currentSession._id}/messages`, { content });
      
      // Artificial delay for empathy
      setTimeout(() => {
        setMessages(prev => 
          prev.map(m => m._id === tempMessage._id ? data.userMessage : m).concat(data.botMessage)
        );
        setIsTyping(false);
        
        // Update session title locally if needed
        if (messages.length === 1 && currentSession.title.startsWith('Session')) {
          setSessions(prev => 
            prev.map(s => s._id === currentSession._id 
              ? { ...s, title: content.substring(0, 40) + (content.length > 40 ? '...' : '') }
              : s
            )
          );
        }
      }, 1000 + Math.random() * 800);
    } catch (err) {
      setIsTyping(false);
      console.error('Message failed to send', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this chat history?')) return;
      
      await api.delete(`/chat/sessions/${sessionId}`);
      const remaining = sessions.filter(s => s._id !== sessionId);
      setSessions(remaining);
      
      if (currentSession?._id === sessionId) {
        if (remaining.length > 0) {
          loadSession(remaining[0]._id);
        } else {
          setCurrentSession(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar overlay */}
        {showSidebarMobile && (
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowSidebarMobile(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`absolute md:static inset-y-0 left-0 z-50 transform ${showSidebarMobile ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
           <Sidebar 
            sessions={sessions}
            currentSessionId={currentSession?._id}
            onSelectSession={loadSession}
            onNewSession={createNewSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative">
          
          {/* Mobile Header / Tools */}
          <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowSidebarMobile(!showSidebarMobile)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showSidebarMobile ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-4 max-w-[200px] sm:max-w-md">
                {currentSession?.title || 'Welcome'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
               {currentSession && !currentSession.temp && (
                 <span className="hidden sm:inline-flex px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full cursor-help whitespace-nowrap" title="Logged Mood">
                   Logged: {currentSession.mood}
                 </span>
               )}
               <button 
                 onClick={() => setShowBreathing(!showBreathing)}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg font-medium text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
               >
                 <Wind size={16} /> <span className="hidden sm:inline">Breathe</span>
               </button>
            </div>
          </div>
          
          {/* Breathing Exercise Float */}
          {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
          
          {/* Chat Flow */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[url('/noise.png')] opacity-95 blend-overlay">
            
            {!currentSession ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto p-4 animate-fade-in">
                 <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/20 flex items-center justify-center text-white mb-2">
                   <Wind size={40} />
                 </div>
                 <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Hi, {user?.name.split(' ')[0]}</h1>
                 <p className="text-slate-500 dark:text-slate-400 text-lg">
                   Welcome to MindfulBot. This is a safe space to share your thoughts, track your feelings, and find some grounding.
                 </p>
                 <button onClick={createNewSession} className="btn-primary mt-4 py-3 px-8 text-base shadow-lg shadow-emerald-500/30">
                   <PlusCircle size={20} className="mr-2" /> Start a New Session
                 </button>
              </div>
            ) : currentSession.temp ? (
              <MoodSelector onSelectMood={handleMoodSelect} />
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto pb-4">
                 {messages.map(msg => (
                   <ChatBubble key={msg._id} message={msg} />
                 ))}
                 {isTyping && <TypingIndicator />}
                 <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
            
          </div>
          
          {/* Input Area */}
          <div className="mt-auto z-20 relative bg-white dark:bg-slate-950">
             <ChatInput 
               onSend={handleSendMessage} 
               disabled={!currentSession || currentSession.temp || isTyping} 
             />
          </div>
          
        </main>
      </div>
    </div>
  );
}
