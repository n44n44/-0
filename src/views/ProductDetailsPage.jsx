import React, { useState, useEffect, useMemo } from 'react';
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
  Flag,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export default function ProductDetailsPage({
  product: initialProduct,
  onNavigate,
  onAddToCart,
  onOpenStoreModal,
}) {
  const {
    products,
    stores,
    isFavorite: checkFavorite,
    toggleFavorite,
    reviews = [],
    canCustomerReviewProduct,
    addProductReview,
    reportProductReview,
    activeCustomerId,
    customerUser,
  } = usePlatform();

  const product = initialProduct || (products && products.length > 0 ? products[0] : null) || {
    id: 'prod-ref-1',
    name: 'فازة ورد طبيعي وردي',
    storeName: 'متجر التصميم المتميز',
    storeId: 'store-1',
    price: 30,
    rating: 5.0,
    reviewsCount: 2,
    category: 'ديكور وهدايا',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgDvxXGGn15lBOwIJxJHHt_80VjPhAj0j3VADUvykxEHOm-pmTLVFBEuF8FUH_FXkIkHpq9ZmI9Yel-pA_QfOopBHB0bXpf4Gq8XlLUWl7qnBGVex-Amhr7JQ7FLL82mJ-Zh3umkHCFFeuxgcC1NXRQ-kpv65q_KyrTzyYWxcHengXEImvM0DsV27NEIwcYcZGBzPlET-tejnRC1FlyTQvULC5GJNfMq_0pKPCNpQ',
    description: 'باقة ورد جوري طبيعي بألوان زهرية هادئة منسقة بعناية في فازة زجاجية شفافة مع أوراق خضراء نضرة تضفي بهجة وأناقة لأي مساحة.',
  };

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('وسط');
  const [selectedColor, setSelectedColor] = useState('وردي باستيل');
  const [customText, setCustomText] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [activeImage, setActiveImage] = useState(product.image);
  const [isFavorite, setIsFavorite] = useState(false);

  // Dynamic Reviews System
  const [activeReviewFilter, setActiveReviewFilter] = useState('all'); // 'all' | 'photos' | '5stars' | 'verified'
  const [reviewSort, setReviewSort] = useState('newest'); // 'newest' | 'highest'

  // Review Form & Reporting States
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewToast, setReviewToast] = useState(null);
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState('محتوى غير لائق أو مخالف');

  // Real Reviews for current product (matching exact ID or catalog aliases)
  const productReviews = useMemo(() => {
    return (reviews || []).filter((r) => {
      if (r.isDeleted) return false;
      if (r.productId === product.id) return true;
      if (product.id === 'prod-bags-home' && r.productId === 'prod-1') return true;
      if (product.id === 'prod-burner-home' && r.productId === 'prod-2') return true;
      if (product.id === 'prod-1' && r.productId === 'prod-bags-home') return true;
      if (product.id === 'prod-2' && r.productId === 'prod-burner-home') return true;
      return false;
    });
  }, [reviews, product.id]);

  const totalReviewsCount = productReviews.length;

  const dynamicAvgRating = useMemo(() => {
    if (totalReviewsCount === 0) return Number(product.rating || 5.0).toFixed(1);
    const sum = productReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return (sum / totalReviewsCount).toFixed(1);
  }, [productReviews, totalReviewsCount, product.rating]);

  // Dynamic Star Distribution Breakdown
  const starDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating || 5))));
      counts[star] = (counts[star] || 0) + 1;
    });

    return [5, 4, 3, 2, 1].map((stars) => {
      const count = counts[stars];
      const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
      return {
        stars,
        label: `${stars} نجوم`,
        count,
        pct: `${pct}%`,
      };
    });
  }, [productReviews, totalReviewsCount]);

  // Filtered and Sorted Reviews List
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...productReviews];

    if (activeReviewFilter === 'photos') {
      result = result.filter((r) => Boolean(r.imageUrl));
    } else if (activeReviewFilter === '5stars') {
      result = result.filter((r) => Math.round(Number(r.rating || 5)) === 5);
    } else if (activeReviewFilter === 'verified') {
      result = result.filter((r) => r.isVerifiedPurchase !== false);
    }

    if (reviewSort === 'highest') {
      result.sort((a, b) => (Number(b.rating) || 5) - (Number(a.rating) || 5));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [productReviews, activeReviewFilter, reviewSort]);

  // Review Eligibility Check (Customer must have purchased product)
  const eligibility = useMemo(() => {
    if (!canCustomerReviewProduct) return { canReview: false, reason: '' };
    return canCustomerReviewProduct(
      product.id,
      customerUser?.id || activeCustomerId,
      customerUser?.phone
    );
  }, [product.id, customerUser, activeCustomerId, reviews, canCustomerReviewProduct]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await addProductReview({
        productId: product.id,
        rating: newRating,
        comment: newComment.trim(),
        imageUrl: newImageUrl.trim() || null,
        customerName: customerUser?.name || 'مشتري موثّق',
        customerId: customerUser?.id || activeCustomerId || 'usr-cust-1',
        customerPhone: customerUser?.phone || '771234567',
      });
      setReviewToast({ type: 'success', message: 'تم إرسال ونشر تقييمك الموثّق بنجاح! شكراً لمشاركتك رأيك القيّم 🎉' });
      setNewComment('');
      setNewImageUrl('');
      setNewRating(5);
    } catch (err) {
      setReviewToast({ type: 'error', message: err.message || 'تعذر إرسال التقييم' });
    } finally {
      setIsSubmittingReview(false);
      setTimeout(() => setReviewToast(null), 4000);
    }
  };

  const handleConfirmReport = async () => {
    if (!reportingReview) return;
    try {
      await reportProductReview(reportingReview.id, reportReason);
      setReviewToast({ type: 'success', message: 'تم استلام بلاغك وسيقوم فريق الإشراف بمراجعته والتحقق منه.' });
      setReportingReview(null);
    } catch (err) {
      setReviewToast({ type: 'error', message: 'فشل إرسال البلاغ' });
    }
    setTimeout(() => setReviewToast(null), 3500);
  };

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
    <div className="min-h-screen bg-[#F8FAFF] pb-16 font-tajawal" dir="rtl" data-product-id={product.id}>
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
                onClick={() => toggleFavorite(product)}
                className={`absolute top-6 left-6 z-10 w-11 h-11 rounded-full backdrop-blur-md shadow-md border border-slate-200 flex items-center justify-center hover:scale-110 active:scale-95 transition cursor-pointer ${
                  checkFavorite(product.id) ? 'bg-rose-50 text-rose-500' : 'bg-white/90 text-slate-400'
                }`}
                title={checkFavorite(product.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                <Heart className={`w-5 h-5 transition-colors ${checkFavorite(product.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
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

        {/* 3. VERIFIED CUSTOMER REVIEWS & RATINGS SYSTEM */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm space-y-8" dir="rtl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#07132B]">تقييمات وآراء العملاء</h2>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#004ac6] font-bold text-xs">
                  {totalReviewsCount} {totalReviewsCount === 1 ? 'تقييم موثق' : totalReviewsCount === 2 ? 'تقييمان موثقان' : 'تقييمات موثقة'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تجارب حقيقية موثقة من المشترين الذين اشتروا هذا المنتج واستلموه في المكلا ومحافظة حضرموت
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto text-xs">
              <span className="text-slate-400 font-medium">الترتيب حسب:</span>
              <button
                type="button"
                onClick={() => setReviewSort('newest')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  reviewSort === 'newest'
                    ? 'bg-[#07132B] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                الأحدث أولاً
              </button>
              <button
                type="button"
                onClick={() => setReviewSort('highest')}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  reviewSort === 'highest'
                    ? 'bg-[#07132B] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                الأعلى تقييماً
              </button>
            </div>
          </div>

          {/* Toast Notification for Review Submissions / Reports */}
          {reviewToast && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                reviewToast.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {reviewToast.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
              <span>{reviewToast.message}</span>
            </div>
          )}

          {/* Ratings Summary Bento Block (Dynamic Average & Distribution) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4 border-b border-slate-100 items-center">
            {/* Score Card */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="text-4xl md:text-5xl font-black text-[#07132B]">{dynamicAvgRating}</span>
              <div className="flex items-center gap-1 text-amber-400 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(Number(dynamicAvgRating)) ? 'fill-current' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">
                بناءً على {totalReviewsCount} {totalReviewsCount === 1 ? 'مراجعة موثقة' : 'مراجعات موثقة'}
              </span>
              <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
                <span>100% مشترون حقيقيون ومؤكدون</span>
              </div>
            </div>

            {/* Dynamic Star Distribution Bars */}
            <div className="md:col-span-8 flex flex-col gap-2.5 px-2 md:px-4">
              {starDistribution.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-slate-700 font-bold shrink-0 flex items-center gap-1">
                    <span>{row.label}</span>
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="w-16 text-slate-400 text-left font-mono font-bold text-xs">
                    {row.count} ({row.pct})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { id: 'all', label: `جميع التقييمات (${totalReviewsCount})` },
              { id: 'photos', label: `مع صور (${productReviews.filter((r) => r.imageUrl).length})` },
              { id: '5stars', label: `5 نجوم (${productReviews.filter((r) => Math.round(Number(r.rating || 5)) === 5).length})` },
              { id: 'verified', label: 'مشتري موثّق فقط' },
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
          {filteredAndSortedReviews.length === 0 ? (
            <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <p className="text-xs text-slate-500 font-medium">لا توجد تقييمات مطابقة لهذا الفلتر</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedReviews.map((rev) => (
                <div key={rev.id} className="py-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#07132B] to-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {rev.customerName ? rev.customerName.charAt(0) : 'ع'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-[#07132B]">{rev.customerName}</h4>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <BadgeCheck className="w-3 h-3 text-emerald-600" />
                              <span>مشترٍ موثّق</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < (rev.rating || 5) ? 'fill-current' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span className="text-[11px] font-mono">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('ar-YE') : 'مؤخراً'}
                          </span>
                          {rev.customerCity && (
                            <>
                              <span>•</span>
                              <span className="text-[11px]">{rev.customerCity}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Report Review Button */}
                    <button
                      type="button"
                      onClick={() => setReportingReview(rev)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 transition cursor-pointer p-1.5 rounded-lg hover:bg-red-50"
                      title="إبلاغ عن تقييم مخالف"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">إبلاغ عن مخالفة</span>
                    </button>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pr-12">
                    {rev.comment}
                  </p>

                  {/* Attached Photo */}
                  {rev.imageUrl && (
                    <div className="pr-12 pt-1">
                      <a href={rev.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block group">
                        <img
                          src={rev.imageUrl}
                          alt="صورة المنتج من المشتري"
                          className="w-24 h-24 object-cover rounded-2xl border border-slate-200 shadow-xs group-hover:opacity-90 transition-opacity"
                        />
                      </a>
                    </div>
                  )}

                  {/* Official Merchant Reply if present */}
                  {rev.merchantReply && (
                    <div className="mr-12 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1 mt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>رد المتجر الرسمي:</span>
                        </span>
                        <span className="text-[10px] text-blue-500 font-mono">
                          {rev.merchantRepliedAt ? new Date(rev.merchantRepliedAt).toLocaleDateString('ar-YE') : 'مؤخراً'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-800 leading-relaxed font-medium">
                        {rev.merchantReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ==================================================================
              REVIEW SUBMISSION SECTION (Strictly for Verified Purchasers)
              ================================================================== */}
          <div className="pt-6 border-t border-slate-100">
            {eligibility.canReview ? (
              <form onSubmit={handleSubmitReview} className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span>أضف تقييمك الموثّق لهذا المنتج</span>
                    </h3>
                    <p className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      <span>أنت مشترٍ موثّق لهذا المنتج عبر الطلب #{eligibility.orderId}</span>
                    </p>
                  </div>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">تقييمك للمنتج (1 إلى 5 نجوم):</label>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 gap-1">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating || newRating) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(starVal)}
                            className="p-1 text-2xl hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                          >
                            <Star className={`w-6 h-6 ${isFilled ? 'fill-current text-amber-400' : 'text-slate-300'}`} />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-700 mr-2">
                      {newRating === 5 && 'ممتاز جداً 🌟'}
                      {newRating === 4 && 'جيد جداً 👍'}
                      {newRating === 3 && 'جيد ومناسب'}
                      {newRating === 2 && 'مقبول'}
                      {newRating === 1 && 'دون المستوى'}
                    </span>
                  </div>
                </div>

                {/* Review Text Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اكتب مراجعتك ورأيك في المنتج <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="صف تجربتك مع جودة المنتج، سرعة التوصيل في المكلا، ودقة مطابقة الصور..."
                    className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                  />
                </div>

                {/* Optional Attached Photo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    إرفاق صورة للمنتج (اختياري):
                  </label>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="رابط صورة المنتج الحقيقية (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newComment.trim()}
                    className="px-6 py-2.5 rounded-xl bg-[#07132B] hover:bg-[#004ac6] text-white font-bold text-xs shadow-md transition-all duration-200 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isSubmittingReview ? 'جارٍ الإرسال...' : 'إرسال التقييم الموثّق'}</span>
                  </button>
                </div>
              </form>
            ) : eligibility.alreadyReviewed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-bold">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>لقد قمت بتقييم هذا المنتج مسبقاً. شكراً لمشاركتك رأيك القيّم والموثق لمساعدة الآخرين!</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-[#004ac6] shrink-0" />
                  <span>
                    التقييمات في غيم سبيس مقتصرة حصرياً على <strong>المشترين الموثّقين</strong> الذين اشتروا هذا المنتج واستلموه، لضمان مصداقية المراجعات وخلوها من البيانات الوهمية.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Reporting Modal */}
          {reportingReview && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4" dir="rtl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-sm flex items-center gap-2 text-red-600">
                    <Flag className="w-4 h-4" />
                    <span>إبلاغ عن تقييم مخالف</span>
                  </h3>
                  <button onClick={() => setReportingReview(null)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  يرجى تحديد سبب الإبلاغ عن مراجعة <strong>{reportingReview.customerName}</strong>:
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    'محتوى مسيء أو سب أو ألفاظ غير لائقة',
                    'إعلان تجاري مضلل أو غير مرتبط بالمنتج',
                    'معلومات كاذبة أو مضللة للمشترين',
                    'صورة غير لائقة أو تنتهك الخصوصية',
                  ].map((reason, idx) => (
                    <label key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reportReason === reason}
                        onChange={() => setReportReason(reason)}
                        className="accent-red-600"
                      />
                      <span className="font-semibold text-slate-800">{reason}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReportingReview(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReport}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
                  >
                    تأكيد الإبلاغ
                  </button>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}
