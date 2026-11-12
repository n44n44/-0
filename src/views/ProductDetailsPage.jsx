import React, { useState, useEffect } from 'react';
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle,
  MessageSquare,
  Store,
  Camera,
  ThumbsUp,
  Headphones,
  BadgeCheck,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function ProductDetailsPage({
  product: initialProduct,
  onNavigate,
  onAddToCart,
  onOpenStoreModal,
}) {
  const { products, stores } = usePlatform();

  const product = initialProduct || products[0] || {
    id: 'prod-cake-1',
    name: 'كيكة عيد ميلاد مميزة مع التزيين اليدوي',
    storeName: 'متجر جازيزا (JAZIZA)',
    price: 25000,
    rating: 4.9,
    reviewsCount: 120,
    category: 'حلويات ومخبوزات',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=800&auto=format&fit=crop&q=80',
    description: 'كيكة احتفالية مصنوعة يدويًا بإتقان فائق من أجود أنواع الشوكولاتة البلجيكية والكريمة الطازجة. يمكن تخصيص الألوان والاسم والعبارة التهنئة حسب طلبكم لنجعل مناسبتكم ذكرى لا تُنسى.',
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('وسط');
  const [selectedColor, setSelectedColor] = useState('وردي باستيل');
  const [customText, setCustomText] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [activeImage, setActiveImage] = useState(product.image);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState('all');

  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
  }, [product.id, product.image]);

  // Determine product category type to ensure 100% match between image, description, and gallery
  const cat = (product.category || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();
  const isCakeOrSweet =
    cat.includes('حلويات') ||
    cat.includes('sweets') ||
    cat.includes('كيك') ||
    prodName.includes('كيك') ||
    prodName.includes('كب كيك');
  const isBagOrCraft =
    cat.includes('صناعات') ||
    cat.includes('crafts') ||
    cat.includes('أزياء') ||
    cat.includes('fashion') ||
    prodName.includes('حقيب') ||
    prodName.includes('شنط') ||
    prodName.includes('خوص') ||
    prodName.includes('تطريز');
  const isOudOrIncense =
    cat.includes('بخور') ||
    cat.includes('incense') ||
    prodName.includes('مبخر') ||
    prodName.includes('بخور') ||
    prodName.includes('عود') ||
    prodName.includes('عطر');
  const isDecorOrCandles =
    cat.includes('ديكور') ||
    cat.includes('decor') ||
    prodName.includes('شمع') ||
    prodName.includes('شموع') ||
    prodName.includes('كونكريت') ||
    prodName.includes('فخار');
  const isGiftOrFlowers =
    cat.includes('هدايا') ||
    cat.includes('gifts') ||
    prodName.includes('ورد') ||
    prodName.includes('باق') ||
    prodName.includes('هدية') ||
    prodName.includes('دب');

  // Related gallery images strictly matching the product's type (No cake images for bags!)
  const getContextualImages = () => {
    if (product.images && Array.isArray(product.images) && product.images.length > 1) {
      return product.images;
    }
    if (isCakeOrSweet) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=800&auto=format&fit=crop&q=80',
      ];
    }
    if (isBagOrCraft) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      ];
    }
    if (isOudOrIncense) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
      ];
    }
    if (isDecorOrCandles) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80',
      ];
    }
    if (isGiftOrFlowers) {
      return [
        product.image,
        'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      ];
    }
    return [
      product.image,
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&auto=format&fit=crop&q=80',
    ];
  };

  const images = getContextualImages();

  const getSizeSubtext = () => {
    if (isCakeOrSweet) {
      if (selectedSize === 'صغير') return 'يكفي 4 - 6 أشخاص';
      if (selectedSize === 'وسط') return 'يكفي 8 - 10 أشخاص (موصى به)';
      return 'يكفي 12 - 16 شخص';
    }
    if (isBagOrCraft) {
      if (selectedSize === 'صغير') return 'حجم مدمج للإطلالات الخفيفة (20×15 سم)';
      if (selectedSize === 'وسط') return 'حجم عملي يومي مناسب للأغراض الشخصية (30×22 سم)';
      return 'سعة واسعة مع جيوب إضافية (40×30 سم)';
    }
    if (isOudOrIncense) {
      if (selectedSize === 'صغير') return 'حجم استخدام شخصي أو غرف نوم';
      if (selectedSize === 'وسط') return 'حجم مجالس وضيافة عائلية فاخر';
      return 'طقم ملكي متكامل للمناسبات والأعراس';
    }
    return selectedSize === 'وسط' ? 'الحجم القياسي الأكثر طلباً' : 'متوفر بحسب المقاس المطلوب';
  };

  const getCustomTextPlaceholder = () => {
    if (isCakeOrSweet) return 'اكتب عبارة التهنئة أو الاسم المكتوب على الكيك...';
    if (isBagOrCraft) return 'اكتب الاسم أو الحرف المطلوب تطريزه على الحقيبة أو كرت الإهداء...';
    if (isOudOrIncense) return 'اكتب عبارة الإهداء أو الاسم المطبوع على كرت التقديم...';
    return 'اكتب تفاصيل طلبك المخصص أو عبارة الإهداء...';
  };

  const getNotesPlaceholder = () => {
    if (isCakeOrSweet) return 'ملاحظات إضافية (تقليل السكر، نوع الكريمة، وقت استلام محدد)...';
    if (isBagOrCraft) return 'ملاحظات إضافية (طول الحزام، لون البطانة الداخلية، تغليف هدية)...';
    if (isOudOrIncense) return 'ملاحظات إضافية (طريقة التغليف، نوع الفحم أو المبخرة، وقت التوصيل)...';
    return 'أي ملاحظات إضافية بخصوص المنتج أو التغليف أو التوصيل...';
  };

  const getGuaranteeText = () => {
    if (isCakeOrSweet) return 'طازج ويُحضر يوم التوصيل بحب وإتقان';
    if (isBagOrCraft) return 'مشغولات يدوية حضرمية أصيلة وضمان الجودة 100%';
    if (isOudOrIncense) return 'زيوت وبخور طبيعي معتق وأصلي مضمون 100%';
    return 'منتج أصلي معتمد بجودة عالية وضمان غيم سبيس';
  };

  const colors = [
    { name: 'وردي باستيل', bg: 'bg-pink-300', ring: 'ring-pink-400' },
    { name: 'بنفسجي لافندر', bg: 'bg-indigo-200', ring: 'ring-indigo-300' },
    { name: 'أزرق سماوي', bg: 'bg-sky-200', ring: 'ring-sky-300' },
    { name: 'أبيض سكري', bg: 'bg-white border border-slate-300', ring: 'ring-slate-300' },
  ];

  const handleAdd = () => {
    onAddToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
      customText,
      additionalNotes,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-16 font-tajawal" dir="rtl">
      {/* 1. Sub-Header Action / Breadcrumb Bar */}
      <div className="w-full bg-slate-50/80 border-b border-slate-200/60 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate && onNavigate('products')}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#004ac6] text-xs font-bold hover:bg-slate-50 transition shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>رجوع</span>
            </button>
            <span className="text-slate-300">/</span>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
              <button onClick={() => onNavigate && onNavigate('stores')} className="hover:text-[#004ac6]">
                المتاجر
              </button>
              <span>/</span>
              <span className="text-slate-700 font-semibold">{product.storeName}</span>
              <span>/</span>
              <span className="text-[#004ac6] font-bold">{product.category || 'كيك ومناسبات'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-xs bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>موقع التوصيل:</span>
            <span className="font-bold text-[#07132B]">المكلا، حضرموت</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Bento Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RIGHT COLUMN: Media Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Highlight Card */}
            <div className="relative bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm overflow-hidden group">
              {/* Favorite Toggle */}
              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 left-6 z-10 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition cursor-pointer"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>

              {/* Store Badge */}
              <div className="absolute top-6 right-6 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{product.storeName}</span>
              </div>

              {/* Image Container */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition p-1 bg-white cursor-pointer ${
                    activeImage === img
                      ? 'border-[#004ac6] ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>

            {/* Vendor Guarantee Micro-banner */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-100 flex items-center justify-between text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-[#004ac6]" />
                <span className="font-semibold">{getGuaranteeText()}</span>
              </div>
              <span className="text-[#004ac6] font-bold text-xs">ضمان الجودة</span>
            </div>
          </div>

          {/* LEFT COLUMN: Customization & Ordering Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#07132B] tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-xs text-slate-800">{product.rating || 4.9}</span>
                  </div>
                  <span className="text-slate-400 text-xs">({product.reviewsCount || 120} تقييم من العملاء)</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    متاح للطلب
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-right sm:text-left flex flex-col items-start sm:items-end">
                <div className="flex items-baseline gap-1 text-[#07132B]">
                  <span className="text-2xl sm:text-3xl font-black">{product.price.toLocaleString()}</span>
                  <span className="text-xs font-bold text-[#004ac6]">ر.ي</span>
                </div>
                <span className="text-[11px] text-slate-400">شامل التغليف الفاخر</span>
              </div>
            </div>

            {/* Product Authentic Description Card - 100% Matching Visuals */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-indigo-50/40 border border-blue-100/90 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#004ac6]">
                <Sparkles className="w-4 h-4 text-[#004ac6]" />
                <span>تفاصيل ووصف المنتج:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {product.description ||
                  (isCakeOrSweet
                    ? 'كيكة احتفالية فاخرة محضرة من أجود المكونات الطازجة ومزينة بأيدي طهاة محترفين لتناسب أسعد مناسباتكم.'
                    : isBagOrCraft
                    ? 'حقيبة يدوية أنيقة مطرزة بنقوش تراثية عريقة ومصنوعة من خامات طبيعية متينة لتمنحك إطلالة فريدة ومميزة.'
                    : isOudOrIncense
                    ? 'مبخرة وبخور مكلاوي أصيل معتق بأرقى خلطات العود والمسك ليعطر أجواء بيتك برائحة حضرمية ساحرة تدوم طويلاً.'
                    : 'منتج يدوي مميز محضر بأعلى معايير الإتقان والجودة من إبداعات المكلا وحضرموت ليلبي ذوقكم الرفيع.')}
              </p>
            </div>

            {/* Customization 1: Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-800">اختر الحجم / القياس</label>
                <span className="text-xs text-slate-500 font-medium">
                  {getSizeSubtext()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['صغير', 'وسط', 'كبير'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#07132B] text-white border-[#07132B] shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Customization 2: Color Palette */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-800">اختر اللون</label>
                <span className="text-xs font-bold text-[#004ac6]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${c.bg} ${
                      selectedColor === c.name
                        ? 'ring-2 ring-offset-2 ring-[#004ac6] scale-105'
                        : 'hover:ring-2 hover:ring-offset-1 hover:ring-slate-300'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Customization 3: Custom Text / Order Specs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  {isCakeOrSweet
                    ? 'العبارة أو الاسم المكتوب على الكيك'
                    : isBagOrCraft
                    ? 'تطريز الاسم أو الحرف المطلوب على الحقيبة'
                    : isOudOrIncense
                    ? 'كرت الإهداء والعبارة الخاصة'
                    : 'تفاصيل الطلب المخصص'}
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={getCustomTextPlaceholder()}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">ملاحظات إضافية</label>
                <input
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={getNotesPlaceholder()}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#004ac6] focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
              {/* Stepper Counter */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-full sm:w-auto sm:min-w-[140px]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base border border-slate-200 active:scale-90 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-[#07132B] px-4">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold text-base border border-slate-200 active:scale-90 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Primary Button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 w-full bg-[#07132B] hover:bg-[#004ac6] text-white py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-sky-300" />
                <span>أضف إلى السلة • {(product.price * quantity).toLocaleString()} ر.ي</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-slate-500 text-xs border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#004ac6]" />
                <span>توصيل مبرد وسريع</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#004ac6]" />
                <span>دفع إلكتروني آمن 100%</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                <Headphones className="w-4 h-4 text-[#004ac6]" />
                <span>دعم العملاء متواصل</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. VERIFIED CUSTOMER REVIEWS (Matching Stitch Design) */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#07132B]">تقييمات وآراء العملاء</h2>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#004ac6] font-bold text-xs">
                  120 تقييم موثق
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تجارب حقيقية من عملائنا في المكلا وحضرموت الذين قاموا بشراء هذا المنتج
              </p>
            </div>
          </div>

          {/* Ratings Summary Bento Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 border-b border-slate-100 items-center">
            {/* Score Card */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-4xl md:text-5xl font-black text-[#07132B]">4.9</span>
              <div className="flex items-center gap-1 text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500">بناءً على 120 تقييم مؤكد</span>
              <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>98% يوصون بهذا المتجر</span>
              </div>
            </div>

            {/* Star Distribution Bars */}
            <div className="md:col-span-8 flex flex-col gap-2 px-2 md:px-4">
              {[
                { label: '5 نجوم', pct: '88%' },
                { label: '4 نجوم', pct: '9%' },
                { label: '3 نجوم', pct: '2%' },
                { label: 'نجمتان', pct: '1%' },
                { label: 'نجمة', pct: '0%' },
              ].map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-14 text-slate-700 font-semibold shrink-0 flex items-center gap-1">
                    {row.label}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400" style={{ width: row.pct }}></div>
                  </div>
                  <span className="w-10 text-slate-400 text-left font-mono font-medium text-xs">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { id: 'all', label: 'جميع التقييمات (120)' },
              { id: 'photos', label: 'مع صور (34)' },
              { id: '5stars', label: '5 نجوم (105)' },
              { id: 'verified', label: 'تم التحقق من الشراء' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveReviewFilter(chip.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  activeReviewFilter === chip.id
                    ? 'bg-[#07132B] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Customer Reviews List */}
          <div className="divide-y divide-slate-100">
            {/* Review 1 */}
            <div className="py-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-sm shadow-xs">
                    ف
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#07132B]">فاطمة باوزير</h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        <span>مشترٍ موثوق</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span>•</span>
                      <span>منذ 3 أيام (المكلا - فوه)</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  الحجم: وسط • وردي
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-12">
                ما شاء الله الكيكة كانت لذيذة جداً وطازجة والشكل طبق الأصل للطلب.. شكراً لمتجر جازيزا ولغيم سبيس على التوصيل السريع بالمكلا!
              </p>
              {/* Review Actions */}
              <div className="pr-12 flex items-center justify-between pt-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#004ac6] transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>مفيد (14)</span>
                </button>
                <span className="text-[11px] text-slate-400">طلب مخصص</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="py-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#004ac6] font-bold flex items-center justify-center text-sm shadow-xs">
                    م
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#07132B]">محمد العمودي</h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        <span>مشترٍ موثوق</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span>•</span>
                      <span>منذ 5 أيام (المكلا - الديس)</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  الحجم: كبير • أزرق
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pr-12">
                توصيل مبرد وفي الموعد تماماً قبل الحفلة بساعتين. الطعم غني بالشوكولاتة والكريمة خفيفة وموزونة جداً.
              </p>
              <div className="pr-12 flex items-center justify-between pt-1">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#004ac6] transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>مفيد (9)</span>
                </button>
                <span className="text-[11px] text-slate-400">طلب مخصص</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
