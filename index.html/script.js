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

// Interactive 3D Cyber Canvas Animation for Hero Section
(function initHeroCyberAnimation() {
  const canvas = document.getElementById('heroCyberCanvas');
  const heroSection = document.getElementById('home');
  const portrait = document.querySelector('.portrait-frame');
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = 0;
  let height = 0;
  let isRunning = true;
  let animationFrameId = null;

  // Mouse interaction state
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    targetMouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
    targetMouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    targetMouseX = 0;
    targetMouseY = 0;
    if (portrait) portrait.style.transform = '';
  });

  // Digital code characters
  const codeChars = ['0', '1', '<', '>', '/', '{', '}', ';', 'λ', 'const', 'API', 'MERN', 'NODE', 'VITE', 'SQL', '010', '101', 'REST'];

  // Initialize dense vertical code streams
  const streamCount = Math.max(36, Math.floor(width / 26));
  const streams = [];
  for (let i = 0; i < streamCount; i++) {
    streams.push({
      x: (i + Math.random() * 0.4) * (width / streamCount),
      y: Math.random() * -height * 1.2,
      speed: 1.4 + Math.random() * 2.8,
      length: 10 + Math.floor(Math.random() * 12),
      chars: Array.from({ length: 22 }, () => codeChars[Math.floor(Math.random() * codeChars.length)]),
      opacity: 0.55 + Math.random() * 0.45,
      changeTimer: 0
    });
  }

  // Floating 3D holographic tech nodes & floating telemetry HUDs
  const nodeCount = 22;
  const techLabels = ['SYS: OK', 'MERN_STACK', 'API_200', 'NODE_ACTIVE', 'POSTGRES', 'REACT_V19'];
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6),
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 2.5 + Math.random() * 2.5,
      pulse: Math.random() * Math.PI * 2,
      label: i < techLabels.length ? techLabels[i] : null
    });
  }

  let gridOffset = 0;
  let lastTime = performance.now();

  function render(time) {
    if (!isRunning) return;

    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    if (portrait && !reduceMotion && window.innerWidth > 900) {
      portrait.style.transform = `perspective(900px) rotateY(${mouseX * 10}deg) rotateX(${-mouseY * 10}deg) translateY(-5px)`;
    }

    const isLight = document.body.classList.contains('light');
    ctx.clearRect(0, 0, width, height);

    const horizonY = height * 0.46 + mouseY * 40;
    const vpX = width * 0.58 + mouseX * 100;

    // 1. Draw 3D Perspective Cyber Grid Floor
    ctx.save();
    const gridSpeed = reduceMotion ? 0 : delta * 0.42;
    gridOffset = (gridOffset + gridSpeed) % 1;

    // Horizontal perspective lines moving towards viewer
    const horizontalLineCount = 20;
    const currentYPositions = [];
    for (let i = 0; i < horizontalLineCount; i++) {
      const p = (i + gridOffset) / horizontalLineCount;
      const y = horizonY + Math.pow(p, 2.2) * (height - horizonY);
      if (y > height) continue;
      currentYPositions.push({ y, p });

      const alpha = Math.min(1, Math.pow(p, 1.4)) * (isLight ? 0.45 : 0.85);
      ctx.beginPath();
      ctx.strokeStyle = isLight
        ? `rgba(8, 127, 108, ${alpha})`
        : `rgba(104, 228, 194, ${alpha})`;
      ctx.lineWidth = 1 + p * 1.8;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Radial perspective lines converging to vanishing point
    const radialCount = 30;
    for (let i = -radialCount / 2; i <= radialCount / 2; i++) {
      const spreadX = vpX + i * (width / 11) * 1.35;
      const alpha = Math.max(0.12, 1 - Math.abs(i) / (radialCount / 2)) * (isLight ? 0.4 : 0.75);

      ctx.beginPath();
      ctx.strokeStyle = isLight
        ? `rgba(8, 127, 108, ${alpha})`
        : `rgba(0, 229, 255, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.moveTo(vpX, horizonY);
      ctx.lineTo(spreadX, height);
      ctx.stroke();

      // Glowing grid intersection dots on selected points
      if (!isLight && Math.abs(i) % 3 === 0) {
        currentYPositions.slice(-6).forEach(({ y, p }) => {
          const ratio = (y - horizonY) / (height - horizonY);
          const intersectX = vpX + (spreadX - vpX) * ratio;
          ctx.beginPath();
          ctx.arc(intersectX, y, 1.8 * p, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(104, 228, 194, ${0.8 * p})`;
          ctx.fill();
        });
      }
    }

    // Glowing horizon beam
    const horizonGrad = ctx.createLinearGradient(0, horizonY - 14, 0, horizonY + 24);
    horizonGrad.addColorStop(0, 'rgba(104, 228, 194, 0)');
    horizonGrad.addColorStop(0.5, isLight ? 'rgba(8, 127, 108, 0.6)' : 'rgba(104, 228, 194, 0.75)');
    horizonGrad.addColorStop(1, 'rgba(104, 228, 194, 0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, horizonY - 14, width, 38);
    ctx.restore();

    // 2. Draw Digital Code Rain Streams
    ctx.save();
    ctx.font = '700 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    streams.forEach(stream => {
      if (!reduceMotion) {
        stream.y += stream.speed * 62 * delta;
        stream.changeTimer += delta;
        if (stream.changeTimer > 0.1) {
          stream.changeTimer = 0;
          const idx = Math.floor(Math.random() * stream.chars.length);
          stream.chars[idx] = codeChars[Math.floor(Math.random() * codeChars.length)];
        }
      }

      if (stream.y > horizonY + 50) {
        stream.y = -Math.random() * 240;
        stream.x = Math.random() * width;
      }

      for (let j = 0; j < stream.length; j++) {
        const charY = stream.y - j * 17;
        if (charY < 0 || charY > horizonY + 35) continue;

        const isLead = j === 0;
        const trailAlpha = Math.max(0, (1 - j / stream.length)) * stream.opacity * (isLight ? 0.75 : 0.95);

        if (isLead) {
          ctx.fillStyle = isLight ? '#064e3b' : '#ffffff';
          ctx.shadowColor = isLight ? '#087f6c' : '#68e4c2';
          ctx.shadowBlur = isLight ? 6 : 14;
        } else {
          ctx.fillStyle = isLight
            ? `rgba(8, 127, 108, ${trailAlpha})`
            : `rgba(104, 228, 194, ${trailAlpha})`;
          ctx.shadowBlur = 0;
        }

        const char = stream.chars[j % stream.chars.length];
        ctx.fillText(char, stream.x, charY);
      }
    });
    ctx.restore();

    // 3. Draw Floating Holographic Tech Nodes & Telemetry
    ctx.save();
    nodes.forEach((node, i) => {
      if (!reduceMotion) {
        node.x += node.vx * 60 * delta;
        node.y += node.vy * 60 * delta;
        node.pulse += delta * 2.2;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = horizonY;
        if (node.y > horizonY) node.y = 0;
      }

      const pulseScale = 1 + Math.sin(node.pulse) * 0.28;
      const nodeAlpha = (0.55 + Math.sin(node.pulse) * 0.3) * (isLight ? 0.7 : 0.95);

      // Node core
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(8, 127, 108, ${nodeAlpha})` : `rgba(104, 228, 194, ${nodeAlpha})`;
      ctx.shadowColor = isLight ? '#087f6c' : '#68e4c2';
      ctx.shadowBlur = isLight ? 8 : 16;
      ctx.fill();

      // Holographic label
      if (node.label && !isLight) {
        ctx.font = '600 9px ui-monospace, monospace';
        ctx.fillStyle = 'rgba(187, 247, 231, 0.65)';
        ctx.shadowBlur = 0;
        ctx.fillText(node.label, node.x + 8, node.y + 3);
      }

      // Connecting constellation lines
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 140) {
          const lineAlpha = (1 - dist / 140) * 0.42 * (isLight ? 0.6 : 0.9);
          ctx.beginPath();
          ctx.strokeStyle = isLight
            ? `rgba(8, 127, 108, ${lineAlpha})`
            : `rgba(104, 228, 194, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });
    ctx.restore();

    animationFrameId = requestAnimationFrame(render);
  }

  // Optimize with IntersectionObserver (pauses animation when scrolled past hero)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      if (visible && !isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      } else if (!visible && isRunning) {
        isRunning = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    }, { threshold: 0.1 }).observe(heroSection);
  }

  animationFrameId = requestAnimationFrame(render);
})();


