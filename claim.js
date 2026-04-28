window.addEventListener('DOMContentLoaded', () => {

  // ===== PHOTO PREVIEW =====
  const photoInput = document.getElementById('photoUpload');
  const photoPreview = document.getElementById('photoPreview');

  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoPreview.style.display = 'block';
          photoPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ===== FORM VALIDATION =====
  const form = document.getElementById('claimForm');

  form.addEventListener('submit', (e) => {
    const name = document.getElementById('businessName').value.trim();
    const category = document.getElementById('businessCategory').value;
    const description = document.getElementById('businessDesc').value.trim();
    const phone = document.getElementById('businessPhone').value.trim();
    const address = document.getElementById('businessAddress').value.trim();

    if (!name || !category || !description || !phone || !address) {
      e.preventDefault();
      showError('Please fill in all required fields.');
      return;
    }
  });
});

// ===== ERROR HELPER =====
function showError(msg) {
  const existing = document.getElementById('formError');
  if (existing) existing.remove();

  const error = document.createElement('div');
  error.id = 'formError';
  error.className = 'form-error';
  error.textContent = msg;

  const form = document.getElementById('claimForm');
  form.prepend(error);
}

