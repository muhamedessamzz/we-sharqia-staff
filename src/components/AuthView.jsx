import React, { useState } from 'react';
import { api } from '../api/client';
import { LogIn, Lock, User, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(username, password);
      onLoginSuccess(res);
    } catch (err) {
      setError(err.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-purple-950/5 border border-purple-100/90 relative overflow-hidden">
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#E4007C] via-[#5C2C90] to-[#0984e3]"></div>

        {/* Brand Header */}
        <div className="text-center mb-5 pt-1">
          <img
            src="/Purple Code and Signal Crest.png"
            alt="شعار مدارس WE للتكنولوجيا التطبيقية"
            className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-xs"
          />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">مدارس WE للتكنولوجيا التطبيقية</h2>
          <div className="inline-flex items-center gap-1.5 bg-pink-50 text-[#E4007C] text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-pink-200/80 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E4007C]"></span>
            <span>بوابة إدارة المدرسة والمعلمين</span>
          </div>
        </div>


        {error && (
          <div className="bg-rose-50 text-rose-700 p-3 rounded-2xl text-xs font-bold mb-4 flex items-center gap-2 border border-rose-200 fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">اسم المستخدم</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#F8F5FC] border border-purple-100 rounded-xl pr-10 pl-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#5C2C90]/30 focus:border-[#5C2C90] focus:bg-white transition-all text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-[#5C2C90] via-[#7B3FA8] to-[#E4007C] hover:opacity-95 shadow-md shadow-purple-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn size={17} />
            <span>{loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
