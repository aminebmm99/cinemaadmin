/**
 * Navbar-Sync IFRAME - CINEMAX
 * Handles synchronization of navbar when used in iframe
 * Watches for session changes and communicates with parent window
 */

class NavbarSyncIframe {
  constructor() {
    this.isInIframe = window.self !== window.top;
    this.init();
  }

  init() {
    if (!this.isInIframe) {
      return; // Not in iframe, skip
    }

    // Listen for parent messages
    window.addEventListener('message', (e) => {
      if (e.data.type === 'updateProfile') {
        this.updateProfile(e.data.user);
      }
    });

    // Watch for localStorage changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'userSession') {
        // Session changed in parent window, update navbar
        if (navbarUtils) {
          navbarUtils.updateNavbarUI();
        }
      }
    });

    // Notify parent that iframe is ready
    window.parent.postMessage({ type: 'navbarReady' }, '*');
  }

  /**
   * Update profile display in navbar
   */
  updateProfile(user) {
    if (!user || !user.username) return;

    const profileName = document.getElementById('profileName');
    const profileAvatar = document.getElementById('profileAvatar');
    const dropdownUsername = document.getElementById('dropdownUsername');

    if (profileName) profileName.textContent = user.username;
    if (profileAvatar) profileAvatar.textContent = user.username.charAt(0).toUpperCase();
    if (dropdownUsername) dropdownUsername.textContent = user.username;
  }

  /**
   * Send message to parent window
   */
  sendToParent(data) {
    if (this.isInIframe) {
      window.parent.postMessage(data, '*');
    }
  }

  /**
   * Get current session from parent via postMessage
   */
  async requestSessionFromParent() {
    return new Promise((resolve) => {
      const handler = (e) => {
        if (e.data.type === 'sessionResponse') {
          window.removeEventListener('message', handler);
          resolve(e.data.user);
        }
      };
      window.addEventListener('message', handler);
      this.sendToParent({ type: 'requestSession' });
      setTimeout(() => resolve(null), 5000); // 5s timeout
    });
  }
}

// Initialize if in iframe
if (window.self !== window.top) {
  const iframeSync = new NavbarSyncIframe();
}
