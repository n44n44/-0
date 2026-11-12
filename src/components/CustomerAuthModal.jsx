import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import GhaymLogo from './GhaymLogo';
import { NEIGHBORHOODS_MUKALLA } from '../data/mockData';
import YemeniPhoneInput from './YemeniPhoneInput';
import { validateYemeniPhone } from '../utils/phoneValidation';

export default function CustomerAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { loginCustomer, registerCustomer } = usePlatform();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('771234567');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    neighborhood: NEIGHBORHOODS_MUKALLA[0].name,
    password: '',
  });

  // Forgot password state
  const [forgotPhone, setForgotPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      alert('يرجى إدخال رقم الجوال أو البريد الإلكتروني.');
      return;
    }
    const user = loginCustomer(loginIdentifier, loginPassword);
    if (window.confetti) {
      window.confetti({ particleCount: 60, spread: 50 });
    }
    if (onAuthSuccess) onAuthSuccess(user);
    onClose();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regData.name.trim()) {
      alert('يرجى كتابة الاسم الكامل.');
      return;
    }
    const phoneVal = validateYemeniPhone(regData.phone);
    if (!phoneVal.valid) {
      alert(phoneVal.error);
      return;
    }
    const user = registerCustomer({
      ...regData,
      phone: phoneVal.cleaned,
    });
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60 });
    }
    if (onAuthSuccess) onAuthSuccess(user);
    onClose();
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!forgotPhone.trim()) {
      alert('يرجى إدخال رقم الهاتف.');
      return;
    }
    setOtpSent(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otpCode || !newPassword) {
      alert('يرجى إدخال الرمز وكلمة المرور الجديدة.');
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setOtpSent(false);
      setActiveTab('login');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Decorative Bar */}
        <div className="bg-[#172A46] p-6 text-white text-center relative overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-2">
            <GhaymLogo size="md" subtitle="بوابة حسابات العملاء" />
          </div>

          <h3 className="text-base font-extrabold text-white mt-1">
            {activeTab === 'login' && 'مرحباً بك مجدداً في غيم سبيس'}
            {activeTab === 'register' && 'إنشاء حساب عميل جديد'}
            {activeTab === 'forgot' && 'استعادة كلمة المرور'}
          </h3>
          <p className="text-xs text-sky-200 mt-0.5">
            {activeTab === 'login' && 'سجل الدخول لمتابعة طلباتك وإتمام الشراء بسهولة'}
            {activeTab === 'register' && 'انضم لآلاف المتسوقين وادعم الحرفيين والأسر المنتجة'}
            {activeTab === 'forgot' && 'أدخل رقم هاتفك لتلقي رمز التحقق وإعادة التعيين'}
          </p>

          {/* Navigation Tabs */}
          <div className="flex bg-[#0e1b2f] p-1 rounded-xl mt-4 border border-[#2b4c7a]">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'login'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'register'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              حساب جديد
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم الهاتف أو البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="77XXXXXXX أو your@email.com"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 pr-9 focus:outline-none focus:border-[#54B9F2]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">كلمة المرور</label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-[#54B9F2] hover:underline font-bold"
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 pr-9 pl-9 focus:outline-none focus:border-[#54B9F2]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#54B9F2] to-sky-600 hover:from-sky-400 hover:to-[#54B9F2] text-[#172A46] font-black text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>تسجيل الدخول ومتابعة التسوق</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick test credentials hint */}
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] text-center">
                <span>💡 حساب تجريبي مفعل: <strong>771234567</strong> (فاطمة باوزير)</span>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="مثال: عبدالله أحمد باوزير"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 pr-9 focus:outline-none focus:border-[#54B9F2]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <YemeniPhoneInput
                label="رقم الهاتف اليمني (واتساب)"
                required={true}
                value={regData.phone}
                onChange={(cleaned) => setRegData({ ...regData, phone: cleaned })}
                id="customer-register-phone-input"
              />

              <div>
                <label className="block font-bold text-slate-700 mb-1">الحي / المنطقة في المكلا</label>
                <div className="relative">
                  <select
                    value={regData.neighborhood}
                    onChange={(e) => setRegData({ ...regData, neighborhood: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 pr-9 focus:outline-none focus:border-[#54B9F2]"
                  >
                    {NEIGHBORHOODS_MUKALLA.map((n) => (
                      <option key={n.name} value={n.name}>
                        {n.name} ({n.fee} ر.ي توصيل)
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="اختر كلمة مرور قوية"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 pr-9 focus:outline-none focus:border-[#54B9F2]"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>إنشاء الحساب وبدء التسوق</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {activeTab === 'forgot' && (
            <div className="space-y-4 text-xs">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      أدخل رقم الهاتف المسجل لتلقي كود التحقق
                    </label>
                    <input
                      type="tel"
                      required
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="77XXXXXXX"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#172A46] text-white font-bold hover:bg-[#24416a] transition"
                  >
                    إرسال كود التحقق (OTP)
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="w-full text-center text-slate-500 hover:underline"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="p-3 bg-sky-50 rounded-xl text-sky-800 text-[11px]">
                    تم إرسال كود التحقق التجريبي: <strong>8942</strong> إلى {forgotPhone}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رمز التحقق (OTP)</label>
                    <input
                      type="text"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="أدخل الرمز المكون من 4 أرقام"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 text-center font-mono tracking-widest text-base focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور الجديدة"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>

                  {resetSuccess && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-1.5 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>تمت استعادة وتغيير كلمة المرور بنجاح! جاري التحويل...</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                  >
                    تأكيد وتعيين كلمة المرور
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

