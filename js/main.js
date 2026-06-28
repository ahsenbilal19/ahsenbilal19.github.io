// ── ROUTER ────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (!page) return;
  page.classList.add('active');
  window.scrollTo(0, 0);
  const link = document.querySelector(`.nav-links a[data-page="${id}"]`);
  if (link) link.classList.add('active');
  document.getElementById('nav-links')?.classList.remove('open');
  if (id === 'home') { setTimeout(initParticles, 60); setTimeout(animateCounters, 800); }
  setTimeout(() => { initReveal(); initTimeline(); }, 120);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-page]');
  if (!el) return;
  const href = el.getAttribute('href');
  if (href && (href.startsWith('http') || href.endsWith('.pdf'))) return;
  e.preventDefault();
  const t = el.getAttribute('data-page');
  if (!t) return;
  history.pushState({ page: t }, '', '#' + t);
  showPage(t);
});

window.addEventListener('popstate', e => showPage(e.state?.page || 'home'));
showPage(location.hash.replace('#', '') || 'home');

// ── NAV SCROLL ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER ─────────────────────────────────────────────────────
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('nav-links')?.classList.toggle('open');
});

// ── PARTICLES ─────────────────────────────────────────────────────
let pRAF = null;
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  if (pRAF) { cancelAnimationFrame(pRAF); pRAF = null; }
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COLS = ['rgba(59,130,246,','rgba(96,165,250,','rgba(0,212,255,','rgba(147,197,253,'];

  class P {
    constructor(rand) { this.reset(rand); }
    reset(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 8;
      this.vx = (Math.random() - .5) * .35;
      this.vy = -(Math.random() * .4 + .12);
      this.r  = Math.random() * 1.4 + .25;
      this.a  = Math.random() * .4 + .06;
      this.c  = COLS[Math.floor(Math.random() * COLS.length)];
    }
    step() { this.x += this.vx; this.y += this.vy; if (this.y < -8) this.reset(false); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.c + this.a + ')'; ctx.fill(); }
  }

  const n = Math.min(80, Math.floor(W * H / 11000));
  const pts = Array.from({ length: n }, (_, i) => new P(i < n * .65));

  let mx = -9999, my = -9999;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  }, { passive: true });
  canvas.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

  function drawLines() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 95) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${.045*(1-d/95)})`; ctx.lineWidth = .4; ctx.stroke();
        }
      }
      const mdx = pts[i].x - mx, mdy = pts[i].y - my;
      const md = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < 120) {
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(0,212,255,${.12*(1-md/120)})`; ctx.lineWidth = .55; ctx.stroke();
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { p.step(); p.draw(); });
    drawLines();
    pRAF = requestAnimationFrame(loop);
  }
  loop();
}

// ── TYPING EFFECT ─────────────────────────────────────────────────
const ROLES = ['Software Engineer','Frontend Developer','QA Engineer','Data Analyst','Full-Stack Builder'];
let ri = 0, ci = 0, del = false;
function typeLoop() {
  const el = document.querySelector('.typed-text');
  if (!el) { setTimeout(typeLoop, 300); return; }
  const w = ROLES[ri];
  if (!del) {
    el.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; setTimeout(typeLoop, 2200); return; }
  } else {
    el.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % ROLES.length; }
  }
  setTimeout(typeLoop, del ? 42 : 85);
}
setTimeout(typeLoop, 1600);

// ── COUNTER ANIMATION ─────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.closest('.stat-item')?.querySelector('.stat-lbl')?.textContent.includes('Skills') ? '+' : '+';
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + (target >= 10 ? '+' : '+');
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 65); obs.unobserve(e.target); }
    });
  }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── TIMELINE REVEAL ───────────────────────────────────────────────
function initTimeline() {
  const items = document.querySelectorAll('.tl-item:not(.visible)');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 120); obs.unobserve(e.target); }
    });
  }, { threshold: .08 });
  items.forEach(el => obs.observe(el));
}

// ── CONTACT FORM ──────────────────────────────────────────────────
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const msg     = document.getElementById('cf-msg')?.value.trim();
  if (!name || !email || !msg) { showStatus('error', '⚠ Please fill all required fields.'); return; }
  window.location.href = `mailto:ranacnco17@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio: ' + name)}&body=${encodeURIComponent('From: ' + name + ' <' + email + '>\n\n' + msg)}`;
  showStatus('success', '✓ Opening your email client...');
  this.reset();
});

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  if (!el) return;
  el.className = type; el.textContent = msg; el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ── COPY EMAIL ────────────────────────────────────────────────────
document.querySelector('.copy-email')?.addEventListener('click', () => {
  navigator.clipboard.writeText('ranacnco17@gmail.com').then(() => {
    const v = document.getElementById('email-val');
    if (v) { v.textContent = '✓ Copied!'; setTimeout(() => v.textContent = 'ranacnco17@gmail.com', 2000); }
  }).catch(() => {});
});

// ── BEAM MOUSE PARALLAX ───────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const beam = document.querySelector('.hero-beam');
  const glow = document.querySelector('.hero-glow');
  if (!beam && !glow) return;
  const x = (e.clientX / window.innerWidth - .5) * 20;
  const y = (e.clientY / window.innerHeight - .5) * 10;
  if (beam) beam.style.transform = `translate(${x * .3}px, ${y * .3}px)`;
  if (glow) glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
});
