const tableBody = document.getElementById('reservations-tbody');
const searchInput = document.getElementById('filter-search');
const btnAddReservation = document.getElementById('btn-add-reservation');
const filmSelect = document.getElementById('film-input');
const seanceSelect = document.getElementById('heure-input');
const dateInput = document.getElementById('date-input');
const ticketsInput = document.getElementById('tickets-input');
const totalInput = document.getElementById('total-input');

const modal = document.getElementById('reservation-modal');
const form = document.getElementById('reservation-form');
const btnCancel = document.getElementById('btn-cancel');
const reservationIdInput = document.getElementById('reservation-id');
const modalTitle = document.getElementById('modal-title');

let allSeances = [];
let reservationsData = [];

function statusLabel(value) {
    const status = normalizeStatus(value);
    if (status === 'Attente') return 'Attente';
    if (status === 'Annulee') return 'Annulée';
    return 'Confirmée';
}

function statusForSelect(value) {
    return normalizeStatus(value);
}

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

function renderReservations(items) {
    if (!tableBody) return;

    if (!Array.isArray(items) || items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">Aucune reservation</td></tr>';
        return;
    }

    tableBody.innerHTML = items.map((r) => {
        const dateText = r.date && r.heure ? `${r.date} ${r.heure}` : '-';
        const total = Number(r.total || 0).toFixed(2);
        return `
            <tr>
                <td>${r.code}</td>
                <td>
                    <strong>${r.customer_name}</strong><br>
                    <small>${r.customer_email}</small>
                </td>
                <td>
                    <strong>${r.film_title}</strong><br>
                    <small>${dateText} (Seance #${r.seance_id})</small>
                </td>
                <td>${r.tickets_count}</td>
                <td>${total}</td>
                <td>${statusLabel(r.status)}</td>
                <td>
                    <button class='btn btn-sm' onclick='editReservation(${r.id})'>Modifier</button>
                    <button class='btn btn-sm btn-danger' onclick='deleteReservation(${r.id})'>Supprimer</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load reservations from database
async function loadReservations() {
    try {
        const response = await fetch('../../backend/api/reservation/reservations.php');
        const payload = await response.json();
        reservationsData = payload.reservations || [];
        
        if (tableBody) {
            renderReservations(reservationsData);
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Erreur lors du chargement des réservations</td></tr>';
        }
    }
}

// Load films from database
async function loadFilmsList() {
    try {
        const response = await fetch('../../backend/api/film/get-films.php');
        const result = await response.json();
        const films = result.data || [];
        
        if (filmSelect) {
            // Clear existing options except the first placeholder
            filmSelect.innerHTML = '<option value="">Sélectionner un film</option>';
            
            // Add film options
            films.forEach(film => {
                const option = document.createElement('option');
                option.value = film.id;
                option.textContent = film.title;
                filmSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading films:', error);
    }
}

async function loadSeancesList() {
    try {
        const response = await fetch('../../backend/api/seance/seances.php');
        const result = await response.json();
        allSeances = result.seances || [];
        syncSeanceOptionsByFilm();
    } catch (error) {
        console.error('Error loading seances:', error);
    }
}

function formatDateForInput(dateText) {
    if (!dateText || !dateText.includes('/')) return '';
    const [day, month, year] = dateText.split('/');
    return `${year}-${month}-${day}`;
}

function getSelectedSeance() {
    const seanceId = Number(seanceSelect?.value || 0);
    if (!seanceId) return null;
    return allSeances.find((seance) => Number(seance.id) === seanceId) || null;
}

function updateTotal() {
    if (!totalInput) return;
    const selectedSeance = getSelectedSeance();
    const ticketsCount = Number(ticketsInput?.value || 0);
    if (!selectedSeance || ticketsCount <= 0) {
        totalInput.value = '0.00';
        return;
    }

    const basePrice = Number(selectedSeance.base_price || 0);
    totalInput.value = (basePrice * ticketsCount).toFixed(2);
}

function syncSeanceOptionsByFilm(keepSeanceId = null) {
    if (!seanceSelect) return;

    const filmId = Number(filmSelect?.value || 0);
    const previousValue = keepSeanceId ? String(keepSeanceId) : seanceSelect.value;

    if (!filmId) {
        seanceSelect.innerHTML = '<option value="">Choisir un film d\'abord</option>';
        seanceSelect.value = '';
        if (dateInput) dateInput.value = '';
        updateTotal();
        return;
    }

    const seancesForFilm = allSeances
        .filter((seance) => Number(seance.film_id) === filmId && (Number(seance.available_seats) > 0 || String(seance.id) === previousValue))
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    if (seancesForFilm.length === 0) {
        seanceSelect.innerHTML = '<option value="">Aucune seance disponible</option>';
        seanceSelect.value = '';
        if (dateInput) dateInput.value = '';
        updateTotal();
        return;
    }

    const options = seancesForFilm.map((seance) => (
        `<option value="${seance.id}">#${seance.id} - ${seance.date} ${seance.heure} - ${seance.base_price} TND</option>`
    )).join('');

    seanceSelect.innerHTML = '<option value="">Selectionner une seance</option>' + options;

    if (seancesForFilm.some((seance) => String(seance.id) === previousValue)) {
        seanceSelect.value = previousValue;
    } else {
        seanceSelect.value = '';
    }

    const selectedSeance = getSelectedSeance();
    if (dateInput) {
        dateInput.value = selectedSeance ? formatDateForInput(selectedSeance.date) : '';
    }
    updateTotal();
}

function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.reset();
    if (reservationIdInput) reservationIdInput.value = '';
    if (modalTitle) modalTitle.textContent = 'Nouvelle Réservation';
    syncSeanceOptionsByFilm();
    updateTotal();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
    if (reservationIdInput) reservationIdInput.value = '';
    if (modalTitle) modalTitle.textContent = 'Nouvelle Réservation';
}

function filterTable() {
    if (!tableBody || !searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = query === '' || text.includes(query) ? '' : 'none';
    });
}

function editReservation(id) {
    const reservation = reservationsData.find((item) => Number(item.id) === Number(id));
    if (!reservation) {
        alert('Reservation introuvable.');
        return;
    }

    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    if (modalTitle) modalTitle.textContent = 'Modifier Réservation';
    if (reservationIdInput) reservationIdInput.value = String(reservation.id);

    document.getElementById('nom-input').value = reservation.customer_name || '';
    document.getElementById('email-input').value = reservation.customer_email || '';
    document.getElementById('tickets-input').value = reservation.tickets_count || 1;
    document.getElementById('statut-select').value = statusForSelect(reservation.status);

    if (filmSelect) {
        filmSelect.value = String(reservation.film_id || '');
    }

    syncSeanceOptionsByFilm(reservation.seance_id);
    if (seanceSelect) {
        seanceSelect.value = String(reservation.seance_id || '');
    }

    const selectedSeance = getSelectedSeance();
    if (dateInput) {
        dateInput.value = selectedSeance ? formatDateForInput(selectedSeance.date) : '';
    }
    updateTotal();
}

function deleteReservation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) return;
    
    try {
        fetch(`../../backend/api/reservation/reservations.php?id=${id}`, {
            method: 'DELETE'
        }).then(async (response) => {
            const result = await response.json();
            if (result.success) {
                loadReservations();
                alert('Réservation supprimée avec succès!');
            } else {
                alert('Erreur: ' + (result.error || 'suppression impossible'));
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    }
}

if (btnAddReservation) {
    btnAddReservation.addEventListener('click', openModal);
}

if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterTable);
}

if (filmSelect) {
    filmSelect.addEventListener('change', syncSeanceOptionsByFilm);
}

if (seanceSelect) {
    seanceSelect.addEventListener('change', () => {
        const selectedSeance = getSelectedSeance();
        if (dateInput) {
            dateInput.value = selectedSeance ? formatDateForInput(selectedSeance.date) : '';
        }
        updateTotal();
    });
}

if (ticketsInput) {
    ticketsInput.addEventListener('input', updateTotal);
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const reservationId = Number(reservationIdInput?.value || 0);

        const payload = {
            customer_name: document.getElementById('nom-input').value.trim(),
            customer_email: document.getElementById('email-input').value.trim(),
            film_id: Number(document.getElementById('film-input').value),
            seance_id: Number(document.getElementById('heure-input').value),
            tickets_count: Number(document.getElementById('tickets-input').value),
            status: normalizeStatus(document.getElementById('statut-select').value)
        };

        if (!payload.film_id || !payload.seance_id || payload.tickets_count <= 0) {
            alert('Veuillez choisir un film, une seance valide et un nombre de billets correct.');
            return;
        }

        try {
            const url = reservationId
                ? `../../backend/api/reservation/reservations.php?id=${reservationId}`
                : '../../backend/api/reservation/reservations.php';
            const method = reservationId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                alert('Erreur: ' + (result.error || 'operation impossible'));
                return;
            }

            closeModal();
            await Promise.all([loadReservations(), loadSeancesList()]);
            alert(reservationId ? 'Réservation modifiée avec succès!' : 'Réservation ajoutée avec succès!');
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadReservations();
    loadFilmsList();
    loadSeancesList();
});
