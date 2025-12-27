
import React from 'react';
import { User, ThemeSettings } from '../types';

interface ProfileScreenProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
  onClearHistory: () => void;
  onUpdateTheme: (theme: ThemeSettings) => void;
}

const ACCENT_COLORS = [
  { name: 'Blue', value: '#135bec' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Indigo', value: '#6366f1' },
];

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onBack, onLogout, onClearHistory, onUpdateTheme }) => {
  const messageCount = user.history?.length || 0;
  const currentTheme = user.theme || { mode: 'dark', accentColor: '#135bec' };

  const toggleMode = () => {
    onUpdateTheme({
      ...currentTheme,
      mode: currentTheme.mode === 'dark' ? 'light' : 'dark'
    });
  };

  const selectColor = (color: string) => {
    onUpdateTheme({
      ...currentTheme,
      accentColor: color
    });
  };
  
  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark max-w-md mx-auto overflow-hidden transition-colors">
      <header className="shrink-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <h2 className="text-lg font-bold">پروفایل من</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 rounded-3xl border-4 border-primary/20 overflow-hidden relative shadow-2xl shadow-primary/10">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=135bec&color=fff`} 
              className="w-full h-full object-cover" 
              alt="Avatar" 
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.phoneNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center shadow-sm">
            <span className="text-primary font-bold text-xl block">{messageCount}</span>
            <span className="text-[10px] text-slate-400">تعداد پیام‌ها</span>
          </div>
          <div className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center shadow-sm">
            <span className="text-secondary font-bold text-xl block">۳</span>
            <span className="text-[10px] text-slate-400">آزمون‌های انجام شده</span>
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 px-2">ظاهر و پوسته</h4>
          <div className="bg-white dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-6 shadow-sm">
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">
                  {currentTheme.mode === 'dark' ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="text-sm">حالت شب</span>
              </div>
              <button 
                onClick={toggleMode}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${currentTheme.mode === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform duration-300 ${currentTheme.mode === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* Accent Color Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">palette</span>
                <span className="text-sm">رنگ اصلی برنامه</span>
              </div>
              <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => selectColor(color.value)}
                    className={`size-8 rounded-full shrink-0 border-2 transition-all ${currentTheme.accentColor === color.value ? 'border-primary scale-110 shadow-lg' : 'border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400 px-2">تنظیمات حساب</h4>
          <div className="bg-white dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">notifications</span>
                <span className="text-sm">اعلان‌ها</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">chevron_left</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">security</span>
                <span className="text-sm">امنیت و حریم خصوصی</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-600">chevron_left</span>
            </button>
            <button 
              onClick={onClearHistory}
              className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-colors text-red-500"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">delete_sweep</span>
                <span className="text-sm">پاکسازی حافظه گفتگو</span>
              </div>
            </button>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">logout</span>
          <span>خروج از حساب کاربری</span>
        </button>
      </main>

      <footer className="h-20 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-4 bg-white dark:bg-background-dark">
         <button onClick={onBack} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[9px]">گفتگو</span>
         </button>
         <button onClick={() => {/* navigate to assessments in App.tsx */}} className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">assignment</span>
            <span className="text-[9px]">آزمون‌ها</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined fill-current">person</span>
            <span className="text-[9px] font-bold">پروفایل</span>
         </button>
      </footer>
    </div>
  );
};

export default ProfileScreen;
