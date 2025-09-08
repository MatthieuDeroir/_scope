/**
 * Main JavaScript for Tech Articles Blog
 * Handles theme switching, search, progressive web app features, and interactive elements
 */

class TechBlog {
  constructor() {
    this.init();
  }

  init() {
    // Initialize core features
    this.initTheme();
    this.initSearch();
    this.initProgressiveWebApp();
    this.initScrollToTop();
    this.initSmoothScrolling();
    this.initLazyLoading();
    this.initAnimations();
    this.initReadingProgress();
    this.initCodeCopyButtons();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initInteractiveElements();
      });
    } else {
      this.initInteractiveElements();
    }
  }

  /**
   * Theme Management
   */
  initTheme() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    this.setTheme(defaultTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button if it exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`);
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Animate the transition
    this.animateThemeTransition();
  }

  animateThemeTransition() {
    const body = document.body;
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  }

  /**
   * Search Functionality
   */
  initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;

    // Debounce search input
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value, searchResults);
      }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    // Load search index
    this.loadSearchIndex();
  }

  async loadSearchIndex() {
    try {
      // In a real implementation, this would load a pre-generated search index
      const response = await fetch('/search-index.json');
      if (response.ok) {
        this.searchIndex = await response.json();
      } else {
        // Fallback: create simple search index from page content
        this.createSimpleSearchIndex();
      }
    } catch (error) {
      console.log('Search index not available, creating simple index');
      this.createSimpleSearchIndex();
    }
  }

  createSimpleSearchIndex() {
    // Create a simple search index from post titles and excerpts
    this.searchIndex = [];
    
    document.querySelectorAll('.post-card').forEach(card => {
      const title = card.querySelector('h3 a')?.textContent;
      const excerpt = card.querySelector('.post-excerpt')?.textContent;
      const url = card.querySelector('h3 a')?.href;
      const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent);
      
      if (title && url) {
        this.searchIndex.push({
          title,
          excerpt: excerpt || '',
          url,
          tags,
          content: `${title} ${excerpt} ${tags.join(' ')}`
        });
      }
    });
  }

  performSearch(query, resultsContainer) {
    if (!query || query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    const results = this.searchIndex ? this.searchContent(query) : this.fallbackSearch(query);
    this.displaySearchResults(results, resultsContainer);
  }

  searchContent(query) {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
    
    return this.searchIndex.filter(item => {
      const content = item.content.toLowerCase();
      return searchTerms.some(term => content.includes(term));
    }).slice(0, 5); // Limit to 5 results
  }

  fallbackSearch(query) {
    // Simple fallback search using visible content
    const results = [];
    const searchTerm = query.toLowerCase();
    
    document.querySelectorAll('.post-card').forEach(card => {
      const title = card.querySelector('h3 a')?.textContent.toLowerCase();
      const excerpt = card.querySelector('.post-excerpt')?.textContent.toLowerCase();
      
      if ((title && title.includes(searchTerm)) || (excerpt && excerpt.includes(searchTerm))) {
        results.push({
          title: card.querySelector('h3 a')?.textContent,
          excerpt: card.querySelector('.post-excerpt')?.textContent,
          url: card.querySelector('h3 a')?.href
        });
      }
    });
    
    return results.slice(0, 5);
  }

  displaySearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<p>No results found. Try different keywords.</p>';
    } else {
      container.innerHTML = results.map(result => `
        <div class="search-result">
          <h4><a href="${result.url}">${this.highlightSearchTerm(result.title, 'search-query')}</a></h4>
          <p>${this.truncateText(result.excerpt, 100)}</p>
        </div>
      `).join('');
    }
    
    container.style.display = 'block';
  }

  highlightSearchTerm(text, query) {
    // Simple highlighting (in a real app, you'd use a more sophisticated approach)
    return text;
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  /**
   * Progressive Web App Features
   */
  initProgressiveWebApp() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful');
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.showUpdateNotification();
                }
              });
            });
          })
          .catch(registrationError => {
            console.log('ServiceWorker registration failed');
          });
      });
    }

    // Handle install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.showInstallButton(deferredPrompt);
    });
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <p>A new version is available!</p>
      <button onclick="window.location.reload()">Update</button>
      <button onclick="this.parentElement.remove()">Later</button>
    `;
    document.body.appendChild(notification);
  }

  showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.textContent = 'Install App';
    installButton.addEventListener('click', () => {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        installButton.remove();
      });
    });
    
    // Add to header or appropriate location
    const header = document.querySelector('.site-header .header-container');
    if (header) {
      header.appendChild(installButton);
    }
  }

  /**
   * Scroll to Top Button
   */
  initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.visibility = 'visible';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.visibility = 'hidden';
      }
    });

    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Smooth Scrolling for Anchor Links
   */
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Lazy Loading for Images
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Scroll Animations
   */
  initAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.post-card, .featured-post, .related-post').forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserver.observe(el);
      });
    }
  }

  /**
   * Reading Progress Indicator
   */
  initReadingProgress() {
    if (document.body.classList.contains('post')) {
      const progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 1001;
        transition: width 0.1s ease;
      `;
      
      document.body.appendChild(progressBar);

      window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
      });
    }
  }

  /**
   * Code Copy Buttons
   */
  initCodeCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      const button = document.createElement('button');
      button.className = 'copy-code';
      button.textContent = 'Copy';
      button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;
      
      pre.style.position = 'relative';
      pre.appendChild(button);

      // Show button on hover
      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      // Copy functionality
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code') || pre;
        const text = code.textContent;
        
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          // Fallback for older browsers
          this.fallbackCopyTextToClipboard(text, button);
        }
      });
    });
  }

  fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Fallback: Could not copy text');
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Interactive Elements
   */
  initInteractiveElements() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewsletterSignup(e.target);
      });
    }

    // Contact forms
    document.querySelectorAll('form[name="contact"]').forEach(form => {
      form.addEventListener('submit', (e) => {
        this.handleFormSubmission(e);
      });
    });

    // External link handling
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Keyboard navigation improvements
    this.initKeyboardNavigation();
  }

  handleNewsletterSignup(form) {
    const email = form.querySelector('input[type="email"]').value;
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
      alert(`Thank you for subscribing with ${email}! Please check your email to confirm your subscription.`);
      form.reset();
      button.textContent = originalText;
      button.disabled = false;
    }, 1000);
  }

  handleFormSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Form validation
    const formData = new FormData(form);
    let isValid = true;
    
    // Basic validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    if (isValid) {
      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you soon.');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1000);
    } else {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      alert('Please fill in all required fields.');
    }
  }

  /**
   * Keyboard Navigation
   */
  initKeyboardNavigation() {
    // Skip to main content
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 0 0 4px 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
      skipLink.classList.remove('sr-only');
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content id if it doesn't exist
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + T: Toggle theme
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Alt + S: Focus search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape: Close modals/dropdowns
      if (e.key === 'Escape') {
        // Close search results
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
          searchResults.style.display = 'none';
        }
        
        // Close mobile menu
        const mobileNav = document.querySelector('.site-nav');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          mobileToggle.classList.remove('active');
        }
        
        // Close dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }

  /**
   * Utility Functions
   */
  
  // Debounce function for performance
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Get preferred color scheme
  getPreferredColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Analytics helper (for future integration)
  trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // You can also integrate other analytics services here
    console.log('Track event:', eventName, properties);
  }
}

// Initialize the blog functionality
const techBlog = new TechBlog();

// Global functions for HTML onclick handlers
function toggleTheme() {
  techBlog.toggleTheme();
}

function toggleMobileMenu() {
  const nav = document.getElementById('site-nav') || document.querySelector('.site-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (nav && toggle) {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
  }
}

function toggleToc() {
  const toc = document.getElementById('toc');
  if (toc) {
    const isVisible = toc.style.display !== 'none';
    toc.style.display = isVisible ? 'none' : 'block';
  }
}

function handleNewsletterSignup(event) {
  event.preventDefault();
  techBlog.handleNewsletterSignup(event.target);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TechBlog;
}