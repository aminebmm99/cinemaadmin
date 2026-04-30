/**
 * Navigation Sync Utility - CINEMAX
 * Automatically highlights the current page in the navigation bar
 * Works across all pages by comparing window.location.pathname
 */

class NavSync {
  constructor() {
    this.navLinks = document.querySelectorAll('.navbar-link[data-nav]');
    this.isIframe = window.self !== window.top;
    this.init();
  }

  init() {
    // Run on page load
    this.syncNavigation();

    // In iframe mode, the parent frame content changes while navbar stays mounted.
    if (this.isIframe) {
      window.addEventListener('focus', () => this.syncNavigation());
      window.addEventListener('click', () => this.syncNavigation());
    }
    
    // Optional: Re-sync on history change (for dynamic navigation)
    window.addEventListener('popstate', () => this.syncNavigation());
  }

  syncNavigation() {
    const currentPath = this.getCurrentPath();
    
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Determine which nav item should be active based on current path
    let activeNavKey = null;

    if (currentPath.includes('/index/') || currentPath.endsWith('/index.html') || currentPath === '/user-interface/frontend/' || currentPath === '/user-interface/frontend/index/') {
      activeNavKey = 'home';
    } else if (currentPath.includes('/movies/')) {
      activeNavKey = 'movies';
    } else if (currentPath.includes('/showtimes/')) {
      activeNavKey = 'showtimes';
    } else if (currentPath.includes('/movie-details/')) {
      activeNavKey = 'movies'; // Movie details page highlights movies nav
    } else if (currentPath.includes('/booking/')) {
      activeNavKey = 'movies'; // Booking page highlights movies nav
    }

    // Add active class to matching nav link
    if (activeNavKey) {
      const activeLink = document.querySelector(`.navbar-link[data-nav="${activeNavKey}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }

    console.log(`[NavSync] Current path: ${currentPath} | Active: ${activeNavKey}`);
  }

  getCurrentPath() {
    if (!this.isIframe) {
      return window.location.pathname;
    }

    try {
      const parentDoc = window.parent.document;
      const mainFrame = parentDoc.getElementById('mainFrame');
      if (!mainFrame) {
        return window.location.pathname;
      }

      const frameSrc = mainFrame.getAttribute('src');
      if (frameSrc) {
        return new URL(frameSrc, window.location.href).pathname;
      }
    } catch (e) {
      // Parent document might be inaccessible in edge cases.
    }

    return window.location.pathname;
  }

  /**
   * Manually set active navigation (useful for dynamic page loads)
   * @param {string} navKey - The data-nav attribute value (home, movies, showtimes)
   */
  setActive(navKey) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.navbar-link[data-nav="${navKey}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new NavSync();
});
