const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('span');

function updateThemeControl() {
  const isLight = document.body.classList.contains('light');
  themeIcon.textContent = isLight ? '☾' : '☀';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

if (localStorage.getItem('theme') === 'light') document.body.classList.add('light');
updateThemeControl();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  updateThemeControl();
});

const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navLinks');
function closeMenu() {
  navList.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation menu');
}
menuToggle.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
});

const sectionIds = ['about', 'skills', 'experience', 'projects', 'contact'];
const navLinks = Array.from(document.querySelectorAll('#navLinks a'));
function highlightCurrentSection() {
  let active = null;
  for (const id of sectionIds) {
    const rect = document.getElementById(id).getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom >= 140) { active = id; break; }
  }
  navLinks.forEach(link => {
    const current = link.getAttribute('href') === `#${active}`;
    link.classList.toggle('active', current);
    if (current) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('scroll', highlightCurrentSection, { passive: true });
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
highlightCurrentSection();
document.getElementById('year').textContent = new Date().getFullYear();

const carousel = document.getElementById('spitiCarousel');
if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const previousButton = carousel.querySelector('.carousel-control.previous');
  const nextButton = carousel.querySelector('.carousel-control.next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentSlide = 0;
  let timer = null;
  let isVisible = true;
  let pointerStartX = null;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show photo ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index, true));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function showSlide(index, restart = false) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', String(slideIndex !== currentSlide)));
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentSlide);
      dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
    });
    if (restart) startAutoplay();
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!reduceMotion && isVisible) timer = window.setInterval(() => showSlide(currentSlide + 1), 1500);
  }

  previousButton.addEventListener('click', () => showSlide(currentSlide - 1, true));
  nextButton.addEventListener('click', () => showSlide(currentSlide + 1, true));
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) startAutoplay();
  });
  carousel.addEventListener('pointerdown', event => { pointerStartX = event.clientX; });
  carousel.addEventListener('pointerup', event => {
    if (pointerStartX === null) return;
    const distance = event.clientX - pointerStartX;
    if (Math.abs(distance) > 45) showSlide(currentSlide + (distance < 0 ? 1 : -1), true);
    pointerStartX = null;
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) startAutoplay(); else stopAutoplay();
    }, { threshold: 0.25 }).observe(carousel);
  }

  showSlide(0);
  startAutoplay();
}
