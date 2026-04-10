// Elements du DOM
const tableBody = document.getElementById('seances-tbody');
const searchInput = document.getElementById('filter-search');
const filterStatut = document.getElementById('filter-statut');
const filterDate = document.getElementById('filter-date');
const btnAddSeance = document.getElementById('btn-add-seance');

// Modale
const modal = document.getElementById('seance-modal');
const form = document.getElementById('seance-form');
const btnCancel = document.getElementById('btn-cancel');
const modalTitle = document.getElementById('modal-title');

let editingSeanceId = null;

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadSeances();
    setupEventListeners();
});

// ========== CHARGEMENT ET AFFICHAGE ==========
function loadSeances() {
    const seances = CinemaData.getAllSeances();
    displaySeances(seances);
}

function displaySeances(seances) {
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (seances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Aucune séance trouvée</td></tr>';
        return;
    }

    seances.forEach(seance => {
        const row = document.createElement('tr');
        const statutClass = seance.statut === 'Disponible' ? 'success' : 
                          seance.statut === 'Complet' ? 'warning' : 'danger';
        
        row.innerHTML = `
            <td>${seance.filmTitle}</td>
            <td>${seance.salle}</td>
            <td>${seance.date}</td>
            <td>${seance.heure}</td>
            <td>${seance.placesDisponibles}/${seance.placesTotal}</td>
            <td><span class="badge badge-${statutClass}">${seance.statut}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editSeance(${seance.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSeance(${seance.id})">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ========== MODALE - OUVERTURE/FERMETURE ==========
function openModal() {
    if (!modal) return;
    editingSeanceId = null;
    modalTitle.textContent = 'Nouvelle séance';
    if (form) form.reset();
    populateFilmSelect();
    modal.classList.add('show');
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    editingSeanceId = null;
    if (form) form.reset();
}

// ========== REMPLIR LES SÉLECTS ==========
function populateFilmSelect() {
    const filmSelect = document.getElementById('film-select');
    if (!filmSelect) return;
    
    filmSelect.innerHTML = '<option value="">Sélectionner un film...</option>';
    CinemaData.getAllFilms().forEach(film => {
        const option = document.createElement('option');
        option.value = film.id;
        option.textContent = film.title;
        filmSelect.appendChild(option);
    });
}

// ========== ÉDITION ==========
function editSeance(id) {
    const seance = CinemaData.getSeanceById(id);
    if (!seance) return;

    editingSeanceId = id;
    document.getElementById('seance-id').value = id;
    document.getElementById('film-select').value = seance.filmId;
    document.getElementById('salle-select').value = seance.salle;
    document.getElementById('date-input').value = seance.date;
    document.getElementById('heure-input').value = seance.heure;
    document.getElementById('places-input').value = seance.placesTotal;
    document.getElementById('prix-input').value = seance.prix;
    document.getElementById('statut-select').value = seance.statut;

    modalTitle.textContent = 'Modifier la séance';
    populateFilmSelect();
    openModal();
}

function deleteSeance(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
        CinemaData.deleteSeance(id);
        loadSeances();
    }
}

// ========== FILTRAGE ==========
function filterSeances() {
    const seances = CinemaData.getAllSeances();
    const query = searchInput.value.trim().toLowerCase();
    const statut = filterStatut.value;
    const date = filterDate.value;

    const filtered = seances.filter(seance => {
        const matchesSearch = query === '' || 
                            seance.filmTitle.toLowerCase().includes(query) || 
                            seance.salle.toLowerCase().includes(query);
        const matchesStatut = statut === '' || seance.statut === statut;
        const matchesDate = date === '' || seance.date === date;
        
        return matchesSearch && matchesStatut && matchesDate;
    });

    displaySeances(filtered);
}

// ========== SOUMISSION FORMULAIRE ==========
function handleFormSubmit(e) {
    e.preventDefault();

    const seanceData = {
        filmId: parseInt(document.getElementById('film-select').value),
        salle: document.getElementById('salle-select').value,
        date: document.getElementById('date-input').value,
        heure: document.getElementById('heure-input').value,
        placesTotal: parseInt(document.getElementById('places-input').value),
        prix: parseFloat(document.getElementById('prix-input').value),
        statut: document.getElementById('statut-select').value
    };

    if (editingSeanceId) {
        CinemaData.updateSeance(editingSeanceId, seanceData);
    } else {
        seanceData.placesDisponibles = seanceData.placesTotal;
        CinemaData.addSeance(seanceData);
    }

    closeModal();
    loadSeances();
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    if (btnAddSeance) {
        btnAddSeance.addEventListener('click', openModal);
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
        searchInput.addEventListener('input', filterSeances);
    }

    if (filterStatut) {
        filterStatut.addEventListener('change', filterSeances);
    }

    if (filterDate) {
        filterDate.addEventListener('change', filterSeances);
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}
