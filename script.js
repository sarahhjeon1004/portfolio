(() => {
  'use strict';

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  function observeReveals() {
    document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
      revealObserver.observe(el);
    });
  }

  observeReveals();

  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + nav.offsetHeight + 100;
    let current = '';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateActiveNav();

  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMobile.classList.toggle('open');
    });

    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  const caseStudies = document.querySelectorAll('.case-study');
  const filterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  const workSection = document.getElementById('work');

  function scrollToEl(el) {
    if (!el) return;
    const navHeight = nav.offsetHeight;
    const pos = el.getBoundingClientRect().top + window.scrollY - navHeight - 24;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }

  function showAll() {
    caseStudies.forEach((cs) => {
      cs.classList.remove('hidden');
      cs.style.opacity = '';
    });
    document.querySelectorAll('.project-card').forEach((c) => c.classList.remove('active'));
    if (filterBtn) filterBtn.classList.add('active');
    observeReveals();
  }

  function showProject(projectId) {
    caseStudies.forEach((cs) => {
      if (cs.dataset.case === projectId) {
        cs.classList.remove('hidden');
        cs.style.opacity = '0';
        requestAnimationFrame(() => {
          cs.style.transition = 'opacity 0.5s ease';
          cs.style.opacity = '1';
        });
      } else {
        cs.classList.add('hidden');
      }
    });
    document.querySelectorAll('.project-card').forEach((c) => {
      if (c.dataset.project === projectId) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
    if (filterBtn) filterBtn.classList.remove('active');
    observeReveals();

    setTimeout(() => {
      scrollToEl(document.getElementById(projectId));
    }, 50);
  }

  document.getElementById('projectCards').addEventListener('click', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;
    const projectId = card.dataset.project;
    if (projectId) {
      showProject(projectId);
    }
  });

  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      showAll();
      setTimeout(() => scrollToEl(workSection), 50);
    });
  }

  document.querySelectorAll('.back-to-projects').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showAll();
      scrollToEl(document.getElementById('projects'));
    });
  });

  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    darkToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  const staggerGroups = [
    '.solution-grid .solution-card',
    '.principles-grid .principle',
    '.impact-grid .impact-card',
    '.ama-features .ama-feature',
    '.project-cards .project-card',
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.style.transitionDelay = `${index * 100}ms`;
    });
  });

  document.querySelectorAll('.project-card').forEach((card) => {
    card.classList.add('reveal');
  });
  observeReveals();
})();
