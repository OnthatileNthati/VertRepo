async function init() {
  const response = await fetch('./businesses.json');
  const businesses = await response.json();

  const params = new URLSearchParams(window.location.search);
  const businessId = parseInt(params.get('id'));
  const business = businesses.find(function(b) { return b.id === businessId; });

  if (!business) {
    document.getElementById('listingContent').innerHTML = '<div class="empty-state"><p>Business not found.</p><a href="index.html">← Back to home</a></div>';
    return;
  }

  document.title = business.name + ' — VertRepo';

  var coverHTML = '';
  if (business.images && business.images.length > 0) {
    coverHTML = '<div class="listing-images">' + business.images.map(function(img) {
      return '<img src="' + img + '" class="listing-img" alt="' + business.name + '" />';
    }).join('') + '</div>';
  } else {
    var emoji = business.category === 'restaurants' ? '🍽️' :
                business.category === 'carwashes' ? '🚗' :
                business.category === 'beauty' ? '💅' :
                business.category === 'auto' ? '🔧' : '🛠️';
    coverHTML = '<div class="listing-cover-placeholder">' + emoji + '</div>';
  }

  document.getElementById('listingContent').innerHTML = '<div class="listing-cover">' + coverHTML + '</div>' +
    '<div class="listing-detail-container">' +
      '<div class="listing-header">' +
        (business.featured ? '<div class="card-badge">⭐ Featured</div>' : '') +
        '<div class="card-category">' + business.category + '</div>' +
        '<h1 class="listing-name">' + business.name + '</h1>' +
        '<div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">' + business.rating + '</span><span class="review-count">(' + business.reviews + ' reviews)</span></div>' +
        '<p class="listing-location">📍 ' + business.address + '</p>' +
      '</div>' +
      '<div class="listing-section"><h2>About</h2><p>' + business.description + '</p></div>' +
      '<div class="listing-section"><h2>Services</h2><div class="services-list">' +
        business.services.map(function(s) { return '<span class="service-tag">' + s + '</span>'; }).join('') +
      '</div></div>' +
      '<div class="listing-actions">' +
        (business.whatsapp ? '<a href="https://wa.me/' + business.whatsapp + '" target="_blank" class="btn-whatsapp">💬 WhatsApp</a>' : '') +
        '<a href="claim.html" class="btn-claim">Claim this listing</a>' +
      '</div>' +
    '</div>';
}

window.addEventListener('DOMContentLoaded', init);