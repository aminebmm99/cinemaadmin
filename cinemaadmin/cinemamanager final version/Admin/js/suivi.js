/**
 * Module pour le tableau de bord (suivi)
 */

document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    // Actualiser toutes les 30 secondes
    setInterval(loadDashboard, 30000);
});

function loadDashboard() {
    const stats = CinemaData.getStatistics();
    updateCards(stats);
    loadRecentReservations();
}

function updateCards(stats) {
    const cards = {
        'card-films': stats.totalFilms,
        'card-seances': stats.seancesAujourdhui,
        'card-reservations': stats.confirmees,
        'card-places': stats.placesDisponibles
    };

    for (const [id, value] of Object.entries(cards)) {
        const element = document.querySelector(`#${id} strong`);
        if (element) {
            element.textContent = value;
        }
    }

    // Afficher les détails de revenu
    const revenueElement = document.getElementById('revenue-total');
    if (revenueElement) {
        revenueElement.textContent = `${stats.revenueTotal.toFixed(2)} TND`;
    }

    // Afficher le statut
    const statusElement = document.getElementById('status-details');
    if (statusElement) {
        statusElement.innerHTML = `
            Confirmées: <strong>${stats.confirmees}</strong> | 
            En attente: <strong>${stats.attente}</strong> | 
            Annulées: <strong>${stats.annulees}</strong>
        `;
    }
}

function loadRecentReservations() {
    const reservations = CinemaData.getDernierReservations(5);
    const tbody = document.querySelector('table tbody');
    
    if (!tbody) return;

    tbody.innerHTML = '';

    if (reservations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Aucune réservation</td></tr>';
        return;
    }

    reservations.forEach(res => {
        const seance = res.seanceDetails;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.code}</td>
            <td>${seance ? seance.filmTitle : '-'}</td>
            <td>${seance ? seance.date : '-'}</td>
            <td>${seance ? seance.heure : '-'}</td>
            <td>${res.tickets}</td>
        `;
        tbody.appendChild(row);
    });
}
