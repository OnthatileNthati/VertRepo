const burger = document.querySelector('.nav__burger');
if (burger) {
  burger.addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('nav--open');
  });
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

async function init() {
  try {
    const response = await fetch('../businesses.json');
    const businesses = await response.json();

    const params = new URLSearchParams(window.location.search);
    const businessId = parseInt(params.get('id'));
    const business = businesses.find(function(b) { return b.id === businessId; });

    if (!business) {
      document.getElementById('listingContent').innerHTML = '<div class="empty-state"><p>Business not found.</p><a href="search.html">← Back to directory</a></div>';
      return;
    }

    document.title = business.name + ' — VertGuide';
    injectSchema(business);

    let coverHTML = '';
    if (business.images && business.images.length > 0) {
      coverHTML = '<div class="listing-images">' + business.images.map(function(img) {
        return '<img src="' + img + '" class="listing-img" alt="' + business.name + '" />';
      }).join('') + '</div>';
    } else {
      coverHTML = '<i data-lucide="' + getCategoryIcon(business.category) + '" class="listing-cover-placeholder"></i>';
    }

    const fullStars = Math.round(business.rating || 0);
    const starsHTML = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

    const servicesHTML = (business.services && business.services.length > 0)
      ? business.services.map(function(s) { return '<span class="service-tag">' + s + '</span>'; }).join('')
      : '<p>No services listed yet.</p>';

    document.getElementById('listingContent').innerHTML =
      '<div class="listing-cover">' + coverHTML + '</div>' +
      '<div class="listing-detail-container">' +
        '<div class="listing-header">' +
          (business.featured ? '<div class="card-badge"><i data-lucide="star"></i> Featured</div>' : '') +
          '<div class="card-category">' + business.category + '</div>' +
          '<h1 class="listing-name">' + business.name + '</h1>' +
          '<div class="card-rating"><span class="stars">' + starsHTML + '</span><span class="rating-num">' + business.rating + '</span><span class="review-count">(' + business.reviews + ' reviews)</span></div>' +
          '<p class="listing-location"><i data-lucide="map-pin"></i> ' + business.address + '</p>' +
        '</div>' +
        '<div class="listing-section"><h2>About</h2><p>' + business.description + '</p></div>' +
        '<div class="listing-section"><h2>Services</h2><div class="services-list">' + servicesHTML + '</div></div>' +
        '<div class="listing-actions">' +
          (business.whatsapp ? '<a href="https://wa.me/' + business.whatsapp + '" target="_blank" class="btn-whatsapp"><i data-lucide="message-circle"></i> WhatsApp</a>' : '') +
          (business.mapsUrl ? '<a href="' + business.mapsUrl + '" target="_blank" class="btn-claim"><i data-lucide="map-pin"></i> Get Directions</a>' : '') +
          (business.googleReviewsUrl ? '<a href="' + business.googleReviewsUrl + '" target="_blank" class="btn-claim"><i data-lucide="external-link"></i> Read Reviews</a>' : '') +
          '<a href="claim.html" class="btn-claim">Claim this listing</a>' +
        '</div>' +
      '</div>';

    if (window.lucide) lucide.createIcons();

  } catch (err) {
    console.error('Failed to load listing:', err);
    document.getElementById('listingContent').innerHTML = '<div class="empty-state"><p>Something went wrong loading this listing.</p></div>';
  }
}

function injectSchema(business) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": "Pretoria East",
      "addressCountry": "ZA"
    },
    "aggregateRating": business.reviews > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.reviews
    } : undefined,
    "url": window.location.href
  };

  if (business.whatsapp) {
    schema.telephone = "+" + business.whatsapp;
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}



window.addEventListener('DOMContentLoaded', init);