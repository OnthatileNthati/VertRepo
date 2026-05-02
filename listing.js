//===BUSINESS DATA===
const businesses = [
{
    id: 1,
    name: "Coming Soon",
    category: "Restaurants",
    rating: 5.0,
    reviews: 0,
    description: "Be the first restaurant listed here.",
    services: ["Dine in", "Takeaway", "Delivery"],
    location: "Pretoria East",
    address: "Pretoria East, Gauteng",
    whatsapp:"",
    featured: true,
},

{
    id: 2,
    name: "Coming Soon",
    category: "CarWash",
    rating: 5.0,
    reviews: 0,
    description: "Be the first carwash listed here.",
    services: ["Exterior wash", "Interior cleaning", "Hand Wash"],
    location: "Pretoria East",
    address: "Pretoria East, Gauteng",
    whatsapp:"",
    featured: false,  
},

{
    id: 3,
    name: "Coming Soon",
    category: "Beauty",
    rating: 5.0,
    reviews: 0,
    description: "Be the first beauty business listed here.",
    services: ["Haircut", "Coloring", "Treatment"],
    location: "Pretoria East",
    address: "Pretoria East, Gauteng",
    whatsapp:"",
    featured: false,
},

{
    id: 4,
    name: "Coming Soon",
    category: "Automotive",
    rating: 5.0,
    reviews: 0,
    description: "Be the first automotive business listed here.",
    services: ["Oil Change", "Tire Rotation", "Brake Service"],
    location: "Pretoria East",
    address: "Pretoria East, Gauteng",
    whatsapp:"",
    featured: false,
},

{
    id: 5,
    name: "Coming Soon",
    category: "Services",
    rating: 5.0,
    reviews: 0,
    description: "Be the first services business listed here.",
    services: ["Plumbing", "Electrical", "Cleaning"],
    location: "Pretoria East",
    address: "Pretoria East, Gauteng",
    whatsapp:"",
    featured: true,
}
];

async function init() {
  const response = await fetch('./businesses.json');
  const businesses = await response.json();

  //==GET ID FROM URL==
  const params = new URLSearchParams(window.location.search);
  const businessId = parseInt(params.get('id'));

  //==FIND BUSINESS==
  const business = businesses.find(b => b.id === businessId);

  //==RENDER==
  if (!business) {
    document.getElementById('listingContent').innerHTML = `
      <div class="empty-state">
        <p>Business not found.</p>
        <a href="index.html">← Back to home</a>
      </div>
    `;
    return;
  }

  document.title = `${business.name} — VertRepo`;

  document.getElementById('listingContent').innerHTML = `
    <div class="listing-cover">
      <div class="listing-cover-placeholder">
        ${business.category === 'restaurants' ? '🍽️' :
          business.category === 'carwashes' ? '🚗' :
          business.category === 'beauty' ? '💅' :
          business.category === 'auto' ? '🔧' : '🛠️'}
      </div>
    </div>
    <div class="listing-detail-container">
      <div class="listing-header">
        ${business.featured ? '<div class="card-badge">⭐ Featured</div>' : ''}
        <div class="card-category">${business.category}</div>
        <h1 class="listing-name">${business.name}</h1>
        <div class="card-rating">
          <span class="stars">★★★★★</span>
          <span class="rating-num">${business.rating}</span>
          <span class="review-count">(${business.reviews} reviews)</span>
        </div>
        <p class="listing-location">📍 ${business.address}</p>
      </div>

      <div class="listing-section">
        <h2>About</h2>
        <p>${business.description}</p>
      </div>

      <div class="listing-section">
        <h2>Services</h2>
        <div class="services-list">
          ${business.services.map(s => `<span class="service-tag">${s}</span>`).join('')}
        </div>
      </div>

      <div class="listing-actions">
        ${business.whatsapp ? `
          <a href="https://wa.me/${business.whatsapp}"
             target="_blank"
             class="btn-whatsapp">
            💬 WhatsApp
          </a>` : ''}
        <a href="claim.html" class="btn-claim">Claim this listing</a>
      </div>
    </div>
  `;
}

window.addEventListener('DOMContentLoaded', init);