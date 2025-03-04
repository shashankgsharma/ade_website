// JavaScript for handling the slider
document.addEventListener('DOMContentLoaded', function() {
    // Initialize slide index for each slider
    var sliders = document.querySelectorAll('.image-slider');
    sliders.forEach(function(slider, index) {
        let slideIndex = 1;
        showSlides(slider, slideIndex);

        // Next/previous controls
        slider.querySelector('.next').addEventListener('click', function() {
            showSlides(slider, slideIndex += 1);
        });

        slider.querySelector('.prev').addEventListener('click', function() {
            showSlides(slider, slideIndex -= 1);
        });

        function showSlides(slider, n) {
            let slides = slider.getElementsByClassName('slide');
            if (n > slides.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = slides.length }
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            slides[slideIndex - 1].style.display = "block";
        }
    });
});

document.querySelectorAll('.slide img').forEach(img => {
    img.onload = function() {
        if (this.naturalHeight > this.naturalWidth) {
            this.style.height = '100%';
            this.style.width = 'auto';
        }
    };
});
