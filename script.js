// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 24px rgba(15, 33, 69, 0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== SEARCH =====
window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      const category = categoryFilter.value;
      if (query === '' && category === '') {
        searchInput.focus();
        return;
      }
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('cat', category);
      window.location.href = 'search.html?' + params.toString();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }
});

// ===== DYNAMIC CATEGORY COUNTS =====
async function updateCategoryCounts() {
  const response = await fetch('/businesses.json');
  const businesses = await response.json();

  const counts = {
    restaurants: 0,
    carwashes: 0,
    beauty: 0,
    auto: 0,
    services: 0
  };

  businesses.forEach(function(b) {
    if (counts[b.category] !== undefined) {
      counts[b.category]++;
    }
  });

  document.querySelectorAll('.category-card').forEach(function(card) {
    const href = card.getAttribute('href');
    const cat = href.split('cat=')[1];
    const countEl = card.querySelector('.cat-count');
    if (countEl && cat && counts[cat] !== undefined) {
      countEl.textContent = counts[cat] + (counts[cat] !== 1 ? ' listings' : ' listing');
    }
  });
}

// ===== DYNAMIC FEATURED LISTINGS =====
async function loadFeaturedListings() {
  const response = await fetch('/businesses.json');
  const businesses = await response.json();

  const featured = businesses.filter(function(b) {
    return b.featured === true;
  });

  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  if (featured.length === 0) {
    grid.innerHTML = '<p class="section-sub">No featured businesses yet.</p>';
    return;
  }

  grid.innerHTML = featured.map(function(b) {
    return `
      <a href="${b.url ? b.url : 'listing.html?id=' + b.id}" class="listing-card featured-card">
        <div class="card-badge">⭐ Featured</div>
        <div class="card-img-placeholder">
          ${b.category === 'restaurants' ? '🍽️' :
            b.category === 'carwashes' ? '🚗' :
            b.category === 'beauty' ? '💅' :
            b.category === 'auto' ? '🔧' : '🛠️'}
        </div>
        <div class="card-body">
          <div class="card-category">${b.category}</div>
          <h3 class="card-name">${b.name}</h3>
          <div class="card-rating">
            <span class="stars">★★★★★</span>
            <span class="rating-num">${b.rating}</span>
            <span class="review-count">(${b.reviews} reviews)</span>
          </div>
          <p class="card-desc">${b.description}</p>
          <div class="card-footer">
            <span class="card-location">📍 ${b.location}</span>
            <span class="card-cta">View →</span>
          </div>
        </div>
      </a>
    `;
  }).join('');
}

updateCategoryCounts();
loadFeaturedListings();