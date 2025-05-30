// Handle navbar visibility on scroll
document.addEventListener('DOMContentLoaded', function() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header-container');
    const scrollThreshold = 10;
    let isScrolling;
    
    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', function() {
        clearTimeout(isScrolling);
        
        isScrolling = setTimeout(function() {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show/hide header based on scroll direction
            if (Math.abs(lastScrollTop - currentScrollTop) > scrollThreshold) {
                if (currentScrollTop > lastScrollTop && currentScrollTop > header.offsetHeight) {
                    // Scrolling down & past header height - hide header
                    header.classList.add('hidden');
                } else {
                    // Scrolling up - show header
                    header.classList.remove('hidden');
                }
                lastScrollTop = currentScrollTop;
            }
        }, 10);
    }, false);
});