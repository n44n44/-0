import React from 'react';
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
  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-10">
{/*  BEGIN: HeroBannerSection with Seamless Blended Logo  */}
<section className="relative rounded-3xl bg-gradient-to-l from-[#07132b] via-[#0d2046] to-[#07132b] text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-[#1b3160]" data-purpose="hero-carousel" id="hero-banner">
{/*  Volumetric Background Cloud Auras  */}
<div className="parallax-layer absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-br from-sky-400/25 to-blue-600/10 rounded-full blur-3xl pointer-events-none anim-cloud-glow" data-parallax-factor="0.04"></div>
<div className="parallax-layer absolute top-1/2 -right-20 w-96 h-80 bg-gradient-to-tl from-indigo-500/20 via-sky-300/15 to-transparent rounded-full blur-3xl pointer-events-none anim-cloud-float-2" data-parallax-factor="-0.035"></div>
<div className="parallax-layer absolute -bottom-16 left-1/4 w-[30rem] h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none anim-cloud-float-1" data-parallax-factor="0.025"></div>
{/*  Floating Ambient 3D Cloud Shapes  */}
<div className="parallax-layer absolute top-8 left-16 w-20 h-20 rounded-full bg-gradient-to-b from-white/20 via-sky-400/15 to-transparent backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(56,189,248,0.2)] pointer-events-none hidden md:block anim-cloud-float-1" data-parallax-factor="0.06"></div>
<div className="parallax-layer absolute bottom-10 right-24 w-28 h-28 rounded-full bg-gradient-to-t from-sky-400/20 via-indigo-500/15 to-transparent backdrop-blur-md border border-white/15 pointer-events-none hidden md:block anim-cloud-float-2" data-parallax-factor="-0.05"></div>
{/*  Carousel Navigation Arrows  */}
<button aria-label="السابق" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition z-20">
<i className="fa-solid fa-chevron-right text-sm"></i>
</button>
<button aria-label="التالي" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition z-20">
<i className="fa-solid fa-chevron-left text-sm"></i>
</button>
{/*  Banner Content Grid  */}
<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 px-4 sm:px-6">
{/*  Cloud Logo Seamlessly Blended into Banner  */}
<div className="parallax-layer md:col-span-5 flex justify-center order-2 md:order-1 relative" data-parallax-factor="-0.045">
<div className="absolute inset-0 bg-sky-400/30 rounded-full blur-3xl scale-125 pointer-events-none anim-cloud-glow"></div>
<div className="relative w-64 h-52 sm:w-80 sm:h-64 flex items-center justify-center anim-cloud-float-1">
<img alt="شعار غيم سبيس السحابي" className="w-full h-full object-contain blend-hero-logo drop-shadow-[0_15px_30px_rgba(56,189,248,0.4)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0kTwyrOgVt1UikZzjl_8adoPbACflThuS0OAMs1NBAxfhdj0d6U5zy__p3zH1LwwSEoGCf-TrnUeEI9e7ofTlwvzBEkjkRq7dWVa2VM8YYzl6qDAYySLO14czo6P79cFjMAhBjFyf9NEde5r2LsURP2LZTDBAFNk7WWjYNfTnw_OMambwfjlKjSD-giwosQLJIjXhF6XEZHmA2tjH6DDME6VgOoNX5agZVPKSTOwWd7WRKHY8-450" />
</div>
</div>
{/*  Headline & CTA  */}
<div className="parallax-layer md:col-span-7 text-center md:text-right space-y-4 order-1 md:order-2" data-parallax-factor="0.02">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200 font-semibold mb-1 shadow-sm">
<span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
<span className="">مهرجان الإبداع الحضرمي ☁️</span>
</div>
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug drop-shadow-md">
      عروض غيم سبيس -
      <span className="block text-2xl sm:text-3xl lg:text-4xl text-sky-300 font-bold mt-1">لدعم الحرفيين والأسر المنتجة</span>
</h1>
<p className="text-base sm:text-lg text-gray-200 font-medium max-w-xl leading-relaxed">
      اكتشف إبداع المكلا.. منتجات مصنوعة بكل حب وحرفية بأيادٍ محلية مبدعة وبخصومات تصل إلى 50%
    </p>
<div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
<button onClick={() => onNavigate && onNavigate("products")} className="inline-flex items-center gap-2 bg-[#eab839] hover:bg-[#d9a72b] text-[#07132b] font-bold px-8 py-3 rounded-full text-base shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
<span className="">تسوق العروض الآن</span>
<span className="text-lg">✨</span>
</button>
<button onClick={() => onNavigate && onNavigate("stores")} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full text-base backdrop-blur-sm border border-white/20 transition cursor-pointer">
<span className="">تصفح المتاجر والأقسام</span>
</button>
</div>
</div>
</div>
</section>
{/*  END: HeroBannerSection  */}
{/* BEGIN: CategoriesSection */}
<section className="relative" data-purpose="categories-slider">
  <div className="flex items-center justify-between mb-4" id="categories">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">تصنيفات المنتجات</h2>
      <p className="text-xs text-gray-500 mt-0.5">اختر القسم وتصفح إبداعات الحرفيين والأسر</p>
    </div>
    <button onClick={() => onNavigate && onNavigate('products')} className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer">عرض الكل ↗</button>
  </div>
  <div className="w-full flex items-start justify-between gap-3 sm:gap-5 overflow-x-auto py-3 px-1" style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
    {/* Category 1: ديكور وهدايا */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-gift text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-amber-600 transition text-center leading-tight">ديكور وهدايا</span>
      <span className="text-[10px] text-gray-400 font-medium">+120 منتج</span>
    </button>
    {/* Category 2: صناعات يدوية */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="rounded-full bg-gradient-to-tr from-[#8a5a36] via-[#b37a4c] to-[#deb887] flex items-center justify-center shadow-md shadow-[#8a5a36]/20 group-hover:shadow-lg group-hover:shadow-[#8a5a36]/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-[#fbf7f4] flex items-center justify-center text-[#8a5a36] border border-[#ebdace]" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-basket-shopping text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-[#8a5a36] transition text-center leading-tight">صناعات يدوية</span>
      <span className="text-[10px] text-gray-400 font-medium">+85 منتج</span>
    </button>
    {/* Category 3: ملابس وأزياء */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="rounded-full bg-gradient-to-tr from-[#163168] via-sky-500 to-sky-200 flex items-center justify-center shadow-md shadow-sky-600/20 group-hover:shadow-lg group-hover:shadow-sky-600/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-200" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-shirt text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-sky-600 transition text-center leading-tight">ملابس وأزياء</span>
      <span className="text-[10px] text-gray-400 font-medium">+140 منتج</span>
    </button>
    {/* Category 4: أسر منتجة */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="rounded-full bg-gradient-to-tr from-[#581c87] via-[#8b5cf6] to-[#d8b4fe] flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:shadow-lg group-hover:shadow-purple-600/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-purple-50 flex items-center justify-center text-[#7c3aed] border border-purple-200" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-kitchen-set text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-purple-600 transition text-center leading-tight">أسر منتجة</span>
      <span className="text-[10px] text-gray-400 font-medium">+95 منتج</span>
    </button>
    {/* Category 5: بخور وعطور */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="rounded-full bg-gradient-to-tr from-[#92400e] via-[#d97706] to-[#fde68a] flex items-center justify-center shadow-md shadow-amber-700/20 group-hover:shadow-lg group-hover:shadow-amber-700/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-amber-50 flex items-center justify-center text-amber-700 border border-amber-200" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-spray-can-sparkles text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-amber-700 transition text-center leading-tight">بخور وعطور</span>
      <span className="text-[10px] text-gray-400 font-medium">+70 منتج</span>
    </button>
    {/* Category 6: حلويات ومخبوزات */}
    <button onClick={() => onNavigate && onNavigate('products')} className="flex flex-col items-center group shrink-0 min-w-[90px] transition-transform duration-300 hover:-translate-y-1 cursor-pointer bg-transparent border-none">
      <div className="rounded-full bg-gradient-to-tr from-[#e11d48] via-[#f97316] to-[#fdba74] flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:shadow-lg group-hover:shadow-orange-500/35 transition-all" style={{width:'4.5rem',height:'4.5rem'}}>
        <div className="rounded-full bg-rose-50 flex items-center justify-center text-[#ea580c] border border-orange-200" style={{width:'3.5rem',height:'3.5rem'}}>
          <i className="fa-solid fa-cake-candles text-2xl"></i>
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-gray-800 group-hover:text-orange-600 transition text-center leading-tight">حلويات ومخبوزات</span>
      <span className="text-[10px] text-gray-400 font-medium">+60 منتج</span>
    </button>
  </div>
</section>
{/* END: CategoriesSection */}
{/*  BEGIN: FeaturedStoresSection  */}
<section className="space-y-4" data-purpose="featured-stores">
<div className="flex items-center justify-between">
<h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">المتاجر المميزة لهذا الأسبوع</h2>
<button className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer" onClick={() => onNavigate("stores")}>عرض كافة المتاجر ↗</button>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
{/*  Store Card 1: سر المنتجات المنزلية  */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center p-4 hover:shadow-lg transition duration-300 group">
<div className="relative w-full mb-8">
  <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner relative">
    <img alt="سر المنتجات المنزلية" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
  {/* شعار المتجر ظاهر كامل 100% أمام الغلاف وليس مقصوصاً */}
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white shadow-xl bg-rose-50 flex items-center justify-center overflow-hidden z-20 transition-transform group-hover:scale-105">
    <i className="fa-solid fa-jar text-2xl text-rose-500"></i>
  </div>
</div>
<h3 className="text-sm font-bold text-gray-900 group-hover:text-sky-700 transition">سر المنتجات المنزلية</h3>
<div className="flex items-center gap-2 mt-1.5 mb-4">
<span className="flex items-center text-amber-500 text-xs font-bold gap-1">
<i className="fa-solid fa-star text-[11px]"></i> 4.8
    </span>
<span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
<i className="fa-solid fa-check text-[9px]"></i> موثق
    </span>
</div>
<button onClick={() => onOpenStoreModal ? onOpenStoreModal({ id: 'store-5', name: 'سر المنتجات المنزلية', category: 'أسر منتجة', rating: 4.8, cover: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80' }) : onNavigate("store-details")} className="w-full mt-auto py-2.5 bg-gray-50 hover:bg-[#07132b] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition border border-gray-200 cursor-pointer">زيارة المتجر</button>
</div>
{/*  Store Card 2: بخور وعطور المكلا  */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center p-4 hover:shadow-lg transition duration-300 group">
<div className="relative w-full mb-8">
  <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner relative">
    <img alt="بخور وعطور المكلا" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={STORE_COVERS.oud} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
  {/* شعار المتجر ظاهر كامل 100% أمام الغلاف وليس مقصوصاً */}
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white shadow-xl bg-[#2b1810] flex items-center justify-center text-amber-300 font-bold text-xs z-20 transition-transform group-hover:scale-105">
    <i className="fa-solid fa-fire-burner text-xl text-amber-400"></i>
  </div>
</div>
<h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition">بخور وعطور المكلا</h3>
<div className="flex items-center gap-2 mt-1.5 mb-4">
<span className="flex items-center text-amber-500 text-xs font-bold gap-1">
<i className="fa-solid fa-star text-[11px]"></i> 4.9
    </span>
<span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
<i className="fa-solid fa-check text-[9px]"></i> موثق
    </span>
</div>
<button onClick={() => onOpenStoreModal ? onOpenStoreModal({ id: 'store-oud', name: 'بخور وعطور المكلا', category: 'بخور وعطور', rating: 4.9, cover: STORE_COVERS.oud }) : onNavigate("store-details")} className="w-full mt-auto py-2.5 bg-gray-50 hover:bg-[#07132b] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition border border-gray-200 cursor-pointer">زيارة المتجر</button>
</div>
{/*  Store Card 3: متجر جازيزا للعطور والإكسسوارات  */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center p-4 hover:shadow-lg transition duration-300 group">
<div className="relative w-full mb-8">
  <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner relative">
    <img alt="متجر جازيزا للحلويات" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={STORE_COVERS.sweets} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
  {/* شعار المتجر ظاهر كامل 100% أمام الغلاف وليس مقصوصاً */}
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white shadow-xl bg-black text-amber-300 font-bold text-[11px] flex items-center justify-center tracking-wider z-20 transition-transform group-hover:scale-105">
    JAZIZA
  </div>
</div>
<h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition">متجر جازيزا المميز</h3>
<div className="flex items-center gap-2 mt-1.5 mb-4">
<span className="flex items-center text-amber-500 text-xs font-bold gap-1">
<i className="fa-solid fa-star text-[11px]"></i> 4.8
    </span>
<span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
<i className="fa-solid fa-check text-[9px]"></i> موثق
    </span>
</div>
<button onClick={() => onOpenStoreModal ? onOpenStoreModal({ id: 'store-jaziza', name: 'متجر جازيزا', category: 'حلويات ومخبوزات', rating: 4.8, cover: STORE_COVERS.sweets }) : onNavigate("store-details")} className="w-full mt-auto py-2.5 bg-gray-50 hover:bg-[#07132b] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition border border-gray-200 cursor-pointer">زيارة المتجر</button>
</div>
{/*  Store Card 4: سمر المكلا للأزياء التراثية  */}
<div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center p-4 hover:shadow-lg transition duration-300 group">
<div className="relative w-full mb-8">
  <div className="w-full h-36 rounded-xl overflow-hidden shadow-inner relative">
    <img alt="سمر المكلا للأزياء والتطريز" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={STORE_COVERS.fashion} />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
  </div>
  {/* شعار المتجر ظاهر كامل 100% أمام الغلاف وليس مقصوصاً */}
  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-white shadow-xl bg-[#1a1412] text-amber-200 font-bold text-[11px] flex items-center justify-center tracking-wider z-20 transition-transform group-hover:scale-105">
    SAMAR
  </div>
</div>
<h3 className="text-sm font-bold text-gray-900 group-hover:text-amber-700 transition">سمر المكلا للأزياء</h3>
<div className="flex items-center gap-2 mt-1.5 mb-4">
<span className="flex items-center text-amber-500 text-xs font-bold gap-1">
<i className="fa-solid fa-star text-[11px]"></i> 4.9
    </span>
<span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
<i className="fa-solid fa-check text-[9px]"></i> موثق
    </span>
</div>
<button onClick={() => onOpenStoreModal ? onOpenStoreModal({ id: 'store-samar', name: 'سمر المكلا للأزياء', category: 'أزياء وتطريز', rating: 4.9, cover: STORE_COVERS.fashion }) : onNavigate("store-details")} className="w-full mt-auto py-2.5 bg-gray-50 hover:bg-[#07132b] hover:text-white text-gray-700 rounded-xl text-xs font-bold transition border border-gray-200 cursor-pointer">زيارة المتجر</button>
</div>
</div>
</section>
{/*  END: FeaturedStoresSection  */}
{/*  BEGIN: SellerCallToActionBanner  */}
<section className="rounded-2xl bg-gradient-to-r from-[#07132b] via-[#0d224d] to-[#07132b] p-6 sm:p-7 text-white shadow-lg border border-[#1b3469] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden" data-purpose="join-seller-banner">
<div className="absolute -right-8 -top-8 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none anim-cloud-glow"></div>
<div className="absolute -left-8 -bottom-8 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none anim-cloud-float-2"></div>
<div className="flex items-center gap-4 text-center sm:text-right relative z-10">
<div className="w-14 h-14 shrink-0 hidden sm:flex items-center justify-center anim-cloud-float-1">
<img alt="غيم سبيس ترحيب" className="w-12 h-12 object-contain filter drop-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0kTwyrOgVt1UikZzjl_8adoPbACflThuS0OAMs1NBAxfhdj0d6U5zy__p3zH1LwwSEoGCf-TrnUeEI9e7ofTlwvzBEkjkRq7dWVa2VM8YYzl6qDAYySLO14czo6P79cFjMAhBjFyf9NEde5r2LsURP2LZTDBAFNk7WWjYNfTnw_OMambwfjlKjSD-giwosQLJIjXhF6XEZHmA2tjH6DDME6VgOoNX5agZVPKSTOwWd7WRKHY8-450" />
</div>
<div>
<h3 className="text-lg sm:text-xl font-bold text-white">هل لديك موهبة أو مشروع منزلي؟ انضم إلى غيم سبيس الآن وابدأ البيع مجاناً! ☁️🛒</h3>
<p className="text-xs sm:text-sm text-sky-200 mt-1">منصتك المتكاملة لعرض منتجاتك، تنظيم مبيعاتك والوصول لآلاف العملاء في حضرموت</p>
</div>
</div>
<button onClick={() => onOpenSellerModal ? onOpenSellerModal() : onNavigate("merchant")} className="w-full sm:w-auto inline-flex items-center justify-center bg-[#eab839] hover:bg-[#d9a726] text-[#07132b] font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-md whitespace-nowrap active:scale-95">سجل كتاجر</button>
</section>
{/*  END: SellerCallToActionBanner  */}
{/*  BEGIN: LatestProductsSection  */}
<section className="space-y-4" data-purpose="latest-products" id="products">
<div className="flex items-center justify-between">
<h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">أحدث المنتجات المضافة</h2>
<button className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer" onClick={() => onNavigate("products")}>عرض كافة المنتجات ↗</button>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
{[
  {
    id: 'prod-bags-home',
    name: 'حقائب يمنية قماشية وتطريز حضرمي',
    price: 24000,
    storeName: 'تراثيات حضرمية',
    category: 'حرف يدوية',
    rating: 4.9,
    reviewsCount: 84,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    description: 'صنع يدوي بالكامل من القطن الطبيعي وتطريز حضرمي أصيل مناسب للإهداء والاستخدام اليومي الفاخر.'
  },
  {
    id: 'prod-burner-home',
    name: 'مباخر بتطريز تقليدي وفخامة البخور',
    price: 18500,
    storeName: 'بخور وعطور المكلا',
    category: 'فخاريات وتراث',
    rating: 4.9,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
    description: 'فخار حضرمي أصيل بنقوش يدوية وتفاصيل دقيقة تحافظ على جمر البخور وتوزع الشذا الساحر.'
  },
  {
    id: 'prod-candles-home',
    name: 'شموع صويا طبيعية معطرة بالعود',
    price: 12000,
    storeName: 'إبداعات يدوية',
    category: 'روائح منزلية',
    rating: 4.9,
    reviewsCount: 65,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
    description: 'شموع صويا طبيعية 100% مسكوبة يدوياً برائحة العود المعتق واللبان الحوجري تدوم حتى 40 ساعة.'
  },
  {
    id: 'prod-concrete-home',
    name: 'أواني وتشكيلات كونكريت رخامية',
    price: 15000,
    storeName: 'إبداعات يدوية',
    category: 'ديكور حديث',
    rating: 4.8,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    description: 'تصاميم عصرية مدمجة بالذهب والنحاس ومصنوعة بأيدي حرفيات المكلا لإضفاء لمسة جمالية راقية.'
  }
].map((prod) => (
  <div
    key={prod.id}
    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-3 hover:shadow-lg transition duration-300 group cursor-pointer"
    onClick={() => {
      if (onSelectProduct) onSelectProduct(prod);
      else if (onNavigate) onNavigate('product-details');
    }}
  >
    <div className="relative w-full h-52 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-3">
      <img alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" src={prod.image} />
      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-0.5 rounded-md font-semibold">
        {prod.category}
      </span>
      <button
        aria-label="أضف للمفضلة"
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 flex items-center justify-center backdrop-blur-sm transition"
      >
        <i className="fa-regular fa-heart text-xs"></i>
      </button>
    </div>
    <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-sky-700 transition">
      {prod.name}
    </h3>
    <p className="text-[11px] text-gray-400 mt-0.5">{prod.storeName}</p>
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm font-extrabold text-[#07132b]">
        {prod.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">ر.ي</span>
      </span>
      <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">متوفر</span>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (onAddToCart) onAddToCart(prod);
      }}
      className="mt-3 w-full py-2 bg-[#07132b] hover:bg-[#0e2248] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
    >
      <i className="fa-solid fa-cart-shopping text-sky-400 text-xs"></i>
      <span>أضف للسلة</span>
    </button>
  </div>
))}
</div>
</section>
{/*  END: LatestProductsSection  */}
</main>
  );
}
