import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Headphones,
  Award,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Store,
  BookOpen,
  Eye,
  Rocket,
  Quote,
  CheckCircle2,
  Clock,
  Users,
  PackageCheck,
  Smile,
} from 'lucide-react';
import GhaymLogo from '../components/GhaymLogo';
import { LOGO_DATA_URI } from '../data/logoBase64';

export default function AboutPage({ onNavigate, onOpenSellerModal }) {
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
            <span className="text-slate-600 text-xs font-semibold">من نحن</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-xs bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>موقع التوصيل:</span>
            <span className="font-bold text-[#07132B]">المكلا، حضرموت</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
        {/* HERO SECTION: Cloud Canvas with Official Brand Illustration & Mission */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-white via-slate-50 to-blue-50/50 border border-slate-200/70 p-6 md:p-12 shadow-sm">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#004ac6] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>بوابة التسوق السحابية الأولى في حضرموت</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-[#07132B] tracking-tight leading-tight">
                غيم سبيس <span className="text-[#004ac6]">| Ghaym Space</span>
              </h1>

              <p className="text-lg font-bold text-[#004ac6]">
                منصة إلكترونية تجمع بين المتاجر والعملاء في مكان واحد، لتجربة تسوق أسهل وأمتع..
              </p>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                مساحتكِ لكل ما تحبين لدعم الحرفيين، والأسر المنتجة، وبوتيكات الهدايا والمناسبات. انطلقت منصة «غيم سبيس» لتكون الجسر الذكي والموثوق الذي يُمكّن المبدعين من عرض منتجاتهم الفاخرة ويوفر للمتسوقين تجربة شراء سلسة، ممتعة، ومضمونة من القلب إلى القلب.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate && onNavigate('stores')}
                  className="px-6 py-3 rounded-xl bg-[#004ac6] text-white text-xs sm:text-sm font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>تصفح جميع المتاجر</span>
                </button>
                <button
                  onClick={() => onOpenSellerModal && onOpenSellerModal()}
                  className="px-6 py-3 rounded-xl bg-white border border-blue-200 text-[#004ac6] text-xs sm:text-sm font-bold hover:bg-blue-50/50 transition flex items-center gap-2 active:scale-95 cursor-pointer shadow-xs"
                >
                  <span>انضم كتاجر شريك</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Hero: Signature Floating Cloud Badge */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-sky-400/30 blur-2xl animate-pulse pointer-events-none"></div>

                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl bg-gradient-to-b from-[#0053db] via-[#004ac6] to-[#07132B] flex flex-col items-center justify-center p-6 text-white shadow-2xl transition hover:-translate-y-1">
                  <div className="relative mb-3 flex items-center justify-center">
                    <div className="p-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/25 shadow-xl flex items-center justify-center">
                      <img
                        src={LOGO_DATA_URI}
                        alt="شعار منصة غيم سبيس الرسمي"
                        className="w-24 h-24 object-contain rounded-xl bg-white/95 p-1.5 shadow-md"
                      />
                    </div>
                  </div>

                  <span className="font-extrabold text-2xl tracking-wide mt-2">غيم سبيس</span>
                  <span className="text-xs text-sky-200 font-medium">Ghaym Space Market</span>

                  <div className="absolute -bottom-3 bg-white text-[#004ac6] text-xs font-bold px-4 py-1.5 rounded-full shadow-md border border-blue-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                    <span>تسوق بسهولة وسرعة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE THREE CORE PILLARS (ركائز تجربة غيم سبيس) */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#07132B]">ركائز تجربة غيم سبيس</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              نعتمد في منصتنا على ثلاثة مبادئ راسخة تجعل كل رحلة تسوق آمنة وسعيدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004ac6]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#07132B]">تجربة آمنة</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                أنظمة دفع إلكتروني موثوقة ومشفرة بالكامل، مع ضمان حماية بيانات المستخدمين وسياسة استرجاع مرنة تضمن حقك في كل خطوة.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284C7]">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#07132B]">دعم متواصل</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                فريق خدمة عملاء ودعم فني متواجد لمساعدتك والإجابة عن استفساراتك وتتبع طلباتك لحظة بلحظة برحابة واهتمام مستمر.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#EAB839]">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#07132B]">جودة عالية</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                انتقاء دقيق للمتاجر المحلية، وصُنّاع الحرف، ومبدعي الهدايا والكيك مع مراجعة مستمرة للتقييمات للحفاظ على معايير الفخامة والإتقان.
              </p>
            </div>
          </div>
        </section>

        {/* 4. BENTO GRID: OUR STORY, VISION & MISSION */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Story Card (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#004ac6] text-xs font-bold">
                <BookOpen className="w-4 h-4" />
                <span>بدايتنا وإلهامنا</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#07132B]">
                قصة انطلاقة غيم سبيس
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                وُلدت فكرة «غيم سبيس» من ملاحظة الشغف الهائل للأسر المنتجة وأصحاب الحرف اليدوية وبوتيكات الحلويات والهدايا في مدننا، وحاجتهم الماسة لمنصة رقمية احترافية تحتضن إبداعاتهم، وتقدمها للعميل في واجهة أنيقة وسهلة الاستخدام دون أي تعقيد.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                اخترنا اسم "غيم" لأنه يرمز للخير العميم، الخفة، والانسيابية، فصممنا المنصة لتكون مثل السحابة النقية التي تظلل المجتمع وتوصل الفرح إلى باب كل منزل.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  غ
                </div>
                <div>
                  <p className="text-xs font-bold text-[#07132B]">فريق غيم سبيس</p>
                  <p className="text-[11px] text-slate-400">من حضرموت إلى كل الآفاق</p>
                </div>
              </div>
              <Quote className="w-7 h-7 text-slate-200" />
            </div>
          </div>

          {/* Vision & Mission Column (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Vision */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#004ac6] flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#07132B]">رؤيتنا</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                أن نكون الوجهة الرقمية الرائدة والأولى للتسوق المجتمعي والبوتيكات في المنطقة، ممكّنين آلاف الحرفيين من النمو المستدام والتوسع التجاري.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3 flex-1">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#07132B]">رسالتنا</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                توفير بيئة تجارية متكاملة وذكية تجمع بين جودة المنتجات، وعدالة الفرص، وسرعة التوصيل، مع تقديم تجربة عميل تفوق التوقعات في كل طلب.
              </p>
            </div>
          </div>
        </section>

        {/* 5. NUMBERS & IMPACT */}
        <section className="bg-[#07132B] rounded-3xl p-8 md:p-10 text-white shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10">
            {/* Stat 1 */}
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-5xl font-black text-[#38BDF8] mb-1">500+</div>
              <div className="text-xs sm:text-sm text-slate-300">متجر شريك وأسرة منتجة</div>
            </div>
            {/* Stat 2 */}
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-5xl font-black text-[#38BDF8] mb-1">50,000+</div>
              <div className="text-xs sm:text-sm text-slate-300">طلب ناجح تم تسليمه</div>
            </div>
            {/* Stat 3 */}
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-5xl font-black text-[#EAB839] mb-1">98%</div>
              <div className="text-xs sm:text-sm text-slate-300">نسبة رضا وتقييم إيجابي</div>
            </div>
            {/* Stat 4 */}
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-5xl font-black text-emerald-400 mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-slate-300">خدمة عملاء ومتابعة ميدانية</div>
            </div>
          </div>
        </section>

        {/* 6. INVITATION BANNER (JOIN AS MERCHANT) */}
        <section className="rounded-3xl bg-gradient-to-r from-[#004ac6] via-[#0284C7] to-[#07132B] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-right">
            <h3 className="text-2xl font-black">هل لديك موهبة أو مشروع منزلي؟</h3>
            <p className="text-xs sm:text-sm text-sky-100">
              انضم إلى مجتمع غيم سبيس الآن، واعرض منتجاتك لآلاف العملاء وابدأ البيع بكل سهولة مجاناً!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenSellerModal && onOpenSellerModal()}
              className="px-7 py-3.5 rounded-xl bg-white text-[#004ac6] text-xs sm:text-sm font-black hover:bg-sky-50 transition shadow-md active:scale-95 cursor-pointer"
            >
              سجّل كتاجر الآن
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
