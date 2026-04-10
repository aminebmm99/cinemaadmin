const tableBody = document.getElementById('reservations-tbody');
const searchInput = document.getElementById('filter-search');
const filterStatut = document.getElementById('filter-statut');
const filterDate = document.getElementById('filter-date');
const btnAddReservation = document.getElementById('btn-add-reservation');

const modal = document.getElementById('reservation-modal');
const form = document.getElementById('reservation-form');
const btnCancel = document.getElementById('btn-cancel');
const modalTitle = document.getElementById('modal-title');

let editingReservationId = null;

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
    setupEventListeners();
});

// ========== CHARGEMENT ET AFFICHAGE ==========
function loadReservations() {
    const reservations = CinemaData.getAllReservations();
    displayReservations(reservations);
}

function displayReservations(reservations) {
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (reservations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Aucune réservation trouvée</td></tr>';
        return;
    }

    reservations.forEach(res => {
        const row = document.createElement('tr');
        const seance = res.seanceDetails;
        const statutClass = res.statut === 'Confirmée' ? 'success' : 
                          res.statut === 'Attente' ? 'warning' : 'danger';
        
        row.innerHTML = `
            <td>${res.code}</td>
            <td>${res.nom}<br><small>${res.email}</small></td>
            <td>${seance ? seance.filmTitle + '<br>' + seance.date + ' ' + seance.heure : '-'}</td>
            <td>${res.tickets}</td>
            <td>${res.total.toFixed(2)} TND</td>
            <td><span class="badge badge-${statutClass}">${res.statut}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editReservation(${res.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteReservation(${res.id})">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ========== MODALE - OUVERTURE/FERMETURE ==========
function openModal() {
    if (!modal) return;
    editingReservationId = null;
    modalTitle.textContent = 'Nouvelle Réservation';
    if (form) form.reset();
    populateSeanceSelect();
    modal.classList.add('show');
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    editingReservationId = null;
    if (form) form.reset();
}

// ========== REMPLIR LES SÉLECTS ==========
function populateSeanceSelect() {
    const heure = document.getElementById('heure-input');
    if (!heure) return;
    
    const film = document.getElementById('film-input').value;
    const date = document.getElementById('date-input').value;
    
    // Pour simplifier, créer un select basique
    if (!document.getElementById('seance-select')) {
        const select = document.createElement('select');
        select.id = 'seance-select';
        heure.replaceWith(select);
    }

    const seanceSelect = document.getElementById('seance-select');
    seanceSelect.innerHTML = '<option value="">Sélectionner une séance...</option>';
    
    const seances = CinemaData.getAllSeances().filter(s => 
        (!film || s.filmTitle === film) && (!date || s.date === date)
    );
    
    seances.forEach(seance => {
        const option = document.createElement('option');
        option.value = seance.id;
        option.textContent = `${seance.filmTitle} - ${seance.date} ${seance.heure} (${seance.placesDisponibles} places)`;
        seanceSelect.appendChild(option);
    });
}

// ========== ÉDITION ==========
function editReservation(id) {
    const res = CinemaData.getReservationById(id);
    if (!res) return;

    editingReservationId = id;
    document.getElementById('reservation-id').value = id;
    document.getElementById('nom-input').value = res.nom;
    document.getElementById('email-input').value = res.email;
    document.getElementById('film-input').value = res.seanceDetails?.filmTitle || '';
    document.getElementById('date-input').value = res.seanceDetails?.date || '';
    document.getElementById('tickets-input').value = res.tickets;
    document.getElementById('total-input').value = res.total;
    document.getElementById('statut-select').value = res.statut;

    modalTitle.textContent = 'Modifier la réservation';
    populateSeanceSelect();
    openModal();
}

function deleteReservation(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        CinemaData.deleteReservation(id);
        loadReservations();
    }
}

// ========== FILTRAGE ==========
function filterReservations() {
    const reservations = CinemaData.getAllReservations();
    const query = searchInput.value.trim().toLowerCase();
    const statut = filterStatut.value;
    const date = filterDate.value;

    const filtered = reservations.filter(res => {
        const seance = res.seanceDetails;
        const matchesSearch = query === '' || 
                            res.code.toLowerCase().includes(query) || 
                            res.nom.toLowerCase().includes(query) ||
                            res.email.toLowerCase().includes(query) ||
                            (seance && seance.filmTitle.toLowerCase().includes(query));
        const matchesStatut = statut === '' || res.statut === statut;
        const matchesDate = date === '' || (seance && seance.date === date);
        
        return matchesSearch && matchesStatut && matchesDate;
    });

    displayReservations(filtered);
}

// ========== SOUMISSION FORMULAIRE ==========
function handleFormSubmit(e) {
    e.preventDefault();

    const reservationData = {
        nom: document.getElementById('nom-input').value,
        email: document.getElementById('email-input').value,
        seanceId: parseInt(document.getElementById('seance-select').value),
        tickets: parseInt(document.getElementById('tickets-input').value),
        total: parseFloat(document.getElementById('total-input').value),
        statut: document.getElementById('statut-select').value
    };

    if (editingReservationId) {
        CinemaData.updateReservation(editingReservationId, reservationData);
    } else {
        const result = CinemaData.addReservation(reservationData);
        if (result.error) {
            alert(result.error);
            return;
        }
    }

    closeModal();
    loadReservations();
}

// ========== Calcul automatique du total ==========
function calculateTotal() {
    const ticketsInput = document.getElementById('tickets-input');
    const seanceSelect = document.getElementById('seance-select');
    const totalInput = document.getElementById('total-input');
    
    if (!ticketsInput || !seanceSelect || !totalInput) return;
    
    const seanceId = parseInt(seanceSelect.value);
    const tickets = parseInt(ticketsInput.value) || 0;
    
    const seance = CinemaData.getSeanceById(seanceId);
    if (seance && tickets > 0) {
        totalInput.value = (seance.prix * tickets).toFixed(2);
    }
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
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
        searchInput.addEventListener('input', filterReservations);
    }

    if (filterStatut) {
        filterStatut.addEventListener('change', filterReservations);
    }

    if (filterDate) {
        filterDate.addEventListener('change', filterReservations);
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Événements pour le calcul automatique
    const ticketsInput = document.getElementById('tickets-input');
    if (ticketsInput) {
        ticketsInput.addEventListener('change', calculateTotal);
    }

    const seanceSelect = document.getElementById('seance-select');
    if (seanceSelect) {
        seanceSelect.addEventListener('change', calculateTotal);
    }
}
