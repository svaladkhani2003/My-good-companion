
import React, { useState } from 'react';
import { User, ThemeSettings, Session } from '../types';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
  onClearHistory: () => void;
  onUpdateTheme: (theme: ThemeSettings) => void;
  onNavigateToAssessments: () => void;
}

const THEME_COLORS = [
  '#135bec', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack, onLogout, onClearHistory, onUpdateTheme, onNavigateToAssessments }) => {
  const [showSessions, setShowSessions] = useState(false);
  const currentTheme = user.theme || { mode: 'dark', accentColor: '#135bec', personalityMode: 'kind', speechSpeed: 1 };

  const updateSubTheme = (key: keyof ThemeSettings, value: any) => {
    onUpdateTheme({ ...currentTheme, [key]: value });
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark max-w-md mx-auto overflow-hidden transition-colors">
      <header className="p-4 border-b dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-background-dark/50 backdrop-blur-md">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-90 transition-all"><span className="material-symbols-outlined">arrow_forward_ios</span></button>
        <h2 className="font-bold">پروفایل و شخصی‌سازی</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 rounded-3xl border-4 border-primary/20 overflow-hidden shadow-2xl relative group">
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full object-cover" alt="Avatar" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="material-symbols-outlined text-white">edit</span>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.phoneNumber}</p>
          </div>
        </div>

        {/* Sessions Section */}
        <div className="bg-white dark:bg-slate-800/40 rounded-3xl p-6 border dark:border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
             <h4 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                سوابق خودشناسی
             </h4>
             <button onClick={() => setShowSessions(!showSessions)} className="text-xs text-primary font-bold hover:underline">{showSessions ? 'بستن' : 'مشاهده همه'}</button>
          </div>
          
          {showSessions ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
               {(user.sessions || []).length > 0 ? user.sessions?.map(s => (
                 <div key={s.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
                    <div className="flex justify-between text-[10px] opacity-60 mb-1">
                       <span>{s.date}</span>
                       <span>{s.messages.length} پیام</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{s.summary}</p>
                 </div>
               )) : (
                 <p className="text-center text-xs opacity-50 py-4 italic">هنوز تحلیلی بایگانی نشده است.</p>
               )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
               <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                  <div className="text-2xl font-bold text-primary">{user.history?.length || 0}</div>
                  <div className="text-[10px] opacity-50">کل تعاملات</div>
               </div>
               <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                  <div className="text-2xl font-bold text-secondary">۵</div>
                  <div className="text-[10px] opacity-50">آزمون‌های کامل</div>
               </div>
            </div>
          )}
        </div>

        {/* Customization Section */}
        <div className="space-y-6">
           <h4 className="text-sm font-bold opacity-50 px-2 uppercase tracking-wide">تنظیمات ظاهری و رفتاری</h4>
           
           <div className="bg-white dark:bg-slate-800/20 rounded-3xl p-5 border dark:border-slate-800 space-y-6 shadow-sm">
              <div className="space-y-3">
                 <label className="text-[11px] block opacity-60 font-bold">رنگ تم و حباب‌های گفتگو:</label>
                 <div className="flex flex-wrap gap-3">
                    {THEME_COLORS.map(color => (
                      <button 
                        key={color}
                        onClick={() => updateSubTheme('accentColor', color)}
                        className={`size-10 rounded-full transition-all active:scale-90 border-2 ${currentTheme.accentColor === color ? 'border-white ring-2 ring-primary scale-110' : 'border-transparent opacity-60'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                 </div>
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-slate-800">
                 <label className="text-[11px] block opacity-60 font-bold">لحن پاسخ‌دهی همراه:</label>
                 <div className="flex gap-2">
                    {[
                      {id: 'kind', l: 'مهربان و صمیمی'}, 
                      {id: 'professional', l: 'حرفه‌ای'}, 
                      {id: 'clinical', l: 'بالینی'}
                    ].map(mode => (
                      <button 
                        key={mode.id}
                        onClick={() => updateSubTheme('personalityMode', mode.id)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] border transition-all active:scale-95 ${currentTheme.personalityMode === mode.id ? 'bg-primary text-white border-primary shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                      >
                        {mode.l}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3 pt-4 border-t dark:border-slate-800">
                 <div className="flex justify-between text-[11px] font-bold">
                    <span className="opacity-60">سرعت خواندن متون (TTS):</span>
                    <span className="text-primary">{currentTheme.speechSpeed}x</span>
                 </div>
                 <input 
                   type="range" min="0.5" max="2" step="0.1" 
                   value={currentTheme.speechSpeed} 
                   onChange={(e) => updateSubTheme('speechSpeed', parseFloat(e.target.value))}
                   className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
           <button onClick={onLogout} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-95">
             <span className="material-symbols-outlined">logout</span>
             <span>خروج از حساب</span>
           </button>
           <button onClick={onClearHistory} className="w-full py-3 text-slate-400 hover:text-red-400 text-xs font-medium transition-colors">پاکسازی تاریخچه گفتگوها</button>
        </div>
      </main>

      <footer className="h-20 shrink-0 border-t dark:border-slate-800 flex justify-around items-center bg-white dark:bg-background-dark">
         <button onClick={onBack} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity active:scale-90">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[9px]">گفتگو</span>
         </button>
         <button onClick={onNavigateToAssessments} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity active:scale-90">
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-[9px]">آزمون‌ها</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-primary active:scale-90 transition-all">
            <span className="material-symbols-outlined fill-current" style={{ color: user.theme?.accentColor }}>person</span>
            <span className="text-[9px] font-bold">پروفایل</span>
         </button>
      </footer>
    </div>
  );
};

export default ProfileScreen;
