/**
 * مساري | MASARI - Bookings List & Ticket Management
 */

document.addEventListener('DOMContentLoaded', () => {
  const listContainer = document.getElementById('bookingsListContainer');
  const tabs = document.querySelectorAll('.tab-pill');
  const modalOverlay = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('closeModalBtn');
  const modalBody = document.getElementById('bookingModalBody');
  const btnCancelBooking = document.getElementById('btnCancelBooking');

  let activeFilter = 'all';
  let currentModalBookingId = null;

  function getBookings() {
    return JSON.parse(localStorage.getItem('masari_bookings')) || [];
  }

  function saveBookings(bookings) {
    localStorage.setItem('masari_bookings', JSON.stringify(bookings));
  }

  function renderBookings() {
    if (!listContainer) return;
    const bookings = getBookings();
    listContainer.innerHTML = '';

    const filtered = bookings.filter(b => {
      if (activeFilter === 'all') return true;
      return b.type === activeFilter;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 40px; margin-bottom: 10px;">📋</div>
          <h4 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">لا توجد حجوزات في هذا القسم</h4>
          <p style="font-size: 13px;">يمكنك البدء بحجز رحلة طيران أو فندق أو موعد مستشفى الآن.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'booking-ticket-item';

      let typeIcon = '';
      if (item.type === 'flight') {
        typeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/></svg>`;
      } else if (item.type === 'hotel') {
        typeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>`;
      } else {
        typeIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`;
      }

      let statusClass = 'confirmed';
      let statusLabel = 'مؤكد';
      if (item.status === 'cancelled') {
        statusClass = 'cancelled';
        statusLabel = 'ملغي';
      } else if (item.status === 'pending') {
        statusClass = 'pending';
        statusLabel = 'قيد الانتظار';
      }

      card.innerHTML = `
        <div class="booking-main-info">
          <div class="booking-type-icon">
            ${typeIcon}
          </div>
          <div>
            <div class="booking-title">${item.title}</div>
            <div class="booking-date">${item.date}</div>
          </div>
        </div>

        <div class="booking-side-action">
          <span class="badge-status ${statusClass}">${statusLabel}</span>
          <span class="chevron-icon" style="font-size: 16px;">&gt;</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openBookingModal(item);
      });

      listContainer.appendChild(card);
    });
  }

  // Booking Modal View
  function openBookingModal(item) {
    if (!modalOverlay || !modalBody) return;
    currentModalBookingId = item.id;

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 4px;">رقم الحجز المرجعي</div>
        <div style="font-size: 20px; font-weight: 800; color: var(--primary); direction: ltr;">#${item.id}</div>
      </div>

      <div style="background: var(--bg-sand); border-radius: 14px; padding: 14px; margin-bottom: 16px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">عنوان الحجز:</span>
          <strong>${item.title}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">تاريخ الحجز:</span>
          <strong>${item.date}</strong>
        </div>
        ${item.flightNumber ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">رقم الرحلة:</span>
          <strong>${item.flightNumber}</strong>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: var(--text-muted);">المبلغ الإجمالي:</span>
          <strong style="color: var(--primary);">SAR ${item.price?.toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-muted);">حالة الحجز:</span>
          <strong>${item.status === 'cancelled' ? 'ملغي' : 'مؤكد ومسجل'}</strong>
        </div>
      </div>

      <div style="background: #ffffff; border: 1px dashed var(--border-light); border-radius: 12px; padding: 12px; text-align: center; margin-bottom: 10px;">
        <div style="font-family: monospace; font-size: 16px; letter-spacing: 4px; color: var(--text-primary); margin-bottom: 4px;">|||| | ||||| || ||||||</div>
        <div style="font-size: 11px; color: var(--text-muted);">رمز التحقق الإلكتروني للخدمة</div>
      </div>
    `;

    if (btnCancelBooking) {
      if (item.status === 'cancelled') {
        btnCancelBooking.style.display = 'none';
      } else {
        btnCancelBooking.style.display = 'block';
      }
    }

    modalOverlay.classList.add('open');
  }

  // Cancel Booking Action
  if (btnCancelBooking) {
    btnCancelBooking.addEventListener('click', () => {
      if (!currentModalBookingId) return;
      if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
        const bookings = getBookings();
        const target = bookings.find(b => b.id === currentModalBookingId);
        if (target) {
          target.status = 'cancelled';
          saveBookings(bookings);
          MasariApp.toast('تم إلغاء الحجز بنجاح', 'info');
          modalOverlay.classList.remove('open');
          renderBookings();
        }
      }
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('open');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('open');
      }
    });
  }

  // Filter Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter') || 'all';
      renderBookings();
    });
  });

  // Initial load
  renderBookings();
});
