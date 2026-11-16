/**
 * مساري | MASARI - Core Application Engine
 * Handles State, LocalStorage Mock DB, Navigation, Drawers & UI Components
 */

const MasariApp = {
  // Initial Seed Data matching the user's reference mockup
  initDatabase() {
    if (!localStorage.getItem('masari_initialized')) {
      const defaultUser = {
        name: 'ندى القاضي',
        email: 'user@masari.com',
        phone: '0501234567',
        avatar: 'ن'
      };

      const defaultBookings = [
        {
          id: 'MS123456',
          type: 'flight',
          title: 'رحلة إلى دبي',
          destination: 'دبي - الإمارات',
          origin: 'الرياض - السعودية',
          flightNumber: 'SV1532',
          airline: 'طيران السعودية',
          date: '29 ديسمبر 2025',
          time: '14:30',
          duration: 'ساعتان و15 دقيقة',
          price: 1250,
          status: 'confirmed',
          statusText: 'مؤكد',
          passengers: 1
        },
        {
          id: 'MS789012',
          type: 'hotel',
          title: 'فندق فورسيزون الرياض',
          location: 'الرياض - طريق الملك فهد',
          date: '25 ديسمبر 2025',
          nights: 2,
          price: 1800,
          status: 'confirmed',
          statusText: 'مؤكد',
          rating: 4.9
        },
        {
          id: 'MS345678',
          type: 'hospital',
          title: 'مستشفى الملك فيصل التخصصي',
          location: 'الرياض - المعذر',
          date: '16 ديسمبر 2025',
          time: '10:00 صباحاً',
          price: 350,
          status: 'confirmed',
          statusText: 'مؤكد',
          department: 'استشارة طبية متقدمة'
        }
      ];

      const defaultFlights = [
        {
          id: 'FL001',
          origin: 'الرياض',
          originCode: 'RUH',
          destination: 'دبي',
          destinationCode: 'DXB',
          flightNumber: 'N1532',
          airline: 'طيران السعودية',
          departureTime: '10:00 ص',
          arrivalTime: '12:15 م',
          duration: 'ساعتان و 15 دقيقة',
          date: '2025-12-29',
          price: 1250,
          stops: 'مباشرة',
          features: ['إمكانية استرداد', 'إمكانية تغيير الحجز', 'وجبة مجانية مشمولة']
        },
        {
          id: 'FL002',
          origin: 'الرياض',
          originCode: 'RUH',
          destination: 'دبي',
          destinationCode: 'DXB',
          flightNumber: 'EK818',
          airline: 'طيران الإمارات',
          departureTime: '16:45 م',
          arrivalTime: '19:00 م',
          duration: 'ساعتان و 15 دقيقة',
          date: '2025-12-29',
          price: 1420,
          stops: 'مباشرة',
          features: ['إمكانية استرداد', 'إمكانية تغيير الحجز', 'وزن أمتعة 35 كجم']
        },
        {
          id: 'FL003',
          origin: 'الرياض',
          originCode: 'RUH',
          destination: 'جدة',
          destinationCode: 'JED',
          flightNumber: 'SV1020',
          airline: 'طيران السعودية',
          departureTime: '08:30 ص',
          arrivalTime: '10:15 ص',
          duration: 'ساعة و 45 دقيقة',
          date: '2025-12-30',
          price: 680,
          stops: 'مباشرة',
          features: ['تغيير مجاني للموعد', 'حقيبة مقصورة مجانية']
        },
        {
          id: 'FL004',
          origin: 'جدة',
          originCode: 'JED',
          destination: 'القاهرة',
          destinationCode: 'CAI',
          flightNumber: 'MS672',
          airline: 'مصر للطيران',
          departureTime: '11:00 ص',
          arrivalTime: '13:10 م',
          duration: 'ساعتان و 10 دقائق',
          date: '2025-12-31',
          price: 950,
          stops: 'مباشرة',
          features: ['استرداد كامل', 'وجبة ساخنة']
        }
      ];

      const defaultHotels = [
        {
          id: 'HT001',
          name: 'فندق والجز كارتزون (ريتز كارلتون)',
          location: 'الرياض - حي الهدا',
          rating: 4.8,
          price: 560,
          image: 'assets/images/hotel-resort.jpg',
          amenities: ['مسبح فاخر', 'سبا متكامل', 'إفطار مجاني', 'واي فاي فائق']
        },
        {
          id: 'HT002',
          name: 'فندق ميانتون بلازا',
          location: 'دبي - وسط المدينة',
          rating: 4.6,
          price: 650,
          image: 'assets/images/hotel-modern.jpg',
          amenities: ['إطلالة برج خليفة', 'نادي صحي', 'مواقف خاصة']
        },
        {
          id: 'HT003',
          name: 'منتجع فورسيزونز الشاطئي',
          location: 'جدة - الكورنيش الشمالي',
          rating: 4.9,
          price: 980,
          image: 'assets/images/hotel-fourseasons.jpg',
          amenities: ['شاطئ خاص', 'مطاعم عالمية', 'أجنحة ملكية']
        }
      ];

      const defaultHospitals = [
        {
          id: 'HP001',
          name: 'مستشفى الملك فيصل التخصصي',
          location: 'مستشفى رائد - الرياض / مكة المكرمة',
          rating: 4.9,
          type: 'مستشفى تخصصي وأبحاث',
          image: 'assets/images/hospital-building.jpg',
          summary: 'رعاية طبية تخصصية وأبحاث بأعلى المعايير العالمية والاعتمادات الدولية.',
          consultationFee: 350
        },
        {
          id: 'HP002',
          name: 'مستشفى السعودي الألماني',
          location: 'رعاية طبية متميزة - الرياض / جدة',
          rating: 4.7,
          type: 'مجمع طبي متكامل',
          image: 'assets/images/hospital-modern.jpg',
          summary: 'أحدث التجهيزات الطبية مع نخبة من الاستشاريين في كافة التخصصات الدقيقة.',
          consultationFee: 280
        },
        {
          id: 'HP003',
          name: 'مجموعة الدكتور سليمان الحبيب الطبية',
          location: 'العليا - الرياض',
          rating: 4.8,
          type: 'مدينة طبية شاملة',
          image: 'assets/images/hospital-doctor.jpg',
          summary: 'خدمات طوارئ واستشارات على مدار 24 ساعة مع مراكز تشخيص متطورة.',
          consultationFee: 300
        }
      ];

      localStorage.setItem('masari_user', JSON.stringify(defaultUser));
      localStorage.setItem('masari_bookings', JSON.stringify(defaultBookings));
      localStorage.setItem('masari_flights', JSON.stringify(defaultFlights));
      localStorage.setItem('masari_hotels', JSON.stringify(defaultHotels));
      localStorage.setItem('masari_hospitals', JSON.stringify(defaultHospitals));
      localStorage.setItem('masari_initialized', 'true');
    }
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('masari_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Setup Global Navigation Drawer
  setupDrawer() {
    const openBtn = document.getElementById('openDrawerBtn');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const backdrop = document.getElementById('drawerBackdrop');
    const logoutBtn = document.getElementById('drawerLogoutBtn');

    if (openBtn && backdrop) {
      openBtn.addEventListener('click', () => {
        backdrop.classList.add('open');
      });
    }

    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('open');
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('masari_user_logged');
        MasariApp.toast('تم تسجيل الخروج بنجاح', 'info');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 800);
      });
    }

    // Update user info in drawer if present
    const user = this.getCurrentUser();
    const drawerName = document.getElementById('drawerUserName');
    const drawerAvatar = document.getElementById('drawerUserAvatar');
    if (user && drawerName) {
      drawerName.textContent = user.name || 'مستخدم مساري';
    }
    if (user && drawerAvatar) {
      drawerAvatar.textContent = (user.name && user.name.charAt(0)) || 'م';
    }
  },

  // Setup Top Device Toolbar (Mobile/Desktop Mode toggle)
  setupToolbar() {
    const screen = document.getElementById('appScreen');
    const mobileBtn = document.getElementById('btnViewMobile');
    const desktopBtn = document.getElementById('btnViewDesktop');
    const pageSelect = document.getElementById('quickPageSelect');

    const savedMode = localStorage.getItem('masari_view_mode') || 'mobile';
    if (screen && savedMode === 'desktop') {
      screen.classList.add('expanded-mode');
      if (mobileBtn && desktopBtn) {
        mobileBtn.classList.remove('active');
        desktopBtn.classList.add('active');
      }
    }

    if (mobileBtn && screen) {
      mobileBtn.addEventListener('click', () => {
        screen.classList.remove('expanded-mode');
        mobileBtn.classList.add('active');
        desktopBtn?.classList.remove('active');
        localStorage.setItem('masari_view_mode', 'mobile');
      });
    }

    if (desktopBtn && screen) {
      desktopBtn.addEventListener('click', () => {
        screen.classList.add('expanded-mode');
        desktopBtn.classList.add('active');
        mobileBtn?.classList.remove('active');
        localStorage.setItem('masari_view_mode', 'desktop');
      });
    }

    if (pageSelect) {
      pageSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          window.location.href = e.target.value;
        }
      });
    }
  },

  // Toast Notification System
  toast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Update Clock in Notch Bar
  updateTime() {
    const timeEl = document.getElementById('notchTime');
    if (!timeEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;
  },

  init() {
    this.initDatabase();
    this.setupDrawer();
    this.setupToolbar();
    this.updateTime();
    setInterval(() => this.updateTime(), 30000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MasariApp.init();
});
