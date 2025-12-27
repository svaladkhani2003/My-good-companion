
import React from 'react';

interface FeaturesScreenProps {
  onBack: () => void;
}

const FeaturesScreen: React.FC<FeaturesScreenProps> = ({ onBack }) => {
  return (
    <div className="h-screen flex flex-col bg-background-dark max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md z-30 border-b border-slate-800">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <h2 className="text-lg font-bold">ویژگی‌های هوشمند</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* Premium Hero Section */}
        <section className="relative pt-12 pb-20 px-6 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>
          
          {/* Looped Animation Visualizer */}
          <div className="relative mx-auto w-48 h-48 mb-10 flex items-center justify-center">
            {/* Stage 1: Pulse Ring (Listening) */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping opacity-20"></div>
            
            {/* Stage 2: Rotating Orbits (Analyzing) */}
            <div className="absolute inset-2 border-t-2 border-primary rounded-full animate-spin [animation-duration:3s]"></div>
            <div className="absolute inset-6 border-r-2 border-secondary rounded-full animate-spin [animation-duration:5s] [animation-direction:reverse]"></div>
            
            {/* Stage 3: Core (Insight) */}
            <div className="relative size-24 bg-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_40px_rgba(19,91,236,0.3)]">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
            </div>

            {/* Floating Data Bubbles */}
            <div className="absolute top-0 right-0 size-8 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-white/5 flex items-center justify-center animate-bounce [animation-duration:4s]">
                <span className="material-symbols-outlined text-sm text-blue-400">equalizer</span>
            </div>
            <div className="absolute bottom-4 left-0 size-10 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-white/5 flex items-center justify-center animate-bounce [animation-duration:3s]">
                <span className="material-symbols-outlined text-sm text-purple-400">favorite</span>
            </div>
          </div>

          <h1 className="text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            همراهی فراتر از یک چت‌بات
          </h1>
          <p className="text-slate-400 leading-relaxed max-w-xs mx-auto text-sm">
            ما با ترکیب هوش مصنوعی نسل جدید و متدهای علمی روانشناسی، تجربه‌ای منحصر به فرد از خودشناسی را برای شما فراهم کرده‌ایم.
          </p>
        </section>

        {/* Feature Sections */}
        <div className="px-6 space-y-12 pb-20">
          
          {/* Section 1: Analysis */}
          <div className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <h3 className="text-xl font-bold">تحلیل عمیق و بلادرنگ</h3>
            </div>
            <p className="text-slate-400 text-sm leading-7 pr-16 border-r-2 border-primary/20">
              هر کلمه‌ای که می‌نویسید، توسط مدل‌های زبانی پیشرفته تحلیل می‌شود تا الگوهای خلقی، سطوح استرس و نشانه‌های اضطراب شما شناسایی شود. این تحلیل‌ها به شما کمک می‌کند ریشه احساسات خود را بهتر درک کنید.
            </p>
          </div>

          {/* Section 2: Clinical Tests */}
          <div className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3 className="text-xl font-bold">آزمون‌های بالینی معتبر</h3>
            </div>
            <p className="text-slate-400 text-sm leading-7 pr-16 border-r-2 border-secondary/20">
              دسترسی به تست‌های استاندارد جهانی مانند MBTI، تست افسردگی بک و نئو. نتایج این آزمون‌ها مستقیماً در حافظه درمانی شما ذخیره شده و به هوش مصنوعی کمک می‌کند مشاوره‌های دقیق‌تری ارائه دهد.
            </p>
          </div>

          {/* Section 3: Privacy */}
          <div className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h3 className="text-xl font-bold">امنیت و ناشناسی کامل</h3>
            </div>
            <p className="text-slate-400 text-sm leading-7 pr-16 border-r-2 border-emerald-500/20">
              داده‌های شما با بالاترین استانداردهای امنیتی رمزگذاری می‌شوند. شما می‌توانید در محیطی کاملاً امن و بدون قضاوت، درونی‌ترین افکار خود را به اشتراک بگذارید. کنترل کامل تاریخچه گفتگوها همیشه در اختیار شماست.
            </p>
          </div>

          {/* Use Cases Section */}
          <div className="pt-10">
            <h3 className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">موارد استفاده واقعی</h3>
            <div className="grid gap-4">
              <div className="bg-slate-800/20 p-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-blue-500 text-sm">work</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">مدیریت فشار کاری</h4>
                  <p className="text-[10px] text-slate-500 mt-1">تخلیه ذهن بعد از یک روز سخت و دریافت راهکارهای کاهش تنش.</p>
                </div>
              </div>
              
              <div className="bg-slate-800/20 p-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-purple-500 text-sm">group</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">بهبود روابط اجتماعی</h4>
                  <p className="text-[10px] text-slate-500 mt-1">تحلیل رفتارهای تکراری در روابط و پیدا کردن ریشه‌های عدم تفاهم.</p>
                </div>
              </div>

              <div className="bg-slate-800/20 p-4 rounded-3xl border border-slate-800 flex items-center gap-4">
                <div className="size-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-orange-500 text-sm">self_improvement</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">رشد و توسعه فردی</h4>
                  <p className="text-[10px] text-slate-500 mt-1">مانیتور کردن روند تغییرات روحی در طول ماه‌ها برای رسیدن به ثبات.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA Footer */}
      <footer className="p-6 border-t border-slate-800 bg-background-dark/80 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="w-full h-14 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all"
        >
          <span>شروع تجربه شخصی شما</span>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </footer>
    </div>
  );
};

export default FeaturesScreen;
