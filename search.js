//===FETCH BUSINESS DATA
async function  init() {
    const response = await fetch('./businesses.json');
    const businesses = await response.json();

    //===GET URL PARAMS==
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q') || ''; 
    const catParam = params.get('cat') || ''; 

    document.getElementById('searchInput').value = queryParam;
    document.getElementById('categoryFilter').value = catParam;

    //==SORT==
    function sortBusinesses(list){
        return list.sort((a,b) => {
            if (a.featured !== b.featured) return b.featured - a.featured;
            if (b.rating !== a.rating) return b.rating - a.rating; 
            return b.reviews - a.reviews;
        });
    }

//==FILTER==
function filterAndRender(){
    const searchItem = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    let results = businesses.filter(b => {
        const matchesQuery = b.name.toLowerCase().includes(searchItem) ||
                             b.description.toLowerCase().includes(searchTerm);
        const matchesCat = category ==='' || b.category === category; 
        return matchesQuery && matchesCat;        
    });
    renderCards(sortBusinesses(results));
}
}

//===RENDER CARDS===
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
       b.category === 'services' ? '🔧' : '🛠️'}
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


//===LISTENERS===
document.getElementById('searchInput').addEventListener('input', filterAndRender);
document.getElementById('categoryFilter').addEventListener('change', filterAndRender);

filterAndRender();
 }

 window.addEventListener('DOMContentLoaded', init)