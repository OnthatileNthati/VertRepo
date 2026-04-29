//===NAVBAR SCROLL EFFECT===

const navbar = document.getElementById("navbar");

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.style.boxShadow = 'o 4px 24px rgba(15, 33, 69, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

//===SEARCH===
window.addEventListener('DOMContentLoaded', () => {
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

searchBTN.addEventListener('click', () => {
    const query = searchInput.value.trim();
    const category = categoryFilter.value;

    if (query === '' && category === 'all') {
        searchInput.focus();
        return;
    }

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if(category) params.set('cat', category);

    window.location.href = `search.html?${params.toString()}`;
});


//==SEARCH ON ENTER KEY===

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});
});

// ===== DYNAMIC CATEGORY COUNTS =====
async function updateCategoryCounts() {
  const response = await fetch('./businesses.json');
  const businesses = await response.json();

  const counts = {
    restaurants: 0,
    carwashes: 0,
    beauty: 0,
    auto: 0,
    services: 0
  };

  businesses.forEach(b => {
    if (counts[b.category] !== undefined) {
      counts[b.category]++;
    }
  });

  const catCards = document.querySelectorAll('.category-card');
  catCards.forEach(card => {
    const href = card.getAttribute('href');
    const cat = new URL(href, window.location.href).searchParams.get('cat');
    const countEl = card.querySelector('.cat-count');
    if (countEl && counts[cat] !== undefined) {
      countEl.textContent = `${counts[cat]} listing${counts[cat] !== 1 ? 's' : ''}`;
    }
  });
}

updateCategoryCounts();