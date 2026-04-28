//===PHOTO REVIEW===

window.addEventListener('DOMContentLoaded', () =>{
    const photoInput = document.getElementById('photoUpload')
    const photoReview = document.getElementById('photoReview')

    if(photoInput){
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0]; 
            if(file){
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.style.display = 'block'; 
                    photoPreview.src = e.target.result; 
                };
                reader.readAsDataURL(file);
            }
        });
    }

//==FILE VALIDATION==

const form = document.getElementById('claimForm')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('businessName').value.trim();
    const category = document.getElementById('businessCategory').value;
    const description = document.getElementById('businessDesc').value.trim();
    const phone = document.getElementById('businessPhone').value.trim();
    const whatsapp = document.getElementById('businessWhatsapp').value.trim(); 
    const address = document.getElementById('businessAddress').value.trim()


    if(!name || !category || !description || !phone || !whatsapp || !address)
})



})