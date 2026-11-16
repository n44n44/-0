/**
 * مساري | MASARI - Flights Search & Details Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Passenger Counter Controller
  const counterVal = document.getElementById('passengerCount');
  const btnInc = document.getElementById('btnIncPassenger');
  const btnDec = document.getElementById('btnDecPassenger');

  let passengers = 1;

  if (btnInc && counterVal) {
    btnInc.addEventListener('click', (e) => {
      e.preventDefault();
      if (passengers < 9) {
        passengers++;
        counterVal.textContent = passengers;
      }
    });
  }

  if (btnDec && counterVal) {
    btnDec.addEventListener('click', (e) => {
      e.preventDefault();
      if (passengers > 1) {
        passengers--;
        counterVal.textContent = passengers;
      }
    });
  }

  // Flight Search Form
  const flightSearchForm = document.getElementById('flightSearchForm');
  const resultsContainer = document.getElementById('flightResultsContainer');

  if (flightSearchForm && resultsContainer) {
    flightSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const origin = document.getElementById('departureCity').value;
      const destination = document.getElementById('destinationCity').value;
      const departDate = document.getElementById('departureDate').value;

      if (!destination) {
        MasariApp.toast('يرجى تحديد وجهة السفر المطلوبة', 'error');
        return;
      }

      MasariApp.toast('جاري البحث عن أفضل الرحلات المتاحة...', 'info');

      // Retrieve flights from storage
      const allFlights = JSON.parse(localStorage.getItem('masari_flights')) || [];
      
      // Filter or generate matching flights
      let matches = allFlights.filter(f => f.destination.includes(destination) || destination.includes(f.destination));

      if (matches.length === 0) {
        // Fallback realistic flight for search terms
        matches = [
          {
            id: 'FL_' + Date.now(),
            origin: origin || 'الرياض',
            originCode: origin === 'جدة' ? 'JED' : 'RUH',
            destination: destination,
            destinationCode: destination === 'دبي' ? 'DXB' : (destination === 'القاهرة' ? 'CAI' : 'DOH'),
            flightNumber: 'SV' + Math.floor(1000 + Math.random() * 9000),
            airline: 'طيران السعودية',
            departureTime: '10:30 ص',
            arrivalTime: '12:45 م',
            duration: 'ساعتان و 15 دقيقة',
            date: departDate || '2025-12-29',
            price: 1250,
            stops: 'مباشرة',
            features: ['إمكانية استرداد', 'إمكانية تغيير الحجز', 'وجبة مجانية مشمولة']
          }
        ];
      }

      renderFlightResults(matches);
    });

    // Auto-search initially to display results matching mockup
    const allFlights = JSON.parse(localStorage.getItem('masari_flights')) || [];
    renderFlightResults(allFlights.slice(0, 2));
  }

  function renderFlightResults(flights) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    flights.forEach(flight => {
      const card = document.createElement('div');
      card.className = 'flight-result-card';
      card.innerHTML = `
        <div class="flight-card-top">
          <div class="flight-airline">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
            </svg>
            <span>${flight.airline}</span>
            <span style="font-size: 11px; background: var(--primary-subtle); color: var(--primary); padding: 2px 8px; border-radius: 10px;">${flight.stops}</span>
          </div>
          <div class="flight-price-tag">
            SAR ${flight.price.toLocaleString()}
          </div>
        </div>

        <div class="flight-route-row">
          <div class="route-endpoint">
            <div class="city-code">${flight.originCode || 'RUH'}</div>
            <div class="time-label">${flight.departureTime || '10:00 ص'}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${flight.origin}</div>
          </div>

          <div class="route-flight-path">
            <span class="flight-duration">${flight.duration || 'ساعتان'}</span>
            <div class="flight-line-bar">
              <span class="plane-marker">✈</span>
            </div>
          </div>

          <div class="route-endpoint">
            <div class="city-code">${flight.destinationCode || 'DXB'}</div>
            <div class="time-label">${flight.arrivalTime || '12:15 م'}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${flight.destination}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--primary);">عرض التفاصيل والحجز &larr;</span>
        </div>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('masari_selected_flight', JSON.stringify(flight));
        window.location.href = `flight-details.html?id=${flight.id}`;
      });

      resultsContainer.appendChild(card);
    });
  }

  // Flight Details Screen Logic
  const bookFlightBtn = document.getElementById('btnBookFlightNow');
  if (bookFlightBtn) {
    // Populate flight details
    const selectedFlightStr = localStorage.getItem('masari_selected_flight');
    let flight = null;
    if (selectedFlightStr) {
      try { flight = JSON.parse(selectedFlightStr); } catch(e){}
    }
    
    // Default fallback flight if direct access
    if (!flight) {
      flight = {
        id: 'FL001',
        origin: 'الرياض',
        destination: 'دبي',
        flightNumber: 'N1532',
        airline: 'طيران السعودية',
        date: '29 ديسمبر 2025',
        time: '10:00 ص',
        duration: 'ساعتان و 15 دقيقة',
        price: 1250,
        features: ['إمكانية استرداد', 'إمكانية تغيير الحجز', 'تغليف مجاني للمشاعر']
      };
    }

    // Populate DOM elements if present
    const elTitle = document.getElementById('flightRouteTitle');
    const elAirline = document.getElementById('flightAirlineName');
    const elNumber = document.getElementById('flightNumberBadge');
    const elDuration = document.getElementById('flightDurationBadge');
    const elPrice = document.getElementById('flightTotalPrice');

    if (elTitle) elTitle.textContent = `رحلة ${flight.origin} - ${flight.destination}`;
    if (elAirline) elAirline.textContent = flight.airline;
    if (elNumber) elNumber.textContent = `رقم الرحلة: ${flight.flightNumber}`;
    if (elDuration) elDuration.textContent = `مدة الرحلة: ${flight.duration}`;
    if (elPrice) elPrice.textContent = `SAR ${flight.price.toLocaleString()}`;

    bookFlightBtn.addEventListener('click', () => {
      const pendingBooking = {
        type: 'flight',
        itemType: 'flight',
        title: `رحلة ${flight.origin} إلى ${flight.destination}`,
        subtitle: `${flight.airline} • رقم الرحلة ${flight.flightNumber}`,
        details: `رحلة إلى ${flight.destination} ${flight.date || '29 ديسمبر 2025'}`,
        flightNumber: flight.flightNumber,
        date: flight.date || '29 ديسمبر 2025',
        price: flight.price || 1250,
        currency: 'SAR',
        icon: 'flight'
      };

      localStorage.setItem('masari_pending_booking', JSON.stringify(pendingBooking));
      window.location.href = 'payment.html';
    });
  }
});
