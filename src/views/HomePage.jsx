import React from 'react';
import {
  Sparkles,
  Star,
  ShoppingCart,
  Heart,
  Check,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Gift,
  ShoppingBag,
  Shirt,
  UtensilsCrossed,
  Flame,
  Cake,
  Truck,
  ShieldCheck,
  CreditCard,
  Award,
} from 'lucide-react';
import { LOGO_DATA_URI } from '../data/logoBase64';
import { PRODUCT_IMAGES } from '../data/storeProductImages';
import { STORE_COVERS } from '../data/storeCoversBase64';

export default function HomePage({
  onNavigate,
  onOpenStoreModal,
  onAddToCart,
  onOpenSellerModal,
  onSelectProduct,
}) {
  // 4 Featured Stores
  const featuredStores = [
    {
      id: 'store-1',
      name: 'متجر غيم للهدايا والديكور',
      tagline: 'تصميم وتصنيع هدايا وتحف فنية وديكورات فريدة',
      category: 'ديكور وهدايا',
      rating: 4.9,
      reviewsCount: 142,
      cover: STORE_COVERS.decor,
      avatarType: 'logo',
      avatarImg: LOGO_DATA_URI,
    },
    {
      id: 'store-oud',
      name: 'بخور وعطور المكلا',
      tagline: 'أجود أنواع البخور والمخلطات المكلاوية الأصيلة',
      category: 'بخور وعطور',
      rating: 4.9,
      reviewsCount: 98,
      cover: STORE_COVERS.oud,
      avatarType: 'icon',
      avatarIcon: <Flame className="w-6 h-6 text-amber-400" />,
      avatarBg: 'bg-[#2b1810]',
    },
    {
      id: 'store-jaziza',
      name: 'متجر جازيزا للحلويات',
      tagline: 'كيك مناسبات، حلويات غربية ومخبوزات طازجة',
      category: 'حلويات ومخبوزات',
      rating: 4.8,
      reviewsCount: 115,
      cover: STORE_COVERS.sweets,
      avatarType: 'text',
      avatarText: 'JAZIZA',
      avatarBg: 'bg-[#4a0e1c] text-amber-300',
    },
    {
      id: 'store-samar',
      name: 'سمر المكلا للأزياء',
      tagline: 'أزياء تراثية حضرمية، تطريز يدوي وعبايات راقية',
      category: 'أزياء وتطريز',
      rating: 4.9,
      reviewsCount: 88,
      cover: STORE_COVERS.fashion,
      avatarType: 'text',
      avatarText: 'SAMAR',
      avatarBg: 'bg-[#1a1412] text-amber-200',
    },
  ];

  // 4 Latest Products
  const latestProducts = [
    {
      id: 'prod-bags-home',
      name: 'حقائب يمنية قماشية وتطريز حضرمي',
      price: 24000,
      storeName: 'تراثيات حضرمية',
      category: 'صناعات يدوية',
      rating: 4.9,
      reviewsCount: 84,
      image: PRODUCT_IMAGES.bag,
      description: 'حقيبة قماشية تراثية مصنوعة يدوياً من القطن الطبيعي وتطريز حضرمي أصيل مناسبة للإهداء والاستخدام اليومي الفاخر.',
    },
    {
      id: 'prod-burner-home',
      name: 'مباخر بتطريز تقليدي وفخامة البخور',
      price: 18500,
      storeName: 'بخور وعطور المكلا',
      category: 'فخاريات وتراث',
      rating: 4.9,
      reviewsCount: 92,
      image: PRODUCT_IMAGES.burner,
      description: 'مبخرة فخارية حضرمية مصنوعة بأيدي حرفيين محليين مع نقوش تراثية يدوية وتفاصيل دقيقة تجسد أصالة حضرموت.',
    },
    {
      id: 'prod-cake-jaziza',
      name: 'كيكة الفراولة والشوكولاتة الملكية',
      price: 18000,
      storeName: 'متجر جازيزا',
      category: 'حلويات ومخبوزات',
      rating: 4.9,
      reviewsCount: 120,
      image: PRODUCT_IMAGES.cake,
      description: 'كيكة احتفالية فاخرة بالفراولة الطازجة والشوكولاتة البلجيكية الغنية، محضرة يدوياً يوم التوصيل من متجر جازيزا بالمكلا.',
    },
    {
      id: 'prod-concrete-home',
      name: 'أواني وتشكيلات كونكريت رخامية',
      price: 15000,
      storeName: 'متجر غيم للهدايا والديكور',
      category: 'ديكور حديث',
      rating: 4.8,
      reviewsCount: 45,
      image: PRODUCT_IMAGES.concrete,
      description: 'أواني وديكورات كونكريت عصرية بتأثير رخامي مدمجة بلمسات من الذهب والنحاس لإضفاء لمسة جمالية راقية على منزلك.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-12" dir="rtl">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-l from-[#07132B] via-[#0E2248] to-[#07132B] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-[#1B3160]" id="hero-banner">
        {/* Volumetric Dreamy Ambient Cloud Auras */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-sky-400/25 to-blue-600/10 rounded-full blur-3xl pointer-events-none anim-cloud-glow"></div>
        <div className="absolute top-1/2 -right-20 w-96 h-80 bg-gradient-to-tl from-indigo-500/20 via-sky-300/15 to-transparent rounded-full blur-3xl pointer-events-none anim-cloud-float-2"></div>
        <div className="absolute -bottom-20 left-1/4 w-[30rem] h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none anim-cloud-float-1"></div>

        {/* Floating Ambient 3D Cloud Glass Discs */}
        <div className="absolute top-8 left-16 w-20 h-20 rounded-full bg-gradient-to-b from-white/20 via-sky-400/15 to-transparent backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(56,189,248,0.2)] pointer-events-none hidden md:block anim-cloud-float-1"></div>
        <div className="absolute bottom-10 right-24 w-28 h-28 rounded-full bg-gradient-to-t from-sky-400/20 via-indigo-500/15 to-transparent backdrop-blur-md border border-white/15 pointer-events-none hidden md:block anim-cloud-float-2"></div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 px-2 sm:px-4">
          
          {/* Right Column (in RTL): Headline & Call to Action */}
          <div className="md:col-span-7 text-center md:text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200 font-bold mb-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>مهرجان الإبداع الحضرمي ☁️</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug drop-shadow-md">
              عروض غيم سبيس -
              <span className="block text-2xl sm:text-3xl lg:text-4xl text-sky-300 font-extrabold mt-1">
                لدعم الحرفيين والأسر المنتجة
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 font-medium max-w-xl leading-relaxed">
              اكتشف إبداع المكلا.. منتجات يدوية وتحف وتراثيات مصنوعة بكل حب وحرفية بأيادٍ محلية مبدعة وبخصومات حصرية تصل إلى 50%
            </p>

            <div className="pt-3 flex flex-wrap gap-3.5 justify-center md:justify-start">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('products')}
                className="inline-flex items-center gap-2 bg-[#EAB839] hover:bg-[#D9A72B] text-[#07132B] font-black px-7 py-3 rounded-full text-sm sm:text-base shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>تسوق العروض الآن</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('stores')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full text-sm sm:text-base backdrop-blur-md border border-white/20 transition cursor-pointer"
              >
                <span>تصفح المتاجر والأقسام</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Left Column (in RTL): Seamless Glowing Cloud Logo */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="absolute inset-0 bg-sky-400/25 rounded-full blur-3xl scale-125 pointer-events-none anim-cloud-glow"></div>
            <div className="relative w-64 h-56 sm:w-72 sm:h-64 flex items-center justify-center anim-cloud-float-1">
              <div className="relative p-2 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden group">
                <img
                  src={LOGO_DATA_URI}
                  alt="شعار غيم سبيس الرسمي"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-2xl drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & FEATURES BAR */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" data-purpose="trust-badges">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">توصيل سريع</h4>
            <p className="text-[11px] text-slate-400">لكافة أحياء المكلا وضواحيها</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">أسر وحرفيون موثوقون</h4>
            <p className="text-[11px] text-slate-400">منتجات محلية 100% يدوية</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">دفع آمن ومتعدد</h4>
            <p className="text-[11px] text-slate-400">عند الاستلام أو بالمحافظ</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3.5 hover:shadow-md transition">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">جودة معتمدة</h4>
            <p className="text-[11px] text-slate-400">تقييمات حقيقية من عملائنا</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="space-y-4" data-purpose="categories-section">
        <div className="flex items-center justify-between" id="categories">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">تصنيفات المنتجات</h2>
            <p className="text-xs text-slate-500 mt-0.5">اختر القسم وتصفح إبداعات الحرفيين والأسر في حضرموت</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('categories')}
            className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 transition cursor-pointer flex items-center gap-1"
          >
            <span>عرض كافة الأقسام</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Category 1: ديكور وهدايا */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Gift className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600 transition text-center">
              ديكور وهدايا
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+120 منتج</span>
          </button>

          {/* Category 2: صناعات يدوية */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-[#8a5a36]/40 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8a5a36] to-[#deb887] flex items-center justify-center text-white shadow-md shadow-[#8a5a36]/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#8a5a36] transition text-center">
              صناعات يدوية
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+85 منتج</span>
          </button>

          {/* Category 3: ملابس وأزياء */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-sky-400 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#163168] to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-110 transition-transform">
              <Shirt className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-sky-600 transition text-center">
              ملابس وأزياء
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+140 منتج</span>
          </button>

          {/* Category 4: أسر منتجة */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-purple-300 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#581c87] to-[#a855f7] flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-600 transition text-center">
              أسر منتجة
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+95 منتج</span>
          </button>

          {/* Category 5: بخور وعطور */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-amber-600 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#78350f] to-[#f59e0b] flex items-center justify-center text-white shadow-md shadow-amber-700/20 group-hover:scale-110 transition-transform">
              <Flame className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition text-center">
              بخور وعطور
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+70 منتج</span>
          </button>

          {/* Category 6: حلويات ومخبوزات */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="flex flex-col items-center bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-rose-400 transition-all duration-300 group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e11d48] to-[#fb923c] flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
              <Cake className="w-7 h-7" />
            </div>
            <span className="mt-3 text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition text-center">
              حلويات ومخبوزات
            </span>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5">+60 منتج</span>
          </button>
        </div>
      </section>

      {/* 4. FEATURED STORES SECTION */}
      <section className="space-y-4" data-purpose="featured-stores">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">المتاجر والأسر المنتجة المميزة</h2>
            <p className="text-xs text-slate-500 mt-0.5">متاجر حضرمية مبدعة بجودة عالية وشحن مباشر</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('stores')}
            className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 transition cursor-pointer flex items-center gap-1"
          >
            <span>عرض كافة المتاجر</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col items-center text-center p-4 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Store Cover with Avatar overlapping outside, completely in front */}
              <div className="relative w-full mb-7">
                <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner relative bg-slate-100">
                  <img
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src={store.cover}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
                </div>

                {/* Store Avatar: 100% visible circle, in front (z-20), border-2 border-white */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white shadow-xl bg-white flex items-center justify-center overflow-hidden z-20 transition-transform group-hover:scale-110">
                  {store.avatarType === 'logo' && (
                    <img src={store.avatarImg} alt={store.name} className="w-full h-full object-cover" />
                  )}
                  {store.avatarType === 'icon' && (
                    <div className={`w-full h-full ${store.avatarBg} flex items-center justify-center`}>
                      {store.avatarIcon}
                    </div>
                  )}
                  {store.avatarType === 'text' && (
                    <div className={`w-full h-full ${store.avatarBg} flex items-center justify-center font-black text-[11px] tracking-wider`}>
                      {store.avatarText}
                    </div>
                  )}
                </div>
              </div>

              {/* Store Info */}
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition line-clamp-1">
                {store.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{store.tagline}</p>

              <div className="flex items-center gap-2 mt-2 mb-4">
                <span className="flex items-center text-amber-500 text-xs font-bold gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {store.rating}
                </span>
                <span className="text-[10px] text-slate-400">({store.reviewsCount})</span>
                <span className="bg-sky-50 text-sky-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-sky-100">
                  <Check className="w-2.5 h-2.5" /> موثق
                </span>
              </div>

              {/* Visit Store Button */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenStoreModal) onOpenStoreModal(store);
                  else if (onNavigate) onNavigate('store-details');
                }}
                className="w-full mt-auto py-2.5 bg-slate-50 hover:bg-[#07132B] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition border border-slate-200 cursor-pointer active:scale-95"
              >
                زيارة المتجر
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SELLER CALL TO ACTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-[#07132B] via-[#0D224D] to-[#07132B] p-6 sm:p-8 text-white shadow-xl border border-[#1B3469] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden" data-purpose="join-seller-banner">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-sky-400/15 rounded-full blur-2xl pointer-events-none anim-cloud-glow"></div>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none anim-cloud-float-2"></div>

        <div className="flex items-center gap-4 text-center sm:text-right relative z-10">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2 hidden sm:flex items-center justify-center">
            <img src={LOGO_DATA_URI} alt="غيم سبيس" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">
              هل لديكِ موهبة أو مشروع منزلي؟ انضمي إلى غيم سبيس الآن وابدئي البيع مجاناً! ☁️✨
            </h3>
            <p className="text-xs sm:text-sm text-sky-200 mt-1">
              منصتك المتكاملة لعرض منتجاتك، تنظيم مبيعاتك والوصول لآلاف العملاء في المكلا وحضرموت
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSellerModal}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-[#EAB839] hover:bg-[#D9A726] text-[#07132B] font-black text-sm px-7 py-3 rounded-xl transition shadow-lg whitespace-nowrap active:scale-95 cursor-pointer relative z-10"
        >
          سجل كتاجر الآن
        </button>
      </section>

      {/* 6. LATEST PRODUCTS SECTION */}
      <section className="space-y-4" data-purpose="latest-products" id="products">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">أحدث المنتجات المضافة</h2>
            <p className="text-xs text-slate-500 mt-0.5">إبداعات جديدة ومميزة من الحرفيين والأسر</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-900 transition cursor-pointer flex items-center gap-1"
          >
            <span>عرض كافة المنتجات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col p-3 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => {
                if (onSelectProduct) onSelectProduct(prod);
                else if (onNavigate) onNavigate('product-details');
              }}
            >
              <div className="relative w-full h-52 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-3">
                <img
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  src={prod.image}
                />
                <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-0.5 rounded-md font-semibold">
                  {prod.category}
                </span>
                <button
                  type="button"
                  aria-label="أضف للمفضلة"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-sky-700 transition">
                {prod.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{prod.storeName}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm sm:text-base font-extrabold text-[#07132B]">
                  {prod.price.toLocaleString()} <span className="text-xs font-normal text-slate-500">ر.ي</span>
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  متوفر
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(prod);
                }}
                className="mt-3 w-full py-2.5 bg-[#07132B] hover:bg-[#0E2248] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-sky-400" />
                <span>أضف للسلة</span>
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
