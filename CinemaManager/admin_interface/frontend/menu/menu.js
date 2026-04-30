document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');
    const logoutBtn = document.getElementById('logoutBtn');
    
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function logout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('selectedShowtime');
    window.top.location.href = '/CinemaManager/user-interface/frontend/index/index.html';
}

window.logout = logout;