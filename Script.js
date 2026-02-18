/* ═══════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Custom Cursor ── */
  const cursor    = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .stat-box, .fact-item, .social-link');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });

  /* ── Hamburger Menu ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  // Close on nav link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ── Scrolled Nav ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  /* ── Intersection Observer: Fade-in ── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  /* ── Skill Bars animation ── */
  const skillBars = document.querySelectorAll('.skill-bar');
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width') || '75%';
        setTimeout(() => { target.style.width = width; }, 300);
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => barObserver.observe(bar));

  /* ── Counter animation (DSA stats) ── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, 0, end, 1400);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── Active nav link highlight ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── Resume button — placeholder alert ── */
  document.getElementById('resumeDownload')?.addEventListener('click', () => {
    console.log('Download button clicked');
    // No preventDefault, so the link works normally
});

  document.getElementById('resumeView')?.addEventListener('click', () => {
    // Optional: You can log or track clicks here
    console.log('Preview button clicked');
    // No preventDefault, so the link will open
});


  /* ── Parallax on hero visual ── */
  const heroVisual = document.querySelector('.hero-visual');
  window.addEventListener('scroll', () => {
    if (!heroVisual) return;
    const scrolled = window.scrollY;
    heroVisual.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
  });

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Tilt effect on project cards ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── Floating particles in hero ── */
  createParticles();

  function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${Math.random() > 0.5 ? 'var(--accent)' : 'var(--accent2)'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top:  ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.35 + 0.05};
        pointer-events: none;
        z-index: 1;
        animation: floatParticle ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 4}s infinite alternate;
      `;
      hero.appendChild(dot);
    }

    // inject keyframes if not already
    if (!document.getElementById('particleStyle')) {
      const style = document.createElement('style');
      style.id = 'particleStyle';
      style.textContent = `
        @keyframes floatParticle {
          0%   { transform: translateY(0px)   translateX(0px); }
          100% { transform: translateY(-40px) translateX(20px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

});