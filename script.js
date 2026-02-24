(() => {
  'use strict';

  // Scroll reveal
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

  // Nav scroll
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile nav toggle
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

  // Smooth scroll for anchor links
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

  // Project selector / filter
  const projectCards = document.querySelectorAll('.project-card');
  const caseStudies = document.querySelectorAll('.case-study');
  const filterBtn = document.querySelector('.filter-btn[data-filter="all"]');
  const workSection = document.getElementById('work');

  function showAll() {
    caseStudies.forEach((cs) => {
      cs.classList.remove('hidden');
    });
    projectCards.forEach((c) => c.classList.remove('active'));
    if (filterBtn) filterBtn.classList.add('active');
    observeReveals();
  }

  function showProject(projectId) {
    caseStudies.forEach((cs) => {
      if (cs.dataset.case === projectId) {
        cs.classList.remove('hidden');
      } else {
        cs.classList.add('hidden');
      }
    });
    projectCards.forEach((c) => {
      c.classList.toggle('active', c.dataset.project === projectId);
    });
    if (filterBtn) filterBtn.classList.remove('active');
    observeReveals();

    setTimeout(() => {
      const target = document.getElementById(projectId);
      if (target) {
        const navHeight = nav.offsetHeight;
        const pos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    }, 100);
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.project;
      showProject(projectId);
    });
  });

  if (filterBtn) {
    filterBtn.addEventListener('click', () => {
      showAll();
      setTimeout(() => {
        if (workSection) {
          const navHeight = nav.offsetHeight;
          const pos = workSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      }, 100);
    });
  }

  // Back to projects links
  document.querySelectorAll('.back-to-projects').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showAll();
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const navHeight = nav.offsetHeight;
        const pos = projectsSection.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      }
    });
  });

  // Staggered reveal
  const staggerGroups = [
    '.solution-grid .solution-card',
    '.principles-grid .principle',
    '.impact-grid .impact-card',
    '.ama-features .ama-feature',
    '.project-cards .project-card',
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((item, index) => {
      item.style.transitionDelay = `${index * 80}ms`;
    });
  });
})();
