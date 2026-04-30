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

function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const btn   = document.getElementById('submit-btn');

  if (password !== confirmPassword) {
    showToast('[✗] Les mots de passe ne correspondent pas', 3000);
    return;
  }

  btn.textContent = 'Création…';
  btn.disabled = true;

  fetch('../../backend/signup/api-signup.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, phone, password })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    btn.textContent = 'Créer mon compte';
    btn.disabled = false;

    if (data.success) {
      showToast(`[✓] ${data.message}`, 2000);
      
      setTimeout(() => {
        window.location.href = '../login/login.html';
      }, 1500);
    } else {
      showToast(`[✗] ${data.message}`, 3000);
    }
  })
  .catch(error => {
    btn.textContent = 'Créer mon compte';
    btn.disabled = false;
    console.error('Signup error:', error);
    showToast('[✗] Erreur: ' + error.message, 3000);
    console.error(error);
  });
}
