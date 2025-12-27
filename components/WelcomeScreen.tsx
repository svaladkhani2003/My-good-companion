
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onShowFeatures: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onShowFeatures }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center bg-background-dark overflow-hidden p-6 text-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <header className="relative z-10 w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">psychology</span>
          </div>
          <h2 className="text-lg font-bold">درمانگر هوشمند</h2>
        </div>
        <button 
          onClick={onShowFeatures}
          className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-slate-400">info</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 max-w-sm">
        <div className="relative group">
          <div className="absolute inset-0 border border-primary/20 rounded-full scale-110 animate-pulse-slow"></div>
          <div className="w-72 aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/30 border border-white/10">
            <img 
              src="https://picsum.photos/seed/brain/800/800" 
              alt="Mental Clarity" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">مسیر آرامش ذهنی</h1>
          <p className="text-slate-400 leading-relaxed text-lg">
            اولین دستیار هوشمند روانشناسی با قابلیت تحلیل بلادرنگ و گفتگو به زبان فارسی.
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-sm pb-10 flex flex-col gap-4">
        <button 
          onClick={onStart}
          className="group relative w-full h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all overflow-hidden"
        >
          <span className="mr-2">شروع گفتگو</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2">arrow_back</span>
        </button>
        <button 
          onClick={onShowFeatures}
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          امکانات و نحوه عملکرد برنامه
        </button>
        <div className="flex items-center justify-center gap-1.5 opacity-50">
          <span className="material-symbols-outlined text-sm">lock</span>
          <p className="text-xs">حریم خصوصی شما اولویت ماست</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomeScreen;
