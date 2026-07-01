/* =============================================
   WMADERAS — script.js
   ============================================= */

(function () {
  'use strict';

  /* ---- NAVBAR scroll behavior ---- */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  /* ---- MOBILE MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---- INTERSECTION OBSERVER — reveal elements ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const fadeUpEls = document.querySelectorAll('.fade-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay based on sibling index
          const siblings = entry.target.parentElement
            ? [...entry.target.parentElement.children].filter(el => el.classList.contains('fade-up'))
            : [];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 0.1}s`;
          entry.target.classList.add('in-view');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));
  fadeUpEls.forEach(el => fadeObserver.observe(el));

  /* ---- ADD fade-up to sections ---- */
  const animTargets = document.querySelectorAll(
    '.producto-card, .porque-item, .n-stat, .galeria-item'
  );
  animTargets.forEach(el => {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
  });

  /* ---- ACTIVE nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ---- CONTACT FORM ---- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      const btnText = btn.querySelector('.btn-text');
      const btnIcon = btn.querySelector('.btn-icon');

      // Loading state
      btn.disabled = true;
      btnText.textContent = 'Enviando...';
      btnIcon.textContent = '⟳';

      // Simulate API call
      setTimeout(() => {
        btn.disabled = false;
        btnText.textContent = 'Enviar consulta';
        btnIcon.textContent = '→';
        form.reset();
        successMsg.classList.add('show');

        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1500);
    });
  }

  /* ---- SMOOTH SCROLL for anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- PARALLAX on hero on scroll ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ---- CURSOR ACCENT (desktop only) ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 8px; height: 8px;
      background: #B5712A;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform .15s ease, opacity .3s;
      opacity: 0;
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(dot);

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = '1';
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    document.addEventListener('mouseleave', () => dot.style.opacity = '0');

    // Scale on hovering interactive elements
    document.querySelectorAll('a, button, .producto-card, .galeria-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(3)';
        dot.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        dot.style.opacity = '1';
      });
    });
  }

  /* ---- NUMBER COUNTER for stats ---- */
  function animateNumber(el, target, duration = 1500) {
    const start = Date.now();
    const prefix = el.textContent.startsWith('+') ? '+' : '';
    const suffix = el.textContent.replace(/[\d+]/g, '');
    const update = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.n-stat strong');
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/\D/g, '');
        if (raw) animateNumber(el, parseInt(raw));
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));

  /* ---- TICKER pause on hover ---- */
  const ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ---- CARRUSEL GALERÍA ---- */
  const track      = document.getElementById('galeriaTrack');
  const viewport   = document.getElementById('galeriaViewport');
  const btnPrev    = document.getElementById('arrowPrev');
  const btnNext    = document.getElementById('arrowNext');
  const dotsWrap   = document.getElementById('carouselDots');

  if (track && viewport && btnPrev && btnNext) {
    const slides      = Array.from(track.querySelectorAll('.galeria-slide'));
    const totalSlides = slides.length;

    // Cuántas fotos se ven según el ancho de pantalla
    function getSlidesVisible() {
      if (window.innerWidth <= 500)  return 1;
      if (window.innerWidth <= 768)  return 2;
      return 3;
    }

    let current = 0; // página actual (grupo de slides)

    function totalPages() {
      return Math.ceil(totalSlides / getSlidesVisible());
    }

    // Crea los puntos de navegación
    function buildDots() {
      dotsWrap.innerHTML = '';
      const pages = totalPages();
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', `Página ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    // Mueve el track a la posición correcta
    function goTo(page) {
      const pages = totalPages();
      current = Math.max(0, Math.min(page, pages - 1));

      // Calcula el ancho de un slide incluyendo gap
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = 10;
      const slidesVisible = getSlidesVisible();
      const offset = current * slidesVisible * (slideWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;

      btnPrev.disabled = current === 0;
      btnNext.disabled = current >= pages - 1;
      updateDots();
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    // Reconstruir al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
      current = 0;
      buildDots();
      goTo(0);
    });

    // Swipe táctil para móvil
    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });

    // Init
    buildDots();
    goTo(0);
  }

  /* ---- PLAY OVERLAY en videos ---- */
  document.querySelectorAll('.vid-player').forEach(vid => {
    const slide   = vid.closest('.vid-slide');
    const overlay = slide.querySelector('.vid-play-overlay');

    // Clic en el overlay => reproducir video
    overlay.addEventListener('click', () => {
      if (vid.paused) {
        vid.play();
      } else {
        vid.pause();
      }
    });

    vid.addEventListener('play',  () => slide.classList.add('playing'));
    vid.addEventListener('pause', () => slide.classList.remove('playing'));
    vid.addEventListener('ended', () => slide.classList.remove('playing'));
  });


  const vidTrack    = document.getElementById('vidTrack');
  const vidViewport = document.getElementById('vidViewport');
  const vidPrev     = document.getElementById('vidArrowPrev');
  const vidNext     = document.getElementById('vidArrowNext');
  const vidDotsWrap = document.getElementById('vidDots');

  if (vidTrack && vidViewport && vidPrev && vidNext) {
    const vidSlides = Array.from(vidTrack.querySelectorAll('.galeria-slide'));
    const totalVid  = vidSlides.length;
    let vidCurrent  = 0;

    function getVidVisible() {
      if (window.innerWidth <= 500) return 1;
      if (window.innerWidth <= 768) return 2;
      return 3;
    }

    function totalVidPages() {
      return Math.ceil(totalVid / getVidVisible());
    }

    function buildVidDots() {
      vidDotsWrap.innerHTML = '';
      for (let i = 0; i < totalVidPages(); i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === vidCurrent ? ' active' : '');
        d.setAttribute('aria-label', `Página ${i + 1}`);
        d.addEventListener('click', () => goVidTo(i));
        vidDotsWrap.appendChild(d);
      }
    }

    function updateVidDots() {
      vidDotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === vidCurrent);
      });
    }

    function goVidTo(page) {
      // Pausar videos del grupo actual antes de mover
      const vis = getVidVisible();
      const from = vidCurrent * vis;
      for (let i = from; i < from + vis && i < totalVid; i++) {
        const v = vidSlides[i].querySelector('video');
        if (v && !v.paused) v.pause();
      }

      const pages = totalVidPages();
      vidCurrent = Math.max(0, Math.min(page, pages - 1));
      const slideW = vidSlides[0].getBoundingClientRect().width;
      const gap = 10;
      const offset = vidCurrent * vis * (slideW + gap);
      vidTrack.style.transform = `translateX(-${offset}px)`;
      vidPrev.disabled = vidCurrent === 0;
      vidNext.disabled = vidCurrent >= pages - 1;
      updateVidDots();
    }

    vidPrev.addEventListener('click', () => goVidTo(vidCurrent - 1));
    vidNext.addEventListener('click', () => goVidTo(vidCurrent + 1));

    window.addEventListener('resize', () => {
      vidCurrent = 0;
      buildVidDots();
      goVidTo(0);
    });

    // Swipe táctil
    let vidTouchX = 0;
    vidViewport.addEventListener('touchstart', e => { vidTouchX = e.touches[0].clientX; }, { passive: true });
    vidViewport.addEventListener('touchend', e => {
      const diff = vidTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? goVidTo(vidCurrent + 1) : goVidTo(vidCurrent - 1);
    }, { passive: true });

    buildVidDots();
    goVidTo(0);
  }

})();
