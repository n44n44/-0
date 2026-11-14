import React, { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function StoreDetailsPage({
  store: initialStore,
  onNavigate,
  onAddToCart,
  onSelectProduct,
}) {
  const { stores, products, isFavorite, toggleFavorite } = usePlatform();
  const store = initialStore || stores[0] || {
    id: 'store-jaziza',
    name: 'متجر جازيزا (JAZIZA)',
    category: 'حلويات ومخبوزات',
    rating: 4.9,
    reviewsCount: 128,
    location: 'حضرموت، المكلا - حي السلام',
    workingHours: '9:00 ص - 10:30 م',
    phone: '+967 770 123 456',
    cover: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80',
    avatar: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=200&auto=format&fit=crop&q=80',
    description: 'متجر متخصص في إعداد أرقى أنواع الكيك المنزلي، الحلويات الغربية، وتنسيق هدايا المناسبات السعيدة بكل حب وإتقان في قلب المكلا.',
  };

  const [activeTab, setActiveTab] = useState('all');

  // Filter products belonging to this store or category
  const storeProducts = [
    {
      id: 'jaz-1',
      name: 'كيكة الشوكولاتة الفاخرة',
      storeName: store.name,
      price: 18000,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      category: 'حلويات ومخبوزات',
      rating: 4.9,
      tag: 'الأكثر مبيعاً',
      description: 'كيكة الشوكولاتة الفاخرة بطبقات الشوكولاتة البلجيكية الغنية مع كريمة الفدج الناعمة والتزيين اليدوي الراقي.',
    },
    {
      id: 'jaz-2',
      name: 'كب كيك ميني باستيل (12 قطعة)',
      storeName: store.name,
      price: 8500,
      image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&auto=format&fit=crop&q=80',
      category: 'حلويات ومخبوزات',
      rating: 4.8,
      tag: 'جديد',
      description: 'تشكيلة ميني كب كيك باستيل هشة محضرة طازجة من الفانيليا والرد فيلفت مع لمسات كريمة ملونة لجميع الاحتفالات.',
    },
    {
      id: 'jaz-3',
      name: 'كيكة الفراولة والكريمة الملكية',
      storeName: store.name,
      price: 22000,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
      category: 'حلويات ومخبوزات',
      rating: 5.0,
      tag: 'مميز',
      description: 'كيكة الفراولة الطازجة المحشوة بطبقات الكريمة المخفوقة وقطع الفراولة الطبيعية مع جليز لامع وفاخر.',
    },
    {
      id: 'jaz-4',
      name: 'كيكة عيد ميلاد مميزة مع التزيين',
      storeName: store.name,
      price: 25000,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
      category: 'حلويات ومخبوزات',
      rating: 4.9,
      tag: 'حسب الطلب',
      description: 'كيكة عيد ميلاد مصممة ومزينة حسب الطلب بدقة متناهية مع مجسمات كرتونية وشريط ساتان فاخر يدوي الصنع.',
    },
    {
      id: 'jaz-5',
      name: 'باقة ورد وردية فاخرة للإهداء',
      storeName: store.name,
      price: 15000,
      image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
      category: 'هدايا وتغليف',
      rating: 4.8,
      tag: 'إهداء',
      description: 'باقة ورد طبيعي جوري وردي منسقة يدوياً مع ورق تغليف كرافت فاخر وشريط حريري متناسق للإهداء الراقي.',
    },
    {
      id: 'jaz-6',
      name: 'دب لطيف مع بالونات وتغليف إهداء',
      storeName: store.name,
      price: 12000,
      image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
      category: 'هدايا وتغليف',
      rating: 4.9,
      tag: 'إهداء',
      description: 'دمية دب قطنية فائقة النعومة مع بالونات هيليوم وكرت إهداء أنيق بتغليف شفاف لجميع المناسبات السعيدة.',
    },
  ];

  const filteredProducts = activeTab === 'all'
    ? storeProducts
    : storeProducts.filter((p) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16" dir="rtl">
      {/* 1. Store Header & Cover Banner */}
      <div className="relative">
        <div className="h-64 sm:h-80 w-full bg-[#07132B] relative overflow-hidden">
          <img
            src={store.cover || store.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&auto=format&fit=crop&q=80'}
            alt={store.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-black/30"></div>

          {/* Top navigation back button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 absolute top-6 right-0 left-0 flex items-center justify-between z-20">
            <button
              onClick={() => onNavigate('stores')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-bold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع المتاجر</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition"
                title="مشاركة المتجر"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md flex items-center justify-center transition"
                title="إضافة للمفضلة"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Store Profile Card (Overlapping Banner) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            {/* Avatar & Details */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-right">
              <div className="w-28 h-28 rounded-2xl bg-[#07132B] p-2 border-4 border-white shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={store.avatar || store.image || 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=200&auto=format&fit=crop&q=80'}
                  alt={store.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl font-black text-[#07132B]">{store.name}</h1>
                  <span className="px-3 py-0.5 rounded-full bg-sky-100 text-[#0284C7] text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>متجر موثق</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 max-w-xl leading-relaxed">
                  {store.description}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-gray-500 pt-1">
                  <div className="flex items-center gap-1 text-[#EAB839] font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{store.rating || 4.9}</span>
                    <span className="text-gray-400 font-normal">({store.reviewsCount || 128} تقييم)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{store.location || 'المكلا - حي السلام'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{store.workingHours || '9:00 ص - 10:30 م'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Protection & Rating (Customer communicates only via Ghaym Platform) */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
              <button
                onClick={() => onNavigate('contact')}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#07132B] to-[#122245] hover:brightness-110 text-white text-xs font-bold transition shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                <span>خدمة عملاء غيم</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-sky-900 border border-sky-100 text-[11px] font-medium">
                <Truck className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                <span>دفع محمي وتوصيل مضمون</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Value Pillars (Matching 10_store_jaziza.html) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-sky-100 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#07132B]">جودة ومكونات طازجة 100%</h4>
              <p className="text-[11px] text-gray-500">مخبوزات يومية بمكونات مختارة بعناية</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sky-100 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#EAB839] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#07132B]">توصيل مبرد وسريع</h4>
              <p className="text-[11px] text-gray-500">حفاظ تام على شكل ونكهة المنتجات</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-sky-100 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#07132B]">دعم وتخصيص المناسبات</h4>
              <p className="text-[11px] text-gray-500">كتابة عبارات وتصاميم مخصصة للأفراح</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Products Tab Bar & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {[
              { id: 'all', label: 'جميع المنتجات' },
              { id: 'cakes', label: 'كيك وحلويات' },
              { id: 'sweets', label: 'ميني كب كيك' },
              { id: 'gifts', label: 'هدايا وباقات' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-[#07132B] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-500 self-end sm:self-auto font-medium">
            عرض {filteredProducts.length} من أصل {storeProducts.length} منتج
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-sky-300 transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div
                className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(prod);
                  else if (onNavigate) onNavigate('product-details');
                }}
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Favorite Button */}
                <button
                  type="button"
                  aria-label="المفضلة"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(prod);
                  }}
                  className={`absolute top-3 left-3 w-8 h-8 rounded-full shadow-sm flex items-center justify-center backdrop-blur-md transition-all active:scale-90 z-10 cursor-pointer ${
                    isFavorite(prod.id)
                      ? 'bg-rose-50 text-rose-500 scale-105'
                      : 'bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500'
                  }`}
                  title={isFavorite(prod.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(prod.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                </button>
                {prod.tag && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#07132B]/80 text-[#EAB839] backdrop-blur-md text-[10px] font-bold">
                    {prod.tag}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-800">
                  <Star className="w-3 h-3 text-[#EAB839] fill-current" />
                  <span>{prod.rating}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(prod);
                      else if (onNavigate) onNavigate('product-details');
                    }}
                    className="font-bold text-[#07132B] text-sm group-hover:text-[#0284C7] transition cursor-pointer"
                  >
                    {prod.name}
                  </h3>
                  <div className="mt-2 text-base font-black text-[#07132B]">
                    {prod.price.toLocaleString()} <span className="text-xs text-gray-500 font-medium">ر.ي</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (onSelectProduct) onSelectProduct(prod);
                      else if (onNavigate) onNavigate('product-details');
                    }}
                    className="w-full py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold transition"
                  >
                    تفاصيل
                  </button>
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="w-full py-2 rounded-xl bg-[#07132B] hover:bg-[#122245] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>أضف للسلة</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

