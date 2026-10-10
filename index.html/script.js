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

const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
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

  // Pure digital binary matrix characters (clean, crisp, no blurry text)
  const codeChars = ['0', '1'];

  // Initialize crisp vertical matrix rain streams
  const streamCount = Math.max(32, Math.floor(width / 32));
  const streams = [];
  for (let i = 0; i < streamCount; i++) {
    streams.push({
      x: (i + Math.random() * 0.3) * (width / streamCount),
      y: Math.random() * -height * 1.5,
      speed: 1.2 + Math.random() * 2.2,
      length: 8 + Math.floor(Math.random() * 12),
      chars: Array.from({ length: 20 }, () => codeChars[Math.floor(Math.random() * 2)]),
      opacity: 0.35 + Math.random() * 0.4,
      changeTimer: 0
    });
  }

  // Floating ambient cyber telemetry nodes
  const nodeCount = 16;
  const nodes = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * (height * 0.65),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 2 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  let gridOffset = 0;
  let radarAngle = 0;
  let lastTime = performance.now();

  function render(time) {
    if (!isRunning) return;

    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    if (portrait && !reduceMotion && window.innerWidth > 900) {
      portrait.style.transform = `perspective(900px) rotateY(${mouseX * 8}deg) rotateX(${-mouseY * 8}deg) translateY(-4px)`;
    }

    const isLight = document.body.classList.contains('light');
    ctx.clearRect(0, 0, width, height);

    // Grid horizon placed strictly below text (bottom 30% of screen)
    const horizonY = height * 0.70 + mouseY * 20;
    const vpX = width * 0.52 + mouseX * 80;

    // 1. Draw 3D Perspective Cyber Grid Floor
    ctx.save();
    const gridSpeed = reduceMotion ? 0 : delta * 0.36;
    gridOffset = (gridOffset + gridSpeed) % 1;

    // Horizontal perspective lines moving towards viewer
    const horizontalLineCount = 16;
    for (let i = 0; i < horizontalLineCount; i++) {
      const p = (i + gridOffset) / horizontalLineCount;
      const y = horizonY + Math.pow(p, 2.3) * (height - horizonY);
      if (y > height) continue;

      const alpha = Math.min(1, Math.pow(p, 1.3)) * (isLight ? 0.35 : 0.75);
      ctx.beginPath();
      ctx.strokeStyle = isLight
        ? `rgba(8, 127, 108, ${alpha})`
        : `rgba(0, 240, 255, ${alpha * 0.85})`;
      ctx.lineWidth = 1 + p * 1.5;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Radial perspective lines converging to vanishing point
    const radialCount = 28;
    for (let i = -radialCount / 2; i <= radialCount / 2; i++) {
      const spreadX = vpX + i * (width / 10) * 1.35;
      const alpha = Math.max(0.1, 1 - Math.abs(i) / (radialCount / 2)) * (isLight ? 0.35 : 0.7);

      ctx.beginPath();
      ctx.strokeStyle = isLight
        ? `rgba(8, 127, 108, ${alpha})`
        : `rgba(0, 240, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 1.1;
      ctx.moveTo(vpX, horizonY);
      ctx.lineTo(spreadX, height);
      ctx.stroke();
    }

    // Glowing horizon light bar with neon cyan bloom
    const horizonGrad = ctx.createLinearGradient(0, horizonY - 14, 0, horizonY + 24);
    horizonGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    horizonGrad.addColorStop(0.5, isLight ? 'rgba(8, 127, 108, 0.45)' : 'rgba(0, 240, 255, 0.7)');
    horizonGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, horizonY - 14, width, 38);
    ctx.restore();

    // 2. Draw Holographic Circular Radar HUD in background (upper right)
    if (!isLight && width > 700) {
      ctx.save();
      const hudX = width * 0.78 + mouseX * 25;
      const hudY = height * 0.32 + mouseY * 15;
      const hudRadius = 64;
      radarAngle += delta * 0.8;

      ctx.strokeStyle = 'rgba(45, 212, 191, 0.16)';
      ctx.lineWidth = 1;

      // Outer ring
      ctx.beginPath();
      ctx.arc(hudX, hudY, hudRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Middle dashed ring
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(hudX, hudY, hudRadius * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating radar sweep
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(hudX, hudY);
      ctx.lineTo(hudX + Math.cos(radarAngle) * (hudRadius * 0.95), hudY + Math.sin(radarAngle) * (hudRadius * 0.95));
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.35)';
      ctx.stroke();

      // Center pulse dot
      ctx.beginPath();
      ctx.arc(hudX, hudY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#2dd4bf';
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Crisp Digital Binary Code Rain Streams
    ctx.save();
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    streams.forEach(stream => {
      if (!reduceMotion) {
        stream.y += stream.speed * 54 * delta;
        stream.changeTimer += delta;
        if (stream.changeTimer > 0.15) {
          stream.changeTimer = 0;
          const idx = Math.floor(Math.random() * stream.chars.length);
          stream.chars[idx] = codeChars[Math.floor(Math.random() * 2)];
        }
      }

      if (stream.y > horizonY + 30) {
        stream.y = -Math.random() * 200;
        stream.x = Math.random() * width;
      }

      for (let j = 0; j < stream.length; j++) {
        const charY = stream.y - j * 16;
        if (charY < 0 || charY > horizonY + 20) continue;

        const isLead = j === 0;
        const trailAlpha = Math.max(0, (1 - j / stream.length)) * stream.opacity * (isLight ? 0.65 : 0.85);

        if (isLead) {
          ctx.fillStyle = isLight ? '#064e3b' : '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = isLight ? 4 : 10;
        } else {
          ctx.fillStyle = isLight
            ? `rgba(8, 127, 108, ${trailAlpha})`
            : `rgba(45, 212, 191, ${trailAlpha})`;
          ctx.shadowBlur = 0;
        }

        const char = stream.chars[j % stream.chars.length];
        ctx.fillText(char, stream.x, charY);
      }
    });
    ctx.restore();

    // 4. Draw Subtle Constellation Nodes
    ctx.save();
    nodes.forEach((node, i) => {
      if (!reduceMotion) {
        node.x += node.vx * 50 * delta;
        node.y += node.vy * 50 * delta;
        node.pulse += delta * 2;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = horizonY;
        if (node.y > horizonY) node.y = 0;
      }

      const pulseScale = 1 + Math.sin(node.pulse) * 0.25;
      const nodeAlpha = (0.4 + Math.sin(node.pulse) * 0.25) * (isLight ? 0.6 : 0.85);

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? `rgba(8, 127, 108, ${nodeAlpha})` : `rgba(45, 212, 191, ${nodeAlpha})`;
      ctx.fill();

      // Connecting faint constellation lines
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.25 * (isLight ? 0.5 : 0.8);
          ctx.beginPath();
          ctx.strokeStyle = isLight
            ? `rgba(8, 127, 108, ${lineAlpha})`
            : `rgba(45, 212, 191, ${lineAlpha})`;
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


