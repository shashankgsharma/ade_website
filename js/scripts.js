// JavaScript for handling the slider
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slide indices for each slider
    const sliderStates = {};
    
    function initializeSlider(slider) {
        const productId = slider.querySelector('.slide').id.split('-')[1];
        if (!sliderStates[productId]) {
            sliderStates[productId] = 1;
        }
        
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');
        
        nextButton.addEventListener('click', () => {
            changeSlide(1, productId, slider);
        });
        
        prevButton.addEventListener('click', () => {
            changeSlide(-1, productId, slider);
        });
    }
    
    // Function to change slides
    function changeSlide(direction, productId, slider) {
        const slides = slider.getElementsByClassName('slide');
        sliderStates[productId] += direction;
        
        if (sliderStates[productId] > slides.length) {
            sliderStates[productId] = 1;
        }
        if (sliderStates[productId] < 1) {
            sliderStates[productId] = slides.length;
        }
        
        // Hide all slides
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        // Show the current slide
        slides[sliderStates[productId] - 1].style.display = "block";
    }
    
    // Initialize all sliders in the main view
    document.querySelectorAll('.image-slider').forEach(initializeSlider);

    // Handle product card clicks for modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on buttons
            if (e.target.classList.contains('btn') || 
                e.target.classList.contains('prev') || 
                e.target.classList.contains('next')) {
                return;
            }
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    ${this.innerHTML}
                </div>
            `;
            
            document.body.appendChild(modal);
            modal.style.display = 'block';
            
            // Initialize slider in the modal
            const modalSlider = modal.querySelector('.image-slider');
            if (modalSlider) {
                initializeSlider(modalSlider);
            }
            
            // Update URL with product ID
            const productId = this.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const url = new URL(window.location);
            url.searchParams.set('product', productId);
            window.history.pushState({}, '', url);

            // Re-attach share button functionality in modal
            modal.querySelector('.btn.share').addEventListener('click', async (e) => {
                e.stopPropagation();
                const shareUrl = window.location.href;
                
                try {
                    if (navigator.share) {
                        await navigator.share({
                            title: productId,
                            text: `Check out ${productId} from A.D. Enterprises`,
                            url: shareUrl
                        });
                    } else {
                        await navigator.clipboard.writeText(shareUrl);
                        const msg = document.createElement('div');
                        msg.style.cssText = `
                            position: fixed;
                            bottom: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: rgba(0,0,0,0.8);
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            z-index: 1001;
                        `;
                        msg.textContent = 'Link copied to clipboard!';
                        document.body.appendChild(msg);
                        setTimeout(() => msg.remove(), 2000);
                    }
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            });
            
            modal.querySelector('.close-modal').onclick = function() {
                modal.remove();
                const url = new URL(window.location);
                url.searchParams.delete('product');
                window.history.pushState({}, '', url);
            };
            
            window.onclick = function(event) {
                const modal = document.querySelector('.modal');
                if (event.target == modal) {
                    modal.remove();
                    const url = new URL(window.location);
                    url.searchParams.delete('product');
                    window.history.pushState({}, '', url);
                }
            };
        });
    });

    // Add share button clipboard copy for homepage product cards
    document.querySelectorAll('.product-card .btn.share').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const productId = card.querySelector('h3').textContent.toLowerCase().replace(/\s+/g, '-');
            const url = new URL(window.location);
            url.searchParams.set('product', productId);
            const shareUrl = url.toString();
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: productId,
                        text: `Check out ${productId} from A.D. Enterprises`,
                        url: shareUrl
                    });
                } else {
                    await navigator.clipboard.writeText(shareUrl);
                    const msg = document.createElement('div');
                    msg.style.cssText = `
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(99,102,241,0.95);
                        color: white;
                        padding: 12px 28px;
                        border-radius: 8px;
                        z-index: 2000;
                        font-size: 1rem;
                        box-shadow: 0 2px 8px rgba(99,102,241,0.15);
                    `;
                    msg.textContent = 'Link copied to clipboard!';
                    document.body.appendChild(msg);
                    setTimeout(() => msg.remove(), 2000);
                }
            } catch (err) {
                console.error('Error sharing:', err);
            }
        });
    });

    // Handle shared URLs on page load
    function openProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            const productCards = document.querySelectorAll('.product-card');
            for (const card of productCards) {
                const cardTitle = card.querySelector('h3').textContent;
                if (cardTitle.toLowerCase().replace(/\s+/g, '-') === productId) {
                    card.click();
                    break;
                }
            }
        }
    }

    // Open product modal if URL has a product parameter
    openProductFromURL();

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
        openProductFromURL();
    });
    
    // Ensure the close-modal button works for all modals, including the last two product cards
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close-modal')) {
            const modal = event.target.closest('.modal');
            modal.remove();
            const url = new URL(window.location);
            url.searchParams.delete('product');
            window.history.pushState({}, '', url);
        }
    });
});
