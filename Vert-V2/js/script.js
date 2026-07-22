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

async function updateCategoryCounts() {
  const businesses = await loadBusinesses();

  const counts = {
    'restaurants': 0,
    'services': 0,
    'date-ideas': 0,
    'things-to-do': 0
  };

  businesses.forEach(function(b) {
    if (counts[b.category] !== undefined) {
      counts[b.category]++;
    }
  });

  document.querySelectorAll('.index-card').forEach(function(card) {
    const href = card.getAttribute('href');
    if (!href) return;
    const cat = href.split('cat=')[1];
    const countEl = card.querySelector('.index-card__count');
    if (countEl && cat && counts[cat] !== undefined) {
      countEl.textContent = counts[cat] + (counts[cat] !== 1 ? ' listings' : ' listing');
    }
  });
}

async function loadFeaturedListings() {
  const businesses = await loadBusinesses();
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const featured = businesses.filter(function(b) {
    return b.featured === true;
  });

  if (featured.length === 0) {
    grid.innerHTML = '<p class="section-sub">No featured businesses yet.</p>';
    return;
  }

  grid.innerHTML = featured.map(function(b) {
    const fullStars = Math.round(b.rating || 0);
    const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

    return `
      <a href="listing.html?id=${b.id}" class="listing-card featured-card">
        <span class="card-badge"><i data-lucide="star"></i> Featured</span>
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

function setupHeroSearch() {
  const form = document.getElementById('heroSearchForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('cat', category);
    window.location.href = 'search.html?' + params.toString();
  });
}

window.addEventListener('DOMContentLoaded', function() {
  setupHeroSearch();
  updateCategoryCounts();
  loadFeaturedListings();
});