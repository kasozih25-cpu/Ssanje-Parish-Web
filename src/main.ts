// ===== Navigation =====
const navbar = document.getElementById('navbar') as HTMLElement;
const navToggle = document.getElementById('nav-toggle') as HTMLElement;
const navLinks = document.getElementById('nav-links') as HTMLElement;
const navLinkElements = document.querySelectorAll('.nav-link');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateBackToTop();
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== Smooth Scroll for anchor links (within-page) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = (anchor as HTMLAnchorElement).getAttribute('href')!;
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = (target as HTMLElement).offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== News Filters =====
const filterBtns = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    newsCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== Media Tabs =====
const mediaTabs = document.querySelectorAll('.media-tab');
const mediaContents = document.querySelectorAll('.media-content');

mediaTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    mediaTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const tabName = tab.getAttribute('data-tab');

    mediaContents.forEach(content => {
      content.classList.remove('active');
    });

    const targetContent = document.getElementById(`media-${tabName}`);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const formStatus = document.getElementById('form-status') as HTMLElement;
const submitBtn = contactForm?.querySelector('.btn-submit') as HTMLElement;

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading state
  submitBtn.classList.add('loading');
  formStatus.className = 'form-status';
  formStatus.style.display = 'none';

  // Simulate form submission
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Show success message
  submitBtn.classList.remove('loading');
  formStatus.className = 'form-status success';
  formStatus.textContent = '✓ Message sent successfully! We\'ll get back to you within 24 hours.';
  contactForm.reset();

  // Clear status after 5 seconds
  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 5000);
});


// ===== Back to Top =====
const backToTop = document.getElementById('back-to-top') as HTMLElement;

function updateBackToTop(): void {
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Scroll Animations =====
const fadeElements = document.querySelectorAll<HTMLElement>(
  '.ql-card, .news-card, .program-card, .service-item, .partner-card, .donate-card, .involve-card, .admission-card, .hc-info-card, .facility-item, .demo-item, .livestock-item, .event-item, .about-content, .about-sidebar, .farm-intro, .hc-intro, .accommodation-intro, .gfdi-intro, .contact-info, .contact-form-wrapper'
);

fadeElements.forEach(el => {
  el.classList.add('fade-in');
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

fadeElements.forEach(el => {
  fadeObserver.observe(el);
});

// ===== Initialize =====
updateBackToTop();
