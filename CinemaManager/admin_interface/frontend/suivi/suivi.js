const filmsCountEl = document.getElementById('kpi-films');
const seancesTodayEl = document.getElementById('kpi-seances-today');
const reservationsWeekEl = document.getElementById('kpi-reservations-week');
const remainingSeatsEl = document.getElementById('kpi-remaining-seats');
const latestReservationsBody = document.getElementById('latest-reservations-body');

function toDateFromFrench(dateText) {
    if (!dateText || !dateText.includes('/')) {
        return null;
    }

    const [day, month, year] = dateText.split('/').map(Number);
    if (!day || !month || !year) {
        return null;
    }

    return new Date(year, month - 1, day);
}

function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function startOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);
    return result;
}

function normalizeStatus(value) {
    const status = (value || '').toString().trim().toLowerCase();
    if (status === 'confirmee' || status === 'confirmée') return 'confirmee';
    if (status === 'attente') return 'attente';
    if (status === 'annulee' || status === 'annule' || status === 'annulée') return 'annulee';
    return status;
}

function setNumber(element, value) {
    if (!element) return;
    element.textContent = String(value);
}

function renderLatestReservations(reservations) {
    if (!latestReservationsBody) return;

    if (!Array.isArray(reservations) || reservations.length === 0) {
        latestReservationsBody.innerHTML = '<tr><td colspan="5" class="table-empty">Aucune réservation récente</td></tr>';
        return;
    }

    const rows = reservations.slice(0, 8).map((item) => {
        const code = item.code || '-';
        const film = item.film_title || '-';
        const date = item.date || '-';
        const heure = item.heure || '-';
        const tickets = Number(item.tickets_count || 0);

        return `
            <tr>
                <td>${code}</td>
                <td>${film}</td>
                <td>${date}</td>
                <td>${heure}</td>
                <td>${tickets}</td>
            </tr>
        `;
    }).join('');

    latestReservationsBody.innerHTML = rows;
}

async function loadDashboard() {
    try {
        const [filmsRes, seancesRes, reservationsRes, sallesRes] = await Promise.all([
            fetch('../../backend/api/film/get-films.php'),
            fetch('../../backend/api/seance/seances.php'),
            fetch('../../backend/api/reservation/reservations.php'),
            fetch('../../backend/api/salle/salles.php')
        ]);

        const [filmsPayload, seancesPayload, reservationsPayload, sallesPayload] = await Promise.all([
            filmsRes.json(),
            seancesRes.json(),
            reservationsRes.json(),
            sallesRes.json()
        ]);

        const films = Array.isArray(filmsPayload.data) ? filmsPayload.data : [];
        const seances = Array.isArray(seancesPayload.seances) ? seancesPayload.seances : [];
        const reservations = Array.isArray(reservationsPayload.reservations) ? reservationsPayload.reservations : [];
        const salles = Array.isArray(sallesPayload.salles) ? sallesPayload.salles : [];

        const now = new Date();
        const weekStart = startOfWeek(now);

        const seancesToday = seances.filter((seance) => {
            const date = toDateFromFrench(seance.date);
            return date ? isSameDay(date, now) : false;
        }).length;

        const reservationsWeek = reservations.filter((reservation) => {
            const date = toDateFromFrench(reservation.date);
            const status = normalizeStatus(reservation.status);
            return date && date >= weekStart && status === 'confirmee';
        }).length;

        const totalSalleSeats = salles.reduce((sum, salle) => {
            return sum + Number(salle.capacite || 0);
        }, 0);

        const ticketsBought = reservations.reduce((sum, reservation) => {
            const status = normalizeStatus(reservation.status);
            if (status !== 'confirmee') {
                return sum;
            }
            return sum + Number(reservation.tickets_count || 0);
        }, 0);

        const remainingSeats = Math.max(0, totalSalleSeats - ticketsBought);

        setNumber(filmsCountEl, films.length);
        setNumber(seancesTodayEl, seancesToday);
        setNumber(reservationsWeekEl, reservationsWeek);
        setNumber(remainingSeatsEl, remainingSeats);

        renderLatestReservations(reservations);
    } catch (error) {
        console.error('Erreur chargement dashboard suivi:', error);

        setNumber(filmsCountEl, '-');
        setNumber(seancesTodayEl, '-');
        setNumber(reservationsWeekEl, '-');
        setNumber(remainingSeatsEl, '-');

        if (latestReservationsBody) {
            latestReservationsBody.innerHTML = '<tr><td colspan="5" class="table-error">Erreur lors du chargement des données</td></tr>';
        }
    }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
