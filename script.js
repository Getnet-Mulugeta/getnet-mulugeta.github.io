// ============================================
// Pipeline Hero Animation
// ============================================
const canvas = document.getElementById('pipeCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

const allTools = [
  'Python','Apache Airflow','Apache Spark','Kafka','PostgreSQL',
  'AWS S3','Docker','dbt','MLflow','FastAPI','Snowflake','Redis',
  'Terraform','PyTorch','TensorFlow','GPT-4','BERT','Kubernetes',
  'BigQuery','Redshift','scikit-learn','Pandas','Node.js','Grafana',
  'Prometheus','Databricks','Delta Lake','Flink','Elasticsearch',
  'OpenAI API','LangChain','Pinecone','Spark Streaming','Hive',
  'Presto','Trino','Great Expectations','Prefect','dbt Cloud',
  'AWS Glue','AWS Lambda','GCP','Azure','Looker','Tableau'
];

const MAX_NODES = 16;
const nodes = [];

function spawnNode(label) {
  return {
    label,
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0004,
    vy: (Math.random() - 0.5) * 0.0004,
    opacity: 0,
    fadeIn: true,
    fadeOut: false,
    life: 8000 + Math.random() * 8000,
    born: Date.now(),
  };
}

const usedLabels = new Set();
function getUnusedLabel() {
  const available = allTools.filter(t => !usedLabels.has(t));
  if (available.length === 0) { usedLabels.clear(); return allTools[Math.floor(Math.random()*allTools.length)]; }
  const label = available[Math.floor(Math.random() * available.length)];
  usedLabels.add(label);
  return label;
}

for (let i = 0; i < MAX_NODES; i++) {
  const n = spawnNode(getUnusedLabel());
  n.opacity = Math.random();
  n.born = Date.now() - Math.random() * n.life;
  nodes.push(n);
}

function drawPipeline() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const now = Date.now();

  nodes.forEach((n, i) => {
    const age = now - n.born;
    if (age > n.life - 1500) {
      n.opacity = Math.max(0, n.opacity - 0.008);
      if (n.opacity <= 0) {
        usedLabels.delete(n.label);
        const fresh = spawnNode(getUnusedLabel());
        nodes[i] = fresh;
        return;
      }
    } else if (n.opacity < 1) {
      n.opacity = Math.min(1, n.opacity + 0.008);
    }
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0.02 || n.x > 0.98) n.vx *= -1;
    if (n.y < 0.02 || n.y > 0.98) n.vy *= -1;
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const na = nodes[i], nb = nodes[j];
      const dx = (na.x - nb.x) * W, dy = (na.y - nb.y) * H;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const alpha = Math.min(na.opacity, nb.opacity);
      if (dist < 300) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(201,168,76,${0.12 * alpha * (1 - dist/300)})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(na.x * W, na.y * H);
        ctx.lineTo(nb.x * W, nb.y * H);
        ctx.stroke();
      }
    }
  }

  nodes.forEach(n => {
    const x = n.x * W, y = n.y * H;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${0.6 * n.opacity})`;
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillStyle = `rgba(136,146,164,${n.opacity * 0.8})`;
    ctx.textAlign = 'center';
    ctx.fillText(n.label, x, y - 8);
  });

  requestAnimationFrame(drawPipeline);
}
drawPipeline();

// ============================================
// Typewriter
// ============================================
const twLines = [
  '> designing end-to-end data pipelines...',
  '> building and deploying ML models to production...',
  '> architecting cloud-native data infrastructure...',
  '> transforming raw data into business intelligence...',
  '> engineering real-time and batch data systems...',
  '> building APIs that serve data at scale...',
  '> automating workflows with Airflow and Docker...',
];
let twIdx = 0;
const twEl = document.getElementById('twText');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function typeLoop() {
  while (true) {
    const line = twLines[twIdx % twLines.length];
    for (let i = 0; i <= line.length; i++) {
      twEl.textContent = line.slice(0, i);
      await sleep(45 + Math.random() * 25);
    }
    await sleep(1800);
    for (let i = line.length; i >= 0; i--) {
      twEl.textContent = line.slice(0, i);
      await sleep(18);
    }
    await sleep(300);
    twIdx++;
  }
}
typeLoop();

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
  document.getElementById('navLinks').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
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
    document.getElementById('loader').classList.add('hidden');
  }, 1900);
});

// ============================================
// Scroll Fade-in Animations
// ============================================
const fadeEls = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .stat, .education-card, .publication-card');
fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => fadeObserver.observe(el));
