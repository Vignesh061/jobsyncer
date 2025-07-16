 // JavaScript for toggling the mobile menu
 const hamburger = document.getElementById('hamburger');
 const navLinks = document.getElementById('navLinks');

 function toggleMenu() {
     navLinks.classList.toggle('active');
     hamburger.classList.toggle('active'); // Toggle active class for X animation
     
     // Prevent scrolling when menu is open
     if (navLinks.classList.contains('active')) {
         document.body.style.overflow = 'hidden';
     } else {
         document.body.style.overflow = 'auto';
     }
 }

 hamburger.addEventListener('click', function (e) {
     e.stopPropagation();
     toggleMenu();
 });

 // Close mobile menu when clicking outside
 document.addEventListener('click', function (e) {
     const isClickInsideNav = navLinks.contains(e.target);
     const isClickOnHamburger = hamburger.contains(e.target);

     if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
         toggleMenu();
     }
 });

 // Close mobile menu when clicking on a nav link
 const navItems = document.querySelectorAll('.nav-links ul li a');
 navItems.forEach(item => {
     item.addEventListener('click', function () {
         if (navLinks.classList.contains('active')) {
             toggleMenu();
         }
     });
 });

 // Close mobile menu when window is resized above mobile breakpoint
 window.addEventListener('resize', function () {
     if (window.innerWidth > 767 && navLinks.classList.contains('active')) {
         navLinks.classList.remove('active');
         hamburger.classList.remove('active');
         document.body.style.overflow = 'auto';
     }
 });
// Reset form
// const refreshBtn = document.getElementById('Refreshbtn');
// if (refreshBtn) {
//     refreshBtn.addEventListener('click', () => {
//         document.getElementById('resume').value = '';
//         document.getElementById('job_desc').value = '';
        
//         const resultsDiv = document.getElementById('results');
//         if (resultsDiv) {
//             resultsDiv.style.display = 'none';
//         }
//     });
// }
// JavaScript to make the interface interactive
document.addEventListener('DOMContentLoaded', function() {
    // Word and character counter
    const jobDescTextarea = document.getElementById('job_desc');
    const wordCounter = document.getElementById('word-counter');
    const charCounter = document.getElementById('char-counter');
    
    if (jobDescTextarea) {
        jobDescTextarea.addEventListener('input', function() {
            const text = this.value;
            const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
            const charCount = text.length;
            
            wordCounter.textContent = `${wordCount} words`;
            charCounter.textContent = `${charCount} characters`;
        });
        
        // Initialize counters if job description already has content
        if (jobDescTextarea.value) {
            const wordCount = jobDescTextarea.value.split(/\s+/).filter(word => word.length > 0).length;
            const charCount = jobDescTextarea.value.length;
            
            wordCounter.textContent = `${wordCount} words`;
            charCounter.textContent = `${charCount} characters`;
        }
    }
    
    // Reset button functionality
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const resumeInput = document.getElementById('resume');
            if (resumeInput) resumeInput.value = '';
            
            if (jobDescTextarea) jobDescTextarea.value = '';
            if (wordCounter) wordCounter.textContent = '0 words';
            if (charCounter) charCounter.textContent = '0 characters';
            
            // Hide results and show placeholder
            const resultsOutput = document.getElementById('results-output');
            const resultsPlaceholder = document.getElementById('results-placeholder');
            const downloadBtn = document.getElementById('download-btn');
            
            if (resultsOutput) resultsOutput.style.display = 'none';
            if (resultsPlaceholder) resultsPlaceholder.style.display = 'flex';
            if (downloadBtn) downloadBtn.disabled = true;
        });
    }
    
    // Form submission - Show loading spinner
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function() {
            const loadingSpinner = document.querySelector('.loading');
            const resultsPlaceholder = document.getElementById('results-placeholder');
            
            if (loadingSpinner) loadingSpinner.style.display = 'flex';
            if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
            
            // Don't preventDefault - allow the form to submit to the backend
        });
    }
    
    // Style score circle based on score value (if it exists)
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle && scoreCircle.getAttribute('data-score')) {
        const score = parseFloat(scoreCircle.getAttribute('data-score'));
        
        // Apply color based on score
        if (score < 40) {
            scoreCircle.style.background = 'linear-gradient(40deg, #e74c3c, #c0392b)';
        } else if (score < 70) {
            scoreCircle.style.background = 'linear-gradient(40deg, #f39c12, #d35400)';
        } else {
            scoreCircle.style.background = 'linear-gradient(40deg, #2ecc71, #27ae60)';
        }
    }
    
    // Fix styling for keyword pills
    const keywordPills = document.querySelectorAll('.keyword-pill');
    keywordPills.forEach(pill => {
        pill.classList.add('keyword-tag');
    });
    
    // Download button functionality
    const downloadBtn = document.getElementById('download-btn');
    const downloadTooltip = document.getElementById('download-tooltip');
    
    if (downloadBtn && downloadTooltip) {
        downloadBtn.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Get the results data
            const score = document.getElementById('match-score')?.textContent || 'N/A';
            const issues = Array.from(document.querySelectorAll('#ats-issues li')).map(li => li.textContent);
            const keywords = Array.from(document.querySelectorAll('.keyword-tag')).map(span => span.textContent);
            const timestamp = document.getElementById('results-stats')?.textContent || new Date().toLocaleString();
            
            // Create report content
            let reportContent = `
# Resume ATS Analysis Report
${timestamp}

## Match Score
${score}

## ATS Friendliness Check
${issues.map(issue => `- ${issue}`).join('\n')}

## Missing Keywords
${keywords.length > 0 ? keywords.map(keyword => `- ${keyword}`).join('\n') : 'No missing keywords detected!'}
            `;
            
            // Create a blob and download link
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume-ats-report.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show tooltip
            downloadTooltip.style.opacity = '1';
            downloadTooltip.style.visibility = 'visible';
            
            // Hide tooltip after 2 seconds
            setTimeout(function() {
                downloadTooltip.style.opacity = '0';
                downloadTooltip.style.visibility = 'hidden';
            }, 2000);
        });
    }
});