// CineMax Login Page JavaScript

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
  const btn = document.getElementById('submit-btn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');

  btnText.textContent = 'Connexion…';
  if (btnLoader) btnLoader.style.display = 'inline-flex';
  btn.disabled = true;

  // Try connecting to backend, fallback to demo mode
  fetch('../../backend/login/api-login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    resetBtn();
    if (data.success) {
      // Store user session
      localStorage.setItem('userSession', JSON.stringify({ username: data.username, role: data.role }));
      showToast('[✓] Connecté avec succès', 2000);
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
  .catch(() => {
    // Demo mode: if no backend, just redirect to home
    resetBtn();
    showToast('[✓] Mode démo — Connexion simulée', 2000);
    setTimeout(() => {
      window.location.href = '../index/index.html';
    }, 1200);
  });

  function resetBtn() {
    if (btnText) btnText.textContent = 'Se connecter';
    if (btnLoader) btnLoader.style.display = 'none';
    btn.disabled = false;
  }
}
