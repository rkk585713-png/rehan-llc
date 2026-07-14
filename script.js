/* ==========================================================================
   REHAN LLC — main script
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading Screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 900);
  });
  // fallback in case load event already fired / is slow
  setTimeout(() => loader && loader.classList.add('hide'), 3500);

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Dark / Light Mode ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('darkModeToggle');
  const savedTheme = localStorage.getItem('rehan-theme');
  if (savedTheme === 'light') root.setAttribute('data-theme', 'light');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('rehan-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('rehan-theme', 'light');
    }
  });

  /* ---------- Sticky Navbar ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('show', window.scrollY > 600);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- Product Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        const tags = card.dataset.tags || '';
        const match = filter === 'all' || tags.includes(filter);
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- Factory Image Slider ---------- */
  const slider = document.getElementById('factorySlider');
  if (slider) {
    const slides = slider.querySelectorAll('img');
    const dotsWrap = slider.querySelector('.slider-dots');
    let current = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('span');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    slider.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
    slider.querySelector('.next').addEventListener('click', () => goTo(current + 1));

    setInterval(() => goTo(current + 1), 5000);
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Quote Modal ---------- */
  const modal = document.getElementById('quoteModal');
  const modalClose = document.getElementById('modalClose');
  const modalProductName = document.getElementById('modalProductName');
  const modalForm = document.getElementById('modalForm');
  const modalNote = document.getElementById('modalNote');

  document.querySelectorAll('.quote-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalProductName.textContent = btn.dataset.product;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalNote.textContent = '';
    modalForm.reset();
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    modalNote.textContent = 'Thank you — our export desk will contact you within 24 hours.';
    setTimeout(closeModal, 2200);
  });

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thank you for reaching out — our team will respond within one business day.';
    contactForm.reset();
  });

  /* ---------- Particle Background (ambient, lightweight) ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.body.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = window.innerWidth < 768 ? 26 : 55;
  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.25 + 0.05,
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.4 + 0.1
    }));
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(201,163,86,';
    particles.forEach(p => {
      ctx.beginPath();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#C9A356';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speedY;
      p.x += p.drift;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animateParticles);
  }
  requestAnimationFrame(animateParticles);

  window.addEventListener('load', resize);
});
