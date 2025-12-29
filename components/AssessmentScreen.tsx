
import React, { useState } from 'react';
import { Assessment, User } from '../types';
import { ASSESSMENTS } from '../constants';
import * as Gemini from '../services/geminiService';

interface AssessmentResult {
  analysis: string;
  exercises: string[];
  followUpQuestions: string[];
}

interface AssessmentScreenProps {
  user: User;
  onBack: () => void;
  onNavigateToProfile: () => void;
  onUpdateUser: (user: User) => void;
}

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ user, onBack, onNavigateToProfile, onUpdateUser }) => {
  const [activeTest, setActiveTest] = useState<Assessment | null>(null);
  const [step, setStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string, options: string[] } | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const startTest = async (test: Assessment) => {
    setActiveTest(test);
    setStep(1);
    setAnswers([]);
    setResult(null);
    setIsAnalyzing(true);
    
    const resp = await Gemini.getAssessmentQuestion(test.title, []);
    setCurrentQuestion(resp);
    setIsAnalyzing(false);
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setIsAnalyzing(true);

    if (step >= 5) {
      const history: { role: 'user' | 'model'; parts: any[] }[] = [
        { role: 'user', parts: [{ text: `من آزمون "${activeTest?.title}" را انجام دادم. پاسخ‌های من عبارتند از: ${newAnswers.join(' | ')}` }] }
      ];
      
      const prompt = `بر اساس پاسخ‌های من، یک تحلیل روانشناختی عمیق و تخصصی ارائه بده.
      پاسخ تو باید دقیقاً در قالب یک JSON معتبر باشد با ساختار زیر:
      {
        "analysis": "متن تحلیل علمی و دقیق به زبان فارسی",
        "exercises": ["تمرین ۱ عملی"، "تمرین ۲ عملی"],
        "followUpQuestions": ["سوال ۱ برای تامل بیشتر"، "سوال ۲ برای تامل بیشتر"]
      }`;

      try {
        const ai = await Gemini.getTherapistResponse(history, [{ text: prompt }], user.analysisPreferences, user.theme);
        // We try to parse the text as JSON
        let parsedResult: AssessmentResult;
        try {
          parsedResult = JSON.parse(ai.text.replace(/```json|```/g, '').trim());
        } catch (e) {
          // Fallback if AI doesn't return clean JSON
          parsedResult = {
            analysis: ai.text,
            exercises: ["مدیتیشن روزانه", "نوشتن افکار"],
            followUpQuestions: ["چه احساسی نسبت به این نتایج داری؟"]
          };
        }
        setResult(parsedResult);
        
        const newSession = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('fa-IR'),
          summary: `تحلیل آزمون ${activeTest?.title}: ${parsedResult.analysis.substring(0, 100)}...`,
          messages: []
        };
        onUpdateUser({ ...user, sessions: [...(user.sessions || []), newSession] });
      } catch (err) {
        console.error("Result generation error", err);
      }
    } else {
      const history = [{ role: 'user', parts: [{ text: `پاسخ به سوال قبل: "${answer}"` }] }];
      const nextResp = await Gemini.getAssessmentQuestion(activeTest!.title, history, answer);
      setCurrentQuestion(nextResp);
      setStep(step + 1);
    }
    setIsAnalyzing(false);
  };

  if (activeTest) {
    return (
      <div className="h-screen bg-background-dark text-white p-6 flex flex-col font-sans overflow-hidden">
        <header className="flex justify-between items-center mb-8 shrink-0">
           <button onClick={() => setActiveTest(null)} className="material-symbols-outlined size-10 flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-90 transition-all rounded-full border border-white/5">close</button>
           <div className="text-center">
             <h3 className="font-bold text-lg">{activeTest.title}</h3>
             <div className="text-[10px] opacity-40 uppercase tracking-widest">مرحله {step} از ۵</div>
           </div>
           <div className="size-10"></div>
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto pb-10 scrollbar-hide">
           {isAnalyzing ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-pulse">
                <div className="relative">
                  <div className="size-20 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 size-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-slate-400">هوش مصنوعی در حال تحلیل پاسخ‌های شماست...</p>
             </div>
           ) : result ? (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* Analysis Section */}
                <section className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group backdrop-blur-sm">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <span className="material-symbols-outlined text-6xl">psychology</span>
                   </div>
                   <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined">analytics</span>
                      تحلیل تخصصی نتایج
                   </h4>
                   <div className="text-sm leading-8 text-slate-200 text-justify whitespace-pre-wrap">{result.analysis}</div>
                </section>

                {/* Exercises Section */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold opacity-60 flex items-center gap-2 px-4">
                    <span className="material-symbols-outlined text-sm">self_improvement</span>
                    تمرین‌های پیشنهادی برای شما
                  </h4>
                  <div className="grid gap-3">
                    {result.exercises.map((ex, i) => (
                      <div key={i} className="bg-slate-800/20 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-800/40 transition-colors">
                        <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-xs">{i + 1}</div>
                        <p className="text-xs font-medium leading-relaxed">{ex}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Follow-up Questions Section */}
                <section className="space-y-4">
                  <h4 className="text-sm font-bold opacity-60 flex items-center gap-2 px-4">
                    <span className="material-symbols-outlined text-sm">quiz</span>
                    سوالاتی برای تامل بیشتر
                  </h4>
                  <div className="space-y-3">
                    {result.followUpQuestions.map((q, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-dashed border-slate-700 text-slate-400 italic text-xs leading-6">
                        {q}
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => {
                      // Navigate back to chat and maybe auto-send a prompt about the result
                      onBack();
                    }}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span>گفتگو با همراه درباره نتایج</span>
                    <span className="material-symbols-outlined">chat_bubble</span>
                  </button>
                  <button onClick={() => setActiveTest(null)} className="w-full py-3 text-slate-500 text-xs font-medium hover:text-white transition-colors">بازگشت به مرکز آزمون</button>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col justify-center space-y-10 animate-in slide-in-from-bottom-8">
                <div className="bg-slate-800/30 p-10 rounded-[3.5rem] border border-slate-700/50 min-h-[220px] flex items-center justify-center text-center shadow-inner relative overflow-hidden">
                   <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl"></div>
                   <p className="text-xl font-medium leading-loose text-white relative z-10">{currentQuestion?.question}</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                   {currentQuestion?.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        className="w-full p-5 bg-slate-800/40 hover:bg-primary/20 transition-all active:scale-[0.98] rounded-[1.5rem] text-sm font-medium border border-slate-700/50 hover:border-primary/50 text-right group flex items-center justify-between"
                      >
                         <span className="group-hover:translate-x-1 transition-transform">{opt}</span>
                         <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-primary">chevron_left</span>
                      </button>
                   ))}
                </div>
             </div>
           )}
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark max-w-md mx-auto overflow-hidden">
      <header className="shrink-0 flex items-center justify-between p-4 border-b dark:border-slate-800 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md z-10">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-90 transition-all">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <h2 className="text-lg font-bold">مرکز خودشناسی هوشمند</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide">
        <div className="p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.01]" style={{ background: `linear-gradient(135deg, ${user.theme?.accentColor || '#135bec'}, #8b5cf6)` }}>
           <div className="absolute inset-0 bg-white/5 animate-shimmer bg-[length:200%_100%] opacity-20 pointer-events-none"></div>
           <h3 className="text-2xl font-black mb-3">تحلیل‌های هوشمند</h3>
           <p className="text-xs opacity-90 leading-relaxed font-medium">
              آزمون‌هایی که با هر پاسخ شما تغییر می‌کنند تا عمیق‌ترین لایه‌های ذهن شما را واکاوی کنند.
           </p>
           <div className="mt-6 flex gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-bold">بدون قضاوت</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-bold">دینامیک</span>
           </div>
        </div>

        <div className="space-y-5 pb-10">
           <h4 className="text-[11px] font-bold opacity-40 uppercase tracking-widest px-2">آزمون‌های تخصصی موجود</h4>
           {ASSESSMENTS.map((test) => (
             <div 
              key={test.id} 
              onClick={() => startTest(test)} 
              className="bg-white dark:bg-slate-800/30 rounded-[2.5rem] p-6 border dark:border-slate-800 hover:border-primary transition-all active:scale-[0.98] cursor-pointer group shadow-sm relative overflow-hidden"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary" style={{ color: user.theme?.accentColor, backgroundColor: `${user.theme?.accentColor}1A` }}>
                         <span className="material-symbols-outlined text-sm">clinical_notes</span>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-500 text-[9px] rounded-full font-bold">{test.category}</span>
                   </div>
                   <span className="text-[10px] opacity-40 font-bold">{test.duration} دقیقه</span>
                </div>
                <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors" style={{ color: user.theme?.accentColor }}>{test.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed line-clamp-2">{test.description}</p>
                <div 
                  className="w-full py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all uppercase tracking-widest"
                >
                   شروع کاوش هوشمند
                   <span className="material-symbols-outlined text-sm">bolt</span>
                </div>
             </div>
           ))}
        </div>
      </main>

      <footer className="h-20 shrink-0 border-t dark:border-slate-800 flex justify-around items-center bg-white dark:bg-background-dark backdrop-blur-md">
         <button onClick={onBack} className="flex flex-col items-center gap-1 opacity-50 active:scale-90 transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">chat_bubble</span>
            <span className="text-[9px] font-bold">گفتگو</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-primary active:scale-90 transition-all">
            <span className="material-symbols-outlined fill-current" style={{ color: user.theme?.accentColor }}>assignment</span>
            <span className="text-[9px] font-bold">آزمون‌ها</span>
         </button>
         <button onClick={onNavigateToProfile} className="flex flex-col items-center gap-1 opacity-50 active:scale-90 transition-all group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">person</span>
            <span className="text-[9px] font-bold">پروفایل</span>
         </button>
      </footer>
    </div>
  );
};

export default AssessmentScreen;
