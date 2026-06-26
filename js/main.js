// ── ROUTER ────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) { page.classList.add('active'); window.scrollTo(0, 0); }
  const link = document.querySelector(`.nav-links a[data-page="${id}"]`);
  if (link) link.classList.add('active');
  if (id === 'home') setTimeout(initParticles, 50);
  setTimeout(() => { initReveal(); initTimeline(); }, 100);
  // close mobile nav
  document.getElementById('nav-links')?.classList.remove('open');
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const t = el.getAttribute('data-page');
    if (!t) return;
    history.pushState({ page: t }, '', '#' + t);
    showPage(t);
  });
});

window.addEventListener('popstate', e => showPage(e.state?.page || 'home'));
showPage(location.hash.replace('#', '') || 'home');

// ── NAV SCROLL ───────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER ────────────────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('nav-links')?.classList.toggle('open');
});

// ── PARTICLES ────────────────────────────────────────────────────
let particleRAF = null;

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  if (particleRAF) { cancelAnimationFrame(particleRAF); particleRAF = null; }

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const COLORS = [
    'rgba(59,130,246,',
    'rgba(96,165,250,',
    'rgba(30,58,95,',
    'rgba(147,197,253,'
  ];

  class P {
    constructor(randomY = false) { this.init(randomY); }
    init(randomY = false) {
      this.x   = Math.random() * W;
      this.y   = randomY ? Math.random() * H : H + 10;
      this.vx  = (Math.random() - 0.5) * 0.35;
      this.vy  = -(Math.random() * 0.45 + 0.15);
      this.r   = Math.random() * 1.6 + 0.3;
      this.a   = Math.random() * 0.45 + 0.08;
      this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.init(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + this.a + ')';
      ctx.fill();
    }
  }

  function spawn() {
    const n = Math.min(100, Math.floor(W * H / 9000));
    particles = Array.from({ length: n }, (_, i) => new P(i < n * 0.6));
  }
  spawn();

  let mouse = { x: -9999, y: -9999 };
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  function drawLines() {
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${0.05 * (1 - d / 110)})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
      // mouse attraction lines
      const mdx = particles[i].x - mouse.x;
      const mdy = particles[i].y - mouse.y;
      const md  = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 140) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(96,165,250,${0.12 * (1 - md / 140)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    particleRAF = requestAnimationFrame(loop);
  }
  loop();
}

// ── TYPING EFFECT ────────────────────────────────────────────────
const roles = [
  'Software Engineer',
  'Frontend Developer',
  'QA Engineer',
  'Data Analyst',
  'Full-Stack Builder'
];
let rIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const el = document.querySelector('.typed-text');
  if (!el) return;
  const word = roles[rIdx];
  if (!deleting) {
    el.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
  } else {
    el.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 42 : 85);
}
setTimeout(typeLoop, 1600);

// ── SCROLL REVEAL ─────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── TIMELINE REVEAL ───────────────────────────────────────────────
function initTimeline() {
  const items = document.querySelectorAll('.tl-item:not(.visible)');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 130);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(el => obs.observe(el));
}

// ── CONTACT FORM ──────────────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();
  if (!name || !email || !message) {
    showStatus('error', '⚠ Please fill in all required fields.');
    return;
  }
  const body = `From: ${name} <${email}>\n\n${message}`;
  const mailto = `mailto:ranacnco17@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact: ' + name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
  showStatus('success', '✓ Opening your email client...');
  this.reset();
});

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  if (!el) return;
  el.className = 'form-status ' + type;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ── COPY EMAIL ────────────────────────────────────────────────────
document.querySelector('.copy-email')?.addEventListener('click', () => {
  navigator.clipboard.writeText('ranacnco17@gmail.com').then(() => {
    const v = document.getElementById('email-val');
    if (v) { v.textContent = '✓ Copied to clipboard!'; setTimeout(() => v.textContent = 'ranacnco17@gmail.com', 2200); }
  }).catch(() => {});
});
