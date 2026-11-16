import React, { useRef, useState, useEffect } from 'react';
import { usePlatform } from '../context/PlatformContext';

const STITCH_LOGO_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0kTwyrOgVt1UikZzjl_8adoPbACflThuS0OAMs1NBAxfhdj0d6U5zy__p3zH1LwwSEoGCf-TrnUeEI9e7ofTlwvzBEkjkRq7dWVa2VM8YYzl6qDAYySLO14czo6P79cFjMAhBjFyf9NEde5r2LsURP2LZTDBAFNk7WWjYNfTnw_OMambwfjlKjSD-giwosQLJIjXhF6XEZHmA2tjH6DDME6VgOoNX5agZVPKSTOwWd7WRKHY8-450';

export default function HomePage({
  onNavigate,
  onOpenStoreModal,
  onAddToCart,
  onOpenSellerModal,
  onSelectProduct,
}) {
  const { isFavorite, toggleFavorite } = usePlatform();

  // 8 Authentic Categories with Live Product/Store Counts
  const categoryItems = [
    {
      id: 'decor',
      name: 'ديكور وهدايا',
      badge: '+120 منتج',
      storesCount: '34 متجر',
      iconClass: 'fa-solid fa-gift',
      gradient: 'from-amber-500 via-amber-400 to-amber-200',
      bgLight: 'bg-amber-50 text-amber-600 border-amber-200',
      textColor: 'group-hover:text-amber-600',
    },
    {
      id: 'pottery',
      name: 'صناعات يدوية',
      badge: '+85 منتج',
      storesCount: '28 متجر',
      iconClass: 'fa-solid fa-basket-shopping',
      gradient: 'from-[#8a5a36] via-[#b37a4c] to-[#deb887]',
      bgLight: 'bg-[#fbf7f4] text-[#8a5a36] border-[#ebdace]',
      textColor: 'group-hover:text-[#8a5a36]',
    },
    {
      id: 'fashion',
      name: 'ملابس وأزياء',
      badge: '+140 منتج',
      storesCount: '42 متجر',
      iconClass: 'fa-solid fa-shirt',
      gradient: 'from-[#163168] via-sky-500 to-sky-200',
      bgLight: 'bg-sky-50 text-sky-600 border-sky-200',
      textColor: 'group-hover:text-sky-600',
    },
    {
      id: 'kitchen',
      name: 'أسر منتجة',
      badge: '+95 منتج',
      storesCount: '56 متجر',
      iconClass: 'fa-solid fa-kitchen-set',
      gradient: 'from-[#581c87] via-[#8b5cf6] to-[#d8b4fe]',
      bgLight: 'bg-purple-50 text-[#7c3aed] border-purple-200',
      textColor: 'group-hover:text-purple-600',
    },
    {
      id: 'incense',
      name: 'بخور وعطور',
      badge: '+70 منتج',
      storesCount: '38 متجر',
      iconClass: 'fa-solid fa-spray-can-sparkles',
      gradient: 'from-[#92400e] via-[#d97706] to-[#fde68a]',
      bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
      textColor: 'group-hover:text-amber-700',
    },
    {
      id: 'sweets',
      name: 'حلويات ومخبوزات',
      badge: '+60 منتج',
      storesCount: '39 متجر',
      iconClass: 'fa-solid fa-cake-candles',
      gradient: 'from-[#e11d48] via-[#f97316] to-[#fdba74]',
      bgLight: 'bg-rose-50 text-[#ea580c] border-orange-200',
      textColor: 'group-hover:text-orange-600',
    },
    {
      id: 'heritage',
      name: 'تراث وفخاريات',
      badge: '+50 منتج',
      storesCount: '25 متجر',
      iconClass: 'fa-solid fa-landmark',
      gradient: 'from-[#0f766e] via-[#14b8a6] to-[#99f6e4]',
      bgLight: 'bg-teal-50 text-teal-700 border-teal-200',
      textColor: 'group-hover:text-teal-600',
    },
    {
      id: 'candles',
      name: 'شموع وروائح منزلية',
      badge: '+45 منتج',
      storesCount: '20 متجر',
      iconClass: 'fa-solid fa-wand-magic-sparkles',
      gradient: 'from-[#0369a1] via-[#38bdf8] to-[#bae6fd]',
      bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
      textColor: 'group-hover:text-sky-600',
    },
  ];

  // Animated Categories Scroll Ref & Auto-scroll State
  const categoriesScrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [dragMoved, setDragMoved] = useState(false);

  // Auto-scroll loop from right to left (RTL direction)
  useEffect(() => {
    const el = categoriesScrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!isPaused && !isDragging && el) {
        // In modern browsers with dir="rtl", scrollLeft is negative or decreasing
        const atEnd = Math.abs(el.scrollLeft) >= (el.scrollWidth - el.clientWidth - 4);
        if (atEnd) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: -1.2 });
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isPaused, isDragging]);

  const scrollPrev = () => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e) => {
    if (!categoriesScrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setDragMoved(false);
    setStartX(e.pageX - categoriesScrollRef.current.offsetLeft);
    setScrollLeftState(categoriesScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !categoriesScrollRef.current) return;
    const x = e.pageX - categoriesScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) setDragMoved(true);
    categoriesScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 2000);
  };
  // 4 Featured Stores
  const featuredStores = [
    {
      id: 'store-1',
      name: 'متجر غيم الهدايا والديكور',
      tagline: 'تصميم وتصنيع هدايا وتحف فنية وديكورات فريدة',
      category: 'ديكور وهدايا',
      rating: 4.9,
      reviewsCount: 142,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZEIfF-VPJ_5ZP0mO3X_wY4hFVtkL_AdQ27_PsIa8pOUMJR5u6LwZ8QlFUSNiGSpxi6tox5tOv5herX_PPgDtloFbJxQWj8srFCmDxVMnHUBY1QTQY6DVtTIkjgM5tqtRyE0k_S1aQ99fbA93eCKObnqad7yPq5WbqoMgygK5iQkNSYtAwmV9BDCJ1cgRRqmLWePTjE6cnLdZym2ua_2WQLrFA5hkOWfiIAoToiRI',
      avatarType: 'logo',
    },
    {
      id: 'store-oud',
      name: 'بخور وعطور المكلا',
      tagline: 'أجود أنواع البخور والمخلطات المكلاوية الأصيلة',
      category: 'بخور وعطور',
      rating: 4.9,
      reviewsCount: 98,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbWwAPDaPMAU0AbnJL7o0JFHnBUKb_xCfQMD0ZXlqmK3GDQc2TYpAG1RYwUlk1Mst0m7dLGywyOld4SgZvXMqzVZnSDVbVNCznu9UioW-FMs9aOvJbraGdJqfuWUX-dGTC014bwRdM-4iv0ZV_u2YThb9nFNLvOwv3taPoV57C6FhfdcVfVd-A2FltBVkBsK5dv6NDolnpIOtZ4mFRDAuZlGoDzvolKwUzcEYoTbs',
      avatarType: 'burner',
    },
    {
      id: 'store-jaziza',
      name: 'متجر جازيزا المميز',
      tagline: 'كيك مناسبات، حلويات غربية ومخبوزات طازجة',
      category: 'حلويات ومخبوزات',
      rating: 4.8,
      reviewsCount: 115,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgicSXG7A3VERksuK_wxciZAy9bUpexlZl9ccRzRWRfNZSytwA5bvj4o5DG2toWQ-ANd98MJIjPzO6fiGLhEjkFFwi99KcI_rxaol-oMTVQmG-MpVTJx1XJjyLhgn1v3W_dpttlNC9m3lFYG4Zkkg4--Ev2dVWopfD45gPAdu1X3a-SKDcKXsMXZEa2GeYGZYqmL7WhtAyT4QxIlsIxGTP9yaTKfRAUfU3X0oLzgc',
      avatarType: 'jaziza',
    },
    {
      id: 'store-samar',
      name: 'سمر المكلا للأزياء',
      tagline: 'أزياء تراثية حضرمية، تطريز يدوي وعبايات راقية',
      category: 'أزياء وتطريز',
      rating: 4.9,
      reviewsCount: 88,
      cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtGSyVVDvewp5mn8XZPiDBXjRT-x_q9TnJt5PVN9a8g0zuRTenDpcVNnV2_pJShqd4sP49iCn6mVOSuryS9gRQx366ctsIMH41USHgdVF7fWXUwk2WpTB1dlAgvxI48eBtH6-8xKVhQ5gpEw37wEbL439CorP0QJEBM1PbqtgAheUZDJqWN1dUkyhtQb2Vy6Sl7xvrWjZYCvybaXE9v9K0eJqQ4rPAf8CZEYwsrW4',
      avatarType: 'samar',
    },
  ];

  // 4 Latest Products
  const latestProducts = [
    {
      id: 'prod-bags-home',
      name: 'حقائب يمنية قماشية وتطريز حضرمي',
      tagline: 'صنع يدوي بالكامل من القطن الطبيعي',
      price: 24000,
      storeName: 'تراثيات حضرمية',
      category: 'حرف يدوية',
      rating: 4.9,
      reviewsCount: 84,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAdU2O_nwVrhsXPF0BG4Au1c8sVBpL6DQ6CxVjtbNJV0USNwQJwSMmhQXQWdbL0SaGAGlwwHcHxjZPk5ypextJ5g_pRp4miv5b57hQKEWUBXspt6ukQrF1l78o3WYK4TR1r7TiXXR1eLjHITPpKjVu5q4kaaHkuGMNnPkyI3k05tGiVVslNc46YaQsUSjGoEJtLgRuV13wqXhFW2jZbJQpssdOETehHsrVWBdor6E',
      description: 'حقيبة قماشية تراثية مصنوعة يدوياً من القطن الطبيعي وتطريز حضرمي أصيل مناسبة للإهداء والاستخدام اليومي الفاخر.',
    },
    {
      id: 'prod-burner-home',
      name: 'مباخر بتطريز تقليدي وفخامة البخور',
      tagline: 'فخار حضرمي أصيل بنقوش يدوية',
      price: 18500,
      storeName: 'بخور وعطور المكلا',
      category: 'فخاريات وتراث',
      rating: 4.9,
      reviewsCount: 92,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGDbLzeGt-HihsJQ0HgIjSiIDj1wRRGHGyi_4D2wGV-Cp1MlxxMljCC_8sqmN0OMVlbsigCN3CF0toJ7GbBbxfHKRuHLLv6hAh0Ek6gCulhkTFN96g3z6Olr0ef96vClc5M06IASom4bR_IvKamuQAB3hAmsd-UjMxJSVCoVoXqOv45n3xgihR8YZvUGylgfu-eBBtwgJBwsiZIZvZTbEiZASihlhbJ4JsYprJ7YQ',
      description: 'مبخرة فخارية حضرمية مصنوعة بأيدي حرفيين محليين مع نقوش تراثية يدوية وتفاصيل دقيقة تجسد أصالة حضرموت.',
    },
    {
      id: 'prod-candles-home',
      name: 'شموع صويا طبيعية معطرة بالعود',
      tagline: 'زيوت عطرية تدوم حتى 40 ساعة',
      price: 12000,
      storeName: 'شموع حضرموت الفاخرة',
      category: 'روائح منزلية',
      rating: 4.8,
      reviewsCount: 65,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgebItWGOCJZqnCZjUZvBbLbzm37W_0j8rgXZ_ae_yEIwlh0Th14U4uvGHFs0yB4K14CBrxOGuCbiT4pVX3sT2ccODEvpCh2r_2pOEay6JEA0_vaa6BAnYKaQnrzpPJv6f6Z16yS2M4l3n18UgRU9EdjvnMAZYJFbMkhmCa1s5fNKH36Iv2a5p6Fg5-nDrCF2PbFpIOjrHKIBsfeL5-OFK_IwghcO6RsXPYZyXU9E',
      description: 'شموع صويا طبيعية معطرة بدهن العود الطبيعي والمسك، مصنوعة يدوياً وتدوم لأكثر من 40 ساعة من الاحتراق العطر الهادئ.',
    },
    {
      id: 'prod-concrete-home',
      name: 'أواني وتشكيلات كونكريت رخامية',
      tagline: 'تصاميم عصرية مدمجة بالذهب والنحاس',
      price: 15000,
      storeName: 'متجر غيم الهدايا والديكور',
      category: 'ديكور حديث',
      rating: 4.8,
      reviewsCount: 45,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa9yOjJKqht9IQTre4INhmc_Kwy7KZjlV792aK4AhTem1dLgFTxI-r88ovNoFhLJ6C1qMTfZB3TGcOJmRUxxqMZPEQ0Dl-ySXsH8DwuehSzb_q1wrp6ieo6Usi5Efqy54QROPih_NFdnBbxnhApAX86gFg6pV54ciI5HK3d6zrB0uV4DkAPV44vSzwwe3W7mQYp44ahHQw6pmk-dFNTeHX3ICvB5ApmPCRZihO7G4',
      description: 'أواني وديكورات كونكريت عصرية بتأثير رخامي مدمجة بلمسات من الذهب والنحاس لإضفاء لمسة جمالية راقية على منزلك.',
    },
  ];

  return (
    <div className="flex-grow w-full max-w-7xl xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8" dir="rtl">
      
      {/* BEGIN: HeroBannerSection (Mobile: Compact Horizontal, Desktop: 16:5 Wide Ratio) */}
      <section
        className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-l from-[#07132b] via-[#0d2046] to-[#07132b] text-white p-3.5 sm:p-6 md:p-8 lg:p-10 overflow-hidden shadow-xl border border-[#1b3160] w-full min-h-[140px] sm:min-h-[220px] md:min-h-[340px] lg:aspect-[16/5] flex items-center"
        id="hero-banner"
      >
        {/* Volumetric Background Cloud Auras */}
        <div className="parallax-layer absolute -top-16 -left-16 w-80 h-80 bg-gradient-to-br from-sky-400/25 to-blue-600/10 rounded-full blur-3xl pointer-events-none anim-cloud-glow"></div>
        <div className="parallax-layer absolute top-1/2 -right-20 w-96 h-80 bg-gradient-to-tl from-indigo-500/20 via-sky-300/15 to-transparent rounded-full blur-3xl pointer-events-none anim-cloud-float-2"></div>
        <div className="parallax-layer absolute -bottom-16 left-1/4 w-[30rem] h-48 bg-sky-400/15 rounded-full blur-2xl pointer-events-none anim-cloud-float-1"></div>

        {/* Floating Ambient 3D Cloud Shapes */}
        <div className="parallax-layer absolute top-8 left-16 w-20 h-20 rounded-full bg-gradient-to-b from-white/20 via-sky-400/15 to-transparent backdrop-blur-md border border-white/20 shadow-[0_8px_32px_rgba(56,189,248,0.2)] pointer-events-none hidden md:block anim-cloud-float-1"></div>
        <div className="parallax-layer absolute bottom-10 right-24 w-28 h-28 rounded-full bg-gradient-to-t from-sky-400/20 via-indigo-500/15 to-transparent backdrop-blur-md border border-white/15 pointer-events-none hidden md:block anim-cloud-float-2"></div>

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          aria-label="السابق"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition z-20 cursor-pointer"
        >
          <i className="fa-solid fa-chevron-right text-xs sm:text-sm"></i>
        </button>
        <button
          type="button"
          aria-label="التالي"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center backdrop-blur-md border border-white/20 shadow-md transition z-20 cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs sm:text-sm"></i>
        </button>

        {/* Banner Content: Balanced Horizontal Layout (Text on Right in RTL, Cloud Logo on Left) */}
        <div className="w-full flex flex-row items-center justify-between gap-3 sm:gap-6 md:gap-8 relative z-10">
          
          {/* Right Side: Headline & CTA (First in RTL reading order) */}
          <div className="flex-1 text-right space-y-1.5 sm:space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs text-sky-200 font-semibold shadow-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-ping"></span>
              <span>• مهرجان الإبداع الحضرمي •</span>
            </div>
            
            <h1 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-snug drop-shadow-md">
              عروض غيم سبيس -
              <span className="block text-xs sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-sky-300 font-bold mt-0.5">
                لدعم الحرفيين والأسر المنتجة
              </span>
            </h1>

            <p className="text-[10px] sm:text-xs md:text-base text-gray-200 font-medium max-w-xl md:max-w-2xl leading-relaxed hidden sm:block">
              اكتشف إبداع المكلا.. منتجات مصنوعة بكل حب وحرفية بأيادٍ محلية مبدعة وبخصومات تصل إلى 50%
            </p>

            <div className="pt-1 sm:pt-2 flex flex-row items-center gap-2 sm:gap-3 justify-start">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('products')}
                className="inline-flex items-center gap-1 sm:gap-2 bg-[#eab839] hover:bg-[#d9a72b] text-[#07132b] font-bold px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-full text-[11px] sm:text-sm lg:text-base shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
              >
                <span>تسوق العروض</span>
                <span className="text-xs sm:text-sm">✨</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('categories')}
                className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm lg:text-base backdrop-blur-sm border border-white/20 transition cursor-pointer whitespace-nowrap"
              >
                <span>تصفح الأقسام</span>
              </button>
            </div>
          </div>

          {/* Left Side: Cloud Logo Graphic Seamlessly Blended */}
          <div className="w-24 sm:w-44 md:w-5/12 lg:w-1/3 shrink-0 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-sky-400/25 rounded-full blur-2xl sm:blur-3xl scale-110 pointer-events-none anim-cloud-glow"></div>
            <div className="relative w-24 h-20 sm:w-40 sm:h-32 md:w-full md:max-w-[320px] lg:max-w-[380px] md:h-52 lg:h-64 flex items-center justify-center anim-cloud-float-1">
              <img
                alt="شعار غيم سبيس السحابي"
                className="w-full h-full object-contain blend-hero-logo drop-shadow-[0_10px_20px_rgba(56,189,248,0.4)]"
                src={STITCH_LOGO_URL}
              />
            </div>
          </div>

        </div>
      </section>
      {/* END: HeroBannerSection */}

      {/* BEGIN: CategoriesSection (Interactive Animated Horizontal Track) */}
      <section className="relative overflow-hidden py-1" data-purpose="categories-slider">
        <div className="flex items-center justify-between mb-3 sm:mb-4" id="categories">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight">تصنيفات المنتجات</h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold">
                <i className="fa-solid fa-arrows-left-right text-[10px]"></i>
                <span>شريط متحرك تفاعلي</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">اسحب وتصفح إبداعات الحرفيين والأسر في حضرموت</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('categories')}
              className="text-xs sm:text-sm font-semibold text-sky-700 hover:text-sky-900 transition cursor-pointer hidden sm:block ml-2"
            >
              عرض الكل
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="السابق"
                title="التمرير لليمين"
                className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-sky-600 hover:border-sky-300 flex items-center justify-center transition cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="التالي"
                title="التمرير لليسار"
                className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 hover:text-sky-600 hover:border-sky-300 flex items-center justify-center transition cursor-pointer active:scale-95"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Track: Auto-scrolling + Touch Drag + Smooth Momentum */}
        <div
          ref={categoriesScrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2500)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full flex items-center gap-3 sm:gap-4 overflow-x-auto py-3 px-1 no-scrollbar select-none cursor-grab active:cursor-grabbing scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}
        >
          {/* Duplicate list to allow rich continuous infinite scroll effect */}
          {[...categoryItems, ...categoryItems].map((cat, idx) => (
            <button
              key={`${cat.id}-${idx}`}
              type="button"
              onClick={() => {
                if (!dragMoved && onNavigate) onNavigate('products');
              }}
              className="flex flex-col items-center group shrink-0 w-[92px] sm:w-[115px] p-2 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer text-center scroll-snap-align-start border border-transparent hover:border-slate-100"
            >
              {/* Vibrant Icon Squircle with Brand Gradient Aura */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${cat.gradient} p-0.5 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 flex items-center justify-center`}>
                <div className={`w-full h-full rounded-2xl ${cat.bgLight} flex items-center justify-center border transition-all duration-300`}>
                  <i className={`${cat.iconClass} text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110`}></i>
                </div>
              </div>

              {/* Category Name */}
              <span className={`mt-2 text-xs sm:text-sm font-bold text-gray-800 ${cat.textColor} transition line-clamp-1`}>
                {cat.name}
              </span>

              {/* Badge */}
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium mt-0.5">
                {cat.badge}
              </span>
            </button>
          ))}
        </div>
      </section>
      {/* END: CategoriesSection */}

      {/* BEGIN: FeaturedStoresSection */}
      <section className="space-y-3 sm:space-y-4" data-purpose="featured-stores">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">المتاجر المميزة لهذا الأسبوع</h2>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('stores')}
            className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-sky-700 transition cursor-pointer"
          >
            عرض الكل
          </button>
        </div>

        {/* 
          Desktop (md / lg): 4 store cards in ONE horizontal row (grid-cols-4)
          Mobile: Single horizontal row with smooth left/right swipe (w-[165px] allows next store to peek)
        */}
        <div
          id="featured-stores-carousel"
          data-purpose="featured-stores-carousel"
          className="flex md:grid md:grid-cols-4 gap-3 sm:gap-5 overflow-x-auto md:overflow-visible pb-3 md:pb-0 snap-x-mandatory no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {featuredStores.map((store) => (
            <div
              key={store.id}
              className="shrink-0 w-[165px] sm:w-[210px] md:w-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col items-center text-center p-2.5 sm:p-4 hover:shadow-lg transition duration-300 group snap-start"
            >
              {/* Store Cover with Avatar Overlap */}
              <div className="relative w-full mb-5 sm:mb-8">
                <div className="w-full h-24 sm:h-36 rounded-xl overflow-hidden shadow-inner relative">
                  <img
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    src={store.cover}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                </div>
                
                {/* Store Profile Image Overlap */}
                <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-md bg-[#07132b] flex items-center justify-center overflow-hidden p-0.5 sm:p-1 z-20">
                  {store.avatar ? (
                    <img alt={store.name} className="w-full h-full object-contain rounded-full" src={store.avatar} />
                  ) : store.avatarType === 'logo' ? (
                    <img alt={store.name} className="w-full h-full object-contain filter drop-shadow" src={STITCH_LOGO_URL} />
                  ) : store.avatarType === 'burner' ? (
                    <div className="w-full h-full bg-[#2b1810] flex items-center justify-center text-amber-300 font-bold text-[10px] sm:text-xs rounded-full">
                      <i className="fa-solid fa-fire-burner text-xs sm:text-lg text-amber-400"></i>
                    </div>
                  ) : store.avatarType === 'jaziza' ? (
                    <div className="w-full h-full bg-black flex items-center justify-center text-amber-300 font-black text-[8px] sm:text-[10px] tracking-wider rounded-full px-0.5">
                      JAZIZA
                    </div>
                  ) : store.avatarType === 'samar' ? (
                    <div className="w-full h-full bg-[#1a1412] flex items-center justify-center text-amber-200 font-black text-[8px] sm:text-[10px] tracking-wider rounded-full px-0.5">
                      SAMAR
                    </div>
                  ) : (
                    <div className="w-full h-full bg-sky-900 flex items-center justify-center text-white font-bold text-xs rounded-full">
                      <i className="fa-solid fa-store text-sky-300 text-xs sm:text-sm"></i>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-sky-700 transition line-clamp-1 w-full">
                {store.name}
              </h3>
              
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 mb-2 sm:mb-4">
                <span className="flex items-center text-amber-500 text-[10px] sm:text-xs font-bold gap-0.5">
                  <i className="fa-solid fa-star text-[9px] sm:text-[11px]"></i> {store.rating}
                </span>
                <span className="bg-sky-500 text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                  <i className="fa-solid fa-check text-[7px] sm:text-[9px]"></i> موثق
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenStoreModal) onOpenStoreModal(store);
                  else if (onNavigate) onNavigate('store-details');
                }}
                className="w-full mt-auto py-1.5 sm:py-2.5 bg-gray-50 hover:bg-[#07132b] hover:text-white text-gray-700 rounded-xl text-[10px] sm:text-xs font-bold transition border border-gray-200 cursor-pointer active:scale-95"
              >
                زيارة المتجر
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* END: FeaturedStoresSection */}

      {/* BEGIN: SellerCallToActionBanner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#07132b] via-[#0d224d] to-[#07132b] p-4 sm:p-7 text-white shadow-lg border border-[#1b3469] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden" data-purpose="join-seller-banner">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none anim-cloud-glow"></div>
        <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none anim-cloud-float-2"></div>
        
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-right relative z-10 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 hidden sm:flex items-center justify-center anim-cloud-float-1">
            <img alt="غيم سبيس ترحيب" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter drop-shadow" src={STITCH_LOGO_URL} />
          </div>
          <div>
            <h3 className="text-sm sm:text-xl font-bold text-white">
              هل لديك موهبة أو مشروع منزلي؟ انضم إلى غيم سبيس الآن وابدأ البيع مجاناً! ☁️🛒
            </h3>
            <p className="text-[11px] sm:text-sm text-sky-200 mt-0.5 sm:mt-1">
              منصتك المتكاملة لعرض منتجاتك، تنظيم مبيعاتك والوصول لآلاف العملاء في حضرموت
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSellerModal}
          className="w-full sm:w-auto shrink-0 bg-[#eab839] hover:bg-[#d9a72b] text-[#07132b] font-bold px-6 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow hover:shadow-md relative z-10 cursor-pointer text-center"
        >
          سجل كتاجر
        </button>
      </section>
      {/* END: SellerCallToActionBanner */}

      {/* BEGIN: LatestProductsSection */}
      <section className="space-y-3 sm:space-y-4" data-purpose="latest-products" id="products">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">أحدث المنتجات المضافة</h2>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('products')}
            className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-sky-700 transition cursor-pointer"
          >
            عرض الكل
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {latestProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => {
                if (onSelectProduct) onSelectProduct(prod);
                else if (onNavigate) onNavigate('product-details');
              }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-2 sm:p-3 hover:shadow-lg transition duration-300 group cursor-pointer"
            >
              <div className="relative w-full h-32 sm:h-44 md:h-48 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center mb-2">
                <img
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  src={prod.image}
                />
                <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  {prod.category}
                </span>
                <button
                  type="button"
                  aria-label="المفضلة"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(prod);
                  }}
                  className={`absolute top-1 left-1 sm:top-2 sm:left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-sm flex items-center justify-center backdrop-blur-sm transition-all duration-200 active:scale-90 cursor-pointer ${
                    isFavorite(prod.id)
                      ? 'bg-rose-50 text-rose-500 scale-105'
                      : 'bg-white/80 hover:bg-white text-gray-500 hover:text-rose-500'
                  }`}
                  title={isFavorite(prod.id) ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                >
                  <i className={`text-[10px] sm:text-xs ${isFavorite(prod.id) ? 'fa-solid fa-heart text-rose-500' : 'fa-regular fa-heart'}`}></i>
                </button>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-sky-700 transition">
                {prod.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 line-clamp-1">{prod.tagline}</p>

              <div className="mt-1.5 sm:mt-2.5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-extrabold text-[#07132b]">
                  {prod.price.toLocaleString()} <span className="text-[9px] sm:text-xs font-normal text-gray-500">ر.ي</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded">
                  متوفر
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddToCart) onAddToCart(prod);
                }}
                className="mt-2 w-full py-1.5 sm:py-2 bg-[#07132b] hover:bg-[#0e2248] text-white rounded-xl text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-cart-shopping text-[9px] sm:text-[11px]"></i>
                <span>أضف للسلة</span>
              </button>
            </div>
          ))}
        </div>
      </section>
      {/* END: LatestProductsSection */}

    </div>
  );
}
