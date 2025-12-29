
import React, { useState, useEffect, useRef } from 'react';
import { User, Message, PsychologicalAnalysis, AnalysisPreferences } from '../types';
import * as Gemini from '../services/geminiService';
import PsychologicalChart from './PsychologicalChart';
import { INITIAL_ANALYSIS } from '../constants';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateToAssessments: () => void;
  onNavigateToProfile: () => void;
  onUpdateUser: (user: User) => void;
}

interface AnalysisPoint {
  time: string;
  stress: number;
  anxiety: number;
  energy: number;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout, onNavigateToAssessments, onNavigateToProfile, onUpdateUser }) => {
  const [messages, setMessages] = useState<Message[]>(user.history || []);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisPoint[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<PsychologicalAnalysis>(user.history?.[user.history.length-1]?.analysis || INITIAL_ANALYSIS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [mediaToUpload, setMediaToUpload] = useState<string | null>(null);

  const prefs = user.analysisPreferences || { 
    focusArea: 'general', depth: 'balanced', responseTone: 'balanced', thinkingEnabled: false, searchEnabled: true, modelSpeed: 'balanced' 
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial Personalized Greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greetingText = `سلام ${user.name} جان! خوشحالم که امروز در کنارت هستم. چطور می‌توانم امروز به تو کمک کنم؟ 😊`;
      const greetingMsg: Message = {
        id: 'greeting-' + Date.now(),
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toISOString()
      };
      setMessages([greetingMsg]);
      Gemini.speakText(greetingText);
    }
  }, [user.name]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaToUpload(reader.result as string);
        setShowMediaMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (customPrompt?: string, mode: 'chat' | 'image' | 'video' | 'edit' = 'chat') => {
    const prompt = customPrompt || inputText;
    if (!prompt.trim() && !mediaToUpload) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
      media: mediaToUpload ? { type: 'image', url: mediaToUpload } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setMediaToUpload(null);
    setIsTyping(true);
    setShowMediaMenu(false);

    try {
      const history = messages.map(m => ({
        role: (m.sender === 'ai' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

      let aiMsg: Message = { id: Date.now().toString(), sender: 'ai', text: '', timestamp: new Date().toISOString() };

      if (mode === 'image') {
        const imgUrl = await Gemini.generateImage(prompt);
        aiMsg.text = "تصویر درمانی شما آماده شد:";
        aiMsg.media = imgUrl ? { type: 'image', url: imgUrl } : undefined;
      } else if (mode === 'video') {
        const videoUrl = await Gemini.generateVideo(prompt, mediaToUpload || undefined);
        aiMsg.text = "ویدیوی شما آماده شد:";
        aiMsg.media = videoUrl ? { type: 'video', url: videoUrl } : undefined;
      } else {
        const parts: any[] = [{ text: prompt }];
        if (userMsg.media) parts.push({ inlineData: { data: userMsg.media.url.split(',')[1], mimeType: 'image/png' } });
        
        const aiResponse = await Gemini.getTherapistResponse(history, parts, prefs, user.theme);
        aiMsg.text = aiResponse.text;
        aiMsg.analysis = aiResponse.analysis;
        aiMsg.grounding = aiResponse.grounding;
        aiMsg.isThinking = prefs.thinkingEnabled;
        
        Gemini.speakText(aiResponse.text);

        if (aiResponse.analysis) {
          setCurrentAnalysis(aiResponse.analysis);
          setAnalysisHistory(prev => [...prev, { 
            time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }), 
            stress: aiResponse.analysis.stressLevel,
            anxiety: aiResponse.analysis.anxietyLevel,
            energy: aiResponse.analysis.energy
          }].slice(-10));
        }
      }

      const finalMessages = [...messages, userMsg, aiMsg];
      setMessages(finalMessages);
      onUpdateUser({ ...user, history: finalMessages });
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const updatePref = (key: keyof AnalysisPreferences, val: any) => {
    onUpdateUser({ ...user, analysisPreferences: { ...prefs, [key]: val } });
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark max-w-md mx-auto overflow-hidden relative transition-colors duration-300 font-sans">
      <header className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border-2 border-primary overflow-hidden shadow-inner">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-sm font-bold">همراه هوشمند من 🌱</h2>
            <div className="flex items-center gap-1">
               <span className={`size-2 rounded-full ${prefs.thinkingEnabled ? 'bg-purple-500 animate-pulse' : 'bg-green-500'}`}></span>
               <p className="text-[10px] text-slate-400">{prefs.thinkingEnabled ? 'در حال تفکر...' : 'آنلاین'}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowSettings(!showSettings)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-90 transition-all text-slate-400">
            <span className="material-symbols-outlined">{showSettings ? 'close' : 'tune'}</span>
          </button>
          <button onClick={onNavigateToProfile} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-90 transition-all text-slate-400">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full rounded-[2.5rem] p-6 space-y-6 animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-center border-b dark:border-slate-800 pb-3">تنظیمات روانشناختی</h3>
            
            <div className="space-y-4">
              <section className="space-y-2">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2">عمق تحلیل هوشمند:</span>
                 <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    {['concise', 'balanced', 'detailed'].map(d => (
                      <button 
                        key={d}
                        onClick={() => updatePref('depth', d)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 border ${prefs.depth === d ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {d === 'concise' ? 'خلاصه' : d === 'balanced' ? 'متعادل' : 'عمیق'}
                      </button>
                    ))}
                 </div>
              </section>

              <section className="space-y-2">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2">لحن پاسخ‌دهی:</span>
                 <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                    {['empathetic', 'balanced', 'direct'].map(t => (
                      <button 
                        key={t}
                        onClick={() => updatePref('responseTone', t)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all active:scale-95 border ${prefs.responseTone === t ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {t === 'empathetic' ? 'همدلانه' : t === 'balanced' ? 'متعادل' : 'صریح'}
                      </button>
                    ))}
                 </div>
              </section>

              <section className="space-y-2">
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-2">تمرکز گفتگو:</span>
                 <div className="grid grid-cols-2 gap-2">
                    {['general', 'career', 'relationships', 'anxiety'].map(f => (
                      <button 
                        key={f}
                        onClick={() => updatePref('focusArea', f)}
                        className={`py-3 rounded-2xl text-[10px] font-bold transition-all active:scale-95 border ${prefs.focusArea === f ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {f === 'general' ? 'عمومی' : f === 'career' ? 'شغلی' : f === 'relationships' ? 'روابط' : 'اضطراب'}
                      </button>
                    ))}
                 </div>
              </section>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border dark:border-slate-700">
                <div className="flex flex-col gap-0.5">
                   <span className="text-xs font-bold">تفکر عمیق (Gemini Pro)</span>
                   <span className="text-[9px] opacity-50">تحلیل دقیق‌تر و منطقی‌تر</span>
                </div>
                <button onClick={() => updatePref('thinkingEnabled', !prefs.thinkingEnabled)} className={`w-11 h-6 rounded-full transition-all relative ${prefs.thinkingEnabled ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${prefs.thinkingEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all">اعمال تغییرات هوشمند</button>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      <div className="px-4 py-2 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
        <PsychologicalChart data={analysisHistory.length ? analysisHistory : [{
          time: 'شروع', 
          stress: currentAnalysis.stressLevel,
          anxiety: currentAnalysis.anxietyLevel,
          energy: currentAnalysis.energy
        }]} />
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`flex flex-col gap-1.5 max-w-[88%] ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}>
              <div 
                style={msg.sender === 'user' ? { backgroundColor: user.theme?.accentColor } : {}}
                className={`p-4 rounded-[1.5rem] shadow-sm text-sm leading-relaxed transition-all relative ${
                msg.sender === 'user' 
                  ? 'text-white rounded-tr-none' 
                  : `bg-white dark:bg-slate-800 dark:text-slate-200 border dark:border-slate-700 rounded-tl-none ${msg.analysis ? 'analysis-bubble-glow animate-breath ring-2 ring-primary/30 border-primary/20 shadow-xl' : ''}`
              }`}>
                {msg.analysis && (
                  <div className="mb-2.5 flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest bg-primary/5 p-2 rounded-xl border border-primary/10">
                     <span className="material-symbols-outlined text-[16px] animate-pulse">insights</span>
                     <span>تحلیل روانشناختی همراه</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.media?.type === 'image' && <img src={msg.media.url} className="mt-3 rounded-xl max-h-60 w-full object-cover shadow-lg border border-white/5" alt="Generated" />}
                {msg.media?.type === 'video' && <video src={msg.media.url} controls className="mt-3 rounded-xl w-full shadow-lg border border-white/5" />}
                
                {msg.grounding && msg.grounding.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                    <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest flex items-center gap-1">
                      <span className="material-symbols-outlined text-[10px]">link</span> منابع استناد:
                    </p>
                    {msg.grounding.map((g, idx) => (
                      <a key={idx} href={g.uri} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 block truncate hover:underline bg-blue-500/5 p-1.5 rounded-lg border border-blue-500/10 transition-colors">🔗 {g.title}</a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-1">
                 <span className="text-[9px] text-slate-400 font-medium">{new Date(msg.timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                 {msg.sender === 'ai' && <span className="material-symbols-outlined text-[10px] text-slate-400">check_circle</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end gap-2 px-2">
            <div className="bg-slate-200 dark:bg-slate-800 px-4 py-2.5 rounded-full text-[10px] text-slate-500 font-bold flex items-center gap-2 animate-breath border border-slate-300/50 dark:border-slate-700/50">
               <div className="flex gap-1">
                 <div className="size-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="size-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="size-1 bg-slate-400 rounded-full animate-bounce"></div>
               </div>
               <span>در حال پردازش تحلیل...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
        {showMediaMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border dark:border-slate-700 p-6 grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-500 z-30">
            <button onClick={() => mediaInputRef.current?.click()} className="flex flex-col items-center gap-2.5 group active:scale-90 transition-all">
               <div className="size-14 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-md">
                  <span className="material-symbols-outlined text-2xl">image</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-tighter">ارسال عکس</span>
            </button>
            <button onClick={() => handleSend(undefined, 'image')} className="flex flex-col items-center gap-2.5 group active:scale-90 transition-all">
               <div className="size-14 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all shadow-md">
                  <span className="material-symbols-outlined text-2xl">auto_fix_high</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-tighter">تولید تصویر</span>
            </button>
            <button onClick={() => handleSend(undefined, 'video')} className="flex flex-col items-center gap-2.5 group active:scale-90 transition-all">
               <div className="size-14 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-[1.5rem] flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-md">
                  <span className="material-symbols-outlined text-2xl">movie</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-tighter">ساخت ویدیو</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowMediaMenu(!showMediaMenu)} className={`size-12 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-sm ${showMediaMenu ? 'bg-primary text-white shadow-primary/20 scale-110' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-slate-800'}`}>
            <span className="material-symbols-outlined transition-transform duration-500" style={{ transform: showMediaMenu ? 'rotate(135deg)' : 'rotate(0)' }}>{showMediaMenu ? 'close' : 'add'}</span>
          </button>
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] px-5 py-2.5 flex items-center focus-within:ring-2 focus-within:ring-primary/30 transition-all border dark:border-slate-700/50 shadow-inner">
            <input 
              type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="هر چه در ذهن دارید..." className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder-slate-400 font-medium"
            />
            <button className="size-8 text-slate-400 hover:text-primary transition-all active:scale-90"><span className="material-symbols-outlined">mic</span></button>
          </div>
          <button 
            onClick={() => handleSend()} disabled={!inputText.trim() && !mediaToUpload}
            className="size-12 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none hover:brightness-110"
            style={{ backgroundColor: user.theme?.accentColor || 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined rtl:rotate-180 text-xl">send</span>
          </button>
        </div>
        <input type="file" ref={mediaInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      </footer>
    </div>
  );
};

export default ChatScreen;
