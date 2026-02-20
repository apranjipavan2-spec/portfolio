document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    
    // Default to light mode if no preference is saved, or if 'light' is saved
    if (!savedTheme || savedTheme === 'light') {
        body.classList.add('light-theme');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        
        // Update Icon
        if (isLight) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Contact Modal Logic - Disabled to allow scroll to bottom
    // const contactBtn = document.getElementById('contact-btn');
    // const modal = document.getElementById('contact-modal');
    // const closeBtn = document.querySelector('.close-btn');

    // if (contactBtn && modal && closeBtn) {
    //     contactBtn.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         modal.style.display = 'flex';
    //     });

    //     closeBtn.addEventListener('click', () => {
    //         modal.style.display = 'none';
    //     });

    //     window.addEventListener('click', (e) => {
    //         if (e.target === modal) {
    //             modal.style.display = 'none';
    //         }
    //     });
    // }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate').forEach(el => {
        observer.observe(el);
    });

    // 1. Skill Bar Glow - Highlight the last active dash
    document.querySelectorAll('.skill-dashes').forEach(dashContainer => {
        const activeDashes = dashContainer.querySelectorAll('.dash.on');
        if (activeDashes.length > 0) {
            activeDashes[activeDashes.length - 1].classList.add('glow');
        }
    });

    // 2. Stats Rolling Animation (Repeats every 5s)
    const stats = document.querySelectorAll('.stat-number');
    
    // Store original values
    stats.forEach(stat => {
        const originalText = stat.innerText; // e.g. "200+"
        const numericValue = parseInt(originalText.replace(/\D/g, '')); // 200
        const suffix = originalText.replace(/[0-9]/g, ''); // "+"
        
        stat.setAttribute('data-target', numericValue);
        stat.setAttribute('data-suffix', suffix);
    });

    function animateStats() {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix');
            
            let current = 0;
            const duration = 2000; // 2 seconds animation
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.innerText = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.innerText = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    }

    // Initial run
    animateStats();

    // Repeat every 5 seconds
    setInterval(animateStats, 5000);

    // 3. Typing Animation Loop (Type -> Wait 3s -> Delete -> Repeat)
    const typingTextElement = document.getElementById('typing-text');
    const textToType = "meaningful insights from raw data </code>";
    const typingDelay = 40;
    const deletingDelay = 20;
    const waitTime = 3000; // 3 seconds wait

    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
        const currentText = textToType.substring(0, charIndex);
        
        // Handle HTML entities if needed, but for this string plain text is fine 
        // except the closing tag which we want to appear as code not actual HTML tag
        // Since we are setting innerText, it will render as literal text which is what we want for the "code" look
        typingTextElement.innerText = currentText;

        if (!isDeleting && charIndex < textToType.length) {
            // Typing
            charIndex++;
            setTimeout(typeLoop, typingDelay);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            charIndex--;
            setTimeout(typeLoop, deletingDelay);
        } else {
            // Phase Change
            isDeleting = !isDeleting;
            if (!isDeleting) {
                // Just finished deleting, start typing immediately
                setTimeout(typeLoop, 500);
            } else {
                // Just finished typing, wait 3 seconds before deleting
                setTimeout(typeLoop, waitTime);
            }
        }
    }
    
    // Start the typing loop
    typeLoop();

    // 4. Experience Spotlight Effect
    document.querySelectorAll('.experience-tile').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
