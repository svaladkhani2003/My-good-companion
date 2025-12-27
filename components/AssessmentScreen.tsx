
import React from 'react';
import { ASSESSMENTS } from '../constants';

interface AssessmentScreenProps {
  onBack: () => void;
  onNavigateToProfile: () => void;
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onBack, onNavigateToProfile }) => {
  return (
    <div className="h-screen flex flex-col bg-background-dark max-w-md mx-auto overflow-hidden">
      <header className="shrink-0 flex items-center justify-between p-4 border-b border-slate-800">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <h2 className="text-lg font-bold">آزمون‌ها</h2>
        <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg group">
          <img src="https://picsum.photos/seed/abstract/800/400" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-4 right-4 text-white text-right">
             <span className="px-2 py-1 bg-primary text-[10px] rounded-lg mb-2 inline-block">پیشنهاد ویژه</span>
             <h3 className="text-xl font-bold">خودشناسی عمیق‌تر</h3>
             <p className="text-xs text-slate-300">با انجام این آزمون‌ها، هوش مصنوعی راهکارهای دقیق‌تری ارائه می‌دهد.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-bold">برای شما</h3>
            <span className="text-xs text-primary font-medium">مشاهده همه</span>
          </div>
          
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-primary"></div>
            <div className="flex gap-4 items-start mb-3">
              <div className="size-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                 <span className="material-symbols-outlined">sentiment_satisfied</span>
              </div>
              <div>
                <h4 className="font-bold text-sm">چکاپ روزانه خلق و خو</h4>
                <p className="text-[10px] text-slate-400">بررسی وضعیت احساسی امروز شما برای الگوسازی دقیق‌تر.</p>
              </div>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mb-2">
              <div className="w-[65%] h-full bg-primary rounded-full shadow-[0_0_8px_#135bec]"></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>۶۵٪ تکمیل شده</span>
              <button className="text-primary font-bold">ادامه دهید</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold">لیست آزمون‌ها</h3>
          <div className="grid gap-4">
            {ASSESSMENTS.map((test) => (
              <div 
                key={test.id} 
                className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => alert('این آزمون به زودی فعال خواهد شد. فعلاً در حال آماده‌سازی سوالات هستیم.')}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-3">
                    <div className={`size-10 rounded-xl flex items-center justify-center ${test.id === 'mbti' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                      <span className="material-symbols-outlined">{test.id === 'mbti' ? 'psychology' : 'mood_bad'}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{test.title}</h4>
                      <span className="text-[10px] text-slate-500">{test.category}</span>
                    </div>
                  </div>
                  {test.completed && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] rounded font-bold">تکمیل شده</span>
                  )}
                </div>
                <div className="flex gap-4 mb-4 text-[10px] text-slate-500">
                   <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span>{test.duration} دقیقه</div>
                   <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">quiz</span>{test.questions} سوال</div>
                </div>
                <button className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  test.completed 
                  ? 'border border-slate-700 text-slate-400 hover:bg-slate-800' 
                  : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-blue-600'
                }`}>
                  {test.completed ? 'مشاهده نتایج' : 'شروع آزمون'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="h-20 border-t border-slate-800 flex justify-around items-center px-4 bg-background-dark">
         <button onClick={onBack} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[9px]">گفتگو</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined fill-current">assignment</span>
            <span className="text-[9px] font-bold">آزمون‌ها</span>
         </button>
         <button onClick={onNavigateToProfile} className="flex flex-col items-center gap-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[9px]">پروفایل</span>
         </button>
      </footer>
    </div>
  );
};

export default AssessmentScreen;
