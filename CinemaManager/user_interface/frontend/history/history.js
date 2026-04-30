document.addEventListener('DOMContentLoaded', async () => {
    const historyList = document.getElementById('historyList');

    function normalizeStatus(value) {
        const status = (value || '').toString().trim().toLowerCase();
        const normalized = status
            .replace(/[àáâä]/g, 'a')
            .replace(/[ç]/g, 'c')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôö]/g, 'o')
            .replace(/[ùúûü]/g, 'u');

        if (normalized === 'attente') return 'Attente';
        if (normalized === 'annule' || normalized === 'annulee') return 'Annulee';
        return 'Confirmee';
    }

    function statusLabel(value) {
        const status = normalizeStatus(value);
        if (status === 'Attente') return 'Attente';
        if (status === 'Annulee') return 'Annulée';
        return 'Confirmée';
    }
    
    // Check Authentication
    const userSessionData = localStorage.getItem('userSession');
    if (!userSessionData) {
        alert("You must be logged in to view your history.");
        window.location.href = '../login/login.html';
        return;
    }

    let user;
    try {
        user = JSON.parse(userSessionData);
    } catch(e) {
        window.location.href = '../login/login.html';
        return;
    }

    if (!user || !user.username) {
        window.location.href = '../login/login.html';
        return;
    }

    // Fetch History
    try {
        const response = await fetch(`../../backend/movies/api-history.php?username=${encodeURIComponent(user.username)}`);
        const result = await response.json();

        if (result.success) {
            renderHistory(result.data);
        } else {
            historyList.innerHTML = `<div class="empty-state"><h2>Error</h2><p>${result.message || 'Could not load history.'}</p></div>`;
        }
    } catch (e) {
        console.error('Failed to load history', e);
        historyList.innerHTML = `<div class="empty-state"><h2>Connection Error</h2><p>Failed to connect to the server.</p></div>`;
    }

    function renderHistory(data) {
        if (!data || data.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <h2>No bookings found</h2>
                    <p>It looks like you haven't made any reservations yet.</p>
                    <a href="../movies/movies.html" class="btn btn-primary">Browse Movies</a>
                </div>
            `;
            return;
        }

        let html = '';
        data.forEach(item => {
            const dateObj = new Date(item.start_time);
            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });

            const reservedDate = new Date(item.reserved_at).toLocaleDateString('en-US');
            const statusKey = normalizeStatus(item.status);

            const fallbackPoster = 'https://via.placeholder.com/100x150?text=No+Poster';
            const poster = item.poster_url || fallbackPoster;

            html += `
                <div class="history-card">
                    <img src="${poster}" alt="${item.film_title}" class="history-poster">
                    <div class="history-details">
                        <div style="display: flex; justify-content: space-between; align-items:flex-start;">
                            <h3>${item.film_title}</h3>
                            <span class="status-badge ${statusKey}">${statusLabel(item.status)}</span>
                        </div>
                        <div style="margin: 6px 0 10px 0; font-size: 0.9rem; color: #d1d5db;">
                            Ticket ID: <strong>${item.booking_code}</strong>
                        </div>
                        <div class="history-meta">
                            <span>📅 Showtime: ${dateStr} at ${timeStr}</span>
                            <span>🎟️ Tickets: ${item.tickets_count}</span>
                            <span>💰 Total: TND${item.total_amount}</span>
                        </div>
                        <div style="margin-top: 15px; font-size: 0.85rem; color: #6b7280; border-top: 1px solid #374151; padding-top: 10px;">
                            <span>Reserved on: ${reservedDate}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        historyList.innerHTML = html;
    }
});
