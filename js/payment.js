/**
 * مساري | MASARI - Payment Processing & Booking Finalization
 */

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve pending booking details
  const pendingBookingStr = localStorage.getItem('masari_pending_booking');
  let pendingBooking = null;

  if (pendingBookingStr) {
    try {
      pendingBooking = JSON.parse(pendingBookingStr);
    } catch (e) {
      console.error(e);
    }
  }

  // Fallback if accessed directly matching mockup
  if (!pendingBooking) {
    pendingBooking = {
      type: 'flight',
      title: 'رحلة إلى دبي',
      details: 'رحلة إلى دبي 29 ديسمبر 2025',
      date: '29 ديسمبر 2025',
      price: 1250,
      currency: 'SAR'
    };
  }

  // Populate Summary Elements
  const elTitle = document.getElementById('summaryItemTitle');
  const elDetails = document.getElementById('summaryItemDetails');
  const elPrice = document.getElementById('summaryItemPrice');
  const elTotal = document.getElementById('summaryTotalAmount');

  if (elTitle) elTitle.textContent = pendingBooking.title || 'تفاصيل الحجز دبي';
  if (elDetails) elDetails.textContent = pendingBooking.details || 'رحلة إلى دبي 29 ديسمبر 2025';
  if (elPrice) elPrice.textContent = `SAR ${pendingBooking.price?.toLocaleString() || '1,250'}`;
  if (elTotal) elTotal.textContent = `SAR ${pendingBooking.price?.toLocaleString() || '1,250'}`;

  // Payment Method Selection
  const methodCards = document.querySelectorAll('.method-radio-card');
  const cardFields = document.getElementById('creditCardFields');
  const applePayPrompt = document.getElementById('applePayPrompt');
  let selectedMethod = 'card';

  methodCards.forEach(card => {
    card.addEventListener('click', () => {
      methodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMethod = card.getAttribute('data-method');

      if (selectedMethod === 'apple') {
        if (cardFields) cardFields.style.display = 'none';
        if (applePayPrompt) applePayPrompt.style.display = 'block';
      } else {
        if (cardFields) cardFields.style.display = 'block';
        if (applePayPrompt) applePayPrompt.style.display = 'none';
      }
    });
  });

  // Credit Card Input Auto-Formatting
  const cardNumInput = document.getElementById('cardNumber');
  if (cardNumInput) {
    cardNumInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
    });
  }

  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
    });
  }

  const cardCvvInput = document.getElementById('cardCvv');
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }

  // Payment Form Submission
  const paymentForm = document.getElementById('paymentForm');
  const submitBtn = document.getElementById('btnSubmitPayment');

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (selectedMethod !== 'apple') {
        const num = cardNumInput ? cardNumInput.value.replace(/\s/g, '') : '';
        const exp = cardExpiryInput ? cardExpiryInput.value : '';
        const cvv = cardCvvInput ? cardCvvInput.value : '';

        if (!num || num.length < 14) {
          MasariApp.toast('يرجى إدخال رقم بطاقة صحيح', 'error');
          return;
        }
        if (!exp || exp.length < 4) {
          MasariApp.toast('يرجى إدخال تاريخ انتهاء البطاقة بشكل صحيح', 'error');
          return;
        }
        if (!cvv || cvv.length < 3) {
          MasariApp.toast('يرجى إدخال رمز الأمان CVV', 'error');
          return;
        }
      }

      // Simulate payment processing state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          جاري التحقق وإتمام الدفع الآمن...
        `;
      }

      setTimeout(() => {
        // Generate booking reference
        const bookingRef = 'MS' + Math.floor(100000 + Math.random() * 900000);

        // Create booking item
        const newBooking = {
          id: bookingRef,
          type: pendingBooking.type || 'flight',
          title: pendingBooking.title || 'رحلة إلى دبي',
          details: pendingBooking.details || 'رحلة إلى دبي',
          date: pendingBooking.date || '29 ديسمبر 2025',
          price: pendingBooking.price || 1250,
          flightNumber: pendingBooking.flightNumber || 'SV1532',
          status: 'confirmed',
          statusText: 'مؤكد',
          createdAt: new Date().toISOString()
        };

        // Save to bookings list in localStorage
        const bookings = JSON.parse(localStorage.getItem('masari_bookings')) || [];
        bookings.unshift(newBooking);
        localStorage.setItem('masari_bookings', JSON.stringify(bookings));

        // Save last confirmed booking reference
        localStorage.setItem('masari_last_confirmed', JSON.stringify(newBooking));

        // Clean pending booking
        localStorage.removeItem('masari_pending_booking');

        MasariApp.toast('تم تأكيد الدفع بنجاح!', 'success');

        setTimeout(() => {
          window.location.href = `confirmation.html?ref=${bookingRef}`;
        }, 800);
      }, 1500);
    });
  }
});
