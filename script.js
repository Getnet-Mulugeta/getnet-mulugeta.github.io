// ============================================
// Neural Network Hero Animation
// ============================================
const canvas = document.getElementById('pipeCanvas');
const ctx = canvas.getContext('2d');
function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

const mlTools = [
  'Python','Apache Airflow','Apache Spark','Kafka','dbt',
  'PostgreSQL','AWS S3','Docker','MLflow','FastAPI',
  'Snowflake','Redis','Terraform','PyTorch','scikit-learn',
  'HuggingFace','OpenAI API','LangChain','pgvector','RAG',
  'AWS Glue','BigQuery','Redshift','Node.js','Elasticsearch'
];

const NEURON_COUNT = 28;
const neurons = [];
const signals = [];
const usedLabels = new Set();

function getLabel() {
  const available = mlTools.filter(t => !usedLabels.has(t));
  if (!available.length) { usedLabels.clear(); }
  const pool = mlTools.filter(t => !usedLabels.has(t));
  const label = pool[Math.floor(Math.random() * pool.length)];
  usedLabels.add(label);
  return label;
}

for (let i = 0; i < NEURON_COUNT; i++) {
  neurons.push({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00015,
    vy: (Math.random() - 0.5) * 0.00015,
    radius: 2.5 + Math.random() * 2.5,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
    opacity: 0.3 + Math.random() * 0.7,
    label: Math.random() > 0.5 ? getLabel() : null,
    firing: false,
    fireTime: 0,
  });
}

function spawnSignal(from, to) {
  signals.push({ from, to, progress: 0, speed: 0.012 + Math.random() * 0.01 });
}

setInterval(() => {
  const i = Math.floor(Math.random() * neurons.length);
  const j = Math.floor(Math.random() * neurons.length);
  if (i !== j) {
    neurons[i].firing = true;
    neurons[i].fireTime = Date.now();
    spawnSignal(i, j);
  }
}, 400);

function drawNeural() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const now = Date.now();

  neurons.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0.02 || n.x > 0.98) n.vx *= -1;
    if (n.y < 0.02 || n.y > 0.98) n.vy *= -1;
    n.pulse += n.pulseSpeed;
    if (n.firing && now - n.fireTime > 600) n.firing = false;
  });

  const connDist = Math.min(W, H) * 0.45;
  for (let i = 0; i < neurons.length; i++) {
    for (let j = i + 1; j < neurons.length; j++) {
      const a = neurons[i], b = neurons[j];
      const dx = (a.x - b.x) * W, dy = (a.y - b.y) * H;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connDist) {
        const alpha = 0.35 * (1 - dist / connDist);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,194,255,${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.moveTo(a.x * W, a.y * H);
        ctx.lineTo(b.x * W, b.y * H);
        ctx.stroke();
      }
    }
  }

  for (let s = signals.length - 1; s >= 0; s--) {
    const sig = signals[s];
    sig.progress += sig.speed;
    if (sig.progress >= 1) { signals.splice(s, 1); continue; }
    const a = neurons[sig.from], b = neurons[sig.to];
    const sx = (a.x + (b.x - a.x) * sig.progress) * W;
    const sy = (a.y + (b.y - a.y) * sig.progress) * H;
    const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8);
    grd.addColorStop(0, 'rgba(0,194,255,0.9)');
    grd.addColorStop(1, 'rgba(0,194,255,0)');
    ctx.beginPath();
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  neurons.forEach(n => {
    const x = n.x * W, y = n.y * H;
    const pulseFactor = 1 + Math.sin(n.pulse) * 0.3;
    const r = n.radius * pulseFactor;
    const isFiring = n.firing;
    const glowR = isFiring ? r * 6 : r * 3;
    const glowAlpha = isFiring ? 0.4 : 0.12;
    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    glow.addColorStop(0, `rgba(0,194,255,${glowAlpha})`);
    glow.addColorStop(1, 'rgba(0,194,255,0)');
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isFiring ? 'rgba(0,194,255,1)' : `rgba(0,194,255,${n.opacity * 0.7})`;
    ctx.fill();
    if (n.label) {
      ctx.font = '9px monospace';
      ctx.fillStyle = `rgba(93,223,255,${n.opacity * 0.6})`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, x, y - r - 5);
    }
  });

  requestAnimationFrame(drawNeural);
}
drawNeural();

// ============================================
// Typewriter
// ============================================
const glitchLines = [
  'building ETL pipelines at scale',
  'deploying ML models to production',
  'engineering real-time data systems',
  'architecting cloud-native infrastructure',
  'shipping full stack AI applications',
  'transforming raw data into intelligence',
  'automating workflows with Airflow and Docker',
];
let glitchIdx = 0;
const twEl = document.getElementById('twText');
const glitchChars = '01アイウエオ▓▒░█▄▀⟨⟩∇∆∑∏∂∈⊕⊗ΨΦΩλμπ';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function glitchReveal(target) {
  const len = target.length;
  for (let i = 0; i < 10; i++) {
    let scrambled = '';
    for (let j = 0; j < len; j++) {
      scrambled += target[j] === ' ' ? ' ' : glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    twEl.textContent = scrambled;
    await sleep(40);
  }
  for (let i = 0; i <= len; i++) {
    let result = target.slice(0, i);
    for (let j = i; j < len; j++) {
      result += target[j] === ' ' ? ' ' : glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    twEl.textContent = result;
    await sleep(30);
  }
}

async function glitchErase(target) {
  const len = target.length;
  for (let i = len; i >= 0; i--) {
    let result = target.slice(0, i);
    for (let j = i; j < Math.min(i + 4, len); j++) {
      result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
    }
    twEl.textContent = result;
    await sleep(20);
  }
}

async function glitchLoop() {
  while (true) {
    const line = glitchLines[glitchIdx % glitchLines.length];
    await glitchReveal(line);
    await sleep(2200);
    await glitchErase(line);
    await sleep(300);
    glitchIdx++;
  }
}
glitchLoop();

// ============================================
// Scroll-triggered fade-in
// ============================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section, .project-card, .skill-card, .timeline-item, .stat').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(el);
});

// ============================================
// Active nav link on scroll
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');



// ============================================
// Video Modal
// ============================================
function openModal(src, title) {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  const titleEl = document.getElementById('modal-title');
  video.src = src;
  if (titleEl) titleEl.textContent = title || 'Demo Video';
  modal.classList.add('active');
  video.play();
}

function closeModal() {
  const modal = document.getElementById('video-modal');
  const video = document.getElementById('modal-video');
  video.pause();
  video.src = '';
  modal.classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    if(zoomOverlay) zoomOverlay.classList.remove('active');
  }
});

// ============================================
// Zoomable Images
// ============================================
const zoomOverlay = document.createElement('div');
zoomOverlay.className = 'img-zoom-overlay';
const zoomImg = document.createElement('img');
zoomOverlay.appendChild(zoomImg);
document.body.appendChild(zoomOverlay);

document.querySelectorAll('.project-visual img').forEach(img => {
  img.addEventListener('click', () => {
    zoomImg.src = img.src;
    zoomOverlay.classList.add('active');
  });
});

zoomOverlay.addEventListener('click', () => {
  zoomOverlay.classList.remove('active');
});

// ============================================
// Hamburger Menu
// ============================================
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.innerHTML = navLinks.classList.contains('open') ? '✕' : '&#9776;';
}

function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').innerHTML = '&#9776;';
}

// ============================================
// Skills Filter
// ============================================
function filterSkills(domain, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.skill-card').forEach(card => {
    if (domain === 'all' || card.dataset.domain === domain) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================
// Floating Nav Dots
// ============================================
const dotSections = ['hero', 'about', 'education', 'publications', 'skills', 'experience', 'projects', 'contact'];
const dots = document.querySelectorAll('.nav-dot');

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  let current = 'hero';
  dotSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - window.innerHeight / 2) current = id;
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', dotSections[i] === current);
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
});

// ============================================
// Scroll Progress Bar
// ============================================
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  scrollBar.style.width = progress + '%';
});

// ============================================
// Back to Top
// ============================================
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

// ============================================
// Loading Screen
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    // Glitch loader
const loaderText = document.getElementById('loaderText');
const loaderLine = document.querySelector('.loader-line');
const name = 'GETNET MULUGETA';
const glitchCharsLoader = '01ABCDEFabcdef#$%&@!?';
let loaderDone = false;

async function loaderGlitch() {
  loaderLine.classList.add('expand');
  // Rapid scramble 5 times
  for (let s = 0; s < 5; s++) {
    loaderText.textContent = Array.from({length: name.length}, (_, i) =>
      name[i] === ' ' ? ' ' : glitchCharsLoader[Math.floor(Math.random() * glitchCharsLoader.length)]
    ).join('');
    await new Promise(r => setTimeout(r, 60));
  }
  // Snap to final name
  loaderText.textContent = name;
  await new Promise(r => setTimeout(r, 300));
  document.getElementById('loader').classList.add('hidden');
}

loaderGlitch();
  }, 1900);
});
// ============================================
// Sophisticated Scroll Animations
// ============================================
const animateEls = document.querySelectorAll(
  '.section-label, .section h2, .about-layout, .edu-row, .skill-domain-row, .showcase-item, .experience-item, .contact-grid, .about-stats-row'
);

animateEls.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
});

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const siblings = Array.from(el.parentElement.children).filter(c =>
        c.style.opacity === '0'
      );
      const idx = siblings.indexOf(el);
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, Math.max(0, idx) * 100);
      scrollObserver.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

animateEls.forEach(el => scrollObserver.observe(el));
