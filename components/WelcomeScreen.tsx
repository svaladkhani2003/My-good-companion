
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onShowFeatures: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onShowFeatures }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center bg-background-dark overflow-hidden p-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      
      <header className="relative z-10 w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary">psychology</span>
          </div>
          <h2 className="text-lg font-bold">درمانگر هوشمند</h2>
        </div>
        <button 
          onClick={onShowFeatures}
          className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors border border-white/5"
        >
          <span className="material-symbols-outlined text-slate-400">info</span>
        </button>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 max-w-sm">
        {/* Animated Brain Container */}
        <div className="relative group animate-float">
          {/* Neural Orbits */}
          <div className="absolute inset-0 -m-8 border border-primary/10 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-0 -m-16 border border-secondary/5 rounded-full animate-spin-reverse-slow"></div>
          
          <div className="absolute inset-0 border border-primary/20 rounded-full scale-110 animate-pulse-slow"></div>
          
          <div className="relative w-64 aspect-square rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(19,91,236,0.3)] border border-white/10 bg-slate-900">
            {/* The Brain Image - Stylized Psychology/Neural Theme */}
            <img 
              src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000&auto=format&fit=crop" 
              alt="Neural Brain Visualization" 
              className="w-full h-full object-cover opacity-80 mix-blend-lighten"
            />
            
            {/* Interactive Pulse Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-primary/5 to-transparent"></div>
            
            {/* Dynamic Light Scan Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[scan_4s_ease-in-out_infinite]"></div>
          </div>

          {/* Floating Data Nodes */}
          <div className="absolute -top-4 -right-4 size-10 bg-primary/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center animate-bounce duration-[3000ms]">
            <span className="material-symbols-outlined text-primary text-xl">cognition</span>
          </div>
          <div className="absolute -bottom-2 -left-4 size-12 bg-secondary/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center animate-bounce duration-[4000ms]">
            <span className="material-symbols-outlined text-secondary text-2xl">neurology</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">مسیر آرامش ذهنی</h1>
          <p className="text-slate-400 leading-relaxed text-lg">
            دستیار هوشمند روانشناسی؛ تحلیلی نو از پیچیدگی‌های ذهن شما به زبان فارسی.
          </p>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-sm pb-10 flex flex-col gap-4">
        <button 
          onClick={onStart}
          className="group relative w-full h-14 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all overflow-hidden"
        >
          <span className="mr-2 z-10">شروع گفتگو</span>
          <span className="material-symbols-outlined transition-transform group-hover:-translate-x-2 z-10">arrow_back</span>
          {/* Button Hover Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
        <button 
          onClick={onShowFeatures}
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          بررسی قابلیت‌های هوش مصنوعی
        </button>
        <div className="flex items-center justify-center gap-1.5 opacity-50">
          <span className="material-symbols-outlined text-sm">lock</span>
          <p className="text-xs">داده‌های شما کاملاً محرمانه باقی می‌ماند</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(500%); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default WelcomeScreen;
