import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  FileEdit,
  BadgeCheck,
  Facebook,
} from 'lucide-react';

export default function ContactPage({ onNavigate }) {
  const [inquiryType, setInquiryType] = useState('orders'); // 'orders' | 'merchant' | 'suggestion' | 'tech_support'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitted(true);
    if (window.confetti) {
      window.confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-16 font-tajawal" dir="rtl">
      {/* 1. Sub-Header Action / Breadcrumb Bar */}
      <div className="w-full bg-slate-50/80 border-b border-slate-200/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#004ac6] text-xs font-bold hover:bg-slate-50 transition shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>رجوع</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 text-xs font-semibold">تواصل معنا</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-500 text-xs">
            <span>الرئيسية</span>
            <span>/</span>
            <span className="text-[#004ac6] font-bold">تواصل معنا</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Hero Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-[#004ac6] text-xs font-bold border border-blue-200/60">
            <Headphones className="w-4 h-4 text-blue-600" />
            <span>مركز العناية بالعملاء والشركاء</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#07132B] tracking-tight">
            تواصل معنا
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            نحن هنا لمساعدتك دائمًا، يسعدنا الاستماع لاستفساراتك، مقترحاتك، ومساعدتك في تطوير أعمالك.
          </p>
        </div>

        {/* Bento Grid: Dual Column Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Right Column: Direct Contact Channels & Cloud Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-1">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6">
              {/* Cloud Envelope Motif */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-36 h-32 flex items-center justify-center mb-4">
                  <div className="w-28 h-20 bg-blue-50 rounded-2xl border-2 border-blue-200/60 flex items-center justify-center shadow-inner relative">
                    <Mail className="w-10 h-10 text-[#004ac6]" />
                    <div className="absolute -top-2 -right-2 bg-[#004ac6] text-white p-1 rounded-full shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>
                </div>

                <h2 className="text-lg font-bold text-[#07132B]">قنوات التواصل المباشر</h2>
                <p className="text-xs text-slate-500 mt-1">
                  فريق دعم غيم سبيس جاهز لخدمتك والرد على جميع متطلباتك بسرعة واحترافية.
                </p>
              </div>

              {/* Contact Data List */}
              <div className="space-y-3">
                {/* Email */}
                <a
                  href="mailto:info@ghaymspace.com"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-transparent hover:border-blue-200 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#004ac6] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">البريد الإلكتروني الرسمي</span>
                    <span className="text-xs font-bold text-[#07132B] font-mono group-hover:text-[#004ac6]">
                      info@ghaymspace.com
                    </span>
                  </div>
                </a>

                {/* Phone / Whatsapp */}
                <a
                  href="https://wa.me/967773058707"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">خدمة العملاء والواتساب (حضرموت)</span>
                    <span className="text-xs font-bold text-[#07132B] font-mono group-hover:text-emerald-700 dir-ltr inline-block">
                      +967 773 058 707
                    </span>
                  </div>
                </a>

                {/* Direct Phone Call */}
                <a
                  href="tel:+967773058707"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-transparent hover:border-sky-200 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-[#004ac6] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">رقم الاتصال المباشر للمنصة</span>
                    <span className="text-xs font-bold text-[#07132B] font-mono group-hover:text-[#004ac6] dir-ltr inline-block">
                      773058707
                    </span>
                  </div>
                </a>

                {/* Working Hours */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-transparent">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#004ac6] flex items-center justify-center shadow-xs shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">أوقات العمل</span>
                    <span className="text-xs font-bold text-[#07132B]">على مدار الساعة (24/7)</span>
                  </div>
                </div>
              </div>

              {/* Social Media Channels */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-2">
                <span className="text-[11px] text-slate-400 block">تابع غيم سبيس على وسائل التواصل</span>
                <div className="flex items-center justify-center gap-2.5">
                  {/* Instagram: ghay_m.space */}
                  <a
                    href="https://instagram.com/ghay_m.space"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram @ghay_m.space"
                    title="إنستغرام ghay_m.space"
                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:bg-white hover:scale-110 transition shadow-xs"
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
                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-black hover:bg-white hover:scale-110 transition shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white hover:scale-110 transition shadow-xs"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>

                  {/* WhatsApp: 773058707 */}
                  <a
                    href="https://wa.me/967773058707"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp 773058707"
                    title="واتساب 773058707"
                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-white hover:scale-110 transition shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Phone Direct */}
                  <a
                    href="tel:+967773058707"
                    aria-label="Call 773058707"
                    title="اتصال مباشر 773058707"
                    className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#004ac6] hover:bg-white hover:scale-110 transition shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Assurance Card */}
            <div className="bg-blue-50/70 rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-start gap-3">
              <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-[#07132B]">استجابة سريعة ومضمونة</h3>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  يتم الرد على جميع التذاكر والاستفسارات التجارية في أقل من ساعتين عمل لضمان سلاسة تعاملاتك.
                </p>
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-[#07132B]">أرسل لنا رسالة</h2>
                  <p className="text-xs text-slate-400 mt-0.5">يرجى ملء النموذج أدناه وسيقوم مستشارنا بالرد عليك</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#004ac6] flex items-center justify-center">
                  <FileEdit className="w-5 h-5" />
                </div>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl space-y-2 text-center animate-fadeIn">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-bold text-base">تم إرسال رسالتك بنجاح! ✨</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    شكرًا لتواصلك مع غيم سبيس. تم تسجيل استفسارك وسيتواصل معك فريق خدمة العملاء خلال أقل من ساعتين.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Inquiry Type Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">نوع الاستفسار</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'orders', label: 'استفسار عن طلب' },
                        { id: 'merchant', label: 'انضمام كتاجر' },
                        { id: 'suggestion', label: 'اقتراح أو ملاحظة' },
                        { id: 'tech_support', label: 'دعم فني' },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => setInquiryType(chip.id)}
                          className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                            inquiryType === chip.id
                              ? 'border-[#004ac6] bg-blue-50 text-[#004ac6] shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: سارة باوزير"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition"
                    />
                  </div>

                  {/* Grid: Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        البريد الإلكتروني <span className="text-slate-400 font-normal">(اختياري)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        رقم الجوال أو الواتساب <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="770 123 456"
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رسالتك هنا... <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب تفاصيل استفسارك أو طلبك هنا بوضوح لنتمكن من تقديم الدعم الأمثل..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition resize-none"
                    ></textarea>
                  </div>

                  {/* Terms / Agreement */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="privacy-check"
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="w-4 h-4 rounded text-[#004ac6] border-slate-300 focus:ring-[#004ac6]"
                    />
                    <label htmlFor="privacy-check" className="text-xs text-slate-600 cursor-pointer select-none">
                      أوافق على سياسة الخصوصية وشروط الاستخدام في منصة غيم سبيس.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!agreePrivacy}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#07132B] hover:bg-[#004ac6] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>إرسال الرسالة</span>
                      <Send className="w-4 h-4 text-sky-300" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
