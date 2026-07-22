const burger = document.querySelector('.nav__burger');
if (burger) {
  burger.addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('nav--open');
  });
}

async function loadBusinesses() {
  try {
    const response = await fetch('../businesses.json');
    return await response.json();
  } catch (err) {
    console.error('Failed to load businesses.json:', err);
    return [];
  }
}

function getCategoryIcon(category) {
  const icons = {
    'restaurants': 'utensils',
    'services': 'wrench',
    'date-ideas': 'heart',
    'things-to-do': 'compass'
  };
  return icons[category] || 'store';
}

function renderResults(businesses) {
  const grid = document.getElementById('resultsGrid');
  const emptyState = document.getElementById('emptyState');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  countEl.textContent = 'Showing ' + businesses.length + (businesses.length !== 1 ? ' results' : ' result');

  if (businesses.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  grid.innerHTML = businesses.map(function(b) {
    const fullStars = Math.round(b.rating || 0);
    const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

    return `
      <a href="listing.html?id=${b.id}" class="listing-card">
        ${b.featured ? '<span class="card-badge"><i data-lucide="star"></i> Featured</span>' : ''}
        <div class="card-img-placeholder">
          <i data-lucide="${getCategoryIcon(b.category)}"></i>
        </div>
        <div class="card-body">
          <div class="card-category">${b.category}</div>
          <h3 class="card-name">${b.name}</h3>
          <div class="card-rating">
            <span class="stars">${starsHTML}</span>
            <span class="rating-num">${b.rating}</span>
            <span class="review-count">(${b.reviews} reviews)</span>
          </div>
          <p class="card-desc">${b.description}</p>
          <div class="card-footer">
            <span class="card-location"><i data-lucide="map-pin"></i> ${b.address}</span>
            <span class="card-cta">View →</span>
          </div>
        </div>
      </a>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function renderCategoryBreakdown(businesses) {
  const list = document.getElementById('categoryBreakdown');
  if (!list) return;

  const labels = {
    'restaurants': 'Restaurants',
    'services': 'Services',
    'date-ideas': 'Date Ideas',
    'things-to-do': 'Things To Do'
  };
  const counts = { 'restaurants': 0, 'services': 0, 'date-ideas': 0, 'things-to-do': 0 };

  businesses.forEach(function(b) {
    if (counts[b.category] !== undefined) counts[b.category]++;
  });

  list.innerHTML = Object.keys(labels).map(function(key) {
    return `<li>${labels[key]} <span>${counts[key]}</span></li>`;
  }).join('');
}

function filterBusinesses(all, query, category) {
  return all.filter(function(b) {
    const matchesQuery = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || b.category === category;
    return matchesQuery && matchesCategory;
  });
}

window.addEventListener('DOMContentLoaded', async function() {
  const allBusinesses = await loadBusinesses();
  renderCategoryBreakdown(allBusinesses);

  const params = new URLSearchParams(window.location.search);
  let currentQuery = params.get('q') || '';
  let currentCategory = params.get('cat') || '';

  // Reflect URL params into the search bar + active chip
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  if (searchInput) searchInput.value = currentQuery;
  if (categoryFilter) categoryFilter.value = currentCategory;

  document.querySelectorAll('.chip--filter').forEach(function(chip) {
    if (chip.dataset.cat === currentCategory) {
      chip.classList.add('is-active');
    } else {
      chip.classList.remove('is-active');
    }
  });

  renderResults(filterBusinesses(allBusinesses, currentQuery, currentCategory));

  // Search form
  const form = document.getElementById('searchPageForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      currentQuery = searchInput.value.trim();
      currentCategory = categoryFilter.value;
      renderResults(filterBusinesses(allBusinesses, currentQuery, currentCategory));
    });
  }

  // Filter chips
  document.querySelectorAll('.chip--filter').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.chip--filter').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentCategory = chip.dataset.cat;
      if (categoryFilter) categoryFilter.value = currentCategory;
      renderResults(filterBusinesses(allBusinesses, currentQuery, currentCategory));
    });
  });
});