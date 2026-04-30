function togglePwd(inputId = 'password', iconId = 'eye-icon') {
  const pwd = document.getElementById(inputId);
  const icon = document.getElementById(iconId);
  if (pwd.type === 'password') {
    pwd.type = 'text';
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pwd.type = 'password';
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>`;
  }
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function handleSubmit(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn   = document.getElementById('submit-btn');

  btn.textContent = 'Connexion…';
  btn.disabled = true;

  fetch('../../backend/login/api-login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    btn.textContent = 'Se connecter';
    btn.disabled = false;

    if (data.success) {
      showToast(`[✓] Connecté avec succès`, 2000);
      
      // Store user session in localStorage
      localStorage.setItem('userSession', JSON.stringify({
          username: username,
          role: data.role
      }));

      setTimeout(() => {
        if (data.role === 'admin') {
          window.location.href = '../../../admin-interface/frontend/main/main.html';
        } else {
          window.location.href = '../index/index.html';
        }
      }, 1000);
    } else {
      showToast(`[✗] ${data.message || 'Identifiants incorrects'}`, 3000);
    }
  })
  .catch(error => {
    btn.textContent = 'Se connecter';
    btn.disabled = false;
    console.error('Login error:', error);
    showToast('[✗] Erreur: ' + error.message, 3000);
  });
}

function setAuthMode(mode) {
  const loginPanel = document.getElementById('login-panel');
  const signupPanel = document.getElementById('signup-panel');
  const footerLogin = document.getElementById('footer-login');
  const footerSignup = document.getElementById('footer-signup');
  const title = document.getElementById('card-title');
  const sub = document.getElementById('card-sub');

  if (mode === 'signup') {
    loginPanel.hidden = true;
    signupPanel.hidden = false;
    footerLogin.hidden = true;
    footerSignup.hidden = false;
    if (title) title.textContent = 'Inscription';
    if (sub) sub.textContent = 'Créez votre compte (e-mail et téléphone requis)';
  } else {
    loginPanel.hidden = false;
    signupPanel.hidden = true;
    footerLogin.hidden = false;
    footerSignup.hidden = true;
    if (title) title.textContent = 'Bienvenue';
    if (sub) sub.textContent = 'Connectez-vous à votre espace';
  }
}

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const phone = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const btn = document.getElementById('signup-submit-btn');

  if (!email || !phone) {
    showToast("[✗] L'e-mail et le numéro de téléphone sont obligatoires", 3000);
    return;
  }

  if (password !== confirmPassword) {
    showToast('[✗] Les mots de passe ne correspondent pas', 3000);
    return;
  }

  btn.textContent = 'Création…';
  btn.disabled = true;

  fetch('../../backend/signup/api-signup.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, phone, password })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      btn.textContent = 'Créer mon compte';
      btn.disabled = false;

      if (data.success) {
        showToast(`✓ ${data.message}`, 2000);
        setTimeout(() => {
          setAuthMode('login');
          document.getElementById('signup-form').reset();
        }, 1500);
      } else {
        showToast(`✗ ${data.message}`, 3000);
      }
    })
    .catch((error) => {
      btn.textContent = 'Créer mon compte';
      btn.disabled = false;
      console.error('Signup error:', error);
      showToast('✗ Erreur: ' + error.message, 3000);
    });
}

function wireAuthToggle() {
  const showSignup = document.getElementById('btn-show-signup');
  const showLogin = document.getElementById('btn-show-login');
  if (showSignup) showSignup.addEventListener('click', () => setAuthMode('signup'));
  if (showLogin) showLogin.addEventListener('click', () => setAuthMode('login'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireAuthToggle);
} else {
  wireAuthToggle();
}
