document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.getElementById('main-nav');
  
  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Hero Banner Slider - video (5s) → image2 (5s) → image3 (5s) → video → ...
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const heroVideo = document.getElementById('hero-video');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval = null;

    function showSlide(index) {
      // Pause video when leaving video slide
      if (heroVideo && slides[currentSlide].getAttribute('data-slide-type') === 'video') {
        heroVideo.pause();
      }
      // Remove active from all slides
      for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }
      // Remove active from all dots
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
      }
      // Add active to current slide and dot
      slides[index].classList.add('active');
      if (dots[index]) {
        dots[index].classList.add('active');
      }
      currentSlide = index;
      // Play video when entering video slide
      if (heroVideo && slides[index].getAttribute('data-slide-type') === 'video') {
        heroVideo.currentTime = 0;
        heroVideo.playbackRate = 1.0;
        heroVideo.muted = true;
        heroVideo.play().catch(function() {});
      }
    }

    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= slides.length) {
        next = 0;
      }
      showSlide(next);
    }

    function startSlider() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    // Dot navigation
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', function() {
        stopSlider();
        showSlide(i);
        startSlider();
      });
    }

    // Start auto-slide immediately
    startSlider();
  }

  // Hero video: force autoplay on all devices (muted + playsInline required for iOS/Android)
  const heroVideoEl = document.getElementById('hero-video');
  if (heroVideoEl) {
    heroVideoEl.muted = true;
    heroVideoEl.setAttribute('muted', '');
    heroVideoEl.playsInline = true;
    heroVideoEl.setAttribute('playsinline', '');
    heroVideoEl.playbackRate = 1.0;
    heroVideoEl.volume = 0;

    function tryPlay() {
      var p = heroVideoEl.play();
      if (p && typeof p.then === 'function') {
        p.catch(function() {});
      }
    }
    tryPlay();
    heroVideoEl.addEventListener('loadedmetadata', tryPlay);
    heroVideoEl.addEventListener('loadeddata', tryPlay);
    heroVideoEl.addEventListener('canplay', tryPlay);
    heroVideoEl.addEventListener('canplaythrough', tryPlay);
    setTimeout(tryPlay, 300);
    setTimeout(tryPlay, 1000);
    heroVideoEl.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible' && heroVideoEl.closest('.hero-slide.active')) {
        heroVideoEl.playbackRate = 1.0;
        heroVideoEl.muted = true;
        tryPlay();
      }
    });
  }
});

