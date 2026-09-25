(function () {
  const root = document.documentElement;

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const isDark = () => root.getAttribute('data-theme') === 'dark' ||
    (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const syncThemeIcon = () => {
    themeBtn.innerHTML = isDark() ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeBtn.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
  };
  syncThemeIcon();
  themeBtn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
    syncThemeIcon();
  });

  // Mobile navigation
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  // Tab routing: only the selected page is shown
  const views = Array.from(document.querySelectorAll('[data-view]'));
  const routes = views.map((v) => v.dataset.view);
  const navAnchors = Array.from(links.querySelectorAll('a'));
  const baseTitle = 'Dr. Bhagwat Singh Chouhan';

  const route = () => {
    const hash = location.hash.slice(1);
    const name = routes.includes(hash) ? hash : (hash ? null : 'home');
    if (!name) return;
    root.setAttribute('data-route', name);
    navAnchors.forEach((a) => {
      const on = a.getAttribute('href') === '#' + name;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const view = views.find((v) => v.dataset.view === name);
    document.title = name === 'home'
      ? baseTitle + ' | Terahertz Photonics & Metamaterials'
      : view.dataset.title + ' | ' + baseTitle;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  window.addEventListener('hashchange', route);
  route();

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

  // Lightbox: cycles through the zoomable figures on the current page only
  const zoomables = Array.from(document.querySelectorAll('[data-zoom]'));
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('p');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');
  let list = [];
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + list.length) % list.length;
    const el = list[current];
    const img = el.querySelector('img');
    lbImg.src = el.dataset.zoom;
    lbImg.alt = img ? img.alt : '';
    lbCap.textContent = el.dataset.caption || (img ? img.alt : '');
  };
  const open = (el) => {
    lastFocus = document.activeElement;
    list = zoomables.filter((z) => z.getClientRects().length > 0);
    prevBtn.hidden = nextBtn.hidden = list.length < 2;
    show(list.indexOf(el));
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  zoomables.forEach((el) => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Enlarge image');
    el.addEventListener('click', () => open(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
    });
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(current - 1));
  nextBtn.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lb.classList.contains('open')) close();
      else if (links.classList.contains('open')) setMenu(false);
      return;
    }
    if (!lb.classList.contains('open') || list.length < 2) return;
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();
