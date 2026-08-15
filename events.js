const burger = document.querySelector('.nav__burger');
if (burger) {
  burger.addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('nav--open');
  });
}

async function loadEvents() {
  try {
    const response = await fetch('../events.json');
    return await response.json();
  } catch (err) {
    console.error('Failed to load events.json:', err);
    return [];
  }
}

function getCategoryIcon(category) {
  const icons = {
    'live-music': 'music',
    'arts-culture': 'palette',
    'food-drink': 'utensils',
    'festivals': 'party-popper',
    'sports-fitness': 'activity',
    'community': 'users'
  };
  return icons[category] || 'calendar';
}

const categoryLabels = {
  'live-music': 'Live Music',
  'arts-culture': 'Arts & Culture',
  'food-drink': 'Food & Drink',
  'festivals': 'Festivals',
  'sports-fitness': 'Sports & Fitness',
  'community': 'Community'
};

function getCountdownParts(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, ended: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return { days, hours, mins, secs, ended: false };
}

function pad(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function isInRange(dateStr, range) {
  if (range === 'all') return true;
  const eventDate = new Date(dateStr);
  const now = new Date();
  const diffDays = (eventDate - now) / (1000 * 60 * 60 * 24);

  if (range === 'week') return diffDays >= 0 && diffDays <= 7;
  if (range === 'month') return diffDays >= 0 && diffDays <= 30;
  if (range === 'weekend') {
    const day = eventDate.getDay();
    return diffDays >= 0 && diffDays <= 7 && (day === 0 || day === 6);
  }
  return true;
}

function renderEventCard(e) {
  return `
    <article class="event-card" data-id="${e.id}">
      <div class="event-card__media">
        ${e.featured ? '<span class="card-badge"><i data-lucide="star"></i> Featured</span>' : ''}
        <i data-lucide="${getCategoryIcon(e.category)}"></i>
      </div>
      <div class="event-card__body">
        <h3>${e.title}</h3>
        <p class="event-card__meta"><i data-lucide="map-pin"></i> ${e.venue}</p>
        <p class="event-card__meta"><i data-lucide="calendar"></i> ${formatDate(e.date)}</p>
        <p class="event-card__desc">${e.description}</p>
      </div>
      <div class="countdown" data-date="${e.date}">
        <p class="countdown__label">Starts In</p>
        <div class="countdown__grid">
          <div class="countdown__unit"><span class="countdown__num" data-unit="days">00</span><span class="countdown__label-sm">Days</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-unit="hours">00</span><span class="countdown__label-sm">Hours</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-unit="mins">00</span><span class="countdown__label-sm">Mins</span></div>
          <div class="countdown__unit"><span class="countdown__num" data-unit="secs">00</span><span class="countdown__label-sm">Secs</span></div>
        </div>
        <a href="${e.ticketUrl || e.mapsUrl || '#'}" target="_blank" class="btn btn--ghost event-card__btn">View Details →</a>
      </div>
    </article>
  `;
}

function renderEvents(events) {
  const grid = document.getElementById('eventsGrid');
  const emptyState = document.getElementById('eventsEmptyState');
  const countEl = document.getElementById('eventsCount');
  if (!grid) return;

  countEl.textContent = 'Showing ' + events.length + (events.length !== 1 ? ' events' : ' event');

  if (events.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  grid.innerHTML = events.map(renderEventCard).join('');
  if (window.lucide) lucide.createIcons();
  injectEventsSchema(events);
}

function renderCategoryBreakdown(events) {
  const list = document.getElementById('eventCategoryBreakdown');
  if (!list) return;

  const counts = {};
  Object.keys(categoryLabels).forEach(key => counts[key] = 0);
  events.forEach(e => { if (counts[e.category] !== undefined) counts[e.category]++; });

  list.innerHTML = Object.keys(categoryLabels).map(function(key) {
    return `<li>${categoryLabels[key]} <span>${counts[key]}</span></li>`;
  }).join('');
}

function tickCountdowns() {
  document.querySelectorAll('.countdown').forEach(function(el) {
    const parts = getCountdownParts(el.dataset.date);
    el.querySelector('[data-unit="days"]').textContent = pad(parts.days);
    el.querySelector('[data-unit="hours"]').textContent = pad(parts.hours);
    el.querySelector('[data-unit="mins"]').textContent = pad(parts.mins);
    el.querySelector('[data-unit="secs"]').textContent = pad(parts.secs);
  });
}

window.addEventListener('DOMContentLoaded', async function() {
  const allEvents = await loadEvents();
  renderCategoryBreakdown(allEvents);

  let currentCategory = '';
  let currentRange = 'all';
  let currentQuery = '';

  function applyFilters() {
    const filtered = allEvents.filter(function(e) {
      const matchesCategory = !currentCategory || e.category === currentCategory;
      const matchesRange = isInRange(e.date, currentRange);
      const matchesQuery = !currentQuery || e.title.toLowerCase().includes(currentQuery.toLowerCase());
      return matchesCategory && matchesRange && matchesQuery;
    });
    renderEvents(filtered);
    tickCountdowns();
  }

  applyFilters();
  setInterval(tickCountdowns, 1000);

  // Category chips
  document.querySelectorAll('.chip--filter').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.chip--filter').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentCategory = chip.dataset.cat;
      applyFilters();
    });
  });

  // Date range tabs
  document.querySelectorAll('.event-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.event-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      currentRange = tab.dataset.range;
      applyFilters();
    });
  });

  // Search form
  const form = document.getElementById('eventsSearchForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      currentQuery = document.getElementById('eventSearchInput').value.trim();
      applyFilters();
    });
  }
});

function injectEventsSchema(events) {
  // Remove any previously injected schema before adding fresh one
  const existing = document.getElementById('eventsSchema');
  if (existing) existing.remove();

  const schemaList = events.map(function(e) {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": e.title,
      "description": e.description,
      "startDate": e.date,
      "location": {
        "@type": "Place",
        "name": e.venue,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pretoria East",
          "addressCountry": "ZA"
        }
      },
      "url": e.ticketUrl || e.mapsUrl || window.location.href
    };
  });

  const script = document.createElement('script');
  script.id = 'eventsSchema';
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schemaList);
  document.head.appendChild(script);
}