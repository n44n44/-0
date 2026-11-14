import React, { createContext, useContext, useState, useEffect } from 'react';
import { cleanYemeniPhone, validateYemeniPhone } from '../utils/phoneValidation';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  ALL_STORES as INITIAL_STORES,
  SAMPLE_ORDERS as INITIAL_ORDERS,
  COURIER_TASKS as INITIAL_COURIER_TASKS,
  NEIGHBORHOODS_MUKALLA,
  CATEGORIES as INITIAL_CATEGORIES,
} from '../data/mockData';
import {
  getSupabaseConfig,
  getSupabaseClient,
  pushOrderToSupabase,
  fetchLiveSupabaseData,
  cleanDemoDataFromSupabase,
} from '../lib/supabaseClient';

const PlatformContext = createContext(null);

// UNIFIED DATABASE ROOT KEY IN LOCAL STORAGE
const UNIFIED_DB_KEY = 'ghaym_space_unified_db_v5';

// Helper to calculate days remaining until a given date string (e.g. '2026-11-19')
export function calculateDaysRemaining(endDateStr) {
  if (!endDateStr) return 0;
  const target = new Date(endDateStr);
  const now = new Date('2026-11-07'); // Platform base date
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Initial preloaded database state (preserving all existing authentic data)
const getInitialDatabase = () => {
  return {
    meta: {
      name: 'Ghaym Space Unified Database',
      version: '4.0.0',
      region: 'اليمن - حضرموت والمكلا',
      createdAt: '2026-11-07T12:00:00Z',
    },

    // 1. UNIFIED USERS TABLE (Multi-tenant with isolated accounts)
    users: [
      {
        id: 'usr-cust-1',
        role: 'customer',
        name: 'فاطمة صالح باوزير',
        phone: '771234567',
        email: 'fatima.bawazir@ghaym.ye',
        city: 'المكلا',
        neighborhood: 'حي الورد - المكلا',
        addresses: [
          {
            id: 'addr-1',
            title: 'المنزل - حي الورد',
            neighborhood: 'حي الورد - المكلا',
            street: 'بجانب جامع الرحمة - عمارة الأمل، شقة 4',
            phone: '771234567',
            isDefault: true,
          },
          {
            id: 'addr-2',
            title: 'مقر العمل - الشرج',
            neighborhood: 'الشرج',
            street: 'شارع المحافظ، مجمع السلام الطبي',
            phone: '771234567',
            isDefault: false,
          },
        ],
      },
      // MERCHANT 1: أميرة باحشوان (متجر وردة الأناقة)
      {
        id: 'usr-merch-1',
        role: 'merchant',
        name: 'أميرة باحشوان',
        phone: '771234567',
        email: 'amira@ghaym.ye',
        storeId: 'store-1',
        storeName: 'متجر وردة الأناقة',
        city: 'المكلا',
        neighborhood: 'حي الورد - المكلا',
        kuraimiAccount: '30129841',
        omgyAccount: 'AMQ-889021',
      },
      // MERCHANT 2: سالم سعيد باوزير (بخور وعطور المكلا)
      {
        id: 'usr-merch-2',
        role: 'merchant',
        name: 'سالم سعيد باوزير',
        phone: '772334455',
        email: 'salem@ghaym.ye',
        storeId: 'store-2',
        storeName: 'بخور وعطور المكلا',
        city: 'المكلا',
        neighborhood: 'الشرج - شارع الكورنيش',
        kuraimiAccount: '30987123',
        omgyAccount: 'AMQ-114092',
      },
      // MERCHANT 3: منى صالح الشاطري (إبداعات يدوية)
      {
        id: 'usr-merch-3',
        role: 'merchant',
        name: 'منى صالح الشاطري',
        phone: '775667788',
        email: 'muna@ghaym.ye',
        storeId: 'store-4',
        storeName: 'إبداعات يدوية',
        city: 'المكلا',
        neighborhood: 'فوه القديمة',
        kuraimiAccount: '30554129',
        omgyAccount: 'AMQ-332190',
      },
      // COURIER 1: أحمد محمد العمودي
      {
        id: 'usr-cour-1',
        role: 'courier',
        name: 'أحمد محمد العمودي',
        phone: '739812345',
        city: 'المكلا',
        vehicle: 'دراجة نارية (سكوتر ياماها)',
        plateNumber: 'حضرموت 14-8902',
        isOnline: true,
        todayEarnings: 7200,
        totalEarnings: 84600,
        totalDeliveries: 54,
        commitmentRate: 98,
        rating: 4.9,
      },
      // COURIER 2: عمر مبارك بن هلابي
      {
        id: 'usr-cour-2',
        role: 'courier',
        name: 'عمر مبارك بن هلابي',
        phone: '774556677',
        city: 'المكلا',
        vehicle: 'دراجة نارية سريعة (سوزوكي)',
        plateNumber: 'حضرموت 11-4501',
        isOnline: true,
        todayEarnings: 4800,
        totalEarnings: 62400,
        totalDeliveries: 38,
        commitmentRate: 96,
        rating: 4.8,
      },
      // PENDING MERCHANT REGISTRATION REQUEST (For Admin approval testing)
      {
        id: 'usr-merch-pending-1',
        role: 'merchant',
        status: 'pending_approval',
        name: 'عبدالله سعيد باوزير',
        phone: '773456789',
        email: 'abdullah.bawazir@ghaym.ye',
        storeId: 'store-pending-1',
        storeName: 'خزفيات وفخار تريم',
        city: 'تريم',
        neighborhood: 'السوق القديم',
        whatsapp: '773456789',
        createdAt: '2026-11-07T10:30:00Z',
      },
      // SUPER ADMIN
      {
        id: 'usr-admin-1',
        role: 'admin',
        name: 'المشرف العام لمنصة غيم سبيس',
        phone: '770000000',
        email: 'superadmin@ghaymspace.com',
        city: 'المكلا',
      },
    ],

    // 1.5 UNIFIED CATEGORIES TABLE
    categories: INITIAL_CATEGORIES.map((c, i) => ({
      id: c.id,
      name: c.name,
      count: c.count || '0 متجر',
      icon: c.icon,
      description: c.description,
      isVisible: true,
      sortOrder: i + 1,
    })),

    // 2. UNIFIED STORES TABLE
    stores: INITIAL_STORES.map((s) => {
      let ownerId = 'usr-merch-1';
      if (s.id === 'store-2') ownerId = 'usr-merch-2';
      if (s.id === 'store-4') ownerId = 'usr-merch-3';
      return { ...s, ownerId };
    }),

    // 3. UNIFIED PRODUCTS TABLE
    products: INITIAL_PRODUCTS,

    // 4. UNIFIED ORDERS TABLE (Linked with storeId and courierId)
    orders: [],

    // 5. SUBSCRIPTION PLANS TABLE (Admin Configurable)
    subscriptionPlans: [
      {
        id: 'plan-basic',
        name: 'باقة البداية للأسر المنتجة',
        price: 15000,
        currency: 'ر.ي',
        period: 'شهري',
        periodDays: 30,
        commissionRate: 5,
        features: [
          'إدارة حتى 30 منتج',
          'لوحة تحكم تاجر مستقلة',
          'استقبال الطلبات والدفع الرقمي',
          'عمولة 5% على المبيعات',
          'دعم فني عبر واتساب',
        ],
      },
      {
        id: 'plan-pro',
        name: 'باقة النمو والمتاجر المتميزة',
        price: 25000,
        currency: 'ر.ي',
        period: 'شهري',
        periodDays: 30,
        commissionRate: 3,
        popular: true,
        features: [
          'منتجات غير محدودة',
          'توليد بالذكاء الاصطناعي للمنتجات',
          'عمولة مخفضة 3% فقط',
          'شارة التوثيق الزرقاء',
          'تقارير مالية وتصدير الفواتير',
          'أولوية في نتائج البحث',
        ],
      },
      {
        id: 'plan-enterprise',
        name: 'باقة المؤسسات والحرف الكبرى',
        price: 45000,
        currency: 'ر.ي',
        period: 'شهري',
        periodDays: 30,
        commissionRate: 1.5,
        features: [
          'كل مميزات باقة النمو',
          'عمولة 1.5% فقط',
          'أولوية قصوى لمندوبي التوصيل',
          'مدير حساب شخصي مخصص',
          'ربط الحسابات البنكية المباشرة',
          'حملات تسويقية مجانية بالصفحة الرئيسية',
        ],
      },
    ],

    // 6. MERCHANT SUBSCRIPTIONS TABLE (1st Month Free Trial Policy)
    subscriptions: [
      {
        id: 'sub-store-1',
        storeId: 'store-1',
        storeName: 'متجر وردة الأناقة',
        merchantId: 'usr-merch-1',
        planId: 'plan-pro',
        planName: 'باقة النمو والمتاجر المتميزة',
        price: 25000,
        currency: 'ر.ي',
        status: 'active_trial', // شهر تجريبي مجاني نشط
        trialStartDate: '2026-10-20',
        trialEndDate: '2026-11-19',
        currentPeriodEnd: '2026-11-19',
        daysRemaining: 12,
        autoRenew: true,
      },
      {
        id: 'sub-store-2',
        storeId: 'store-2',
        storeName: 'بخور وعطور المكلا',
        merchantId: 'usr-merch-2',
        planId: 'plan-basic',
        planName: 'باقة البداية للأسر المنتجة',
        price: 15000,
        currency: 'ر.ي',
        status: 'expiring_soon', // يوشك الشهر التجريبي على الانتهاء
        trialStartDate: '2026-10-10',
        trialEndDate: '2026-11-09',
        currentPeriodEnd: '2026-11-09',
        daysRemaining: 2,
        autoRenew: true,
      },
      {
        id: 'sub-store-4',
        storeId: 'store-4',
        storeName: 'إبداعات يدوية',
        merchantId: 'usr-merch-3',
        planId: 'plan-pro',
        planName: 'باقة النمو والمتاجر المتميزة',
        price: 25000,
        currency: 'ر.ي',
        status: 'active_paid', // تم السداد للشهر الثاني
        trialStartDate: '2026-09-01',
        trialEndDate: '2026-10-01',
        currentPeriodEnd: '2026-12-05',
        daysRemaining: 28,
        autoRenew: true,
      },
    ],

    // 7. INVOICES TABLE
    invoices: [
      {
        id: 'INV-2026-001',
        invoiceNumber: '#INV-1001',
        storeId: 'store-1',
        storeName: 'متجر وردة الأناقة',
        merchantName: 'أميرة باحشوان',
        planId: 'plan-pro',
        planName: 'باقة النمو والمتاجر المتميزة',
        amount: 25000,
        currency: 'ر.ي',
        issueDate: '01 نوفمبر 2026',
        dueDate: '19 نوفمبر 2026',
        status: 'pending_payment', // مستحقة السداد بعد انتهاء الشهر التجريبي
        periodLabel: 'اشتراك شهر نوفمبر 2026',
        notes: 'تجديد الاشتراك الشهري لباقة النمو بعد انتهاء الشهر المجاني',
      },
      {
        id: 'INV-2026-002',
        invoiceNumber: '#INV-1002',
        storeId: 'store-2',
        storeName: 'بخور وعطور المكلا',
        merchantName: 'سالم سعيد باوزير',
        planId: 'plan-basic',
        planName: 'باقة البداية للأسر المنتجة',
        amount: 15000,
        currency: 'ر.ي',
        issueDate: '25 أكتوبر 2026',
        dueDate: '09 نوفمبر 2026',
        status: 'under_review', // تم رفع إيصال التحويل وبانتظار اعتماد الإدارة
        periodLabel: 'اشتراك شهر نوفمبر 2026',
        notes: 'تم رفع إشعار تحويل مصرفي عبر بنك الكريمي وبانتظار مراجعة الإدارة المالية',
      },
      {
        id: 'INV-2026-003',
        invoiceNumber: '#INV-1003',
        storeId: 'store-4',
        storeName: 'إبداعات يدوية',
        merchantName: 'منى صالح الشاطري',
        planId: 'plan-pro',
        planName: 'باقة النمو والمتاجر المتميزة',
        amount: 25000,
        currency: 'ر.ي',
        issueDate: '15 أكتوبر 2026',
        dueDate: '05 نوفمبر 2026',
        status: 'paid',
        paidAt: '05 نوفمبر 2026',
        periodLabel: 'اشتراك شهر نوفمبر 2026',
        notes: 'مسددة بالكامل عبر تحويل بنك القطيبي',
      },
    ],

    // 8. PAYMENTS & BANK TRANSFER RECEIPTS TABLE
    payments: [
      {
        id: 'PAY-8801',
        invoiceId: 'INV-2026-002',
        storeId: 'store-2',
        storeName: 'بخور وعطور المكلا',
        merchantName: 'سالم سعيد باوزير',
        amount: 15000,
        currency: 'ر.ي',
        bankId: 'bank-kuraimi',
        bankName: 'بنك الكريمي للتمويل الأصغر الإسلامي',
        senderName: 'سالم سعيد باوزير',
        senderPhone: '772334455',
        transferRef: 'KR-8910442',
        transferDate: '06 نوفمبر 2026',
        receiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        status: 'pending_verification', // بانتظار مراجعة وتأكيد الإدارة
        notes: 'تم التحويل عبر تطبيق كريمي جوال لحساب المنصة رقم 301298410',
        createdAt: '06 نوفمبر 2026 04:30 م',
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
      },
      {
        id: 'PAY-8802',
        invoiceId: 'INV-2026-003',
        storeId: 'store-4',
        storeName: 'إبداعات يدوية',
        merchantName: 'منى صالح الشاطري',
        amount: 25000,
        currency: 'ر.ي',
        bankId: 'bank-qutaibi',
        bankName: 'شركة القطيبي للصرافة والتحويلات',
        senderName: 'منى صالح الشاطري',
        senderPhone: '775667788',
        transferRef: 'QT-9021881',
        transferDate: '05 نوفمبر 2026',
        receiptImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        status: 'approved',
        notes: 'تم الإيداع النقدي بفرع خور المكلا',
        createdAt: '05 نوفمبر 2026 10:15 ص',
        reviewedBy: 'المشرف العام (admin)',
        reviewedAt: '05 نوفمبر 2026 11:00 ص',
        rejectionReason: null,
      },
    ],

    // 9. PLATFORM APPROVED YEMENI BANK ACCOUNTS (Admin Configurable)
    platformBankAccounts: [
      {
        id: 'bank-kuraimi',
        name: 'بنك الكريمي للتمويل الأصغر الإسلامي',
        accountName: 'منصة غيم سبيس للتجارة الإلكترونية',
        accountNumber: '301298410',
        iban: 'YE73000100030129841001',
        branch: 'فرع المكلا الرئيسي - حي السلام',
        currency: 'ريال يمني (ر.ي)',
        instructions: 'يمكنك التحويل الفوري عبر تطبيق كريمي جوال أو الإيداع النقدي في أي فرع وصراف آلي. يُرجى تدوين رقم الفاتورة في خانة الغرض/الملاحظات.',
        isActive: true,
      },
      {
        id: 'bank-amqi',
        name: 'شركة العمقي وإخوانه للصرافة',
        accountName: 'غيم سبيس - حضرموت',
        accountNumber: '25401988',
        iban: 'YE-AMQ-25401988',
        branch: 'فرع الشرج - المكلا',
        currency: 'ريال يمني (ر.ي)',
        instructions: 'إرسال حوالة عبر العمقي إكسبرس باسم (غيم سبيس - حضرموت) برقم الحساب أعلاه مع إرسال رقم السند والإشعار.',
        isActive: true,
      },
      {
        id: 'bank-qutaibi',
        name: 'شركة القطيبي للصرافة والتحويلات (بنك القطيبي)',
        accountName: 'منصة غيم سبيس الإلكترونية',
        accountNumber: '12098455',
        iban: 'YE-QTB-12098455',
        branch: 'فرع المكلا - خور المكلا',
        currency: 'ريال يمني (ر.ي)',
        instructions: 'سداد عبر تطبيق قطيبي لحظات أو إيداع مباشر في أي فرع من فروع القطيبي في اليمن.',
        isActive: true,
      },
      {
        id: 'bank-bindowal',
        name: 'بنك بن دول للتمويل الأصغر الإسلامي',
        accountName: 'مؤسسة غيم سبيس',
        accountNumber: '8014520',
        iban: 'YE-BDW-8014520',
        branch: 'فرع المكلا',
        currency: 'ريال يمني (ر.ي)',
        instructions: 'تحويل مصرفي أو إيداع نقدي عبر شبكة فروع بن دول في ساحل ووادي حضرموت.',
        isActive: true,
      },
    ],

    // 10. UNIFIED NOTIFICATIONS TABLE
    notifications: [
      {
        id: 'notif-1',
        title: 'طلب جديد وارد #GS-1051',
        message: 'قام العميل سالم باجابر بطلب تحفة كونكريت بحرية بقيمة 25,800 ر.ي.',
        time: 'منذ 10 دقائق',
        unread: true,
        type: 'order',
        role: 'merchant',
      },
      {
        id: 'notif-2',
        title: 'شحنة جاهزة للاستلام #GS-1050',
        message: 'قام متجر وردة الأناقة بتجهيز طرد في حي الورد جاهز للاستلام والتوصيل.',
        time: 'منذ 20 دقيقة',
        unread: true,
        type: 'delivery',
        role: 'courier',
      },
      {
        id: 'notif-3',
        title: 'إيصال سداد جديد بانتظار المراجعة #PAY-8801',
        message: 'قام متجر "بخور وعطور المكلا" برفع إيصال سداد اشتراك بقيمة 15,000 ر.ي عبر الكريمي.',
        time: 'منذ ساعة',
        unread: true,
        type: 'finance',
        role: 'admin',
      },
    ],

    // 11. AUDIT LOG (Transparency & Admin Monitoring)
    auditLogs: [
      {
        id: 'log-1',
        action: 'INIT_SYSTEM_V4',
        actor: 'النظام الموحد',
        role: 'system',
        timestamp: '07 نوفمبر 2026 12:00 م',
        details: 'تشغيل قاعدة البيانات المشتركة v4 بنظام العزل التام للتجار والمندوبين والاشتراكات البنكية.',
      },
    ],

    // 12. SYSTEM SETTINGS
    settings: {
      platformCommissionRate: 5,
      freeTrialDays: 30, // الشهر الأول مجاني
      baseDeliveryFee: 1200,
      minCodAmount: 20000,
      currency: 'ر.ي',
      region: 'حضرموت / المكلا',
    },
  };
};

export function PlatformProvider({ children }) {
  // Load unified database from localStorage or initialize
  const [db, setDb] = useState(() => {
    try {
      const saved = localStorage.getItem(UNIFIED_DB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.users &&
          parsed.products &&
          parsed.orders &&
          parsed.subscriptionPlans &&
          parsed.platformBankAccounts
        ) {
          if (!parsed.categories || parsed.categories.length === 0) {
            parsed.categories = INITIAL_CATEGORIES.map((c, i) => ({
              id: c.id,
              name: c.name,
              count: c.count || '0 متجر',
              icon: c.icon,
              description: c.description,
              isVisible: true,
              sortOrder: i + 1,
            }));
          }
          if (parsed.isProductionMode === undefined) {
            parsed.isProductionMode = false;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading unified DB from storage:', e);
    }
    return getInitialDatabase();
  });

  // Save changes to localStorage on every update
  useEffect(() => {
    try {
      localStorage.setItem(UNIFIED_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Error saving unified DB to storage:', e);
    }
  }, [db]);

  // Synchronize across multiple browser tabs / windows in real-time!
  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === UNIFIED_DB_KEY && e.newValue) {
        try {
          const freshDb = JSON.parse(e.newValue);
          setDb(freshDb);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  // Supabase live connection state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(() => getSupabaseConfig().isConfigured);

  const refreshFromSupabase = async () => {
    try {
      const live = await fetchLiveSupabaseData();
      if (live && (live.stores?.length > 0 || live.products?.length > 0)) {
        setDb((prev) => ({
          ...prev,
          stores: live.stores && live.stores.length > 0 ? live.stores.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category || '',
            rating: Number(s.rating) || 4.9,
            reviewsCount: Number(s.reviews_count || 0),
            location: s.location || 'المكلا، حضرموت',
            phone: s.phone || '773058707',
            cover: s.cover_url || prev.stores.find((x) => x.id === s.id)?.cover || '',
            avatar: s.avatar_url || prev.stores.find((x) => x.id === s.id)?.avatar || '',
            description: s.description || '',
            isVerified: Boolean(s.is_verified ?? true),
          })) : prev.stores,
          products: live.products && live.products.length > 0 ? live.products.map((p) => ({
            id: p.id,
            storeId: p.store_id || 'store-1',
            name: p.name,
            category: p.category || '',
            price: Number(p.price) || 0,
            originalPrice: Number(p.original_price || p.price || 0),
            rating: Number(p.rating) || 4.9,
            reviewsCount: Number(p.reviews_count || 0),
            image: p.image_url || prev.products.find((x) => x.id === p.id)?.image || '',
            badge: p.badge || null,
            description: p.description || '',
            inStock: Number(p.in_stock || 10),
          })) : prev.products,
          orders: live.orders && live.orders.length > 0 ? live.orders.map((o) => ({
            id: o.id,
            orderNumber: o.order_number || `#${o.id}`,
            customerName: o.customer_name,
            phone: o.customer_phone,
            address: o.delivery_address || o.neighborhood || 'المكلا',
            storeId: o.store_id,
            storeName: o.store_name,
            total: Number(o.total_amount || 0),
            subtotal: Number(o.subtotal || o.total_amount || 0),
            shippingFee: Number(o.shipping_fee || 1200),
            paymentMethod: o.payment_method || 'كاش عند الاستلام',
            paymentRef: o.payment_ref,
            status: o.status || 'pending',
            statusLabel: o.status_label || 'قيد المراجعة ⏳',
            items: o.items || [],
            notes: o.notes || '',
            date: o.created_at ? new Date(o.created_at).toLocaleDateString('ar-YE') : 'اليوم',
          })) : prev.orders,
        }));
        setIsSupabaseConnected(true);
      }
    } catch (err) {
      console.warn('Could not sync live data from Supabase:', err);
    }
  };

  useEffect(() => {
    if (getSupabaseConfig().isConfigured) {
      refreshFromSupabase();
    }
  }, []);

  // 1. Current Active Portal: 'marketplace' | 'merchant' | 'courier' | 'admin'
  const [currentPortal, setCurrentPortal] = useState(() => {
    const raw = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
    const hash = raw.split('/')[0];
    if (hash === 'delivery' || hash === 'courier' || hash === 'rider') return 'courier';
    if (hash === 'merchant') return 'merchant';
    if (hash === 'admin') return 'admin';
    return 'marketplace';
  });

  // Hash-based portal routing (Supports /merchant, /delivery, /admin, /)
  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace('#/', '').replace('#', '').toLowerCase();
      const hash = raw.split('/')[0];
      if (hash === 'delivery' || hash === 'courier' || hash === 'rider') {
        setCurrentPortal('courier');
      } else if (hash === 'merchant') {
        setCurrentPortal('merchant');
      } else if (hash === 'admin') {
        setCurrentPortal('admin');
      } else if (!hash || hash === 'marketplace') {
        setCurrentPortal('marketplace');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchPortal = (portal) => {
    const target = portal === 'delivery' ? 'courier' : portal;
    setCurrentPortal(target);
    window.location.hash = target === 'marketplace' ? '/' : `/${target}`;
  };

  // 2. Active Session Accounts (Multi-Tenant Isolation)
  const [activeMerchantId, setActiveMerchantId] = useState(() => {
    return localStorage.getItem('ghaym_active_merchant_id') || 'usr-merch-1';
  });

  const [activeCourierId, setActiveCourierId] = useState(() => {
    return localStorage.getItem('ghaym_active_courier_id') || 'usr-cour-1';
  });

  const [activeCustomerId, setActiveCustomerId] = useState(() => {
    return localStorage.getItem('ghaym_active_customer_id') || null;
  });

  const switchMerchantAccount = (merchantUserId) => {
    setActiveMerchantId(merchantUserId);
    localStorage.setItem('ghaym_active_merchant_id', merchantUserId);
  };

  const switchCourierAccount = (courierUserId) => {
    setActiveCourierId(courierUserId);
    localStorage.setItem('ghaym_active_courier_id', courierUserId);
  };

  const switchCustomerAccount = (customerUserId) => {
    setActiveCustomerId(customerUserId);
    if (customerUserId) {
      localStorage.setItem('ghaym_active_customer_id', customerUserId);
    } else {
      localStorage.removeItem('ghaym_active_customer_id');
    }
  };

  // Resolve active persona objects
  const customerUser = activeCustomerId
    ? (db.users.find((u) => u.id === activeCustomerId && u.role === 'customer') || null)
    : null;
  const merchantsList = db.users.filter((u) => u.role === 'merchant');
  const couriersList = db.users.filter((u) => u.role === 'courier');
  const adminUser = db.users.find((u) => u.role === 'admin') || db.users[db.users.length - 1];

  const currentMerchantUser =
    merchantsList.find((m) => m.id === activeMerchantId) || merchantsList[0];

  const currentMerchantStore =
    db.stores.find((s) => s.id === currentMerchantUser?.storeId) || db.stores[0];

  const currentCourierUser =
    couriersList.find((c) => c.id === activeCourierId) || couriersList[0];

  // ================= STRICT MULTI-TENANT ISOLATED DATA VIEWS ================= //

  // A. Merchant Isolated Views:
  const merchantProducts = db.products.filter(
    (p) => p.storeId === currentMerchantStore?.id
  );

  const merchantOrders = db.orders.filter(
    (o) => o.storeId === currentMerchantStore?.id
  );

  const merchantSubscription =
    db.subscriptions?.find((s) => s.storeId === currentMerchantStore?.id) || {
      id: `sub-${currentMerchantStore?.id}`,
      storeId: currentMerchantStore?.id,
      storeName: currentMerchantStore?.name,
      planId: 'plan-basic',
      planName: 'باقة البداية للأسر المنتجة',
      price: 15000,
      currency: 'ر.ي',
      status: 'active_trial',
      trialStartDate: '2026-10-25',
      trialEndDate: '2026-11-24',
      currentPeriodEnd: '2026-11-24',
      daysRemaining: 17,
      autoRenew: true,
    };

  const merchantInvoices = (db.invoices || []).filter(
    (i) => i.storeId === currentMerchantStore?.id
  );

  const merchantPayments = (db.payments || []).filter(
    (p) => p.storeId === currentMerchantStore?.id
  );

  // B. Courier Isolated Views:
  const courierDeliveries = db.orders.filter(
    (o) => o.courierId === currentCourierUser?.id
  );

  const availablePickupOrders = db.orders.filter(
    (o) => o.status === 'ready_for_pickup'
  );

  // RBAC Permission Checker
  const checkPermission = (action, role = null) => {
    const effectiveRole =
      role ||
      (currentPortal === 'merchant'
        ? 'merchant'
        : currentPortal === 'courier'
        ? 'courier'
        : currentPortal === 'admin'
        ? 'admin'
        : 'customer');

    switch (action) {
      case 'ADD_PRODUCT':
      case 'EDIT_PRODUCT':
      case 'DELETE_PRODUCT':
      case 'UPDATE_INVENTORY':
      case 'SUBMIT_PAYMENT':
        return ['merchant', 'admin'].includes(effectiveRole);

      case 'PREPARE_ORDER':
      case 'MARK_ORDER_READY':
        return ['merchant', 'admin'].includes(effectiveRole);

      case 'ACCEPT_ORDER':
      case 'PICKUP_ORDER':
      case 'DELIVER_ORDER':
        return ['courier', 'admin'].includes(effectiveRole);

      case 'APPROVE_PAYMENT':
      case 'REJECT_PAYMENT':
      case 'CREATE_INVOICE':
      case 'MANAGE_PLANS':
      case 'MANAGE_BANKS':
      case 'VERIFY_STORE':
      case 'VIEW_AUDIT_LOGS':
        return effectiveRole === 'admin';

      default:
        return true;
    }
  };

  // Internal Audit Log Appender
  const addAuditLog = (action, actor, role, details) => {
    return {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      actor,
      role,
      timestamp: new Intl.DateTimeFormat('ar-YE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
      details,
    };
  };

  // ================= UNIFIED DATABASE OPERATIONS ================= //

  // --- A. PRODUCTS (Scoped to Active Merchant) ---
  const addProduct = (prodData) => {
    const newProd = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviews: 1,
      inStock: Number(prodData.inStock) || 15,
      storeId: currentMerchantStore?.id || 'store-1',
      storeName: currentMerchantStore?.name || 'متجر وردة الأناقة',
      badge: 'جديد ✨',
      description: prodData.description || 'منتج يدوي مميز محضر بأيدي أسر منتجة وحرفيين في المكلا.',
      ...prodData,
    };

    setDb((prev) => ({
      ...prev,
      products: [newProd, ...prev.products],
      auditLogs: [
        addAuditLog(
          'ADD_PRODUCT',
          currentMerchantUser?.name || 'التاجر',
          'merchant',
          `إضافة منتج "${newProd.name}" لـ ${newProd.storeName} بسعر ${newProd.price?.toLocaleString()} ر.ي.`
        ),
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `منتج جديد في السوق ✨`,
          message: `أضاف ${newProd.storeName} منتج "${newProd.name}" إلى المنصة الرئيسية.`,
          time: 'الآن',
          unread: true,
          type: 'product',
          role: 'all',
        },
        ...prev.notifications,
      ],
    }));

    return newProd;
  };

  const updateProduct = (prodId, updates) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === prodId ? { ...p, ...updates } : p)),
      auditLogs: [
        addAuditLog(
          'UPDATE_PRODUCT',
          currentMerchantUser?.name || 'التاجر',
          'merchant',
          `تحديث بيانات المنتج #${prodId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const deleteProduct = (prodId) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== prodId),
      auditLogs: [
        addAuditLog(
          'DELETE_PRODUCT',
          currentMerchantUser?.name || 'التاجر',
          'merchant',
          `حذف المنتج #${prodId} من قاعدة البيانات.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const updateProductStock = (prodId, newStock) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === prodId ? { ...p, inStock: Number(newStock) } : p
      ),
    }));
  };

  // --- B. STORE PROFILE UPDATES (Scoped to Active Merchant) ---
  const updateMerchantStore = (updates) => {
    const targetStoreId = currentMerchantStore?.id || 'store-1';
    setDb((prev) => ({
      ...prev,
      stores: prev.stores.map((s) => (s.id === targetStoreId ? { ...s, ...updates } : s)),
      auditLogs: [
        addAuditLog(
          'UPDATE_STORE_PROFILE',
          currentMerchantUser?.name || 'التاجر',
          'merchant',
          `تحديث بيانات المتجر: ${updates.name || targetStoreId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const toggleStoreVerification = (storeId) => {
    setDb((prev) => {
      let updatedStoreName = '';
      let newVerifiedStatus = false;
      const updatedStores = prev.stores.map((s) => {
        if (s.id === storeId) {
          updatedStoreName = s.name;
          newVerifiedStatus = !s.verified;
          return { ...s, verified: !s.verified };
        }
        return s;
      });

      return {
        ...prev,
        stores: updatedStores,
        auditLogs: [
          addAuditLog(
            'TOGGLE_STORE_VERIFICATION',
            adminUser?.name || 'المشرف العام',
            'admin',
            `${newVerifiedStatus ? 'توثيق' : 'إلغاء توثيق'} متجر "${updatedStoreName}".`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // --- C. ORDERS LIFECYCLE ---
  const placeOrder = (orderData) => {
    const orderId = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      orderNumber: `#${orderId.replace('GS-', '')}`,
      date: new Intl.DateTimeFormat('ar-YE', { dateStyle: 'medium' }).format(new Date()),
      time: new Intl.DateTimeFormat('ar-YE', { timeStyle: 'short' }).format(new Date()),
      status: 'pending',
      statusLabel: 'قيد التجهيز والتغليف ⏳',
      courierId: null,
      courierName: null,
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
    };

    setDb((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      auditLogs: [
        addAuditLog(
          'PLACE_ORDER',
          newOrder.customerName || 'عميل',
          'customer',
          `إنشاء طلب جديد #${newOrder.id} بقيمة ${newOrder.total?.toLocaleString()} ر.ي.`
        ),
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `طلب جديد وارد #${newOrder.id}`,
          message: `طلب جديد من ${newOrder.customerName} بقيمة ${newOrder.total?.toLocaleString()} ر.ي لـ ${newOrder.storeName}.`,
          time: 'الآن',
          unread: true,
          type: 'order',
          role: 'merchant',
        },
        ...prev.notifications,
      ],
    }));

    // Sync order to Supabase in background if connected
    pushOrderToSupabase(newOrder).catch((e) => console.warn('Supabase sync order warning:', e));

    return newOrder;
  };

  const markOrderReadyForPickup = (orderId) => {
    setDb((prev) => {
      let targetOrder = null;
      const updatedOrders = prev.orders.map((o) => {
        if (o.id === orderId) {
          targetOrder = o;
          return {
            ...o,
            status: 'ready_for_pickup',
            statusLabel: 'جاهز لاستلام المندوب 📦',
          };
        }
        return o;
      });

      return {
        ...prev,
        orders: updatedOrders,
        auditLogs: [
          addAuditLog(
            'ORDER_READY_FOR_PICKUP',
            currentMerchantUser?.name || 'التاجر',
            'merchant',
            `التاجر جهز الطلب #${orderId} وهو متاح الآن لمندوبي التوصيل بالمكلا.`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `طلبية جاهزة للاستلام #${orderId} 🛵`,
            message: `طرد جاهز للتوصيل إلى ${targetOrder?.address || 'المكلا'}، رسوم التوصيل: 1,200 ر.ي.`,
            time: 'الآن',
            unread: true,
            type: 'delivery',
            role: 'courier',
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const courierAcceptOrder = (orderId) => {
    setDb((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'accepted',
              statusLabel: 'تم قبول الطلب - المندوب متوجه للمتجر 🛵',
              courierId: currentCourierUser?.id || 'usr-cour-1',
              courierName: currentCourierUser?.name || 'أحمد محمد العمودي',
              courierPhone: currentCourierUser?.phone || '739812345',
            }
          : o
      ),
      auditLogs: [
        addAuditLog(
          'COURIER_ACCEPT_ORDER',
          currentCourierUser?.name || 'المندوب',
          'courier',
          `المندوب ${currentCourierUser?.name} قبل مهمة توصيل الطلب #${orderId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const courierConfirmPickup = (orderId) => {
    setDb((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'on_the_way',
              statusLabel: 'قيد التوصيل في الطريق إليك 🛵',
            }
          : o
      ),
      auditLogs: [
        addAuditLog(
          'COURIER_CONFIRM_PICKUP',
          currentCourierUser?.name || 'المندوب',
          'courier',
          `المندوب استلم الطرد #${orderId} وهو في الطريق للعميل بالمكلا.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const courierCompleteDelivery = (orderId, enteredOtp = null) => {
    const deliveryFee = 1200;

    setDb((prev) => {
      let targetOrder = null;
      const updatedOrders = prev.orders.map((o) => {
        if (o.id === orderId) {
          targetOrder = o;
          return {
            ...o,
            status: 'delivered',
            statusLabel: 'تم التسليم بنجاح للعميل ✅',
            deliveredAt: new Intl.DateTimeFormat('ar-YE', { timeStyle: 'short' }).format(new Date()),
          };
        }
        return o;
      });

      const updatedUsers = prev.users.map((u) => {
        if (u.id === currentCourierUser?.id) {
          return {
            ...u,
            totalDeliveries: (u.totalDeliveries || 30) + 1,
            todayEarnings: (u.todayEarnings || 0) + deliveryFee,
            totalEarnings: (u.totalEarnings || 0) + deliveryFee,
          };
        }
        return u;
      });

      return {
        ...prev,
        orders: updatedOrders,
        users: updatedUsers,
        auditLogs: [
          addAuditLog(
            'COURIER_COMPLETE_DELIVERY',
            currentCourierUser?.name || 'المندوب',
            'courier',
            `تم تسليم الطلب #${orderId} بنجاح للعميل وإيداع رسوم التوصيل (${deliveryFee} ر.ي).`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `تم تسليم الطلب #${orderId} بنجاح ✅`,
            message: `استلم العميل ${targetOrder?.customerName || ''} الشحنة بنجاح في المكلا.`,
            time: 'الآن',
            unread: true,
            type: 'delivery',
            role: 'all',
          },
          ...prev.notifications,
        ],
      };
    });
  };

  // --- D. PAYMENTS & SUBSCRIPTIONS (Yemeni Banking Integration) ---

  // 1. Merchant submits proof of bank transfer
  const submitPaymentProof = (paymentData) => {
    const paymentId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment = {
      id: paymentId,
      storeId: currentMerchantStore?.id,
      storeName: currentMerchantStore?.name,
      merchantName: currentMerchantUser?.name,
      status: 'pending_verification', // "لا تعتبر مدفوعة بمجرد رفع الإيصال، بل بعد تأكيد الإدارة"
      createdAt: new Intl.DateTimeFormat('ar-YE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()),
      reviewedBy: null,
      reviewedAt: null,
      rejectionReason: null,
      ...paymentData,
    };

    setDb((prev) => {
      // Update invoice status to 'under_review'
      const updatedInvoices = (prev.invoices || []).map((inv) =>
        inv.id === paymentData.invoiceId ? { ...inv, status: 'under_review' } : inv
      );

      return {
        ...prev,
        payments: [newPayment, ...(prev.payments || [])],
        invoices: updatedInvoices,
        auditLogs: [
          addAuditLog(
            'SUBMIT_PAYMENT_PROOF',
            currentMerchantUser?.name || 'التاجر',
            'merchant',
            `التاجر رفع إيصال سداد بقيمة ${newPayment.amount?.toLocaleString()} ر.ي عبر ${newPayment.bankName} (إشعار: ${newPayment.transferRef}).`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `إيصال سداد جديد للمراجعة 💳`,
            message: `متجر "${currentMerchantStore?.name}" رفع إيصال تحويل بقيمة ${newPayment.amount?.toLocaleString()} ر.ي بانتظار التأكيد.`,
            time: 'الآن',
            unread: true,
            type: 'finance',
            role: 'admin',
          },
          ...prev.notifications,
        ],
      };
    });

    return newPayment;
  };

  // 2. Admin approves payment proof after checking bank deposit
  const adminApprovePayment = (paymentId) => {
    setDb((prev) => {
      let targetPayment = null;
      const updatedPayments = (prev.payments || []).map((p) => {
        if (p.id === paymentId) {
          targetPayment = p;
          return {
            ...p,
            status: 'approved',
            reviewedBy: adminUser?.name || 'المشرف العام',
            reviewedAt: new Intl.DateTimeFormat('ar-YE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date()),
          };
        }
        return p;
      });

      // Update invoice status to 'paid'
      const updatedInvoices = (prev.invoices || []).map((inv) => {
        if (inv.id === targetPayment?.invoiceId) {
          return {
            ...inv,
            status: 'paid',
            paidAt: new Intl.DateTimeFormat('ar-YE', { dateStyle: 'medium' }).format(new Date()),
          };
        }
        return inv;
      });

      // Extend subscription expiration by 30 days and mark active_paid
      const updatedSubscriptions = (prev.subscriptions || []).map((sub) => {
        if (sub.storeId === targetPayment?.storeId) {
          const currentEnd = new Date(sub.currentPeriodEnd || '2026-11-07');
          currentEnd.setDate(currentEnd.getDate() + 30);
          const newEndDate = currentEnd.toISOString().split('T')[0];
          return {
            ...sub,
            status: 'active_paid',
            currentPeriodEnd: newEndDate,
            daysRemaining: calculateDaysRemaining(newEndDate),
          };
        }
        return sub;
      });

      return {
        ...prev,
        payments: updatedPayments,
        invoices: updatedInvoices,
        subscriptions: updatedSubscriptions,
        auditLogs: [
          addAuditLog(
            'ADMIN_APPROVE_PAYMENT',
            adminUser?.name || 'المشرف العام',
            'admin',
            `اعتماد وتأكيد سداد العملية #${paymentId} لـ "${targetPayment?.storeName}" وتمديد الاشتراك لـ 30 يوماً إضافية.`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `تم تأكيد سداد الاشتراك بنجاح ✅`,
            message: `تم التحقق من إيصال التحويل لمتجر "${targetPayment?.storeName}" وتجديد الاشتراك لمدة 30 يوماً.`,
            time: 'الآن',
            unread: true,
            type: 'finance',
            role: 'merchant',
          },
          ...prev.notifications,
        ],
      };
    });
  };

  // 3. Admin rejects payment proof with a reason
  const adminRejectPayment = (paymentId, reason) => {
    setDb((prev) => {
      let targetPayment = null;
      const updatedPayments = (prev.payments || []).map((p) => {
        if (p.id === paymentId) {
          targetPayment = p;
          return {
            ...p,
            status: 'rejected',
            rejectionReason: reason,
            reviewedBy: adminUser?.name || 'المشرف العام',
            reviewedAt: new Intl.DateTimeFormat('ar-YE', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date()),
          };
        }
        return p;
      });

      // Reset invoice status back to 'pending_payment'
      const updatedInvoices = (prev.invoices || []).map((inv) => {
        if (inv.id === targetPayment?.invoiceId) {
          return {
            ...inv,
            status: 'pending_payment',
          };
        }
        return inv;
      });

      return {
        ...prev,
        payments: updatedPayments,
        invoices: updatedInvoices,
        auditLogs: [
          addAuditLog(
            'ADMIN_REJECT_PAYMENT',
            adminUser?.name || 'المشرف العام',
            'admin',
            `رفض إثبات السداد #${paymentId} لـ "${targetPayment?.storeName}" بسبب: ${reason}`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: `تنبيه: تعذر اعتماد إيصال السداد ❌`,
            message: `تم رفض إثبات الدفع لمتجر "${targetPayment?.storeName}" للسبب التالي: (${reason}). يرجى إعادة رفع الإيصال الصحيح.`,
            time: 'الآن',
            unread: true,
            type: 'finance',
            role: 'merchant',
          },
          ...prev.notifications,
        ],
      };
    });
  };

  // 4. Admin issues new custom invoice
  const adminCreateInvoice = (invoiceData) => {
    const invId = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newInvoice = {
      id: invId,
      invoiceNumber: `#${invId}`,
      issueDate: new Intl.DateTimeFormat('ar-YE', { dateStyle: 'medium' }).format(new Date()),
      status: 'pending_payment',
      currency: 'ر.ي',
      ...invoiceData,
    };

    setDb((prev) => ({
      ...prev,
      invoices: [newInvoice, ...(prev.invoices || [])],
      auditLogs: [
        addAuditLog(
          'CREATE_INVOICE',
          adminUser?.name || 'المشرف العام',
          'admin',
          `إصدار فاتورة جديدة #${newInvoice.invoiceNumber} بقيمة ${newInvoice.amount?.toLocaleString()} ر.ي لـ "${newInvoice.storeName}".`
        ),
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `فاتورة جديدة صادرة #${newInvoice.invoiceNumber}`,
          message: `تم إصدار فاتورة اشتراك لمتجر "${newInvoice.storeName}" بقيمة ${newInvoice.amount?.toLocaleString()} ر.ي تستحق في ${newInvoice.dueDate}.`,
          time: 'الآن',
          unread: true,
          type: 'finance',
          role: 'merchant',
        },
        ...prev.notifications,
      ],
    }));

    return newInvoice;
  };

  // 5. Admin updates subscription plans dynamically without touching code
  const adminUpdateSubscriptionPlan = (planId, updates) => {
    setDb((prev) => ({
      ...prev,
      subscriptionPlans: (prev.subscriptionPlans || []).map((p) =>
        p.id === planId ? { ...p, ...updates } : p
      ),
      auditLogs: [
        addAuditLog(
          'UPDATE_SUBSCRIPTION_PLAN',
          adminUser?.name || 'المشرف العام',
          'admin',
          `تعديل خطة الاشتراك "${planId}": السعر الجديد ${updates.price?.toLocaleString()} ر.ي.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminAddSubscriptionPlan = (planData) => {
    const newPlan = {
      id: `plan-${Date.now()}`,
      currency: 'ر.ي',
      period: 'شهري',
      periodDays: 30,
      features: [],
      ...planData,
    };
    setDb((prev) => ({
      ...prev,
      subscriptionPlans: [...(prev.subscriptionPlans || []), newPlan],
      auditLogs: [
        addAuditLog(
          'ADD_SUBSCRIPTION_PLAN',
          adminUser?.name || 'المشرف العام',
          'admin',
          `إضافة خطة اشتراك جديدة: "${newPlan.name}" بسعر ${newPlan.price?.toLocaleString()} ر.ي.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteSubscriptionPlan = (planId) => {
    setDb((prev) => ({
      ...prev,
      subscriptionPlans: (prev.subscriptionPlans || []).filter((p) => p.id !== planId),
      auditLogs: [
        addAuditLog(
          'DELETE_SUBSCRIPTION_PLAN',
          adminUser?.name || 'المشرف العام',
          'admin',
          `حذف خطة الاشتراك "${planId}".`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 6. Admin updates platform bank accounts dynamically without code
  const adminUpdateBankAccount = (bankId, updates) => {
    setDb((prev) => ({
      ...prev,
      platformBankAccounts: (prev.platformBankAccounts || []).map((b) =>
        b.id === bankId ? { ...b, ...updates } : b
      ),
      auditLogs: [
        addAuditLog(
          'UPDATE_BANK_ACCOUNT',
          adminUser?.name || 'المشرف العام',
          'admin',
          `تحديث بيانات الحساب البنكي "${bankId}": رقم الحساب ${updates.accountNumber || ''}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminAddBankAccount = (bankData) => {
    const newBank = {
      id: `bank-${Date.now()}`,
      currency: 'ريال يمني (ر.ي)',
      isActive: true,
      ...bankData,
    };
    setDb((prev) => ({
      ...prev,
      platformBankAccounts: [...(prev.platformBankAccounts || []), newBank],
      auditLogs: [
        addAuditLog(
          'ADD_BANK_ACCOUNT',
          adminUser?.name || 'المشرف العام',
          'admin',
          `إضافة حساب بنكي معتمد جديد: "${newBank.name}" برقم ${newBank.accountNumber}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminToggleBankAccount = (bankId) => {
    setDb((prev) => ({
      ...prev,
      platformBankAccounts: (prev.platformBankAccounts || []).map((b) =>
        b.id === bankId ? { ...b, isActive: !b.isActive } : b
      ),
    }));
  };

  // --- E. CUSTOMER AUTH & ADDRESSES ---
  const loginCustomer = (emailOrPhone) => {
    const existing = db.users.find(
      (u) => (u.phone === emailOrPhone || u.email === emailOrPhone) && u.role === 'customer'
    );
    if (existing) {
      setActiveCustomerId(existing.id);
      localStorage.setItem('ghaym_active_customer_id', existing.id);
      return { success: true, user: existing };
    }
    const newUser = {
      id: `usr-cust-${Date.now()}`,
      role: 'customer',
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'عميل غيم سبيس',
      phone: emailOrPhone.includes('@') ? '771234567' : emailOrPhone,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@ghaym.ye',
      city: 'المكلا',
      neighborhood: 'حي الورد - المكلا',
      addresses: [],
    };
    setDb((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    setActiveCustomerId(newUser.id);
    localStorage.setItem('ghaym_active_customer_id', newUser.id);
    return { success: true, user: newUser };
  };

  const registerCustomer = (userData) => {
    const newUser = {
      id: `usr-cust-${Date.now()}`,
      role: 'customer',
      name: userData.name,
      phone: userData.phone,
      email: userData.email || `${userData.phone}@ghaym.ye`,
      city: userData.city || 'المكلا',
      neighborhood: userData.neighborhood || 'حي الورد - المكلا',
      addresses: [
        {
          id: `addr-${Date.now()}`,
          title: 'عنوان التوصيل الرئيسي',
          neighborhood: userData.neighborhood || 'حي الورد - المكلا',
          street: userData.street || 'شارع رئيسي',
          phone: userData.phone,
          isDefault: true,
        },
      ],
    };
    setDb((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      auditLogs: [
        addAuditLog(
          'REGISTER_CUSTOMER',
          newUser.name,
          'customer',
          `تسجيل حساب عميل جديد: ${newUser.name} (${newUser.phone}).`
        ),
        ...prev.auditLogs,
      ],
    }));
    setActiveCustomerId(newUser.id);
    localStorage.setItem('ghaym_active_customer_id', newUser.id);
    return { success: true, user: newUser };
  };

  const logoutCustomer = () => {
    setActiveCustomerId(null);
    localStorage.removeItem('ghaym_active_customer_id');
  };

  const updateCustomerProfile = (updates) => {
    if (!customerUser) return;
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.id === customerUser.id ? { ...u, ...updates } : u)),
    }));
  };

  const addCustomerAddress = (newAddr) => {
    if (!customerUser) return;
    const addr = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: (customerUser?.addresses?.length || 0) === 0,
    };
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === customerUser.id
          ? { ...u, addresses: [...(u.addresses || []), addr] }
          : u
      ),
    }));
  };

  const deleteCustomerAddress = (addrId) => {
    if (!customerUser) return;
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === customerUser.id
          ? { ...u, addresses: (u.addresses || []).filter((a) => a.id !== addrId) }
          : u
      ),
    }));
  };

  // --- F. COURIER ACTIONS ---
  const toggleCourierOnline = () => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentCourierUser?.id ? { ...u, isOnline: !u.isOnline } : u
      ),
    }));
  };

  const updateCourierProfile = (updates) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentCourierUser?.id ? { ...u, ...updates } : u
      ),
    }));
  };


  // ================= ADMIN & MERCHANT ONBOARDING & CRUD FUNCTIONS ================= //

  // 1. Merchant Onboarding & Self-Registration
  const registerMerchant = (formData) => {
    const newUserId = `usr-merch-${Date.now()}`;
    const newStoreId = `store-${Date.now()}`;
    const cleanPhone = cleanYemeniPhone(formData.phone);
    const cleanWhatsapp = cleanYemeniPhone(formData.whatsapp || formData.phone);

    const bankName = formData.bankName || 'الكريمي إكسبرس (كريمي جوال)';
    const bankAccount = formData.bankAccount || '';
    const kuraimiAccount = bankName.includes('كريمي') ? bankAccount : (formData.kuraimiAccount || '');
    const omgyAccount = bankName.includes('عمقي') ? bankAccount : (formData.omgyAccount || '');
    const qutaibiAccount = bankName.includes('قطيبي') ? bankAccount : (formData.qutaibiAccount || '');
    const dowalAccount = bankName.includes('دول') ? bankAccount : (formData.dowalAccount || '');

    const newMerchantUser = {
      id: newUserId,
      role: 'merchant',
      status: 'pending_approval',
      name: formData.name || formData.ownerName,
      phone: cleanPhone,
      email: formData.email,
      password: formData.password || '******',
      city: formData.city || 'المكلا',
      neighborhood: formData.neighborhood || 'حضرموت',
      whatsapp: cleanWhatsapp,
      storeId: newStoreId,
      storeName: formData.storeName,
      bankName,
      bankAccount,
      kuraimiAccount,
      omgyAccount,
      qutaibiAccount,
      dowalAccount,
      createdAt: new Date().toISOString(),
    };

    const newStore = {
      id: newStoreId,
      ownerId: newUserId,
      name: formData.storeName,
      category: formData.category || 'صناعات يدوية',
      description: formData.description || 'متجر جديد في منصة غيم سبيس.',
      logo: formData.logo || '/logo.jpg',
      image: formData.logo || '/logo.jpg',
      cover: formData.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      coverImage: formData.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      city: formData.city || 'المكلا',
      neighborhood: formData.neighborhood || 'حضرموت',
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      bankName,
      bankAccount,
      kuraimiAccount,
      omgyAccount,
      qutaibiAccount,
      dowalAccount,
      rating: 5.0,
      isVerified: false,
      isApproved: false,
      status: 'pending',
      productsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };

    const trialSub = {
      id: `sub-trial-${Date.now()}`,
      merchantId: newUserId,
      storeId: newStoreId,
      storeName: formData.storeName,
      planId: 'plan-basic',
      planName: 'الباقة الأساسية (تجريبية مجانية 30 يوماً)',
      status: 'trial',
      price: 0,
      billingCycle: 'monthly',
      startDate: '2026-11-07',
      expiresAt: '2026-12-07',
      daysRemaining: 30,
      paymentStatus: 'trial_active',
      autoRenew: false,
      receiptUrl: null,
      notes: 'شهر تجريبي مجاني ترحيبي للأسر المنتجة والحرفيين عند التسجيل الأول',
    };

    setDb((prev) => ({
      ...prev,
      users: [newMerchantUser, ...prev.users],
      stores: [newStore, ...prev.stores],
      subscriptions: [trialSub, ...(prev.subscriptions || [])],
      auditLogs: [
        addAuditLog(
          'REGISTER_MERCHANT',
          newMerchantUser.name,
          'merchant',
          `تسجيل تاجر جديد "${newMerchantUser.name}" لمتجر "${newStore.name}" بانتظار اعتماد الإدارة.`
        ),
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: `طلب انضمام متجر جديد 🏪`,
          message: `قدّم "${newMerchantUser.name}" طلباً لافتتاح متجر "${newStore.name}" (${newStore.category}) في ${newStore.city}.`,
          time: 'الآن',
          unread: true,
          type: 'merchant_approval',
          role: 'admin',
        },
        ...prev.notifications,
      ],
    }));

    setActiveMerchantId(newUserId);
    localStorage.setItem('ghaym_active_merchant_id', newUserId);
    setCurrentPortal('merchant');
    window.location.hash = '#/merchant/dashboard';

    return { success: true, user: newMerchantUser, store: newStore };
  };

  const adminApproveMerchant = (merchantId) => {
    setDb((prev) => {
      const user = prev.users.find((u) => u.id === merchantId);
      const storeId = user?.storeId;
      return {
        ...prev,
        users: prev.users.map((u) => (u.id === merchantId ? { ...u, status: 'active' } : u)),
        stores: prev.stores.map((s) =>
          s.ownerId === merchantId || s.id === storeId
            ? { ...s, status: 'active', isApproved: true, isVerified: true }
            : s
        ),
        auditLogs: [
          addAuditLog(
            'APPROVE_MERCHANT',
            'المشرف العام',
            'admin',
            `الموافقة واعتماد متجر التاجر "${user?.name || merchantId}".`
          ),
          ...prev.auditLogs,
        ],
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'تم اعتماد متجرك بنجاح 🎉',
            message: `تهانينا ${user?.name}، تم اعتماد متجرك رسميًا في غيم سبيس وبات بإمكانك البيع وعرض المنتجات!`,
            time: 'الآن',
            unread: true,
            type: 'approval',
            role: 'merchant',
            targetUserId: merchantId,
          },
          ...prev.notifications,
        ],
      };
    });
  };

  const adminRejectMerchant = (merchantId, reason = 'لم يستوفِ الشروط المحددة') => {
    setDb((prev) => {
      const user = prev.users.find((u) => u.id === merchantId);
      const storeId = user?.storeId;
      return {
        ...prev,
        users: prev.users.map((u) =>
          u.id === merchantId ? { ...u, status: 'rejected', rejectionReason: reason } : u
        ),
        stores: prev.stores.map((s) =>
          s.ownerId === merchantId || s.id === storeId
            ? { ...s, status: 'rejected', rejectionReason: reason }
            : s
        ),
        auditLogs: [
          addAuditLog(
            'REJECT_MERCHANT',
            'المشرف العام',
            'admin',
            `رفض طلب تسجيل التاجر "${user?.name || merchantId}" بسبب: ${reason}.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const adminAddMerchant = (data) => {
    const newUserId = `usr-merch-${Date.now()}`;
    const newStoreId = `store-${Date.now()}`;
    const cleanPhone = cleanYemeniPhone(data.phone);

    const newMerchant = {
      id: newUserId,
      role: 'merchant',
      status: 'active',
      name: data.name,
      phone: cleanPhone,
      email: data.email || `${cleanPhone}@ghaym.ye`,
      city: data.city || 'المكلا',
      neighborhood: data.neighborhood || 'حضرموت',
      whatsapp: cleanYemeniPhone(data.whatsapp || data.phone),
      storeId: newStoreId,
      storeName: data.storeName,
      createdAt: new Date().toISOString(),
    };

    const newStore = {
      id: newStoreId,
      ownerId: newUserId,
      name: data.storeName,
      category: data.category || 'صناعات يدوية',
      description: data.description || 'متجر معتمد في منصة غيم سبيس.',
      logo: data.logo || '/logo.jpg',
      image: data.logo || '/logo.jpg',
      cover: data.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      coverImage: data.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      city: data.city || 'المكلا',
      neighborhood: data.neighborhood || 'حضرموت',
      phone: cleanPhone,
      rating: 5.0,
      isVerified: true,
      isApproved: true,
      status: 'active',
      productsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setDb((prev) => ({
      ...prev,
      users: [newMerchant, ...prev.users],
      stores: [newStore, ...prev.stores],
      auditLogs: [
        addAuditLog(
          'ADD_MERCHANT',
          'المشرف العام',
          'admin',
          `إضافة التاجر الجديد "${newMerchant.name}" ومتجره "${newStore.name}".`
        ),
        ...prev.auditLogs,
      ],
    }));

    return { user: newMerchant, store: newStore };
  };

  const adminUpdateMerchant = (merchantId, updates) => {
    setDb((prev) => {
      const cleanUpdates = { ...updates };
      if (cleanUpdates.phone) cleanUpdates.phone = cleanYemeniPhone(cleanUpdates.phone);
      if (cleanUpdates.whatsapp) cleanUpdates.whatsapp = cleanYemeniPhone(cleanUpdates.whatsapp);

      const user = prev.users.find((u) => u.id === merchantId);
      const storeId = user?.storeId;

      return {
        ...prev,
        users: prev.users.map((u) => (u.id === merchantId ? { ...u, ...cleanUpdates } : u)),
        stores: prev.stores.map((s) => {
          if (s.ownerId === merchantId || s.id === storeId) {
            return {
              ...s,
              name: cleanUpdates.storeName || s.name,
              phone: cleanUpdates.phone || s.phone,
              whatsapp: cleanUpdates.whatsapp || s.whatsapp,
              city: cleanUpdates.city || s.city,
            };
          }
          return s;
        }),
        auditLogs: [
          addAuditLog(
            'UPDATE_MERCHANT',
            'المشرف العام',
            'admin',
            `تحديث بيانات التاجر #${merchantId}.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const adminToggleMerchantStatus = (merchantId) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === merchantId
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      ),
      auditLogs: [
        addAuditLog(
          'TOGGLE_MERCHANT_STATUS',
          'المشرف العام',
          'admin',
          `تغيير حالة التاجر #${merchantId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteMerchant = (merchantId) => {
    setDb((prev) => {
      const user = prev.users.find((u) => u.id === merchantId);
      const storeId = user?.storeId;
      return {
        ...prev,
        users: prev.users.filter((u) => u.id !== merchantId),
        stores: prev.stores.filter((s) => s.ownerId !== merchantId && s.id !== storeId),
        products: prev.products.filter((p) => p.storeId !== storeId),
        auditLogs: [
          addAuditLog(
            'DELETE_MERCHANT',
            'المشرف العام',
            'admin',
            `حذف التاجر #${merchantId} ومتجره.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // 2. Courier Management CRUD
  const adminAddCourier = (data) => {
    const newId = `usr-cour-${Date.now()}`;
    const cleanPhone = cleanYemeniPhone(data.phone);
    const newCourier = {
      id: newId,
      role: 'courier',
      status: 'active',
      name: data.name,
      phone: cleanPhone,
      email: data.email || `${cleanPhone}@ghaym.ye`,
      city: data.city || 'المكلا',
      neighborhood: data.neighborhood || 'حي الورد',
      vehicleType: data.vehicleType || 'دراجة نارية',
      plateNumber: data.plateNumber || '12405 / حضرموت',
      isOnline: true,
      todayEarnings: 0,
      totalEarnings: 0,
      totalDeliveries: 0,
      commitmentRate: 100,
      rating: 5.0,
      createdAt: new Date().toISOString(),
    };
    setDb((prev) => ({
      ...prev,
      users: [...prev.users, newCourier],
      auditLogs: [
        addAuditLog(
          'ADD_COURIER',
          'المشرف العام',
          'admin',
          `إضافة مندوب توصيل جديد: "${newCourier.name}".`
        ),
        ...prev.auditLogs,
      ],
    }));
    return newCourier;
  };

  const adminUpdateCourier = (courierId, updates) => {
    setDb((prev) => {
      const cleanUpdates = { ...updates };
      if (cleanUpdates.phone) cleanUpdates.phone = cleanYemeniPhone(cleanUpdates.phone);
      return {
        ...prev,
        users: prev.users.map((u) => (u.id === courierId ? { ...u, ...cleanUpdates } : u)),
        auditLogs: [
          addAuditLog(
            'UPDATE_COURIER',
            'المشرف العام',
            'admin',
            `تحديث بيانات المندوب #${courierId}.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const adminToggleCourierStatus = (courierId) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === courierId
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      ),
      auditLogs: [
        addAuditLog(
          'TOGGLE_COURIER_STATUS',
          'المشرف العام',
          'admin',
          `تغيير حالة المندوب #${courierId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteCourier = (courierId) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== courierId),
      auditLogs: [
        addAuditLog(
          'DELETE_COURIER',
          'المشرف العام',
          'admin',
          `حذف المندوب #${courierId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 3. Categories Management CRUD
  const adminAddCategory = (catData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: catData.name,
      count: '0 متجر',
      icon: catData.icon || 'vase',
      description: catData.description || '',
      isVisible: catData.isVisible !== false,
      sortOrder: (db.categories?.length || 0) + 1,
    };
    setDb((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), newCat],
      auditLogs: [
        addAuditLog(
          'ADD_CATEGORY',
          'المشرف العام',
          'admin',
          `إضافة تصنيف جديد: "${newCat.name}".`
        ),
        ...prev.auditLogs,
      ],
    }));
    return newCat;
  };

  const adminUpdateCategory = (catId, updates) => {
    setDb((prev) => ({
      ...prev,
      categories: (prev.categories || []).map((c) =>
        c.id === catId ? { ...c, ...updates } : c
      ),
      auditLogs: [
        addAuditLog(
          'UPDATE_CATEGORY',
          'المشرف العام',
          'admin',
          `تحديث بيانات التصنيف #${catId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteCategory = (catId) => {
    setDb((prev) => ({
      ...prev,
      categories: (prev.categories || []).filter((c) => c.id !== catId),
      auditLogs: [
        addAuditLog(
          'DELETE_CATEGORY',
          'المشرف العام',
          'admin',
          `حذف التصنيف #${catId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 4. Stores Management in Admin
  const adminAddStore = (storeData) => {
    const newStore = {
      id: `store-${Date.now()}`,
      ownerId: storeData.ownerId || 'usr-admin-1',
      name: storeData.name,
      category: storeData.category || 'صناعات يدوية',
      description: storeData.description || '',
      logo: storeData.logo || '/logo.jpg',
      image: storeData.logo || '/logo.jpg',
      cover: storeData.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      coverImage: storeData.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      city: storeData.city || 'المكلا',
      neighborhood: storeData.neighborhood || 'حضرموت',
      phone: cleanYemeniPhone(storeData.phone),
      whatsapp: cleanYemeniPhone(storeData.whatsapp || storeData.phone),
      rating: 5.0,
      isVerified: true,
      isApproved: true,
      status: 'active',
      productsCount: 0,
      salesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setDb((prev) => ({
      ...prev,
      stores: [newStore, ...prev.stores],
      auditLogs: [
        addAuditLog(
          'ADD_STORE',
          'المشرف العام',
          'admin',
          `إضافة متجر جديد: "${newStore.name}".`
        ),
        ...prev.auditLogs,
      ],
    }));
    return newStore;
  };

  const adminUpdateStore = (storeId, updates) => {
    setDb((prev) => ({
      ...prev,
      stores: prev.stores.map((s) => (s.id === storeId ? { ...s, ...updates } : s)),
      auditLogs: [
        addAuditLog(
          'UPDATE_STORE',
          'المشرف العام',
          'admin',
          `تحديث بيانات المتجر #${storeId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteStore = (storeId) => {
    setDb((prev) => ({
      ...prev,
      stores: prev.stores.filter((s) => s.id !== storeId),
      products: prev.products.filter((p) => p.storeId !== storeId),
      auditLogs: [
        addAuditLog(
          'DELETE_STORE',
          'المشرف العام',
          'admin',
          `حذف المتجر #${storeId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminToggleStoreStatus = (storeId) => {
    setDb((prev) => ({
      ...prev,
      stores: prev.stores.map((s) =>
        s.id === storeId
          ? { ...s, status: s.status === 'suspended' ? 'active' : 'suspended' }
          : s
      ),
      auditLogs: [
        addAuditLog(
          'TOGGLE_STORE_STATUS',
          'المشرف العام',
          'admin',
          `تغيير حالة المتجر #${storeId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 5. Products Moderation in Admin
  const adminUpdateProduct = (prodId, updates) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === prodId ? { ...p, ...updates } : p)),
      auditLogs: [
        addAuditLog(
          'ADMIN_UPDATE_PRODUCT',
          'المشرف العام',
          'admin',
          `تعديل المنتج #${prodId} من قبل الإدارة.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteProduct = (prodId) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== prodId),
      auditLogs: [
        addAuditLog(
          'ADMIN_DELETE_PRODUCT',
          'المشرف العام',
          'admin',
          `حذف المنتج #${prodId} من قبل الإدارة.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminToggleProductVisibility = (prodId) => {
    setDb((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === prodId ? { ...p, isVisible: p.isVisible === false ? true : false } : p
      ),
      auditLogs: [
        addAuditLog(
          'TOGGLE_PRODUCT_VISIBILITY',
          'المشرف العام',
          'admin',
          `تبديل حالة ظهور المنتج #${prodId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 6. Customers Moderation in Admin
  const adminUpdateCustomer = (customerId, updates) => {
    setDb((prev) => {
      const clean = { ...updates };
      if (clean.phone) clean.phone = cleanYemeniPhone(clean.phone);
      return {
        ...prev,
        users: prev.users.map((u) => (u.id === customerId ? { ...u, ...clean } : u)),
        auditLogs: [
          addAuditLog(
            'UPDATE_CUSTOMER',
            'المشرف العام',
            'admin',
            `تحديث بيانات العميل #${customerId}.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  const adminToggleCustomerStatus = (customerId) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === customerId
          ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
          : u
      ),
      auditLogs: [
        addAuditLog(
          'TOGGLE_CUSTOMER_STATUS',
          'المشرف العام',
          'admin',
          `تغيير حالة العميل #${customerId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminDeleteCustomer = (customerId) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== customerId),
      auditLogs: [
        addAuditLog(
          'DELETE_CUSTOMER',
          'المشرف العام',
          'admin',
          `حذف حساب العميل #${customerId}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  // 7. Orders Moderation in Admin
  const adminUpdateOrderStatus = (orderId, newStatus) => {
    setDb((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      auditLogs: [
        addAuditLog(
          'UPDATE_ORDER_STATUS',
          'المشرف العام',
          'admin',
          `تحديث حالة الطلب #${orderId} إلى: ${newStatus}.`
        ),
        ...prev.auditLogs,
      ],
    }));
  };

  const adminAssignOrderCourier = (orderId, courierId) => {
    setDb((prev) => {
      const courier = prev.users.find((u) => u.id === courierId);
      return {
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId
            ? { ...o, courierId, courierName: courier?.name || 'مندوب التوصيل', status: 'قيد التوصيل' }
            : o
        ),
        auditLogs: [
          addAuditLog(
            'ASSIGN_COURIER',
            'المشرف العام',
            'admin',
            `تعيين المندوب "${courier?.name}" للطلب #${orderId}.`
          ),
          ...prev.auditLogs,
        ],
      };
    });
  };

  // 8. Clean Production Mode vs Demo Data
  const getDemoDataSummary = () => {
    const demoMerchants = (db.users || []).filter(
      (u) => u.role === 'merchant' && ['usr-merch-1', 'usr-merch-2', 'usr-merch-3'].includes(u.id)
    );
    const demoStores = (db.stores || []).filter((s) =>
      ['store-1', 'store-2', 'store-3', 'store-4', 'store-5', 'store-6', 'store-7', 'store-8'].includes(s.id)
    );
    const demoProducts = (db.products || []).filter((p) =>
      ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'].includes(p.id)
    );
    const demoOrders = (db.orders || []).filter((o) =>
      ['GS-1051', 'GS-1050', 'GS-1049', 'GS-1048', 'GS-1047'].includes(o.id)
    );
    return {
      isProductionMode: Boolean(db.isProductionMode),
      demoMerchantsCount: demoMerchants.length,
      demoStoresCount: demoStores.length,
      demoProductsCount: demoProducts.length,
      demoOrdersCount: demoOrders.length,
      totalStores: (db.stores || []).length,
      totalProducts: (db.products || []).length,
      totalOrders: (db.orders || []).length,
      demoMerchants,
      demoStores,
      demoProducts,
      demoOrders,
    };
  };

  const resetToCleanProductionMode = async () => {
    // If Supabase is connected, clean demo records in cloud database as well
    if (isSupabaseConnected) {
      try {
        await cleanDemoDataFromSupabase();
      } catch (err) {
        console.warn('Failed to clean Supabase demo records:', err);
      }
    }

    setDb((prev) => ({
      ...prev,
      isProductionMode: true,
      stores: [],
      products: [],
      orders: [],
      invoices: [],
      payments: [],
      users: prev.users.filter((u) => u.role === 'admin'),
      auditLogs: [
        addAuditLog(
          'CLEAN_PRODUCTION_MODE',
          'المشرف العام',
          'admin',
          'تم تفعيل وضع الإنتاج الحقيقي وتفريغ المتاجر والمنتجات الوهمية (0 متاجر، 0 منتجات، 0 طلبات).'
        ),
        ...prev.auditLogs,
      ],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'وضع الإنتاج الحقيقي مفعّل 🚀',
          message: 'المنصة وقاعدة البيانات جاهزة الآن للعمل الحقيقي، بانتظار تسجيل أول متجر حقيقي.',
          time: 'الآن',
          unread: true,
          type: 'system',
          role: 'admin',
        },
        ...prev.notifications,
      ],
    }));
  };

  const restoreDemoData = () => {
    const initialDb = getInitialDatabase();
    setDb({
      ...initialDb,
      isProductionMode: false,
    });
  };

  // --- G. NOTIFICATIONS ---
  const markAllNotificationsAsRead = () => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
  };

  const value = {
    // Database Snapshot
    db,

    // Navigation
    currentPortal,
    switchPortal,
    // Dynamic Categories
    categories: db.categories || [],
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,

    // Merchant Onboarding & Moderation
    registerMerchant,
    adminApproveMerchant,
    adminRejectMerchant,
    adminAddMerchant,
    adminUpdateMerchant,
    adminToggleMerchantStatus,
    adminDeleteMerchant,

    // Courier CRUD
    adminAddCourier,
    adminUpdateCourier,
    adminToggleCourierStatus,
    adminDeleteCourier,

    // Store CRUD
    adminAddStore,
    adminUpdateStore,
    adminDeleteStore,
    adminToggleStoreStatus,

    // Product CRUD in Admin
    adminUpdateProduct,
    adminDeleteProduct,
    adminToggleProductVisibility,

    // Customer CRUD
    adminUpdateCustomer,
    adminToggleCustomerStatus,
    adminDeleteCustomer,

    // Order Lifecycle in Admin
    adminUpdateOrderStatus,
    adminAssignOrderCourier,

    // Clean Production Mode vs Demo Data
    isProductionMode: Boolean(db.isProductionMode),
    getDemoDataSummary,
    resetToCleanProductionMode,
    restoreDemoData,


    // Users & Multi-Tenant Switchers
    customerUser,
    merchantsList,
    activeMerchantId,
    currentMerchantUser,
    switchMerchantAccount,

    couriersList,
    activeCourierId,
    currentCourierUser,
    switchCourierAccount,

    adminUser,
    checkPermission,

    // Marketplace Products (All)
    products: db.products,

    // Merchant Isolated Products
    merchantProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,

    // Stores (All & Active Merchant)
    stores: db.stores,
    merchantStore: currentMerchantStore,
    updateMerchantStore,
    toggleStoreVerification,

    // Orders (All, Merchant Isolated, Courier Isolated)
    orders: db.orders,
    merchantOrders,
    courierDeliveries,
    availablePickupOrders,
    placeOrder,
    markOrderReadyForPickup,
    courierAcceptOrder,
    courierConfirmPickup,
    courierCompleteDelivery,

    // Subscriptions & Plans
    subscriptionPlans: db.subscriptionPlans || [],
    subscriptions: db.subscriptions || [],
    merchantSubscription,
    adminUpdateSubscriptionPlan,
    adminAddSubscriptionPlan,
    adminDeleteSubscriptionPlan,

    // Invoices & Banking Payments
    invoices: db.invoices || [],
    merchantInvoices,
    payments: db.payments || [],
    merchantPayments,
    platformBankAccounts: db.platformBankAccounts || [],
    submitPaymentProof,
    adminApprovePayment,
    adminRejectPayment,
    adminCreateInvoice,
    adminUpdateBankAccount,
    adminAddBankAccount,
    adminToggleBankAccount,

    // Customer Actions
    loginCustomer,
    registerCustomer,
    customerLogin: loginCustomer,
    customerRegister: registerCustomer,
    switchCustomerAccount,
    logoutCustomer,
    updateCustomerProfile,
    addCustomerAddress,
    deleteCustomerAddress,

    // Courier State
    isCourierOnline: currentCourierUser?.isOnline !== false,
    setIsCourierOnline: toggleCourierOnline,
    courierProfile: currentCourierUser,
    setCourierProfile: updateCourierProfile,

    // Notifications & Audit Logs
    notifications: db.notifications || [],
    markAllNotificationsAsRead,
    auditLogs: db.auditLogs || [],

    // System Settings
    systemSettings: db.settings,

    // Supabase Live Sync State
    isSupabaseConnected,
    setIsSupabaseConnected,
    refreshFromSupabase,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
