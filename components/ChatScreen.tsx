
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, PsychologicalAnalysis, AnalysisPreferences } from '../types';
import { getTherapistResponse } from '../services/geminiService';
import PsychologicalChart from './PsychologicalChart';
import { INITIAL_ANALYSIS } from '../constants';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToAssessments: () => void;
  onNavigateToProfile: () => void;
  onUpdateUser: (user: User) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout, onNavigateToAssessments, onNavigateToProfile, onUpdateUser }) => {
  const [messages, setMessages] = useState<Message[]>(user.history || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<{ time: string; value: number }[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PsychologicalAnalysis>(INITIAL_ANALYSIS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisPrefs: AnalysisPreferences = user.analysisPreferences || { focusArea: 'general', depth: 'balanced' };

  useEffect(() => {
    if (!user.history || user.history.length === 0) {
      const greeting: Message = {
        id: '1',
        sender: 'ai',
        text: `سلام ${user.name}. من "همراه خوب من 🌱" هستم. خوشحالم که دوباره اینجا هستی. امروز چه مشکلی ذهنت رو درگیر کرده؟ من اینجام تا به حرف‌هات گوش بدم.`,
        timestamp: new Date().toISOString()
      };
      const initialMsgs = [greeting];
      setMessages(initialMsgs);
      saveMessages(initialMsgs);
    }
    
    const lastMsgWithAnalysis = [...(user.history || [])].reverse().find(m => m.analysis);
    if (lastMsgWithAnalysis?.analysis) {
        setCurrentAnalysis(lastMsgWithAnalysis.analysis);
    }
    
    setAnalysisHistory([{ time: '10:00', value: currentAnalysis.stressLevel }]);
  }, [user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveMessages = (msgs: Message[]) => {
    onUpdateUser({
        ...user,
        history: msgs
    });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    const history: { role: 'user' | 'model'; parts: { text: string }[] }[] = newMessages.map(m => ({
      role: (m.sender === 'ai' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.text }]
    }));

    const response = await getTherapistResponse(history, inputText, analysisPrefs);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: response.text,
      timestamp: new Date().toISOString(),
      analysis: response.analysis
    };

    const finalMessages = [...newMessages, aiMsg];
    setMessages(finalMessages);
    saveMessages(finalMessages);
    setIsTyping(false);

    if (response.analysis) {
      setCurrentAnalysis(response.analysis);
      setAnalysisHistory(prev => [
        ...prev, 
        { 
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }), 
          value: response.analysis?.stressLevel || 0 
        }
      ].slice(-10));
    }
  };

  const updatePreference = (key: keyof AnalysisPreferences, value: string) => {
    onUpdateUser({
      ...user,
      analysisPreferences: {
        ...analysisPrefs,
        [key]: value
      }
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({
          ...user,
          avatar: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const userAvatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=135bec&color=fff`;

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark max-w-md mx-auto overflow-hidden relative transition-colors duration-300">
      <header className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden relative">
              <img src={userAvatarSrc} alt="User Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-white dark:border-[#101622]"></div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold">همراه خوب من 🌱</h2>
              <span className="material-symbols-outlined text-[10px] text-green-500">verified</span>
            </div>
            <p className="text-[10px] text-slate-400">در حال گفتگو با {user.name}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowSettings(!showSettings)} className={`size-10 flex items-center justify-center rounded-full transition-colors ${showSettings ? 'bg-primary text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400'}`}>
            <span className="material-symbols-outlined">tune</span>
          </button>
          <button onClick={onNavigateToProfile} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      {/* Analysis Settings Overlay */}
      {showSettings && (
        <div className="absolute inset-x-0 top-[73px] bottom-0 z-30 bg-black/40 backdrop-blur-sm flex flex-col p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center">
               <h3 className="font-bold text-lg">تنظیمات هوش مصنوعی</h3>
               <button onClick={() => setShowSettings(false)} className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">close</span>
               </button>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500">تمرکز تحلیل بر:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'general', label: 'عمومی', icon: 'psychology' },
                  { id: 'career', label: 'شغلی', icon: 'work' },
                  { id: 'relationships', label: 'روابط', icon: 'group' },
                  { id: 'anxiety', label: 'اضطراب', icon: 'tsunami' }
                ].map((area) => (
                  <button
                    key={area.id}
                    onClick={() => updatePreference('focusArea', area.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${analysisPrefs.focusArea === area.id ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-sm">{area.icon}</span>
                    <span>{area.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500">عمق و جزئیات پاسخ:</label>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {[
                  { id: 'concise', label: 'کوتاه' },
                  { id: 'balanced', label: 'متعادل' },
                  { id: 'detailed', label: 'عمیق' }
                ].map((depth) => (
                  <button
                    key={depth.id}
                    onClick={() => updatePreference('depth', depth.id)}
                    className={`flex-1 py-2 rounded-lg text-xs transition-all ${analysisPrefs.depth === depth.id ? 'bg-white dark:bg-slate-700 shadow-sm text-primary font-bold' : 'text-slate-500'}`}
                  >
                    {depth.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              تغییر این تنظیمات بلافاصله بر پاسخ‌های بعدی "همراه خوب من" تأثیر می‌گذارد.
            </p>
            
            <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
              تأیید و ذخیره
            </button>
          </div>
          <div className="flex-1" onClick={() => setShowSettings(false)}></div>
        </div>
      )}

      <div className="px-4 py-4 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-xs text-slate-400 mb-1">تحلیل احساسات لحظه‌ای</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{currentAnalysis.mood}</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] rounded flex items-center">
                <span className="material-symbols-outlined text-[12px] ml-1">trending_down</span>
                {currentAnalysis.stressLevel}% استرس
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">بروزرسانی: هم‌اکنون</span>
        </div>
        <PsychologicalChart data={analysisHistory} label="نمودار تنش روانی" />
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] rounded-full font-medium">امروز</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} gap-3`}>
            {msg.sender === 'user' && (
              <div className="size-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0">
                <img src={userAvatarSrc} alt="User" className="w-full h-full object-cover" />
              </div>
            )}
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
              <span className="text-[10px] text-slate-400 px-1">{msg.sender === 'user' ? 'شما' : 'همراه خوب من'}</span>
              <div className={`p-3 rounded-2xl shadow-sm leading-relaxed text-sm ${
                msg.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5">{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {msg.sender === 'ai' && (
              <div className="size-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0">
                <img src="https://picsum.photos/seed/doctor/100/100" alt="AI" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end gap-3 animate-pulse">
            <div className="bg-slate-200 dark:bg-slate-800 text-slate-400 px-4 py-2 rounded-2xl rounded-tl-none text-xs">در حال نوشتن...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-200 dark:border-slate-700 focus-within:border-primary transition-colors">
          <button className="size-10 flex items-center justify-center rounded-full text-slate-400 hover:text-primary">
            <span className="material-symbols-outlined">mic</span>
          </button>
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="هر چه در ذهن دارید بگویید..."
            className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-50 transition-opacity"
          >
            <span className="material-symbols-outlined rtl:rotate-180">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;
