// ===== Navigation =====
const navbar = document.getElementById('navbar') as HTMLElement;
const navToggle = document.getElementById('nav-toggle') as HTMLElement;
const navLinks = document.getElementById('nav-links') as HTMLElement;
const navLinkElements = document.querySelectorAll('.nav-link');
const navOverlay = document.getElementById('nav-overlay') as HTMLElement;

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
function openMobileMenu() {
  navToggle.classList.add('active');
  navLinks.classList.add('open');
  if (navOverlay) navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navToggle.classList.remove('active');
  navLinks.classList.remove('open');
  if (navOverlay) navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Close mobile menu on overlay click
if (navOverlay) {
  navOverlay.addEventListener('click', closeMobileMenu);
}

// Close mobile menu on link click
navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close mobile menu on bottom nav link click
const bottomNavLinks = document.querySelectorAll('.bottom-nav-link');
bottomNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMobileMenu();
  }
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

function activateMediaTab(tabName: string): void {
  mediaTabs.forEach(t => {
    t.classList.remove('active');
    if (t.getAttribute('data-tab') === tabName) {
      t.classList.add('active');
    }
  });

  mediaContents.forEach(content => {
    content.classList.remove('active');
  });

  const targetContent = document.getElementById(`media-${tabName}`);
  if (targetContent) {
    targetContent.classList.add('active');
  }
}

mediaTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    activateMediaTab(tabName!);
  });
});

// Activate tab based on URL hash (e.g. media.html#documents)
if (mediaTabs.length > 0 && window.location.hash) {
  const hashTab = window.location.hash.replace('#', '');
  const matchingTab = document.querySelector(`.media-tab[data-tab="${hashTab}"]`);
  if (matchingTab) {
    activateMediaTab(hashTab);
    // Scroll to media content after a short delay
    setTimeout(() => {
      const targetContent = document.getElementById(`media-${hashTab}`);
      if (targetContent) {
        targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

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

// ===== Image Lightbox Modal =====
let lightboxImage: HTMLImageElement | null = null;
let lightboxOverlay: HTMLElement | null = null;
let lightboxCaption: HTMLElement | null = null;
let lightboxPrev: HTMLElement | null = null;
let lightboxNext: HTMLElement | null = null;
let currentLightboxImages: HTMLImageElement[] = [];
let currentLightboxIndex: number = 0;

function createLightbox(): void {
  if (lightboxOverlay) return;

  lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
    <button class="lightbox-prev" aria-label="Previous image">&#10094;</button>
    <img class="lightbox-image" src="" alt="">
    <div class="lightbox-caption"></div>
    <button class="lightbox-next" aria-label="Next image">&#10095;</button>
  `;
  document.body.appendChild(lightboxOverlay);

  lightboxImage = lightboxOverlay.querySelector('.lightbox-image')!;
  lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption')!;
  lightboxPrev = lightboxOverlay.querySelector('.lightbox-prev')!;
  lightboxNext = lightboxOverlay.querySelector('.lightbox-next')!;

  // Close handlers
  lightboxOverlay.querySelector('.lightbox-close')!.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  });

  // Navigation handlers
  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay!.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(images: HTMLImageElement[], index: number): void {
  createLightbox();
  currentLightboxImages = images;
  currentLightboxIndex = index;
  updateLightboxContent();
  lightboxOverlay!.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(): void {
  if (lightboxOverlay) {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction: number): void {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxImages.length - 1;
  if (currentLightboxIndex >= currentLightboxImages.length) currentLightboxIndex = 0;
  updateLightboxContent();
}

function updateLightboxContent(): void {
  if (!lightboxImage || !lightboxCaption) return;
  const img = currentLightboxImages[currentLightboxIndex];
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt;
  lightboxCaption.textContent = `${img.alt} (${currentLightboxIndex + 1}/${currentLightboxImages.length})`;
}

// Attach lightbox to all gallery images
function initLightbox(): void {
  const galleryGrids = document.querySelectorAll('.photo-grid');
  galleryGrids.forEach(grid => {
    const images = Array.from(grid.querySelectorAll('img')) as HTMLImageElement[];
    if (images.length === 0) return;
    images.forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.classList.add('lightbox-trigger');
      img.addEventListener('click', () => {
        openLightbox(images, index);
      });
      // Touch support for mobile
      img.addEventListener('touchend', (e) => {
        e.preventDefault();
        openLightbox(images, index);
      });
    });
  });
}

// ===== Photo Gallery Slider =====
interface SliderState {
  container: HTMLElement;
  images: HTMLImageElement[];
  currentIndex: number;
  intervalId: number | null;
  autoPlayDelay: number;
}

const activeSliders: Map<HTMLElement, SliderState> = new Map();

function initGallerySliders(): void {
  const photoGalleries = document.querySelectorAll('.photo-gallery');
  photoGalleries.forEach(gallery => {
    const grid = gallery.querySelector('.photo-grid');
    if (!grid) return;

    const images = Array.from(grid.querySelectorAll('img')) as HTMLImageElement[];
    if (images.length <= 1) return;

    // Create slider wrapper
    const sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'photo-slider-wrapper';

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'photo-slider-container';
    sliderContainer.style.position = 'relative';
    sliderContainer.style.overflow = 'hidden';

    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'photo-slider-track';
    sliderTrack.style.display = 'flex';
    sliderTrack.style.transition = 'transform 0.5s ease';

    // Clone images into slider
    images.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'photo-slider-slide';
      slide.style.minWidth = '100%';
      slide.style.flexShrink = '0';
      const clone = img.cloneNode(true) as HTMLImageElement;
      clone.style.width = '100%';
      clone.style.display = 'block';
      slide.appendChild(clone);
      sliderTrack.appendChild(slide);
    });

    sliderContainer.appendChild(sliderTrack);

    // Navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'photo-slider-btn photo-slider-prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Previous photo');
    sliderContainer.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'photo-slider-btn photo-slider-next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Next photo');
    sliderContainer.appendChild(nextBtn);

    // Dots indicator
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'photo-slider-dots';
    images.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = `photo-slider-dot${i === 0 ? ' active' : ''}`;
      dot.addEventListener('click', () => goToSlide(sliderContainer, i));
      dotsContainer.appendChild(dot);
    });
    sliderContainer.appendChild(dotsContainer);

    sliderWrapper.appendChild(sliderContainer);

    // Replace grid with slider
    grid.style.display = 'none';
    grid.parentNode!.insertBefore(sliderWrapper, grid.nextSibling);

    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'photo-slider-toggle';
    toggleBtn.textContent = 'Show as grid';
    toggleBtn.addEventListener('click', () => {
      if (grid.style.display === 'none') {
        grid.style.display = 'grid';
        sliderWrapper.style.display = 'none';
        toggleBtn.textContent = 'Show as slider';
        stopAutoPlay(sliderContainer);
      } else {
        grid.style.display = 'none';
        sliderWrapper.style.display = 'block';
        toggleBtn.textContent = 'Show as grid';
        startAutoPlay(sliderContainer);
      }
    });
    sliderWrapper.parentNode!.insertBefore(toggleBtn, sliderWrapper.nextSibling);

    // Initialize slider state
    const state: SliderState = {
      container: sliderContainer,
      images: images,
      currentIndex: 0,
      intervalId: null,
      autoPlayDelay: 4000
    };
    activeSliders.set(sliderContainer, state);

    // Event listeners
    prevBtn.addEventListener('click', () => {
      navigateSlide(sliderContainer, -1);
    });
    nextBtn.addEventListener('click', () => {
      navigateSlide(sliderContainer, 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = (e as TouchEvent).changedTouches[0].clientX;
    }, { passive: true });
    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = (e as TouchEvent).changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateSlide(sliderContainer, diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    // Pause on hover
    sliderContainer.addEventListener('mouseenter', () => stopAutoPlay(sliderContainer));
    sliderContainer.addEventListener('mouseleave', () => startAutoPlay(sliderContainer));

    // Start autoplay
    startAutoPlay(sliderContainer);
  });
}

function navigateSlide(container: HTMLElement, direction: number): void {
  const state = activeSliders.get(container);
  if (!state) return;

  state.currentIndex += direction;
  if (state.currentIndex < 0) state.currentIndex = state.images.length - 1;
  if (state.currentIndex >= state.images.length) state.currentIndex = 0;

  updateSliderPosition(container);
}

function goToSlide(container: HTMLElement, index: number): void {
  const state = activeSliders.get(container);
  if (!state) return;
  state.currentIndex = index;
  updateSliderPosition(container);
}

function updateSliderPosition(container: HTMLElement): void {
  const state = activeSliders.get(container);
  if (!state) return;

  const track = container.querySelector('.photo-slider-track') as HTMLElement;
  if (track) {
    track.style.transform = `translateX(-${state.currentIndex * 100}%)`;
  }

  // Update dots
  const dots = container.querySelectorAll('.photo-slider-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === state.currentIndex);
  });
}

function startAutoPlay(container: HTMLElement): void {
  const state = activeSliders.get(container);
  if (!state) return;
  stopAutoPlay(container);
  state.intervalId = window.setInterval(() => {
    navigateSlide(container, 1);
  }, state.autoPlayDelay);
}

function stopAutoPlay(container: HTMLElement): void {
  const state = activeSliders.get(container);
  if (!state || !state.intervalId) return;
  clearInterval(state.intervalId);
  state.intervalId = null;
}

// ===== Scroll Progress Indicator =====
let scrollProgress: HTMLElement | null = null;

function initScrollProgress(): void {
  scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress-bar';
  document.body.appendChild(scrollProgress);

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
}

function updateScrollProgress(): void {
  if (!scrollProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

// ===== Enhanced Form Validation =====
function initFormValidation(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement;
  if (!form) return;

  const inputs = form.querySelectorAll<HTMLInputElement>('input[required], textarea[required], select[required]');
  inputs.forEach(input => {
    // Real-time validation on blur
    input.addEventListener('blur', () => validateField(input));
    // Clear error on input
    input.addEventListener('input', () => {
      const errorEl = input.parentNode?.querySelector('.field-error');
      if (errorEl) errorEl.remove();
      input.classList.remove('field-invalid', 'field-valid');
    });
  });

  // Email format validation
  const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        emailInput.classList.add('field-invalid');
      }
    });
  }

  // Phone format validation
  const phoneInput = form.querySelector<HTMLInputElement>('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value && !isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
        phoneInput.classList.add('field-invalid');
      }
    });
  }
}

function validateField(input: HTMLInputElement): boolean {
  if (!input.required) return true;
  if (!input.value.trim()) {
    showFieldError(input, 'This field is required');
    input.classList.add('field-invalid');
    return false;
  }
  input.classList.remove('field-invalid');
  input.classList.add('field-valid');
  const errorEl = input.parentNode?.querySelector('.field-error');
  if (errorEl) errorEl.remove();
  return true;
}

function showFieldError(input: HTMLElement, message: string): void {
  const existing = input.parentNode?.querySelector('.field-error');
  if (existing) existing.remove();

  const error = document.createElement('span');
  error.className = 'field-error';
  error.textContent = message;
  input.parentNode?.appendChild(error);
}

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone: string): boolean {
  const re = /^[\d\s\-\+\(\)]{7,20}$/;
  return re.test(phone);
}

// ===== Reading Time Estimator =====
function initReadingTime(): void {
  const articles = document.querySelectorAll<HTMLElement>('.news-card, .about-content, .hc-intro-content, .org-intro-content');
  const wordsPerMinute = 200;

  articles.forEach(article => {
    const text = article.textContent || '';
    const wordCount = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    const titleEl = article.querySelector('h2, h3');
    if (titleEl) {
      const readingTime = document.createElement('span');
      readingTime.className = 'reading-time';
      readingTime.textContent = minutes > 1 ? `${minutes} min read` : '1 min read';
      titleEl.parentNode!.insertBefore(readingTime, titleEl.nextSibling);
    }
  });
}

// ===== Dynamic Search Functionality =====
let searchOverlay: HTMLElement | null = null;

function initSearch(): void {
  // Add search button to nav
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search-btn';
  searchBtn.innerHTML = '&#128269;';
  searchBtn.setAttribute('aria-label', 'Search');
  searchBtn.title = 'Search (Ctrl+K)';
  navLinks.parentNode!.insertBefore(searchBtn, navLinks.nextSibling);

  searchBtn.addEventListener('click', openSearch);

  // Keyboard shortcut Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}

function openSearch(): void {
  if (searchOverlay && searchOverlay.classList.contains('active')) {
    closeSearch();
    return;
  }

  if (!searchOverlay) {
    searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
      <div class="search-container">
        <div class="search-header">
          <input type="text" class="search-input" placeholder="Search pages, news, documents..." autocomplete="off">
          <button class="search-close" aria-label="Close search">&times;</button>
        </div>
        <div class="search-results"></div>
        <div class="search-footer">
          <span class="search-hint">Press <kbd>Ctrl+K</kbd> to open, <kbd>Esc</kbd> to close</span>
        </div>
      </div>
    `;
    document.body.appendChild(searchOverlay);

    const input = searchOverlay.querySelector<HTMLInputElement>('.search-input')!;
    const results = searchOverlay.querySelector('.search-results')!;

    input.addEventListener('input', () => {
      performSearch(input.value, results);
    });

    searchOverlay.querySelector('.search-close')!.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('search-overlay')) {
        closeSearch();
      }
    });

    // Focus input
    setTimeout(() => input.focus(), 100);
  }

  searchOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSearch(): void {
  if (searchOverlay) {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function performSearch(query: string, resultsContainer: HTMLElement): void {
  if (!query.trim()) {
    resultsContainer.innerHTML = '<p class="search-empty">Type to search across pages, news, and documents</p>';
    return;
  }

  const searchResults = buildSearchResults(query);
  if (searchResults.length === 0) {
    resultsContainer.innerHTML = '<p class="search-empty">No results found. Try different keywords.</p>';
    return;
  }

  resultsContainer.innerHTML = searchResults.map(result => `
    <a href="${result.url}" class="search-result-item">
      <span class="search-result-title">${result.title}</span>
      <span class="search-result-category">${result.category}</span>
      <span class="search-result-excerpt">${result.excerpt}</span>
    </a>
  `).join('');

  // Click handler
  resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => closeSearch());
  });
}

interface SearchResult {
  title: string;
  url: string;
  category: string;
  excerpt: string;
}

function buildSearchResults(query: string): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  // Page navigation results
  const pages: SearchResult[] = [
    { title: 'Home', url: 'index.html', category: 'Page', excerpt: 'Welcome to Ssanje Parish' },
    { title: 'About the Parish', url: 'about.html', category: 'Page', excerpt: 'History, leadership, and parish information' },
    { title: 'Farm School', url: 'farm-school.html', category: 'Page', excerpt: 'Agricultural training and demonstration farms' },
    { title: 'Health Centre Overview', url: 'health-centre-overview.html', category: 'Page', excerpt: 'St. Jude Ssanje Health Centre III' },
    { title: 'Health Centre Services', url: 'health-centre-services.html', category: 'Page', excerpt: 'Medical services and departments' },
    { title: 'Health Centre People', url: 'health-centre-people.html', category: 'Page', excerpt: 'Staff and committee members' },
    { title: 'Health Centre Facilities', url: 'health-centre-facilities.html', category: 'Page', excerpt: 'Population served and utilities' },
    { title: 'Accommodation', url: 'accommodation.html', category: 'Page', excerpt: 'Parish Guest Inn and lodging' },
    { title: 'Organisations', url: 'organisations.html', category: 'Page', excerpt: 'Audible Voices and GFDI' },
    { title: 'News & Events', url: 'news.html', category: 'Page', excerpt: 'Latest announcements and updates' },
    { title: 'Media Centre', url: 'media.html', category: 'Page', excerpt: 'Photo gallery, videos, and documents' },
    { title: 'Partners & Donors', url: 'partners.html', category: 'Page', excerpt: 'Our supporting organisations' },
    { title: 'Support Our Work', url: 'donate.html', category: 'Page', excerpt: 'Ways to contribute and donate' },
    { title: 'Contact Us', url: 'contact.html', category: 'Page', excerpt: 'Get in touch with the parish' }
  ];

  pages.forEach(page => {
    if (page.title.toLowerCase().includes(q) || page.excerpt.toLowerCase().includes(q)) {
      results.push(page);
    }
  });

  // News results from current page
  const newsCards = document.querySelectorAll('.news-card');
  newsCards.forEach(card => {
    const title = (card.querySelector('h3') as HTMLElement)?.textContent || '';
    const excerpt = (card.querySelector('p') as HTMLElement)?.textContent?.substring(0, 80) || '';
    if (title.toLowerCase().includes(q)) {
      results.push({ title, url: 'news.html', category: 'News', excerpt: `${excerpt}...` });
    }
  });

  // Document results from current page
  const docItems = document.querySelectorAll('.document-item');
  docItems.forEach(item => {
    const title = (item.querySelector('h4') as HTMLElement)?.textContent || '';
    const desc = (item.querySelector('p') as HTMLElement)?.textContent || '';
    if (title.toLowerCase().includes(q)) {
      results.push({ title, url: 'media.html#documents', category: 'Document', excerpt: desc });
    }
  });

  return results.slice(0, 10);
}

// ===== Image Lazy Loading with Fade =====
function initLazyLoading(): void {
  const images = document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('lazy-loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(img => {
      img.classList.add('lazy-image');
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    images.forEach(img => img.classList.add('lazy-loaded'));
  }
}

// ===== Keyboard Navigation Shortcuts =====
function initKeyboardShortcuts(): void {
  const shortcuts: { key: string; action: () => void; description: string }[] = [
    { key: '/', action: () => openSearch(), description: 'Open search' },
    { key: 'Escape', action: () => { closeSearch(); closeLightbox(); closeMobileMenu(); }, description: 'Close overlays' }
  ];

  // Add help overlay
  const helpOverlay = document.createElement('div');
  helpOverlay.className = 'keyboard-help-overlay';
  helpOverlay.innerHTML = `
    <div class="keyboard-help-container">
      <h3>Keyboard Shortcuts</h3>
      <ul class="keyboard-shortcuts-list">
        <li><kbd>Ctrl</kbd> + <kbd>K</kbd> — Open search</li>
        <li><kbd>/</kbd> — Open search (when not in input)</li>
        <li><kbd>Esc</kbd> — Close overlays</li>
        <li><kbd>←</kbd> / <kbd>→</kbd> — Navigate lightbox</li>
      </ul>
      <button class="btn btn-primary" onclick="this.closest('.keyboard-help-overlay').classList.remove('active')">Got it</button>
    </div>
  `;
  document.body.appendChild(helpOverlay);

  // Show help on ? key
  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !isInputFocused()) {
      helpOverlay.classList.toggle('active');
    }
  });
}

function isInputFocused(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLInputElement ||
         active instanceof HTMLTextAreaElement ||
         active instanceof HTMLSelectElement;
}

// ===== Page Transition Animations =====
function initPageTransitions(): void {
  // Add fade-in on page load
  const mainContent = document.querySelector('main') || document.body;
  mainContent.classList.add('page-transition');

  // Animate sections as they come into view
  const sections = document.querySelectorAll<HTMLElement>('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -100px 0px' });

  sections.forEach(section => {
    section.classList.add('section-fade');
    sectionObserver.observe(section);
  });
}

// ===== Dynamic Image Preloader =====
function initImagePreloader(): void {
  // Preload critical images that are likely to be clicked
  const criticalImages = [
    './public/fr-l-kakooza.jpg'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// ===== Back to Top with Progress =====
function initBackToTopWithProgress(): void {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop) return;

  // Add progress ring
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'btt-progress-ring');
  svg.setAttribute('viewBox', '0 0 100 100');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('class', 'btt-progress-circle');
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', '45');
  circle.setAttribute('stroke-dasharray', '283');
  circle.setAttribute('stroke-dashoffset', '283');

  svg.appendChild(circle);
  backToTop.insertBefore(svg, backToTop.firstChild);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const offset = 283 - (283 * progress);
    circle.setAttribute('stroke-dashoffset', String(offset));
  }, { passive: true });
}

// ===== News Search Filter =====
function initNewsSearch(): void {
  const newsSection = document.querySelector('.news-section');
  if (!newsSection) return;

  const searchContainer = document.createElement('div');
  searchContainer.className = 'news-search-container';
  searchContainer.innerHTML = `
    <input type="text" class="news-search-input" placeholder="Filter news by keyword...">
  `;

  const filterContainer = newsSection.querySelector('.filter-container');
  if (filterContainer) {
    filterContainer.parentNode!.insertBefore(searchContainer, filterContainer.nextSibling);
  }

  const searchInput = searchContainer.querySelector<HTMLInputElement>('.news-search-input')!;
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const cards = newsSection.querySelectorAll('.news-card');

    cards.forEach(card => {
      const text = card.textContent?.toLowerCase() || '';
      const match = text.includes(query);
      card.classList.toggle('hidden', !match);
    });
  });
}

// ===== Document Download Counter =====
function initDownloadTracking(): void {
  const downloadLinks = document.querySelectorAll<HTMLAnchorElement>('a.doc-download');
  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      const docName = (link.closest('.document-item')?.querySelector('h4') as HTMLElement)?.textContent || 'Document';
      // Visual feedback
      const originalText = link.textContent;
      link.textContent = 'Downloading...';
      link.style.background = 'var(--gold)';
      setTimeout(() => {
        link.textContent = originalText;
        link.style.background = '';
      }, 2000);
    });
  });
}

// ===== Quick Info Bar Animations =====
function initQuickInfoAnimations(): void {
  const quickInfoItems = document.querySelectorAll('.quick-info-item');
  const qiObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('qi-animate');
        }, index * 100);
        qiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  quickInfoItems.forEach(item => {
    item.classList.add('qi-fade');
    qiObserver.observe(item);
  });
}

// ===== Animated Statistics Counters =====
function initAnimatedCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;

        function animate(currentTime: number): void {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(startValue + (target - startValue) * eased);
          el.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ===== Toast Notification System =====
interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

const toastQueue: ToastOptions[] = [];
let activeToast: HTMLElement | null = null;
let toastTimer: number | null = null;

function showToast(options: ToastOptions): void {
  toastQueue.push(options);
  if (!activeToast) {
    displayNextToast();
  }
}

function displayNextToast(): void {
  if (toastQueue.length === 0) {
    activeToast = null;
    return;
  }

  const options = toastQueue.shift()!;
  const toast = document.createElement('div');
  toast.className = `toast toast-${options.type || 'info'}`;

  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[options.type || 'info']}</span>
    <span class="toast-message">${options.message}</span>
    <button class="toast-close" aria-label="Dismiss">&times;</button>
  `;

  document.body.appendChild(toast);
  activeToast = toast;

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  // Close handler
  toast.querySelector('.toast-close')!.addEventListener('click', dismissToast);

  // Auto dismiss
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(dismissToast, options.duration || 4000);
}

function dismissToast(): void {
  if (!activeToast) return;
  activeToast.classList.remove('toast-show');
  activeToast.classList.add('toast-hide');

  setTimeout(() => {
    if (activeToast) {
      activeToast.remove();
      activeToast = null;
    }
    displayNextToast();
  }, 300);
}

// ===== FAQ Accordion =====
function initFAQAccordion(): void {
  const faqItems = document.querySelectorAll<HTMLElement>('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    // Add toggle button
    const toggle = document.createElement('span');
    toggle.className = 'faq-toggle';
    toggle.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
    question.appendChild(toggle);

    // Set initial state
    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item && other.classList.contains('faq-open')) {
          other.classList.remove('faq-open');
          const otherAnswer = other.querySelector('.faq-answer') as HTMLElement;
          if (otherAnswer) {
            otherAnswer.style.maxHeight = '0';
          }
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('faq-open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('faq-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ===== Dynamic Image Comparison Slider =====
function initImageComparison(): void {
  const comparisonContainers = document.querySelectorAll<HTMLElement>('.image-comparison');
  comparisonContainers.forEach(container => {
    const beforeImg = container.querySelector<HTMLImageElement>('.comparison-before');
    const afterImg = container.querySelector<HTMLImageElement>('.comparison-after');
    if (!beforeImg || !afterImg) return;

    const slider = document.createElement('div');
    slider.className = 'comparison-slider';
    slider.innerHTML = '<div class="comparison-handle"></div>';
    container.appendChild(slider);

    const handle = slider.querySelector('.comparison-handle')!;
    let isDragging = false;
    let position = 50;

    function updateSlider(x: number): void {
      const rect = container.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      position = pos;
      beforeImg.style.clipPath = `inset(0 0 0 ${pos}%)`;
      slider.style.left = `${pos}%`;
    }

    handle.addEventListener('mousedown', () => isDragging = true);
    handle.addEventListener('touchstart', () => isDragging = true, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) updateSlider((e as TouchEvent).changedTouches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchend', () => isDragging = false);

    container.addEventListener('click', (e) => {
      updateSlider((e as MouseEvent).clientX);
    });

    // Initial position
    updateSlider(container.getBoundingClientRect().left + container.offsetWidth / 2);
  });
}

// ===== Dynamic Theme Toggle =====
let currentTheme: 'light' | 'dark' = 'light';

function initThemeToggle(): void {
  // Check saved preference
  const saved = localStorage.getItem('parish-theme');
  if (saved === 'dark' || saved === 'light') {
    currentTheme = saved;
    applyTheme(currentTheme);
  }

  // Add theme toggle button
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;

  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle-btn';
  themeBtn.setAttribute('aria-label', 'Toggle dark mode');
  themeBtn.title = 'Toggle theme';
  themeBtn.innerHTML = '<span class="theme-icon-light">☀</span><span class="theme-icon-dark">☾</span>';
  navContainer.appendChild(themeBtn);

  themeBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('parish-theme', currentTheme);
  });
}

function applyTheme(theme: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--bg', '#1a1a2e');
    document.documentElement.style.setProperty('--bg-secondary', '#16213e');
    document.documentElement.style.setProperty('--bg-alt', '#0f3460');
    document.documentElement.style.setProperty('--bg-card', '#1a1a2e');
    document.documentElement.style.setProperty('--text-primary', '#e0e0e0');
    document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
    document.documentElement.style.setProperty('--text-light', '#888');
  } else {
    document.documentElement.style.setProperty('--bg', '#ffffff');
    document.documentElement.style.setProperty('--bg-secondary', '#f5f5f5');
    document.documentElement.style.setProperty('--bg-alt', '#f0f0f0');
    document.documentElement.style.setProperty('--bg-card', '#ffffff');
    document.documentElement.style.setProperty('--text-primary', '#333333');
    document.documentElement.style.setProperty('--text-secondary', '#666666');
    document.documentElement.style.setProperty('--text-light', '#999999');
  }
}

// ===== Dynamic Content Loader =====
async function loadDynamicContent(url: string, target: HTMLElement): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const content = doc.querySelector('main');
    if (content) {
      target.innerHTML = content.innerHTML;
      target.classList.add('content-loaded');
    }
  } catch (error) {
    console.error('Failed to load content:', error);
  }
}

// ===== Smooth Number Formatting =====
function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// ===== Dynamic Breadcrumb Navigation =====
function initBreadcrumbs(): void {
  const path = window.location.pathname;
  const pageName = path.split('/').pop()?.replace('.html', '') || 'home';

  const breadcrumbMap: Record<string, { name: string; url: string }> = {
    'index': { name: 'Home', url: 'index.html' },
    'about': { name: 'About', url: 'about.html' },
    'farm-school': { name: 'Farm School', url: 'farm-school.html' },
    'health-centre-overview': { name: 'Health Centre', url: 'health-centre-overview.html' },
    'health-centre-services': { name: 'Health Services', url: 'health-centre-services.html' },
    'health-centre-people': { name: 'Health People', url: 'health-centre-people.html' },
    'health-centre-facilities': { name: 'Health Facilities', url: 'health-centre-facilities.html' },
    'accommodation': { name: 'Accommodation', url: 'accommodation.html' },
    'organisations': { name: 'Organisations', url: 'organisations.html' },
    'news': { name: 'News', url: 'news.html' },
    'media': { name: 'Media', url: 'media.html' },
    'partners': { name: 'Partners', url: 'partners.html' },
    'donate': { name: 'Donate', url: 'donate.html' },
    'contact': { name: 'Contact', url: 'contact.html' }
  };

  const current = breadcrumbMap[pageName];
  if (!current) return;

  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'breadcrumb-nav';
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');
  breadcrumb.innerHTML = `
    <a href="index.html" class="breadcrumb-link">Home</a>
    <span class="breadcrumb-separator">›</span>
    <span class="breadcrumb-current">${current.name}</span>
  `;

  mainContent.insertBefore(breadcrumb, mainContent.firstChild);
}

// ===== Typewriter Effect for Hero =====
function initTypewriter(): void {
  const heroTitle = document.querySelector<HTMLElement>('.hero-title');
  if (!heroTitle) return;

  const originalText = heroTitle.textContent || '';
  heroTitle.textContent = '';
  heroTitle.style.borderRight = '3px solid var(--gold)';

  let i = 0;
  function type(): void {
    if (i < originalText.length) {
      heroTitle.textContent += originalText.charAt(i);
      i++;
      setTimeout(type, 50 + Math.random() * 50);
    } else {
      // Remove cursor after typing
      setTimeout(() => {
        heroTitle.style.borderRight = 'none';
      }, 1000);
    }
  }

  // Start after a short delay
  setTimeout(type, 500);
}

// ===== Parallax Scrolling Effect =====
function initParallax(): void {
  const parallaxElements = document.querySelectorAll<HTMLElement>('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.5');
      const yPos = -(scrollY * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }, { passive: true });
}

// ===== Dynamic Tooltip System =====
function initTooltips(): void {
  const tooltipTargets = document.querySelectorAll<HTMLElement>('[data-tooltip]');
  let tooltip: HTMLElement | null = null;

  tooltipTargets.forEach(target => {
    target.addEventListener('mouseenter', (e) => {
      const text = target.getAttribute('data-tooltip');
      if (!text) return;

      tooltip = document.createElement('div');
      tooltip.className = 'dynamic-tooltip';
      tooltip.textContent = text;
      document.body.appendChild(tooltip);

      const rect = target.getBoundingClientRect();
      tooltip.style.top = `${rect.top - 40}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = 'translateX(-50%)';

      requestAnimationFrame(() => {
        tooltip.classList.add('tooltip-show');
      });
    });

    target.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.remove('tooltip-show');
        setTimeout(() => {
          if (tooltip) {
            tooltip.remove();
            tooltip = null;
          }
        }, 200);
      }
    });
  });
}

// ===== Scroll Spy for Active Section Highlighting =====
function initScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link[href]');

  if (sections.length === 0 || navLinks.length === 0) return;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;

        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href && (href.includes(`#${id}`) || href.includes(id))) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));
}

// ===== Dynamic Event Calendar Widget =====
function initEventCalendar(): void {
  const calendarContainer = document.querySelector<HTMLElement>('.event-calendar');
  if (!calendarContainer) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // Build calendar header
  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `<h3>${monthNames[month]} ${year}</h3>`;
  calendarContainer.appendChild(header);

  // Day names
  const dayNames = document.createElement('div');
  dayNames.className = 'calendar-day-names';
  ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(day => {
    const dayEl = document.createElement('span');
    dayEl.className = 'calendar-day-name';
    dayEl.textContent = day;
    dayNames.appendChild(dayEl);
  });
  calendarContainer.appendChild(dayNames);

  // Calendar grid
  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('span');
    empty.className = 'calendar-empty';
    grid.appendChild(empty);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('span');
    cell.className = 'calendar-day';
    cell.textContent = String(day);

    if (day === now.getDate()) {
      cell.classList.add('calendar-today');
    }

    cell.addEventListener('click', () => {
      // Remove previous selection
      grid.querySelectorAll('.calendar-selected').forEach(el => el.classList.remove('calendar-selected'));
      cell.classList.add('calendar-selected');
      showToast({ message: `Selected: ${monthNames[month]} ${day}, ${year}`, type: 'info', duration: 2000 });
    });

    grid.appendChild(cell);
  }

  calendarContainer.appendChild(grid);
}

// ===== Dynamic Image Gallery Filter =====
function initGalleryFilter(): void {
  const filterContainer = document.querySelector<HTMLElement>('.gallery-filter');
  if (!filterContainer) return;

  const galleryGrid = filterContainer.nextElementSibling as HTMLElement;
  if (!galleryGrid || !galleryGrid.classList.contains('photo-grid')) return;

  const images = galleryGrid.querySelectorAll<HTMLImageElement>('img');
  const categories = new Set<string>();

  images.forEach(img => {
    const alt = img.alt.toLowerCase();
    if (alt.includes('farm')) categories.add('Farm');
    if (alt.includes('health') || alt.includes('hc')) categories.add('Health');
    if (alt.includes('church') || alt.includes('parish')) categories.add('Parish');
    if (alt.includes('inn') || alt.includes('accommodation')) categories.add('Inn');
    if (alt.includes('school')) categories.add('School');
  });

  // Add "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'gallery-filter-btn active';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => {
    filterGallery(null, allBtn);
  });
  filterContainer.appendChild(allBtn);

  // Add category buttons
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'gallery-filter-btn';
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      filterGallery(cat, btn);
    });
    filterContainer.appendChild(btn);
  });
}

function filterGallery(category: string | null, activeBtn: HTMLElement): void {
  // Update active button
  activeBtn.closest('.gallery-filter')!.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');

  // Filter images
  const grid = activeBtn.closest('section')!.querySelector('.photo-grid');
  if (!grid) return;

  const images = grid.querySelectorAll<HTMLImageElement>('img');
  images.forEach(img => {
    if (!category) {
      img.style.display = '';
      img.style.opacity = '1';
      return;
    }

    const alt = img.alt.toLowerCase();
    let match = false;
    if (category === 'Farm' && alt.includes('farm')) match = true;
    if (category === 'Health' && (alt.includes('health') || alt.includes('hc'))) match = true;
    if (category === 'Parish' && (alt.includes('church') || alt.includes('parish'))) match = true;
    if (category === 'Inn' && (alt.includes('inn') || alt.includes('accommodation'))) match = true;
    if (category === 'School' && alt.includes('school')) match = true;

    if (match) {
      img.style.display = '';
      img.style.opacity = '1';
    } else {
      img.style.opacity = '0.2';
    }
  });
}

// ===== Dynamic Page View Tracker =====
function initPageViewTracker(): void {
  const pageName = window.location.pathname.split('/').pop()?.replace('.html', '') || 'home';
  const views = JSON.parse(localStorage.getItem('page-views') || '{}');
  views[pageName] = (views[pageName] || 0) + 1;
  localStorage.setItem('page-views', JSON.stringify(views));

  // Show visit counter in console for debugging
  console.log(`Page: ${pageName}, Views: ${views[pageName]}`);
}

// ===== Smooth Anchor Scroll with Offset =====
function initSmoothAnchorScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = (anchor as HTMLAnchorElement).getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80;
      const top = (target as HTMLElement).offsetTop - offset;

      window.scrollTo({ top, behavior: 'smooth' });

      // Update URL without jumping
      history.pushState(null, '', href);
    });
  });
}

// ===== Dynamic Loading Skeleton =====
function showLoadingSkeleton(container: HTMLElement): void {
  const skeleton = document.createElement('div');
  skeleton.className = 'loading-skeleton';
  skeleton.innerHTML = `
    <div class="skeleton-line skeleton-title"></div>
    <div class="skeleton-line skeleton-text"></div>
    <div class="skeleton-line skeleton-text"></div>
    <div class="skeleton-line skeleton-short"></div>
  `;
  container.appendChild(skeleton);
}

function hideLoadingSkeleton(container: HTMLElement): void {
  const skeleton = container.querySelector('.loading-skeleton');
  if (skeleton) skeleton.remove();
}

// ===== Intersection-based Lazy Video Loading =====
function initLazyVideos(): void {
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target as HTMLVideoElement;
        if (video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: '500px' });

  videos.forEach(video => videoObserver.observe(video));
}

// ===== Dynamic Form Character Counter =====
function initCharacterCounter(): void {
  const textareas = document.querySelectorAll<HTMLTextAreaElement>('textarea[maxlength]');
  textareas.forEach(textarea => {
    const maxLen = parseInt(textarea.getAttribute('maxlength') || '0', 10);
    if (!maxLen) return;

    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.innerHTML = `<span class="char-current">${textarea.value.length}</span> / <span class="char-max">${maxLen}</span>`;
    textarea.parentNode!.appendChild(counter);

    textarea.addEventListener('input', () => {
      const current = textarea.value.length;
      counter.querySelector('.char-current')!.textContent = String(current);

      if (current > maxLen * 0.9) {
        counter.classList.add('char-warning');
      } else {
        counter.classList.remove('char-warning');
      }
    });
  });
}

// ===== Hero Slideshow =====
let heroSlideshowInterval: number | null = null;
let currentSlideIndex: number = 0;
let slideOrder: number[] = [];

function initHeroSlideshow(): void {
  const slideshow = document.getElementById('hero-slideshow');
  const dotsContainer = document.getElementById('hero-slideshow-dots');
  if (!slideshow || !dotsContainer) return;

  const slides = slideshow.querySelectorAll<HTMLElement>('.hero-slide');
  const dots = dotsContainer.querySelectorAll<HTMLElement>('.slide-dot');
  if (slides.length === 0) return;

  // Generate random order
  slideOrder = generateRandomOrder(slides.length);

  // Click on dots to navigate
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(slides, dots, index);
      resetSlideshowTimer(slides, dots);
    });
  });

  // Start automatic slideshow
  startSlideshow(slides, dots);
}

function generateRandomOrder(length: number): number[] {
  const order = Array.from({length}, (_, i) => i);
  // Fisher-Yates shuffle
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function goToSlide(slides: NodeListOf<HTMLElement>, dots: NodeListOf<HTMLElement>, index: number): void {
  // Remove active class from current
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  // Add active class to new
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlideIndex = index;
}

function nextSlide(slides: NodeListOf<HTMLElement>, dots: NodeListOf<HTMLElement>): void {
  let nextPos = slideOrder.indexOf(currentSlideIndex) + 1;
  if (nextPos >= slideOrder.length) {
    // Generate new random order when cycle completes
    slideOrder = generateRandomOrder(slides.length);
    nextPos = 0;
  }
  const nextIndex = slideOrder[nextPos];
  goToSlide(slides, dots, nextIndex);
}

function startSlideshow(slides: NodeListOf<HTMLElement>, dots: NodeListOf<HTMLElement>): void {
  // Clear any existing timer
  if (heroSlideshowInterval) {
    clearInterval(heroSlideshowInterval);
  }
  heroSlideshowInterval = window.setInterval(() => {
    nextSlide(slides, dots);
  }, 4000); // Change slide every 4 seconds
}

function resetSlideshowTimer(slides: NodeListOf<HTMLElement>, dots: NodeListOf<HTMLElement>): void {
  if (heroSlideshowInterval) {
    clearInterval(heroSlideshowInterval);
  }
  heroSlideshowInterval = window.setInterval(() => {
    nextSlide(slides, dots);
  }, 4000);
}

// ===== Dynamic Print Styles =====
function initPrintStyles(): void {
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
    // Hide non-essential elements
    const hideElements = document.querySelectorAll('.bottom-nav, .back-to-top, .scroll-progress-bar, .theme-toggle-btn, .nav-search-btn');
    hideElements.forEach(el => el.classList.add('no-print'));
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
    const hideElements = document.querySelectorAll('.no-print');
    hideElements.forEach(el => el.classList.remove('no-print'));
  });
}

// ===== Initialize All =====
function init(): void {
  updateBackToTop();
  initLightbox();
  initGallerySliders();
  initHeroSlideshow();
  initScrollProgress();
  initFormValidation();
  initReadingTime();
  initSearch();
  initLazyLoading();
  initKeyboardShortcuts();
  initPageTransitions();
  initImagePreloader();
  initBackToTopWithProgress();
  initNewsSearch();
  initDownloadTracking();
  initQuickInfoAnimations();
  initAnimatedCounters();
  initFAQAccordion();
  initImageComparison();
  initThemeToggle();
  initBreadcrumbs();
  initTypewriter();
  initParallax();
  initTooltips();
  initScrollSpy();
  initEventCalendar();
  initGalleryFilter();
  initPageViewTracker();
  initSmoothAnchorScroll();
  initLazyVideos();
  initCharacterCounter();
  initPrintStyles();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
