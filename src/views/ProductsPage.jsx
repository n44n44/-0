import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Heart,
  ShoppingCart,
  Star,
  Store,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/mockData';

export default function ProductsPage({
  onAddToCart,
  onOpenProductModal,
  onSelectProduct,
  onNavigate,
}) {
  const { products: platformProducts, isFavorite, toggleFavorite } = usePlatform();

  // Combine authentic mock products and dynamic database products
  const allProducts = useMemo(() => {
    const list = [...(platformProducts || [])];
    INITIAL_PRODUCTS.forEach((mockP) => {
      if (!list.some((p) => p.id === mockP.id)) {
        list.push(mockP);
      }
    });
    return list;
  }, [platformProducts]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating'

  const categoriesList = [
    { id: 'all', label: 'الكل' },
    { id: 'fashion', label: 'أزياء نسائية', keywords: ['أزياء', 'ملابس', 'مخاوير', 'عبايات', 'تطريز'] },
    { id: 'home', label: 'مستلزمات منزلية', keywords: ['منزلية', 'روائح', 'شموع', 'كونكريت'] },
    { id: 'food', label: 'أطعمة ومشروبات', keywords: ['أسر منتجة', 'أطعمة', 'حلويات', 'مخبوزات', 'كيك', 'حلوى'] },
    { id: 'crafts', label: 'منتجات يدوية', keywords: ['يدوية', 'حرف', 'تراث', 'صناعات', 'فخاريات', 'حقائب', 'مباخر'] },
    { id: 'decor', label: 'ديكور وهدايا', keywords: ['ديكور', 'هدايا', 'تحف'] },
    { id: 'perfumes', label: 'بخور وعطور', keywords: ['بخور', 'عطور', 'عود', 'لبان', 'مسك'] },
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((prod) => {
      // Category filter
      if (activeCategory !== 'all') {
        const catObj = categoriesList.find((c) => c.id === activeCategory);
        if (catObj && catObj.keywords) {
          const match = catObj.keywords.some((kw) =>
            (prod.category || '').toLowerCase().includes(kw) ||
            (prod.name || '').toLowerCase().includes(kw) ||
            (prod.description || '').toLowerCase().includes(kw)
          );
          if (!match) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          (prod.name || '').toLowerCase().includes(q) ||
          (prod.storeName || '').toLowerCase().includes(q) ||
          (prod.category || '').toLowerCase().includes(q) ||
          (prod.description || '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [allProducts, activeCategory, searchQuery]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      return list.reverse();
    }
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }
    // popular default
    return list.sort((a, b) => (Number(b.reviews || b.reviewsCount || 0)) - (Number(a.reviews || a.reviewsCount || 0)));
  }, [filteredProducts, sortBy]);

  const handleProductClick = (prod) => {
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else if (onOpenProductModal) {
      onOpenProductModal(prod);
    } else if (onNavigate) {
      onNavigate('product-details');
    }
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full space-y-7 animate-fadeIn" dir="rtl">
      
      {/* 1. TOP HEADER BAR (Directly inspired by reference design) */}
      <div className="flex items-center justify-between pb-2">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-xs flex items-center justify-center transition-all cursor-pointer group"
          title="العودة للرئيسية"
        >
          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Title with Sparkle Icon */}
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-[#07132B] tracking-tight">المنتجات</h1>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0066FF] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#0066FF]" />
          </div>
        </div>
      </div>

      {/* 2. CATEGORY PILLS (Blue active pill 'الكل' matching reference design) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scroll-hidden">
        {categoriesList.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-slate-300'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SEARCH & SORT BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، المتجر، أو التصنيف..."
            className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all text-right"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Sort selector & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            عرض {sortedProducts.length} منتج
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF] cursor-pointer"
            >
              <option value="popular">الأكثر شعبية 🔥</option>
              <option value="newest">الأحدث وصولاً ✨</option>
              <option value="rating">الأعلى تقييماً ⭐</option>
              <option value="price_asc">السعر: من الأقل للأعلى ⬆️</option>
              <option value="price_desc">السعر: من الأعلى للأقل ⬇️</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRODUCTS GRID (Unified Luxury Cards matching Reference Image) */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100 shadow-sm max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800">لا توجد منتجات تطابق بحثك حالياً</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرّب تغيير التصنيف المختار أو مسح نص البحث للاطلاع على كافة منتجات المتاجر
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold shadow-md hover:bg-[#0052cc] transition cursor-pointer"
          >
            عرض كافة المنتجات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((prod) => {
            const fav = isFavorite(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => handleProductClick(prod)}
                className="bg-white rounded-3xl border border-slate-100/90 shadow-sm hover:shadow-xl transition-all duration-300 p-3.5 flex flex-col group cursor-pointer relative hover:-translate-y-1"
              >
                {/* 1. Image Container with clean soft light background */}
                <div className="w-full aspect-square bg-[#F8FAFC] rounded-2xl overflow-hidden relative mb-3.5 flex items-center justify-center border border-slate-100/80">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Favorite Heart Button (Top-Left) */}
                  <button
                    type="button"
                    aria-label="المفضلة"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod);
                    }}
                    className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-all duration-200 active:scale-80 z-10 cursor-pointer ${
                      fav
                        ? 'bg-rose-50 text-rose-500 shadow-rose-100 scale-105'
                        : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500'
                    }`}
                    title={fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        fav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'
                      }`}
                    />
                  </button>

                  {/* Badge / Category (Top-Right) */}
                  {(prod.badge || prod.category) && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[11px] font-bold text-slate-700 shadow-xs border border-slate-100/90">
                      {prod.badge || prod.category}
                    </span>
                  )}
                </div>

                {/* 2. Product Information */}
                <div className="flex-1 flex flex-col justify-between text-right">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-[#0066FF] transition-colors">
                      {prod.name}
                    </h3>

                    {/* Store Name with Store Icon */}
                    {prod.storeName && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                        <Store className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        <span className="truncate">{prod.storeName}</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Price & Rating Row */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base sm:text-lg font-black text-[#0066FF]">
                        {Number(prod.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">ر.ي</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{prod.rating || 4.9}</span>
                    </div>
                  </div>

                  {/* 4. Full-width Blue Add-to-Cart Button (Direct Match to Reference) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onAddToCart) onAddToCart(prod);
                    }}
                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>أضف للسلة</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
