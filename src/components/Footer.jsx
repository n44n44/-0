import React, { useState } from 'react';
import {
  Mail,
  ArrowUpRight,
  CheckCircle,
  Instagram,
  MessageCircle,
  Phone,
  Facebook,
} from 'lucide-react';

const STITCH_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0kTwyrOgVt1UikZzjl_8adoPbACflThuS0OAMs1NBAxfhdj0d6U5zy__p3zH1LwwSEoGCf-TrnUeEI9e7ofTlwvzBEkjkRq7dWVa2VM8YYzl6qDAYySLO14czo6P79cFjMAhBjFyf9NEde5r2LsURP2LZTDBAFNk7WWjYNfTnw_OMambwfjlKjSD-giwosQLJIjXhF6XEZHmA2tjH6DDME6VgOoNX5agZVPKSTOwWd7WRKHY8-450';

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
      
      {/* 1. Fluid Multi-Layered Organic Cloud Crests at the top of the Footer */}
      <div className="w-full overflow-hidden leading-none relative select-none pointer-events-none -mb-1">
        <svg
          className="relative block w-full h-16 sm:h-24 lg:h-32 text-[#07132B]"
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Layer 1: Soft Pure Cloud Mist (White & Light Sky) */}
          <path
            d="M0,55 C160,15 280,75 460,40 C640,5 780,70 960,30 C1140,5 1280,60 1440,25 L1440,200 L0,200 Z"
            fill="#BAE6FD"
            fillOpacity="0.25"
          />
          {/* Layer 2: Translucent Sky Blue Cloud Drift */}
          <path
            d="M0,85 C140,45 280,105 440,70 C600,35 760,105 920,60 C1080,25 1240,90 1440,55 L1440,200 L0,200 Z"
            fill="#38BDF8"
            fillOpacity="0.2"
          />
          {/* Layer 3: Twilight Cloud Shadow */}
          <path
            d="M0,115 C160,80 300,135 480,100 C660,65 800,125 980,90 C1160,55 1300,115 1440,85 L1440,200 L0,200 Z"
            fill="#0E2248"
            fillOpacity="0.65"
          />
          {/* Layer 4: Deep Navy Cloud Crests seamlessly forming the Footer Body */}
          <path
            d="M0,135 C110,110 220,150 340,125 C460,100 570,140 690,120 C810,100 920,140 1040,122 C1160,105 1270,142 1440,128 L1440,200 L0,200 Z"
            fill="#07132B"
          />
        </svg>
      </div>

      {/* 2. Main Footer Body with Atmospheric Cloud Sky Gradient */}
      <div className="relative bg-gradient-to-b from-[#07132B] via-[#091C3E] to-[#040C1D] text-white pt-6 pb-8 border-t border-sky-400/10">
        
        {/* Ambient Dreamy Floating Cloud Auras */}
        <div className="absolute top-0 right-1/4 w-96 h-56 bg-sky-400/10 rounded-full blur-3xl pointer-events-none anim-cloud-float-1"></div>
        <div className="absolute bottom-4 left-1/4 w-96 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none anim-cloud-float-2"></div>
        <div className="absolute top-1/2 left-1/3 w-[36rem] h-32 bg-sky-300/5 rounded-full blur-2xl pointer-events-none anim-cloud-glow"></div>

        {/* Delicate Cloud Vector Silhouettes in Background */}
        <svg className="absolute -bottom-10 right-16 w-80 h-36 opacity-10 pointer-events-none text-sky-200 fill-current blur-[1px]" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path>
        </svg>
        <svg className="absolute top-4 left-20 w-64 h-28 opacity-10 pointer-events-none text-sky-300 fill-current blur-[1px]" viewBox="0 0 24 24">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"></path>
        </svg>

        {/* 3. Main Footer Interactive Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 items-center justify-between">
            
            {/* COLUMN 1 (Far Right in RTL): Newsletter Capsule Subscription */}
            <div className="lg:col-span-4 space-y-4 text-right order-1">
              <div className="flex items-center justify-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-400 shrink-0 shadow-sm">
                  <Mail className="w-4 h-4 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    تابعنا ليصلك كل جديد
                  </h3>
                  <p className="text-[11px] text-sky-200/80">عروض حصرية وإبداعات حرفيي حضرموت</p>
                </div>
              </div>

              {/* White Capsule Newsletter Form with Circular Navy Button inside */}
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <div
                  className="bg-white rounded-full p-1.5 flex items-center justify-between shadow-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-sky-400"
                  dir="ltr"
                >
                  {/* Circular Submit Button on Far Left with Arrow */}
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-full bg-[#07132B] hover:bg-[#122245] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-md cursor-pointer group"
                    title="اشتراك"
                  >
                    <ArrowUpRight className="w-5 h-5 text-sky-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  {/* Text Input aligned right */}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="flex-1 min-w-0 bg-transparent text-slate-800 placeholder-slate-400 text-xs sm:text-sm px-4 py-2 focus:outline-none text-right font-medium"
                  />
                </div>

                {subscribed && (
                  <div className="mt-2 text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>تم الاشتراك بنجاح! شكراً لانضمامك إلى غيم سبيس ☁️✨</span>
                  </div>
                )}
              </form>
            </div>

            {/* COLUMN 2 (Center-Right in RTL): Customer Service */}
            <div className="lg:col-span-2 space-y-3 text-right order-2">
              <h3 className="text-base font-bold text-white tracking-wide mb-3 flex items-center gap-1.5">
                <span>خدمة العملاء</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
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
            <div className="lg:col-span-2 space-y-3 text-right order-3">
              <h3 className="text-base font-bold text-white tracking-wide mb-3 flex items-center gap-1.5">
                <span>روابط سريعة</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
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
                    onClick={() => nav('stores')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    جميع المتاجر
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => nav('categories')}
                    className="hover:text-sky-300 transition-colors text-right block w-full hover:-translate-x-1 duration-200 cursor-pointer"
                  >
                    تصنيفات المنتجات
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

            {/* COLUMN 4 (Far Left in RTL): Logo & Social Links */}
            <div className="lg:col-span-4 space-y-4 text-right order-4">
              {/* Brand Logo & Slogan */}
              <button
                type="button"
                className="flex items-center gap-3.5 cursor-pointer group text-right"
                onClick={() => nav('home')}
              >
                {/* Official Platform Logo */}
                <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden bg-white/10 p-1.5 border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <img src={STITCH_LOGO_URL} alt="شعار منصة غيم سبيس" className="w-full h-full object-contain filter drop-shadow" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white leading-tight tracking-wide">
                    غيم سبيس
                  </h2>
                  <p className="text-xs text-sky-200 font-medium flex items-center gap-1.5 mt-0.5">
                    <span>Ghaym Space | مساحتك لكل ما تحبين</span>
                    <span className="text-sky-300 text-sm">☁️</span>
                  </p>
                </div>
              </button>

              {/* Clickable Social Media Outline Buttons */}
              <div className="flex items-center gap-2.5 pt-1" dir="ltr">
                {/* Instagram: ghay_m.space */}
                <a
                  href="https://instagram.com/ghay_m.space"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram @ghay_m.space"
                  title="إنستغرام ghay_m.space"
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white hover:bg-white/15 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Instagram className="w-4 h-4 text-sky-200" />
                </a>

                {/* TikTok: ghay_m.space */}
                <a
                  href="https://tiktok.com/@ghay_m.space"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok @ghay_m.space"
                  title="تيك توك ghay_m.space"
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white hover:bg-white/15 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current text-sky-200" viewBox="0 0 24 24">
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
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white hover:bg-white/15 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Facebook className="w-4 h-4 text-sky-200" />
                </a>

                {/* WhatsApp: 773058707 */}
                <a
                  href="https://wa.me/967773058707"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp 773058707"
                  title="واتساب خدمة العملاء 773058707"
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white hover:bg-white/15 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </a>

                {/* Phone Call: 773058707 */}
                <a
                  href="tel:+967773058707"
                  aria-label="Phone 773058707"
                  title="اتصال مباشر 773058707"
                  className="w-8 h-8 rounded-full border border-white/40 hover:border-white hover:bg-white/15 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-300" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Bottom Horizontal Divider & Copyright Bar */}
          <div className="mt-10 pt-5 border-t border-white/10 flex items-center justify-center text-xs text-sky-200/80 text-center gap-1.5 font-medium">
            <span>جميع الحقوق محفوظة .2026 Ghaym Space</span>
            <span className="text-sky-400">☁️</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
