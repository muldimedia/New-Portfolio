// i18n loader
let I18N = {};
async function loadI18n() {
  try {
    const res = await fetch('i18n.json');
    I18N = await res.json();
  } catch (e) {
    console.warn('i18n load failed', e);
  }
}

// Language setter
function setLang(l) {
  const dict = I18N[l] || {};
  document.querySelectorAll('[id]').forEach((el) => {
    const k = el.id;
    if (dict[k]) {
      el.style.opacity = 0;
      setTimeout(() => {
        el.innerHTML = dict[k];
        el.style.opacity = 1;
      }, 150);
    }
  });
  // persist
  localStorage.setItem('lang', l);
}

// Theme toggle
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

// Active nav on scroll
function observeSections() {
  const links = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const map = new Map(links.map((a) => [a.getAttribute('href'), a]));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = '#' + entry.target.id;
        const link = map.get(id);
        if (link) {
          if (entry.isIntersecting) link.classList.add('active');
          else link.classList.remove('active');
        }
      });
    },
    { rootMargin: '-50% 0px -40% 0px', threshold: 0 }
  );
  document.querySelectorAll('section[id]').forEach((sec) => obs.observe(sec));
}

// Simple carousel
function setupCarousel() {
  const track = document.getElementById('workCarousel');
  if (!track) return;
  const slides = Array.from(track.querySelectorAll('img'));
  let idx = 0;
  function update() {
    track.style.transform = `translateX(-${idx * 100}%)`;
  }
  document.getElementById('prevWork').addEventListener('click', () => {
    idx = (idx - 1 + slides.length) % slides.length;
    update();
  });
  document.getElementById('nextWork').addEventListener('click', () => {
    idx = (idx + 1) % slides.length;
    update();
  });
}

// Service worker
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// Init
window.addEventListener('DOMContentLoaded', async () => {
  await loadI18n();
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('navLinks').classList.toggle('show');
  });
  document
    .querySelectorAll('nav a')
    .forEach((a) =>
      a.addEventListener('click', () =>
        document.getElementById('navLinks').classList.remove('show')
      )
    );

  // Language init
  const preferred =
    localStorage.getItem('lang') || (navigator.language || 'en').slice(0, 2);
  setLang(preferred === 'el' ? 'gr' : I18N[preferred] ? preferred : 'en');
  document
    .querySelectorAll('.lang-btn')
    .forEach((btn) =>
      btn.addEventListener('click', () => setLang(btn.dataset.lang))
    );

  // Theme init
  const theme =
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');
  applyTheme(theme);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // UX
  observeSections();
  setupCarousel();

  // PWA
  registerSW();
});
