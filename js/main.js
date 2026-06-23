// ── ROUTER ────────────────────────────────────────────────────────
const pages   = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  navLinks.forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) { page.classList.add('active'); window.scrollTo(0,0); }
  const link = document.querySelector(`.nav-links a[data-page="${id}"]`);
  if (link) link.classList.add('active');
  if (id === 'home') initParticles();
  initReveal();
  initTimeline();
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.getAttribute('data-page');
    history.pushState({page: target}, '', '#' + target);
    showPage(target);
    if (document.querySelector('.nav-links').classList.contains('open')) {
      document.querySelector('.nav-links').classList.remove('open');
    }
  });
});

window.addEventListener('popstate', e => {
  const id = e.state?.page || 'home';
  showPage(id);
});

// Init from hash
const initPage = location.hash.replace('#','') || 'home';
showPage(initPage);

// ── NAV SCROLL ────────────────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── HAMBURGER ─────────────────────────────────────────────────────
document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ── PARTICLES ─────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(59,130,246,', 'rgba(96,165,250,', 'rgba(30,58,95,'];

  class Particle {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x  = Math.random() * W;
      this.y  = H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  const N = Math.min(120, Math.floor(W * H / 8000));
  for (let i = 0; i < N; i++) particles.push(new Particle());

  // connections
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - d/100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    raf = requestAnimationFrame(loop);
  }
  if (raf) cancelAnimationFrame(raf);
  loop();
}

// ── TYPING EFFECT ─────────────────────────────────────────────────
const roles = [
  'Software Engineer',
  'Frontend Developer',
  'QA Engineer',
  'Data Analyst',
  'Full-Stack Builder'
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.querySelector('.typed-text');

function typeLoop() {
  if (!typedEl) return;
  const word = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
  } else {
    typedEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
setTimeout(typeLoop, 1400);

// ── SCROLL REVEAL ─────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── TIMELINE REVEAL ───────────────────────────────────────────────
function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 120);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
}

// ── CONTACT FORM (mailto fallback) ────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value.trim();
  const message = document.getElementById('cf-message').value.trim();
  if (!name || !email || !message) {
    showStatus('error', 'Please fill in all required fields.');
    return;
  }
  const mailto = `mailto:ranacnco17@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact: ' + name)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + message)}`;
  window.location.href = mailto;
  showStatus('success', 'Opening your email client...');
  this.reset();
});

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  if (!el) return;
  el.className = 'form-status ' + type;
  el.textContent = msg;
  setTimeout(() => { el.className = 'form-status'; el.textContent = ''; }, 5000);
}

// ── COPY EMAIL ────────────────────────────────────────────────────
document.querySelectorAll('.copy-email').forEach(el => {
  el.addEventListener('click', () => {
    navigator.clipboard.writeText('ranacnco17@gmail.com').then(() => {
      el.querySelector('.contact-val').textContent = 'Copied!';
      setTimeout(() => el.querySelector('.contact-val').textContent = 'ranacnco17@gmail.com', 2000);
    });
  });
});
