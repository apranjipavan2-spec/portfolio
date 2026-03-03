document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");

  // Check saved preference
  const savedTheme = localStorage.getItem("theme");

  // Default to light mode if no preference is saved, or if 'light' is saved
  if (!savedTheme || savedTheme === "light") {
    body.classList.add("light-theme");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const isLight = body.classList.contains("light-theme");

    // Update Icon
    if (isLight) {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      localStorage.setItem("theme", "dark");
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
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate").forEach((el) => {
    observer.observe(el);
  });

  // 1. Skill Bar Glow - Highlight the last active dash
  document.querySelectorAll(".skill-dashes").forEach((dashContainer) => {
    const activeDashes = dashContainer.querySelectorAll(".dash.on");
    if (activeDashes.length > 0) {
      activeDashes[activeDashes.length - 1].classList.add("glow");
    }
  });

  // 2. Stats Rolling Animation (Repeats every 5s)
  const stats = document.querySelectorAll(".stat-number");

  // Store original values
  stats.forEach((stat) => {
    const originalText = stat.innerText; // e.g. "200+"
    const numericValue = parseInt(originalText.replace(/\D/g, "")); // 200
    const suffix = originalText.replace(/[0-9]/g, ""); // "+"

    stat.setAttribute("data-target", numericValue);
    stat.setAttribute("data-suffix", suffix);
  });

  function animateStats() {
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const suffix = stat.getAttribute("data-suffix");

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
  const typingTextElement = document.getElementById("typing-text");
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
  document.querySelectorAll(".experience-tile").forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 5. Expand/Collapse All toggle logic
  window.toggleSectionDetails = function (sectionId, btn) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const detailsElements = section.querySelectorAll("details");
    const isCurrentlyExpanded = btn.innerText === "Collapse All";

    detailsElements.forEach((details) => {
      if (isCurrentlyExpanded) {
        details.removeAttribute("open");
      } else {
        details.setAttribute("open", "");
      }
    });

    btn.innerText = isCurrentlyExpanded ? "Expand All" : "Collapse All";
  };

  // 6. Portfolio Carousel Logic
  const track = document.getElementById('workTrack');
  const prevBtn = document.getElementById('prevWorkBtn');
  const nextBtn = document.getElementById('nextWorkBtn');

  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const items = track.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let autoScrollTimer;

    function getVisibleItemsCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 991) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleItems = getVisibleItemsCount();
      const maxIndex = Math.max(0, totalItems - visibleItems);
      
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }
      
      const itemWidth = items[0].offsetWidth;
      // 30px is the gap defined in CSS
      const gap = 30; 
      
      const moveDistance = (itemWidth + gap) * currentIndex;
      track.style.transform = `translateX(-${moveDistance}px)`;
    }

    function moveNext() {
      const visibleItems = getVisibleItemsCount();
      const maxIndex = Math.max(0, totalItems - visibleItems);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // loop back to first
      }
      updateCarousel();
    }

    function movePrev() {
      const visibleItems = getVisibleItemsCount();
      const maxIndex = Math.max(0, totalItems - visibleItems);
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex; // loop back to end
      }
      updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
      moveNext();
      resetAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
      movePrev();
      resetAutoScroll();
    });

    window.addEventListener('resize', updateCarousel);

    // Auto-scroll every 2 seconds
    function startAutoScroll() {
      autoScrollTimer = setInterval(moveNext, 3000);
    }

    function resetAutoScroll() {
      clearInterval(autoScrollTimer);
      startAutoScroll();
    }

    startAutoScroll();
    updateCarousel(); // Initial setup
  }

  // 7. Image Modal Logic
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("img01");
  const captionText = document.getElementById("caption");
  const closeBtn = document.getElementsByClassName("close-modal")[0];

  if (modal && modalImg && closeBtn) {
    document.querySelectorAll(".clickable-img").forEach((img) => {
      img.addEventListener("click", function() {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.innerHTML = this.alt;
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    });

    closeBtn.addEventListener("click", function() {
      modal.style.display = "none";
      document.body.style.overflow = "auto"; // Restore scrolling
    });

    // Close on click outside image
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }
});
