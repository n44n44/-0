import React, { useState } from 'react';
import {
  Mail,
  ArrowUpRight,
  CheckCircle,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  Facebook,
} from 'lucide-react';
import { LOGO_DATA_URI } from '../data/logoBase64';

export default function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  const nav = (route) => {
    if (onNavigate) onNavigate(route);
  };

  return (
    <footer className="w-full relative mt-16 select-none overflow-hidden" dir="rtl">
      {/* 1. Organic Wavy Top Boundary (Exact Two-Crest Curve Matching Figma Node 4-7) */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mb-1 bg-[#F8FAFC]">
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-16 lg:h-20 text-[#07132B] fill-current"
        >
          <path d="M0,45 C160,12 340,15 500,38 C680,62 820,58 980,32 C1150,10 1310,14 1440,46 L1440,90 L0,90 Z" />
        </svg>
      </div>

      {/* 2. Main Footer Body with Deep Space Navy Background */}
      <div className="relative bg-gradient-to-b from-[#07132B] via-[#091736] to-[#050E24] text-white pt-8 pb-6">
        {/* 3. Main Footer Interactive Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 items-center justify-between">
            
            {/* COLUMN 1 (Far Right in RTL): Newsletter Capsule Subscription */}
            <div className="lg:col-span-4 space-y-4 text-right order-1 lg:pl-6">
              <div className="flex items-center justify-start gap-2.5">
                <div className="w-7 h-7 rounded-lg border border-white/60 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  تابعنا ليصلك كل جديد
                </h3>
              </div>

              {/* White Capsule Newsletter Form with Circular Navy Button inside */}
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <div
                  className="bg-white rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-sky-400"
                  dir="ltr"
                >
                  {/* Circular Submit Button on the Far Left with Arrow Top-Right */}
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#07132B] hover:bg-[#122245] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer group"
                    title="اشتراك"
                  >
                    <ArrowUpRight className="w-5 h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Text Input aligned right */}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="flex-1 min-w-0 bg-transparent text-slate-800 placeholder-slate-400 text-sm px-4 py-2 focus:outline-none text-right font-medium"
                  />
                </div>

                {subscribed && (
                  <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>تم الاشتراك بنجاح! شكراً لانضمامك إلى غيم سبيس 🤍</span>
                  </div>
                )}
              </form>
            </div>

            {/* COLUMN 2 (Center-Right in RTL): Customer Service */}
            <div className="lg:col-span-2 space-y-3 text-right lg:border-r lg:border-white/15 lg:pr-8 lg:pl-4 order-2">
              <h3 className="text-base font-bold text-white tracking-wide mb-3">
                خدمة العملاء
              </h3>
              <ul className="space-y-2 text-sm text-slate-200">
                <li>
                  <a
                    href="tel:+967773058707"
                    className="hover:text-sky-300 transition-colors text-right flex items-center justify-start gap-1.5 hover:-translate-x-1 duration-200 cursor-pointer font-mono dir-ltr"
                    title="اتصل بخدمة العملاء"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>773058707</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/967773058707"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-300 transition-colors text-right flex items-center justify-start gap-1.5 hover:-translate-x-1 duration-200 cursor-pointer font-mono dir-ltr"
                    title="تواصل عبر الواتساب"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>واتساب 773058707</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => nav('contact')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    المساعدة والدعم
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => nav('contact')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    تواصل معنا
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => nav('about')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    الأسئلة الشائعة
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 (Center-Left in RTL): Quick Links */}
            <div className="lg:col-span-2 space-y-3 text-right lg:border-r lg:border-white/15 lg:pr-8 lg:pl-4 order-3">
              <h3 className="text-base font-bold text-white tracking-wide mb-3">
                روابط سريعة
              </h3>
              <ul className="space-y-2 text-sm text-slate-200">
                <li>
                  <button
                    onClick={() => nav('about')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    من نحن
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => nav('about')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    سياسة الخصوصية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => nav('about')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    الشروط والأحكام
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 4 (Far Left in RTL): Logo & Social Links (Official Brand Assets) */}
            <div className="lg:col-span-4 space-y-4 text-right lg:border-r lg:border-white/15 lg:pr-8 order-4">
              {/* Brand Logo & Slogan */}
              <div
                className="flex items-center gap-3.5 cursor-pointer group"
                onClick={() => nav('home')}
              >
                {/* Official Platform Logo */}
                <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-white/10 p-1 border border-white/25 shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <img src={LOGO_DATA_URI} alt="شعار منصة غيم سبيس" className="w-full h-full object-contain" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white leading-tight tracking-wide">
                    غيم سبيس
                  </h2>
                  <p className="text-xs text-sky-100 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>مساحتك لكل ما تحبين</span>
                    <span className="text-white text-sm font-bold">♡</span>
                  </p>
                </div>
              </div>

              {/* Real Clickable Social Media Outline Buttons with Authentic User Handles */}
              <div className="flex items-center gap-3 pt-1" dir="ltr">
                {/* Instagram: ghay_m.space */}
                <a
                  href="https://instagram.com/ghay_m.space"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram @ghay_m.space"
                  title="إنستغرام ghay_m.space"
                  className="w-8 h-8 rounded-full border border-white/60 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* TikTok: ghay_m.space */}
                <a
                  href="https://tiktok.com/@ghay_m.space"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok @ghay_m.space"
                  title="تيك توك ghay_m.space"
                  className="w-8 h-8 rounded-full border border-white/60 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.98v8.66c0 1.94-.48 3.92-1.55 5.54-1.22 1.83-3.17 3.07-5.35 3.42-2.19.34-4.5-.18-6.3-1.42-1.81-1.23-3.04-3.17-3.37-5.36-.34-2.18.2-4.5 1.45-6.3 1.25-1.8 3.2-3.03 5.38-3.35.48-.07.97-.09 1.46-.07v4.13c-.76-.08-1.54.06-2.21.43-.68.37-1.22.95-1.52 1.68-.3.72-.34 1.54-.12 2.3.22.76.71 1.41 1.38 1.84.67.43 1.49.57 2.27.42.79-.15 1.48-.61 1.94-1.27.47-.65.71-1.46.7-2.27V.02z" />
                  </svg>
                </a>

                {/* Facebook: ghaym.space */}
                <a
                  href="https://facebook.com/ghaym.space"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook ghaym.space"
                  title="فيسبوك ghaym.space"
                  className="w-8 h-8 rounded-full border border-white/60 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* WhatsApp: 773058707 */}
                <a
                  href="https://wa.me/967773058707"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp 773058707"
                  title="واتساب خدمة العملاء 773058707"
                  className="w-8 h-8 rounded-full border border-white/60 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Phone Call: 773058707 */}
                <a
                  href="tel:+967773058707"
                  aria-label="Phone 773058707"
                  title="اتصال مباشر 773058707"
                  className="w-8 h-8 rounded-full border border-white/60 hover:border-white hover:bg-white/10 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Bottom Horizontal Divider & Copyright Bar (Exact Figma Match) */}
          <div className="mt-10 pt-5 border-t border-white/15 flex items-center justify-center text-xs text-slate-300 text-center gap-1.5 font-medium">
            <span>جميع الحقوق محفوظة. 2026 Ghaym Space.</span>
            <span className="text-sm">⊛</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
