(function () {
  const root = document.documentElement;

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const storedTheme = (() => { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  if (storedTheme) root.setAttribute('data-theme', storedTheme);
  const isDark = () => root.getAttribute('data-theme') === 'dark' ||
    (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const syncThemeIcon = () => {
    if (!themeBtn) return;
    themeBtn.innerHTML = isDark() ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  };
  syncThemeIcon();
  themeBtn && themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeIcon();
  });

  // Mobile navigation
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && links.classList.contains('open')) setMenu(false); });

  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 8), { passive: true });

  // Active section highlight
  const navAnchors = Array.from(links.querySelectorAll('a[href^="#"]'));
  const sections = navAnchors.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // Publication filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubs = document.querySelectorAll('#journal-list .pub');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      pubs.forEach((p) => {
        const year = Number(p.dataset.year);
        let show = true;
        if (f === 'first') show = p.hasAttribute('data-first');
        else if (f === 'older') show = year <= 2023;
        else if (f !== 'all') show = String(year) === f;
        p.hidden = !show;
      });
    });
  });

  // Lightbox for gallery and research figures
  const zoomables = Array.from(document.querySelectorAll('[data-zoom]'));
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('p');
  let current = 0;
  let lastFocus = null;
  const show = (i) => {
    current = (i + zoomables.length) % zoomables.length;
    const el = zoomables[current];
    const img = el.querySelector('img');
    lbImg.src = el.dataset.zoom;
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = el.dataset.caption || (img ? img.alt : '');
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus();
  };
  zoomables.forEach((el, i) => {
    el.addEventListener('click', () => open(i));
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    }
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
