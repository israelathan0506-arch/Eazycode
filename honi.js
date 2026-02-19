const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

searchBtn.addEventListener("click", () => {
  searchModal.classList.add("active");
});

closeSearch.addEventListener("click", () => {
  searchModal.classList.remove("active");
});

// Click outside to close
searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.classList.remove("active");
  }
});

// ESC key close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    searchModal.classList.remove("active");
  }
});





 (function(){
  const carousel = document.getElementById('carousel');
  const wrapper = document.getElementById('carouselWrapper');
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsRoot = document.getElementById('dots');
  const srStatus = document.getElementById('shangaii');

  const AUTOPLAY_INTERVAL = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--autoplay-interval')) || 4500;
  const FADE_DURATION = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fade-duration')) || 800;

  let current = 0;
  let autoplayTimer = null;
  let isPaused = false;

  // build dots
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'dot';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.setAttribute('data-index', i);
    btn.title = `Go to slide ${i+1}`;
    btn.addEventListener('click', () => goTo(i, true));
    dotsRoot.appendChild(btn);
  });

  function updateUI(prevIndex, nextIndex){
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
    });
    Array.from(dotsRoot.children).forEach((d,i)=>{
      d.setAttribute('aria-pressed', i === nextIndex ? 'true' : 'false');
    });
    // announce
    const title = slides[nextIndex].querySelector('.carousel__title')?.textContent || `Slide ${nextIndex+1}`;
    srStatus.textContent = `Showing ${title} (${nextIndex+1} of ${slides.length})`;
    current = nextIndex;
  }

  function goTo(index, userTriggered=false){
    index = (index + slides.length) % slides.length;
    if (index === current) return;
    const prev = current;
    // immediately set aria-hidden; CSS handles crossfade with opacity
    updateUI(prev, index);
    // restart autoplay if user interacted
    if (userTriggered) restartAutoplay();
  }

  function next(){
    goTo(current + 1, false);
  }
  function prev(){
    goTo(current - 1, false);
  }

  prevBtn.addEventListener('click', ()=> { prev(); restartAutoplay(); });
  nextBtn.addEventListener('click', ()=> { next(); restartAutoplay(); });

  // keyboard
  carousel.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
    if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
  });

  // pause on hover or focus inside carousel
  carousel.addEventListener('mouseenter', () => pauseAutoplay());
  carousel.addEventListener('mouseleave', () => resumeAutoplay());
  carousel.addEventListener('focusin', () => pauseAutoplay());
  carousel.addEventListener('focusout', () => resumeAutoplay());

  // swipe support
  let startX = 0, deltaX = 0;
  const vp = carousel;
  vp.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX);
  vp.addEventListener('touchmove', (e)=> deltaX = e.touches[0].clientX - startX);
  vp.addEventListener('touchend', ()=> {
    if (Math.abs(deltaX) > 40){
      if (deltaX < 0) next(); else prev();
      restartAutoplay();
    }
    deltaX = 0;
  });

  // autoplay
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      if (!isPaused) next();
    }, AUTOPLAY_INTERVAL);
  }
  function stopAutoplay(){ if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
  function pauseAutoplay(){ isPaused = true; }
  function resumeAutoplay(){ isPaused = false; }
  function restartAutoplay(){ pauseAutoplay(); setTimeout(()=>{ resumeAutoplay(); }, 60); }

  // entrance animation: add .visible after DOM loads & small delay
  document.addEventListener('DOMContentLoaded', () => {
    // force reflow then add class to trigger transition
    requestAnimationFrame(()=> {
      wrapper.classList.add('visible');
    });
  });

  // initialize
  updateUI(0, 0);
  startAutoplay();

  // make the carousel focusable for keyboard access
  carousel.tabIndex = 0;

  // optional: expose functions for debugging
  window.__myCarousel = { goTo, next, prev, startAutoplay, stopAutoplay };
})();


// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Only attach handlers if elements exist
if (hamburger && navMenu) {
    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    if (navLinks && navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's a dropdown toggle
                if (!link.classList.contains('dropdown-toggle')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Dropdown toggle functionality
const dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(d => d.classList.remove('active'));
    }
});

// Close dropdown when a dropdown link is clicked
const dropdownLinks = document.querySelectorAll('.dropdown-link');
dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
        dropdowns.forEach(d => d.classList.remove('active'));
        // Close hamburger menu on mobile
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Intersection Observer for reveal-on-scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden, .hidden2');
hiddenElements.forEach((el) => observer.observe(el));

// Modal Functionality
const registerBtn = document.getElementById('registerBtn');
const registerModal = document.getElementById('registerModal');
const closeBtn = document.querySelector('.close');
const registerForm = document.getElementById('registerForm');

// Function to close modal
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Function to open modal
function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        // Focus on first input for accessibility
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

// Open modal when "Register Now" button is clicked
if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(registerModal);
    });
}

// Close modal when close button (X) is clicked
if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
    });
}

// Close modal when clicking outside the modal content
if (registerModal) {
    window.addEventListener('click', (event) => {
        if (event.target === registerModal) {
            closeModal(registerModal);
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal(registerModal);
        closeModal(tourModal);
    }
});

// Handle form submission
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.studentName || !data.email || !data.phone || !data.grade) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Log the data (you can send to server here)
        console.log('Registration submitted:', data);
        
        // Show success message
        alert('Thank you for registering! We will contact you soon.');
        
        // Reset form
        registerForm.reset();
        
        // Close modal
        closeModal(registerModal);
    });
}

// Tour Modal Functionality
const tourBtn = document.getElementById('tourBtn');
const tourModal = document.getElementById('tourModal');
const tourCloseBtn = document.querySelector('.tour-close');
const tourForm = document.getElementById('tourForm');

// Open tour modal when "Schedule a Tour" button is clicked
if (tourBtn) {
    tourBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(tourModal);
    });
}

// Close tour modal when close button (X) is clicked
if (tourCloseBtn) {
    tourCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(tourModal);
    });
}

// Close tour modal when clicking outside the modal content
if (tourModal) {
    window.addEventListener('click', (event) => {
        if (event.target === tourModal) {
            closeModal(tourModal);
        }
    });
}

// Handle tour form submission
if (tourForm) {
    tourForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(tourForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!data.visitorName || !data.visitorEmail || !data.visitorPhone || !data.tourDate) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Log the data (you can send to server here)
        console.log('Tour scheduled:', data);
        
        // Show success message
        alert('Thank you! We\'ve scheduled your campus tour. We\'ll see you soon!');
        
        // Reset form
        tourForm.reset();
        
        // Close modal
        closeModal(tourModal);
    });
}


