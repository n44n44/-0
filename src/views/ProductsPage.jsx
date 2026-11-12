import React, { useState } from 'react';
import {
  ArrowRight,
  Star,
  ShoppingCart,
  Heart,
  Grid,
  Cake,
  Gift,
  Wrench,
  Home,
  Check,
  Tag,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { PRODUCT_IMAGES } from '../data/storeProductImages';

export default function ProductsPage({
  onAddToCart,
  onOpenProductModal,
  onSelectProduct,
  onNavigate,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { id: 'all', name: 'كافة المنتجات', count: 64 },
    { id: 'sweets', name: 'كيك وحلويات', count: 24 },
    { id: 'gifts', name: 'هدايا وتغليف', count: 18 },
    { id: 'crafts', name: 'مستلزمات يدوية', count: 12 },
    { id: 'decor', name: 'ديكور وهدايا', count: 9 },
  ];

  const renderCategoryIcon = (id, active) => {
    const cls = `w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-500'}`;
    switch (id) {
      case 'sweets': return <Cake className={cls} />;
      case 'gifts': return <Gift className={cls} />;
      case 'crafts': return <Wrench className={cls} />;
      case 'decor': return <Home className={cls} />;
      default: return <Grid className={cls} />;
    }
  };

  const productsList = [
    {
      id: 'prod-1',
      name: 'كيكة عيد ميلاد',
      category: 'sweets',
      price: 25000,
      rating: 4.9,
      reviewsCount: 120,
      badge: 'مميز',
      color: 'pink',
      size: 'وسط',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDexhWhPtbqjhF8I-pjk7B59cbflr3x0tEMRlqRAuASVCLTGyKkhbk-w8QGeXYdLRyNUGtH-RJR8ehSiegwAHbc6_3ee9gSh3hWwpGZg8iwyNE8_V4yvd4Gklj4Rfrf5ZH4ll41pGj53fei0qdpiDhMPVO00sj0f8LYYVvhWc3sUJXNWKp7mAjMigqVHNXmgHQa3FGfhlgtFhBVg5WE-M2_Tx0po0J1WV_cWHUxNFg',
      description: 'كيكة احتفالية فاخرة مزينة بكريمة باستيل ناعمة ومجسم أرنب لطيف مع شريط ساتان وردي يدوي الصنع.',
    },
    {
      id: 'prod-2',
      name: 'باقة ورد وردية',
      category: 'gifts',
      price: 15000,
      rating: 4.9,
      reviewsCount: 95,
      badge: null,
      color: 'pink',
      size: 'وسط',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgDvxXGGn15lBOwIJxJHHt_80VjPhAj0j3VADUvykxEHOm-pmTLVFBEuF8FUH_FXkIkHpq9ZmI9Yel-pA_QfOopBHB0bXpf4Gq8XlLUWl7qnBGVex-Amhr7JQ7FLL82mJ-Zh3umkHCFFeuxgcC1NXRQ-kpv65q_KyrTzyYWxcHengXEImvM0DsV27NEIwcYcZGBzPlET-tejnRC1FlyTQvULC5GJNfMq_0pKPCNpQ',
      description: 'باقة دائرية من الورد الطبيعي الفاخر، ملفوفة بورق كرافت وردي أنيق وشريط حريري متناسق.',
    },
    {
      id: 'prod-3',
      name: 'هدية مميزة',
      category: 'gifts',
      price: 12000,
      rating: 4.9,
      reviewsCount: 88,
      badge: null,
      color: 'pink',
      size: 'صغير',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgkt16nl53OWSzpQaWOlPU7g3Wf26u4Vfw-qG_c255N2Q0GxOQpKgoCGo9GoR7v8z2mtRMUZJ-d7ywt07LThHWWq61h-lRGz11KpzsSF33WccmBIzREBUuOJWIYKhxi958AU8IvZ9YXBLwchYsDKKrc9100cao6r6E4daT7wpEzNONDFg9E3_M29acYn_M2Mkomt1ZWEF0evuJllljtphVJztJgpx7SGdMAkjgmiw',
      description: 'صندوق هدايا فاخر مغلف بورق مزخرف ناعم مع فيونكة ساتان لؤلؤية بتشطيب متقن.',
    },
    {
      id: 'prod-4',
      name: 'دب لطيف قطني',
      category: 'gifts',
      price: 8000,
      rating: 4.9,
      reviewsCount: 76,
      badge: null,
      color: 'yellow',
      size: 'صغير',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF2-INxNXub8YwUGlKlEC-lb2xfjEZIi8MPv4gz_Lwn0v0ZhtH7sOXYuIMHRJ3cE2ugDzXPdR9jIYi8NgldZAUudxNs1AvyuEKzNR6EsExz6pDdI_Dqf-SgPw4ZCukRp2OlER7tMRHUb47fEUY10OurebHGfoD1zyUxYATAAIrl5O_CWzB_ZN9b0AIuC6iMF7EZ98v02L1S67sopmeyJ1sqIfCr9x5LpUggxU0-6o',
      description: 'دمية دب كلاسيكية محشوة فائقة النعومة من الفرو الدافئ مع ملامح لطيفة مناسبة للإهداء.',
    },
    {
      id: 'prod-5',
      name: 'شموع معطرة طبيعية',
      category: 'decor',
      price: 10000,
      rating: 4.9,
      reviewsCount: 64,
      badge: null,
      color: 'purple',
      size: 'صغير',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqZqKirZ4u-tzsmoTPcdzq8n_qx9FkBDLEIsG5L-yEvCp8QnKa-BoN1EdiWpKwlAmw6wuYux6WR0xTQ-Fjup9sd90TLiFU6iX9QJUXe6oXUhvKazI2hJ-QuYV_BMo_c9E9828N62U137bLcQQTaV-_6KeDusNUh180NuA2YrP02HjuLT3epb9AE5wh8mCRZOO2KPB_oerfjQgLAaY1mqYezVjqvviMjIwCQndjiLc',
      description: 'طقم شموع صويا طبيعية في أوعية كهرمانية فاخرة بروائح عطرية مهدئة ولمسات لافندر طبيعية.',
    },
    {
      id: 'prod-6',
      name: 'كب كيك صغير مشكل',
      category: 'sweets',
      price: 6000,
      rating: 4.9,
      reviewsCount: 110,
      badge: null,
      color: 'white',
      size: 'صغير',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCa5zLxmN28-gkWd0ptqKYebzD2fzeAWTTnzk5BGSx9UCXR34nuJNpjtswTI9ZhxshoVBgcsGf_IOmqkuU1oOrjG7Ft3jCIn8rNu0e1we0TStkXs2X0fQeLYoYrsdgXBXU-3JmgehP24AqMLPDe__YOe6Y5hejmo7wrJmIXXhgaTsbykxCNLODgdXBd48VwYZ6OCNPNxMp1Xd-xTmV4_qQWK0yIpa755p_S4uQAh8',
      description: 'تشكيلة ميني كب كيك طازجة بكريمة الفراولة والفانيليا وحبات التوت الطازج واللآلئ الذهبية.',
    },
    {
      id: 'prod-7',
      name: 'حقيبة يد نسائية تراثية مطرزة',
      category: 'crafts',
      price: 24000,
      rating: 4.9,
      reviewsCount: 84,
      badge: 'تراث أصيل',
      color: 'pink',
      size: 'وسط',
      image: PRODUCT_IMAGES.bag,
      description: 'حقيبة يد نسائية مصنوعة يدوياً من خامات الخوص والقطن مع تطريز تراثي حضرمي أنيق وحزام جلدي متين.',
    },
    {
      id: 'prod-8',
      name: 'مبخرة فخارية حضرمية أصلية',
      category: 'crafts',
      price: 18500,
      rating: 4.8,
      reviewsCount: 79,
      badge: 'صناعة تريم',
      color: 'yellow',
      size: 'وسط',
      image: PRODUCT_IMAGES.burner,
      description: 'مبخرة فخارية تقليدية مصنوعة من طين حضرموت الأحمر مع نقوش يدوية عريقة لتوزيع البخور وعطر العود في المجالس.',
    },
  ];

  const colors = [
    { id: 'pink', name: 'وردي', bg: 'bg-pink-400' },
    { id: 'purple', name: 'بنفسجي', bg: 'bg-purple-400' },
    { id: 'blue', name: 'أزرق سماوي', bg: 'bg-sky-300' },
    { id: 'yellow', name: 'أصفر', bg: 'bg-amber-200' },
    { id: 'white', name: 'أبيض', bg: 'bg-white border border-outline-variant' },
  ];

  const sizes = ['صغير', 'وسط', 'كبير'];

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter
  const filteredProducts = productsList.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (selectedColor && p.color !== selectedColor) return false;
    if (selectedSize && p.size !== selectedSize) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  const handleProductClick = (prod) => {
    if (onSelectProduct) onSelectProduct(prod);
    else if (onOpenProductModal) onOpenProductModal(prod);
    else if (onNavigate) onNavigate('product-details');
  };

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6" dir="rtl">
      {/* Sub-Bar / Header Action */}
      <div className="flex items-center justify-between mb-6 pb-2">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/50 text-on-surface shadow-sm hover:border-primary transition-all duration-200 text-label-md font-label-md cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 text-[#07132B]" />
          <span>رجوع</span>
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface tracking-tight">
            جميع المنتجات
          </h1>
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
        </div>
      </div>

      {/* Main Two-Column Workspace: Sidebar Filters & Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* RIGHT SIDEBAR: FILTERS & CATEGORIES (Clickable & Reactive) */}
        <aside className="lg:col-span-3 space-y-5 bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/40 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.06)]">
          {/* Category Header */}
          <div className="border-b border-surface-container-high pb-3 flex items-center justify-between">
            <h2 className="text-headline-md font-headline-md text-on-surface font-bold flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>تصنيفات المنتجات</span>
            </h2>
            {activeCategory !== 'all' && (
              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs text-primary hover:underline font-bold"
              >
                عرض الكل
              </button>
            )}
          </div>

          {/* Categories List (Clickable with active highlights) */}
          <div className="flex flex-col gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all text-body-md font-body-md text-right cursor-pointer ${
                    isActive
                      ? 'bg-surface-container text-primary font-bold border-r-4 border-primary shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {renderCategoryIcon(cat.id, isActive)}
                    <span>{cat.name}</span>
                  </span>
                  <span
                    className={`text-label-sm font-label-sm px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-primary-container text-white' : 'text-outline'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-surface-container-high my-2"></div>

          {/* Filter 2: Colors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-label-lg font-label-lg text-on-surface font-semibold">الألوان</label>
              {selectedColor && (
                <button
                  onClick={() => setSelectedColor(null)}
                  className="text-[11px] text-gray-400 hover:text-gray-600"
                >
                  إلغاء التحديد
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {colors.map((c) => {
                const isSel = selectedColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(isSel ? null : c.id)}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer shadow-sm ${
                      isSel ? 'ring-2 ring-offset-2 ring-primary-container scale-110' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          <div className="h-px bg-surface-container-high my-2"></div>

          {/* Filter 3: Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-label-lg font-label-lg text-on-surface font-semibold">الحجم</label>
              {selectedSize && (
                <button
                  onClick={() => setSelectedSize(null)}
                  className="text-[11px] text-gray-400 hover:text-gray-600"
                >
                  إلغاء التحديد
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => {
                const isSel = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(isSel ? null : s)}
                    className={`py-1.5 px-3 rounded-lg text-body-sm font-body-sm transition-all text-center cursor-pointer ${
                      isSel
                        ? 'bg-primary-container text-white border border-primary-container font-semibold shadow-sm'
                        : 'border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-2">
            <label className="block text-label-lg font-label-lg text-on-surface font-semibold mb-2">
              الحد الأقصى للسعر (ر.ي)
            </label>
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant mb-1 font-body-sm">
              <span>5,000 ر.ي</span>
              <span className="text-[#07132B] font-bold">{maxPrice.toLocaleString()} ر.ي</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary-container cursor-pointer"
            />
          </div>
        </aside>

        {/* LEFT SECTION: PRODUCT GRID */}
        <section className="lg:col-span-9 space-y-4">
          {/* Grid Utility Bar */}
          <div className="flex items-center justify-between bg-surface-container-lowest px-4 py-3 rounded-xl border border-outline-variant/40 shadow-sm">
            <div className="text-body-sm font-body-sm text-on-surface-variant">
              عرض <span className="font-bold text-on-surface">{sortedProducts.length}</span> من إجمالي{' '}
              <span className="font-bold text-on-surface">{productsList.length}</span> منتج
            </div>
            <div className="flex items-center gap-2">
              <span className="text-label-md font-label-md text-on-surface-variant hidden sm:inline">
                ترتيب حسب:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-body-sm font-body-sm bg-surface-container-low border border-outline-variant/50 rounded-lg px-2.5 py-1 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container cursor-pointer"
              >
                <option value="featured">الأكثر تميزاً</option>
                <option value="rating">الأعلى تقييماً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-100 shadow-sm">
              <div className="text-4xl">🛍️</div>
              <h3 className="text-lg font-bold text-[#07132B]">لا توجد منتجات مطابقة لخيارات الفلترة</h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                جرّب توسيع نطاق السعر أو إلغاء تحديد اللون أو الحجم
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedColor(null);
                  setSelectedSize(null);
                  setMaxPrice(500);
                }}
                className="px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-xl"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {sortedProducts.map((prod) => (
                <article
                  key={prod.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-[0_8px_24px_-4px_rgba(37,99,235,0.08)] overflow-hidden flex flex-col justify-between group hover:shadow-[0_12px_28px_-4px_rgba(37,99,235,0.14)] transition-all duration-300"
                >
                  {/* Product Preview Image with favorite heart */}
                  <div
                    className="relative aspect-square overflow-hidden bg-surface-container-low cursor-pointer"
                    onClick={() => handleProductClick(prod)}
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={prod.image}
                      alt={prod.name}
                    />

                    {/* Favorite Button */}
                    <button
                      type="button"
                      aria-label="أضف للمفضلة"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prod.id);
                      }}
                      className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-outline hover:text-red-500 shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(prod.id) ? "text-rose-500 fill-rose-500" : "text-slate-400 hover:text-rose-400"}`} />
                    </button>

                    {prod.badge && (
                      <span className="absolute bottom-2.5 right-2.5 bg-primary-container/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                    <div className="cursor-pointer" onClick={() => handleProductClick(prod)}>
                      <h3 className="text-headline-md font-headline-md text-on-surface font-bold line-clamp-1 hover:text-primary transition-colors">
                        {prod.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-body-sm font-body-sm font-semibold text-on-surface">
                          {prod.rating}
                        </span>
                        <span className="text-[11px] text-outline">({prod.reviewsCount} تقييم)</span>
                      </div>
                    </div>

                    {/* Price & Add to Cart CTA */}
                    <div className="pt-1 border-t border-surface-container-high/60 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] text-on-surface-variant font-medium">السعر</span>
                        <div className="text-headline-md font-headline-md font-extrabold text-[#07132B]">
                          {Number(prod.price).toLocaleString()}{' '}
                          <span className="text-xs font-bold text-sky-600">
                            ر.ي
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onAddToCart && onAddToCart(prod)}
                        className="w-full py-2.5 px-3 rounded-lg bg-[#07132B] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 pt-6 pb-2">
            <button className="w-9 h-9 rounded-lg border border-outline-variant/60 flex items-center justify-center text-on-surface hover:border-primary-container transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary-container text-white font-bold text-body-sm flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-9 h-9 rounded-lg border border-outline-variant/60 text-on-surface text-body-sm flex items-center justify-center hover:border-primary-container transition-colors cursor-pointer">
              2
            </button>
            <button className="w-9 h-9 rounded-lg border border-outline-variant/60 flex items-center justify-center text-on-surface hover:border-primary-container transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
