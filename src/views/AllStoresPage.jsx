import React, { useState } from 'react';
import {
  ArrowRight,
  Search,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Check,
  ShieldCheck,
  Zap,
  Package,
  ArrowUpDown,
  ChevronDown,
  Sparkles,
  Award,
} from 'lucide-react';

export default function AllStoresPage({
  onNavigate,
  onOpenStoreModal,
  onAddToCart,
  onOpenSellerModal,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'verified' | 'fast_delivery'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('top_rated');

  const categories = [
    { id: 'all', name: 'جميع التصنيفات' },
    { id: 'sweets', name: 'حلويات وكيك' },
    { id: 'flowers', name: 'زهور وتنسيقات' },
    { id: 'gifts', name: 'هدايا واكسسوارات' },
    { id: 'decor', name: 'شموع وديكور منزلي' },
    { id: 'toys', name: 'ألعاب وأطفال' },
  ];

  const allStores = [
    {
      id: 'store-jaziza',
      name: 'متجر جازيزا',
      englishName: 'JAZIZA',
      category: 'sweets',
      badge: 'شريك مميز',
      badgeIcon: 'workspace_premium',
      badgeClass: 'text-primary bg-white/90',
      avatarBg: 'bg-[#5c1328]',
      avatarText: 'JAZIZA',
      avatarTextColor: 'text-[#FCD34D]',
      headerBg: 'bg-surface-container-high/60',
      description: 'حلويات فاخرة، كيك مناسبات ومخبوزات فرنسية راقية',
      rating: 4.9,
      reviewsCount: 142,
      productsCount: 85,
      isVerified: true,
      isFastDelivery: true,
      tags: ['كيك شوكولاتة', 'كب كيك ميني', 'تارت فراولة'],
    },
    {
      id: 'store-sweet-dreams',
      name: 'متجر دريم سويت',
      englishName: 'Sweet Dreams',
      category: 'sweets',
      badge: 'كيك ومناسبات',
      badgeIcon: 'celebration',
      badgeClass: 'text-pink-700 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'cake',
      avatarIconColor: 'text-pink-500',
      avatarText: 'Sweet Dreams',
      avatarTextColor: 'text-pink-600',
      headerBg: 'bg-surface-container-high/60',
      description: 'أشهى كيكات أعياد الميلاد وتوزيعات الحفلات المبهجة',
      rating: 4.9,
      reviewsCount: 98,
      productsCount: 120,
      isVerified: true,
      isFastDelivery: true,
      tags: ['كيك أرنب وردي', 'تنسيق حفلات'],
    },
    {
      id: 'store-dream-store',
      name: 'متجر دريم ستور',
      englishName: 'Dream Store',
      category: 'gifts',
      badge: 'هدايا واكسسوارات',
      badgeIcon: 'featured_seasonal_and_gifts',
      badgeClass: 'text-primary bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'shopping_bag',
      avatarIconColor: 'text-blue-600',
      avatarText: 'Dream Store',
      avatarTextColor: 'text-blue-700',
      headerBg: 'bg-surface-container-high/60',
      description: 'صناديق هدايا استثنائية، تغليف فاخر ومستلزمات مميزة',
      rating: 4.9,
      reviewsCount: 84,
      productsCount: 64,
      isVerified: true,
      isFastDelivery: false,
      tags: ['بوكس ورد هدايا', 'تغليف مخصص'],
    },
    {
      id: 'store-bloom',
      name: 'متجر بلوم',
      englishName: 'Bloom Store',
      category: 'flowers',
      badge: 'زهور طبيعية',
      badgeIcon: 'local_florist',
      badgeClass: 'text-rose-700 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'eco',
      avatarIconColor: 'text-rose-600',
      avatarText: 'Bloom Store',
      avatarTextColor: 'text-rose-700',
      headerBg: 'bg-surface-container-high/60',
      description: 'أرقى باقات الورد الطبيعي وتنسيقات المناسبات والزفاف',
      rating: 4.9,
      reviewsCount: 176,
      productsCount: 92,
      isVerified: true,
      isFastDelivery: true,
      tags: ['باقات جوري هولندي', 'فازات كريستال'],
    },
    {
      id: 'store-aroma-candles',
      name: 'متجر أروما كاندل',
      englishName: 'Aroma Candle',
      category: 'decor',
      badge: 'شموع وعطور',
      badgeIcon: 'flare',
      badgeClass: 'text-amber-800 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'local_fire_department',
      avatarIconColor: 'text-amber-700',
      avatarText: 'Aroma Candle',
      avatarTextColor: 'text-amber-800',
      headerBg: 'bg-surface-container-high/60',
      description: 'شموع صويا طبيعية معطرة بروائح المسك، الفانيلا واللافندر',
      rating: 4.7,
      reviewsCount: 61,
      productsCount: 40,
      isVerified: true,
      isFastDelivery: false,
      tags: ['شموع فانيلا مهدئة', 'فواحات سيراميك'],
    },
    {
      id: 'store-little-teddy',
      name: 'متجر ليتل تيدي',
      englishName: 'Little Teddy',
      category: 'toys',
      badge: 'دمى ومواليد',
      badgeIcon: 'toys',
      badgeClass: 'text-teal-700 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'cruelty_free',
      avatarIconColor: 'text-teal-600',
      avatarText: 'Little Teddy',
      avatarTextColor: 'text-teal-700',
      headerBg: 'bg-surface-container-high/60',
      description: 'دمى دببة لطيفة، ألعاب محشوة ناعمة وهدايا استقبال مواليد',
      rating: 4.9,
      reviewsCount: 115,
      productsCount: 55,
      isVerified: true,
      isFastDelivery: true,
      tags: ['دب لطيف بني', 'صناديق استقبال'],
    },
    {
      id: 'store-crafty-art',
      name: 'متجر كرافتي آرت',
      englishName: 'Crafty Art',
      category: 'gifts',
      badge: 'حرف يدوية',
      badgeIcon: 'palette',
      badgeClass: 'text-purple-700 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'palette',
      avatarIconColor: 'text-purple-700',
      avatarText: 'Crafty Art',
      avatarTextColor: 'text-purple-800',
      headerBg: 'bg-surface-container-high/60',
      description: 'تطريز يدوي، كروشيه، ومجسمات ريزن وتحف فنية مصممة بشغف',
      rating: 4.8,
      reviewsCount: 53,
      productsCount: 38,
      isVerified: true,
      isFastDelivery: false,
      tags: ['طارات تطريز', 'كوسترات ريزن'],
    },
    {
      id: 'store-choco-craft',
      name: 'متجر شوكو كرافت',
      englishName: 'Choco Craft',
      category: 'sweets',
      badge: 'شوكولاتة بلجيكية',
      badgeIcon: 'cookie',
      badgeClass: 'text-amber-800 bg-white/90',
      avatarBg: 'bg-white',
      avatarIcon: 'bakery_dining',
      avatarIconColor: 'text-amber-950',
      avatarText: 'Choco Craft',
      avatarTextColor: 'text-amber-950',
      headerBg: 'bg-surface-container-high/60',
      description: 'حبات الشوكولاتة البلجيكية الفاخرة بحشوات الفستق والكراميل',
      rating: 4.9,
      reviewsCount: 92,
      productsCount: 47,
      isVerified: true,
      isFastDelivery: true,
      tags: ['بوكس شوكولا العيد', 'ترافل كراميل'],
    },
  ];

  // Filtering
  const filteredStores = allStores.filter((st) => {
    // Category filter
    if (selectedCategory !== 'all' && st.category !== selectedCategory) {
      return false;
    }
    // Status filter
    if (filterType === 'verified' && !st.isVerified) return false;
    if (filterType === 'fast_delivery' && !st.isFastDelivery) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = st.name.toLowerCase().includes(q) || st.englishName.toLowerCase().includes(q);
      const matchDesc = st.description.toLowerCase().includes(q);
      const matchTags = st.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  // Sorting
  const sortedStores = [...filteredStores].sort((a, b) => {
    if (sortBy === 'top_rated') return b.rating - a.rating;
    if (sortBy === 'most_popular') return b.reviewsCount - a.reviewsCount;
    if (sortBy === 'newest') return b.productsCount - a.productsCount;
    return 0;
  });

  const handleStoreClick = (store) => {
    if (onOpenStoreModal) {
      onOpenStoreModal(store);
    } else if (onNavigate) {
      onNavigate('store-details');
    }
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8" dir="rtl">
      {/* Top Breadcrumb & Action Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Return/Back Pill Button */}
          <button
            type="button"
            className="glass-pill border border-outline-variant/60 hover:border-primary-container text-on-surface hover:text-primary px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all duration-200 group active:scale-95 text-label-md font-label-md cursor-pointer"
            onClick={() => onNavigate && onNavigate('home')}
          >
            <ArrowRight className="w-4 h-4 text-[#07132B]" />
            <span>رجوع</span>
          </button>
          <div className="h-5 w-px bg-outline-variant/50 hidden sm:block"></div>
          <div>
            <h1 className="text-headline-xl font-headline-xl text-on-surface font-extrabold flex items-center gap-2">
              جميع المتاجر
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-fixed text-on-primary-fixed">
                {sortedStores.length} متجر متاح
              </span>
            </h1>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
              تصفح نخبة المتاجر السحابية وبوتيكات الحفلات والهدايا المعتمدة في منصة غيم
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bento Ribbon */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 md:p-6 border border-outline-variant/40 shadow-sm space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Live Search Field */}
          <div className="lg:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background rounded-xl py-2.5 pr-11 pl-4 border border-outline-variant focus:border-primary-container focus:ring-4 focus:ring-primary-container/10 text-on-surface text-body-md font-body-md transition-all outline-none"
              placeholder="ابحث باسم المتجر، النشاط، أو المخبز..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-outline">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Select */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-background rounded-xl py-2.5 pr-10 pl-8 border border-outline-variant focus:border-primary-container text-on-surface text-body-md font-body-md transition-all appearance-none cursor-pointer outline-none"
              >
                <option value="top_rated">الأعلى تقييماً ★</option>
                <option value="most_popular">الأكثر طلباً ومبيعات</option>
                <option value="newest">المتاجر المنضمة حديثاً</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Filter Badges / Quick Status */}
          <div className="lg:col-span-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-label-md font-label-md whitespace-nowrap shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'all'
                  ? 'bg-primary-container text-white font-bold'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>الكل ({allStores.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType(filterType === 'verified' ? 'all' : 'verified')}
              className={`px-4 py-2 rounded-xl text-label-md font-label-md whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'verified'
                  ? 'bg-primary-container text-white font-bold'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>متاجر موثقة</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType(filterType === 'fast_delivery' ? 'all' : 'fast_delivery')}
              className={`px-4 py-2 rounded-xl text-label-md font-label-md whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === 'fast_delivery'
                  ? 'bg-primary-container text-white font-bold'
                  : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>توصيل سريع</span>
            </button>
          </div>
        </div>

        {/* Categories Pills Row (Clickable & Reactive) */}
        <div className="pt-3 border-t border-surface-container flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-label-md font-label-md">
          <span className="text-outline text-label-sm font-label-sm ml-2 shrink-0">التصنيفات:</span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full shrink-0 transition-all cursor-pointer text-xs sm:text-sm ${
                  isActive
                    ? 'bg-primary-container text-white shadow-md font-bold'
                    : 'bg-surface-container-lowest border border-outline-variant/60 text-on-surface-variant hover:border-primary-container hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stores Grid Section */}
      {sortedStores.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-[#07132B]">لا توجد متاجر تطابق بحثك حالياً</h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
            جرّب تغيير التصنيف المختار أو مسح نص البحث للاطلاع على كافة المتاجر المتوفرة
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setFilterType('all');
              setSearchQuery('');
            }}
            className="mt-2 px-5 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-sm"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedStores.map((st) => (
            <div
              key={st.id}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Card Header with Badges */}
              <div className={`h-20 ${st.headerBg} relative p-3 flex items-start justify-between border-b border-outline-variant/40`}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                  <div className="font-display-hero text-6xl font-bold tracking-widest text-slate-800 opacity-10 select-none scale-150 blur-[0.5px]">
                    {st.englishName.toUpperCase()}
                  </div>
                </div>

                <span className={`${st.badgeClass} text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-outline-variant/40`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{st.badge}</span>
                </span>

                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-on-surface-variant hover:text-red-500 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  title="إضافة للمفضلة"
                >
                  <Heart className="w-4 h-4 text-slate-400 hover:text-red-500" />
                </button>
              </div>

              {/* Card Content Body */}
              <div className="px-5 pt-0 pb-5 flex-1 flex flex-col items-center text-center -mt-10">
                {/* Store Avatar */}
                <div className={`w-20 h-20 rounded-full ${st.avatarBg} border-4 border-white shadow-md flex flex-col items-center justify-center p-2 mb-3 ring-2 ring-primary/10 relative z-10 shrink-0`}>
                  <span className={`text-[11px] font-black ${st.avatarTextColor} tracking-tight`}>
                    {st.avatarText}
                  </span>
                </div>

                {/* Name & Verified Badge */}
                <div className="flex items-center gap-1.5 mb-1">
                  <h2 className="text-headline-md font-headline-md font-bold text-on-surface">
                    {st.name}
                  </h2>
                  {st.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-blue-600" title="متجر موثق" />
                  )}
                </div>

                <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-1 mb-2">
                  {st.description}
                </p>

                {/* Stats Bar */}
                <div className="flex items-center justify-center gap-3 text-body-sm font-body-sm mb-4 bg-surface-container-low/70 w-full py-1.5 rounded-xl border border-outline-variant/40">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{st.rating}</span>
                    <span className="text-outline text-label-sm font-label-sm">({st.reviewsCount})</span>
                  </div>
                  <span className="text-outline-variant">|</span>
                  <div className="text-on-surface-variant flex items-center gap-1 text-label-sm font-label-sm">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    <span>{st.productsCount} منتج</span>
                  </div>
                </div>

                {/* Product Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-5 w-full">
                  {st.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-surface-container text-on-secondary-container text-label-sm font-label-sm px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Visit Store Action Button */}
                <div className="w-full mt-auto">
                  <button
                    type="button"
                    onClick={() => handleStoreClick(st)}
                    className="w-full bg-primary-container hover:bg-primary text-white py-2.5 rounded-xl font-semibold text-label-md font-label-md flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-98 cursor-pointer"
                  >
                    <span>زيارة المتجر</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2 py-4">
        <button
          className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-40"
          disabled
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-primary-container text-white font-bold flex items-center justify-center shadow-sm">
          1
        </button>
        <button className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/60 font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-all">
          2
        </button>
        <button className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-outline-variant/60 flex items-center justify-center text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </main>
  );
}
