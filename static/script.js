// Toggle mobile menu
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            // Scroll to element
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Form refresh button functionality
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('Refreshbtn');
    const resumeInput = document.getElementById('resume');
    const jobDescInput = document.getElementById('job_desc');
    const resultsCard = document.getElementById('results');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            if (resumeInput) resumeInput.value = '';
            if (jobDescInput) jobDescInput.value = '';
            if (resultsCard) resultsCard.style.display = 'none';
        });
    }
    
    // File input styling enhancement
    if (resumeInput) {
        resumeInput.addEventListener('change', function() {
            const fileName = this.files[0]?.name;
            if (fileName) {
                // You could add code here to show the filename
                console.log('File selected:', fileName);
            }
        });
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.style.padding = '5px 20px';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.padding = '10px 20px';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});