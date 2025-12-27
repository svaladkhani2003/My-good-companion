
import React, { useState } from 'react';
import { User } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      onLogin({ name: name || 'کاربر عزیز', phoneNumber: phone });
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background-dark overflow-hidden max-w-md mx-auto relative">
      <div 
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: 'url(https://picsum.photos/seed/therapy/800/600)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-dark"></div>
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          <button className="size-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
             <span className="material-symbols-outlined text-2xl">psychology</span>
             <span>سایک‌آی</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 -mt-10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">خوش آمدید</h1>
          <p className="text-slate-400">همراه هوشمند سلامت روان شما</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">نام شما</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 rounded-xl bg-slate-800 border-none focus:ring-2 focus:ring-primary text-white text-right"
              placeholder="نام مستعار یا واقعی"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">شماره موبایل</label>
            <div className="relative">
              <input 
                dir="ltr"
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-800 border-none focus:ring-2 focus:ring-primary text-white text-right pl-4 pr-10"
                placeholder="0912 345 6789"
                required
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-slate-500">smartphone</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <span>ورود به برنامه</span>
            <span className="material-symbols-outlined">login</span>
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <span className="relative flex justify-center text-sm px-4 bg-background-dark text-slate-500">یا ورود با</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center h-12 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
            <span className="text-sm">گوگل</span>
          </button>
          <button className="flex items-center justify-center h-12 rounded-xl border border-slate-800 hover:bg-slate-800 transition-colors">
            <span className="text-sm">اپل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
