//===BUSINESS DATA===

const businesses = [
{
    id: 1,
    name: "Coming Soon",
    category: "restaurants",
    rating: 5.0,
    reviews: 0,
    description: "Be the first restaurant listed here.",
    location: "Pretoria East",
    whatsapp:"",
    featured: true,
    complete: true,
}

{
    id: 2,
    name: "Coming Soon",
    category: "carwashes",
    rating: 5.0,
    reviews: 0,
    description: "Be the first carwash listed here.",
    location: "Pretoria East",
    whatsapp:"",
    featured: false,
    complete: true,
},

{
    id: 3,
    name: "Coming Soon",
    category: "beauty",
    rating: 5.0,
    reviews: 0,
    description: "Be the first beauty business listed here.",
    location: "Pretoria East",
    whatsapp:"",
    featured: false,
    complete: true,
},

{
    id: 4,
    name: "Coming Soon",
    category: "auto",
    rating: 5.0,
    reviews: 0,
    description: "Be the first automotive business listed here.",
    location: "Pretoria East",
    whatsapp:"",
    featured: false,
    complete: true,

},

{
    id: 5,
    name: "Coming Soon",
    category: "services",
    rating: 5.0,
    reviews: 0,
    description: "Be the first services business listed here.",
    location: "Pretoria East",
    whatsapp:"",
    featured: true,
    complete: true,

}
];

// ===ALGORITHM _ SORT BUSINESSES===

function sortBusinesses(list) {
    return list.sort((a, b) => {
        if (a.featured !== b.featured) return b.featured - a.featured;
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviews - a.reviews;
    });
}

//===GET URL PARAMS===

const params = new URLSearchParams(window.location.search);
const queryParam = params.get('q') || '';
const catParam = params.get('cat') || '';

//===FILTER BUSINESSES===

function filterBusinesses(){
    const searchItem = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let results = businesses.filter(b => {
        const matchesQuery = b.name.toLowerCase().includes(searchTerm) || b.description.toLowerCase().includes(searchTerm);
        const matchesCat = category === '' || b.category === category;
        return matchesQuery && matchesCat;
    });
return sortBusinesses(results);
}

//RENDER CARDS===

function renderCards(list) {
    const grid = document.getElementById('resultsGrid');

    if (list.length === 0) {
        grid.innerHTML = `
        <div class="empty-state">
          <p> No businesses found. Try a different search.</p>
          <a href="claim.html"> Know a business that should be here? Add it now! </a>
        </div>
      `;
        return;
    }
        
        
grid.innerHTML = list.map(b => `
    <a href="listing.html?id=${b.id}" class="listing-card  ${b.featured ? 'featured-card' : ''}" >
     ${b.featured ? '<div class="card-badge">⭐ Featured</div>' : ''}
     <div class="card-img-placeholder">
     ${b.category === 'restaurants' ? '🍽️' :
       b.category === 'carwashes'? '🚗' : 
       b.category === 'beauty' ? '💄' :
       b.category === 'auto' ? '🔧' :
       b.category === 'services' ? '🛠️' : '🏢'}
    </div>
<div class="card-body">
 <div class="card-category">${b.category}</div>
   <h3 class="card-title">${b.name}</h3>
   <div class="card-rating">
   <span class="rating-stars">⭐⭐⭐⭐⭐</span>
   <span class="rating-num">${b.rating}</span>
   <span class="review-count">(${b.reviews} reviews)</span>
   </div>
   <p class="card-desc">${b.description}</p>
   <div class="card-location">📍 ${b.location}</div>
   <span class="card-cta">View</span>
   </div>
</div>
</a>
`).join('');
}

//===INITIALIZE PAGE===

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').value = queryParam;
    document.getElementById('categoryFilter').value = catParam;
    renderCards(filterBusinesses());

    document.getElementById('searchInput').addEventListener('input', () => {
        renderCards(filterBusinesses());
    });

    document.getElementById('categoryFilter').addEventListener('change', () => {
        renderCards(filterBusinesses());
    });
});
