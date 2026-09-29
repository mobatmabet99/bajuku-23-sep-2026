const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = '2026';

const themeToast = document.querySelector('.theme-toast');
const themeToastMessage = document.querySelector('[data-theme-toast-message]');
const themeToastClose = document.querySelector('.theme-toast-close');
const themeToggle = document.querySelector('.theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const themeStorageKey = 'bajuku-theme';
const savedTheme = window.localStorage.getItem(themeStorageKey);
let toastTimeout;

function getCurrentTheme() {
  return document.documentElement.dataset.theme;
}

function updateThemeControls() {
  const isDark = getCurrentTheme() === 'dark';
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Aktifkan tema ${isDark ? 'terang' : 'gelap'}`);
    themeToggle.querySelector('span').textContent = isDark ? '☀' : '☾';
  }
  if (themeToastMessage) {
    themeToastMessage.textContent = `Tema ${isDark ? 'gelap' : 'terang'} aktif. Tekan tombol untuk beralih ke tema ${isDark ? 'terang' : 'gelap'}.`;
  }
}

function showThemeToast() {
  if (!themeToast) return;
  window.clearTimeout(toastTimeout);
  themeToast.hidden = false;
  toastTimeout = window.setTimeout(() => {
    themeToast.hidden = true;
  }, 4500);
}

document.documentElement.dataset.theme =
  savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : systemTheme.matches ? 'dark' : 'light';
updateThemeControls();

themeToggle?.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  window.localStorage.setItem(themeStorageKey, nextTheme);
  updateThemeControls();
  showThemeToast();
});

systemTheme.addEventListener('change', (event) => {
  if (window.localStorage.getItem(themeStorageKey)) return;
  document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
  updateThemeControls();
});

if (themeToast) {
  window.setTimeout(showThemeToast, 300);
  themeToastClose?.addEventListener('click', () => {
    window.clearTimeout(toastTimeout);
    themeToast.hidden = true;
  });
}

const colorButtons = [...document.querySelectorAll('[data-color-choice]')];
const productImage = document.querySelector('.detail-main-image');
const selectedColorLabel = document.querySelector('.selected-color');
const productVideo = document.querySelector('.detail-main-video');
const videoChoice = document.querySelector('[data-video-choice]');
const galleryButtons = [...document.querySelectorAll('[data-gallery-image]')];

function selectColor(button) {
  if (!button) return;

  if (selectedColorLabel) selectedColorLabel.textContent = button.dataset.color;
  colorButtons.forEach((option) => {
    const selected = option === button;
    option.classList.toggle('is-selected', selected);
    option.setAttribute('aria-checked', String(selected));
  });

  if (videoChoice) {
    const videoSource = button.dataset.video;
    videoChoice.dataset.video = videoSource || '';
    videoChoice.disabled = !videoSource;
    videoChoice.querySelector('span').textContent = videoSource
      ? `Putar video warna ${button.dataset.color}`
      : 'Video warna ini belum tersedia';
  }
}

function showProductImage(source, alt) {
  if (!productImage) return;
  if (productVideo) {
    productVideo.pause();
    productVideo.removeAttribute('src');
    productVideo.load();
    productVideo.hidden = true;
  }
  productImage.hidden = false;
  productImage.src = source;
  productImage.alt = alt;
}

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const matchingColor = colorButtons.find((option) => option.dataset.color === button.dataset.color);
    selectColor(matchingColor);
    showProductImage(button.dataset.image, button.dataset.alt);
    galleryButtons.forEach((option) => option.classList.toggle('is-selected', option === button));
  });
});

colorButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    selectColor(button);
    showProductImage(button.dataset.image, button.dataset.alt);
    galleryButtons.forEach((option) => option.classList.toggle(
      'is-selected',
      option.dataset.image === button.dataset.image
    ));
  });

  button.addEventListener('keydown', (event) => {
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 :
      ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0;

    if (!direction || colorButtons.length < 2) return;

    event.preventDefault();
    const nextIndex = (index + direction + colorButtons.length) % colorButtons.length;
    colorButtons[nextIndex].focus();
    colorButtons[nextIndex].click();
  });
});

if (videoChoice && productVideo) {
  videoChoice.addEventListener('click', () => {
    const source = videoChoice.dataset.video;
    if (!source) return;

    productImage.hidden = true;
    productVideo.hidden = false;
    if (productVideo.getAttribute('src') !== source) {
      productVideo.src = source;
      productVideo.load();
    }
    productVideo.play().catch(() => {
      productVideo.controls = true;
    });
  });
}

const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
