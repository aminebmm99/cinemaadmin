/**
 * Navbar Utilities - CINEMAX
 * Centralized functions for navbar functionality used across both iframe and parent pages
 * Handles logout, profile updates, and session management
 */

class NavbarUtils {
  constructor() {
    this.profileAvatarId = 'profileAvatar';
    this.profileNameId = 'profileName';
    this.dropdownUsernameId = 'dropdownUsername';
    this.profileDropdownId = 'profileDropdown';
    this.loginButtonId = 'loginButton';
    this.logoutClass = 'logout';
  }

  /**
   * Update navbar UI based on current session
   * Call this on page load and after logout
   */
  updateNavbarUI() {
    const userSession = localStorage.getItem('userSession');
    const navbarMain = document.querySelector('.navbar-main');
    const profileDropdown = document.getElementById(this.profileDropdownId);
    const loginButton = document.getElementById(this.loginButtonId);
    const profileName = document.getElementById(this.profileNameId);
    const profileAvatar = document.getElementById(this.profileAvatarId);
    const dropdownUsername = document.getElementById(this.dropdownUsernameId);
    const historyLinks = document.querySelectorAll('[data-nav="history"]');

    const setHistoryVisibility = (isVisible) => {
      historyLinks.forEach((link) => {
        // Preserve layout by toggling the list item when available.
        const navItem = link.closest('li');
        if (navItem) {
          navItem.style.display = isVisible ? '' : 'none';
        } else {
          link.style.display = isVisible ? '' : 'none';
        }
      });
    };

    const showLoginButton = () => {
      if (!loginButton) return;
      // Keep layout intact for both navbar styles.
      loginButton.style.display = loginButton.classList.contains('nav-button') ? 'inline-flex' : 'block';
    };

    const showProfileArea = () => {
      if (!profileDropdown) return;
      // In iframe navbar this container is a flex row, in legacy navbar it is a dropdown block.
      profileDropdown.style.display = profileDropdown.classList.contains('navbar-left') ? 'flex' : 'block';
    };

    const setAuthenticatedState = (isAuthenticated) => {
      if (!navbarMain) return;
      navbarMain.classList.toggle('is-authenticated', isAuthenticated);
    };

    if (!userSession) {
      // No session - show login button
      if (profileDropdown) profileDropdown.style.display = 'none';
      showLoginButton();
      setHistoryVisibility(false);
      setAuthenticatedState(false);
      return;
    }

    try {
      const user = JSON.parse(userSession);
      if (user && user.username) {
        // User logged in - show profile dropdown
        if (profileName) profileName.textContent = user.username;
        if (profileAvatar) profileAvatar.textContent = user.username.charAt(0).toUpperCase();
        if (dropdownUsername) dropdownUsername.textContent = user.username;
        showProfileArea();
        if (loginButton) loginButton.style.display = 'none';
        setHistoryVisibility(true);
        setAuthenticatedState(true);
      } else {
        // Invalid session
        if (profileDropdown) profileDropdown.style.display = 'none';
        showLoginButton();
        setHistoryVisibility(false);
        setAuthenticatedState(false);
      }
    } catch (e) {
      // Corrupted session
      if (profileDropdown) profileDropdown.style.display = 'none';
      showLoginButton();
      setHistoryVisibility(false);
      setAuthenticatedState(false);
    }
  }

  /**
   * Global logout handler
   * Clears session and redirects to home
   */
  handleLogout() {
    // Clear all user session data
    localStorage.removeItem('userSession');
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('selectedShowtime');
    
    // If in iframe, notify parent window
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'logout' }, '*');
    }
    
    // Update navbar UI
    this.updateNavbarUI();
    
    // Redirect to home
    const homeUrl = window.location.pathname.includes('/admin-interface/')
      ? './index.html'
      : '../index/index.html';
    
    setTimeout(() => {
      if (window.self !== window.top) {
        window.top.location.href = homeUrl;
      } else {
        window.location.href = homeUrl;
      }
    }, 100);
  }

  /**
   * Initialize navbar event listeners
   * Call this on page load
   */
  initNavbar() {
    // Setup logout buttons
    const logoutButtons = document.querySelectorAll(`[onclick*="handleLogout"], .${this.logoutClass}`);
    logoutButtons.forEach(btn => {
      btn.removeAttribute('onclick');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    });

    // Setup profile dropdown toggle
    const profileButton = document.querySelector('.profile-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (profileButton && dropdownMenu) {
      profileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.style.display = 
          dropdownMenu.style.display === 'block' ? 'none' : 'block';
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-dropdown')) {
          dropdownMenu.style.display = 'none';
        }
      });
    }

    // Listen for storage changes (logout from another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === 'userSession' && !e.newValue) {
        this.updateNavbarUI();
      }
    });

    // Listen for parent window messages (iframe scenario)
    window.addEventListener('message', (e) => {
      if (e.data.type === 'logout') {
        this.updateNavbarUI();
      } else if (e.data.type === 'sessionUpdate') {
        this.updateNavbarUI();
      }
    });

    // Setup movie search in navbar
    this.initMovieSearch();
  }

  initMovieSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-button');

    if (!searchInput || !searchButton) return;

    const runSearch = () => {
      const query = searchInput.value.trim();
      const moviesLink = document.querySelector('.navbar-link[data-nav="movies"]');
      const moviesHref = moviesLink ? moviesLink.getAttribute('href') : './movies/movies.html';

      const baseUrl = new URL(moviesHref, window.location.href);
      baseUrl.search = '';

      if (query) {
        baseUrl.searchParams.set('search', query);
      }

      try {
        const parentMainFrame = window.parent && window.parent.document
          ? window.parent.document.getElementById('mainFrame')
          : null;

        if (parentMainFrame) {
          parentMainFrame.setAttribute('src', `${baseUrl.pathname}${baseUrl.search}`);
          return;
        }
      } catch (e) {
        // Cross-window access can fail depending on embedding context.
      }

      window.location.href = `${baseUrl.pathname}${baseUrl.search}`;
    };

    searchButton.addEventListener('click', runSearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSearch();
      }
    });
  }

  /**
   * Get current user from session
   */
  getCurrentUser() {
    const userSession = localStorage.getItem('userSession');
    if (!userSession) return null;
    
    try {
      return JSON.parse(userSession);
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  /**
   * Notify all iframes/windows of session change
   */
  broadcastSessionChange() {
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'sessionUpdate' }, '*');
    }
    
    // Notify child iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        iframe.contentWindow.postMessage({ type: 'sessionUpdate' }, '*');
      } catch (e) {
        // Cross-origin iframe - silently ignore
      }
    });
  }
}

// Create global instance
const navbarUtils = new NavbarUtils();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  navbarUtils.updateNavbarUI();
  navbarUtils.initNavbar();
});
