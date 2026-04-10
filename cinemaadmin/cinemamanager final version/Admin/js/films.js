// Elements du DOM
const tableBody = document.getElementById('films-tbody');
const searchInput = document.getElementById('filter-search');
const filterGenre = document.getElementById('filter-genre');
const filterRating = document.getElementById('filter-rating');
const btnAddFilm = document.getElementById('btn-add-film');

// Modale
const modal = document.getElementById('film-modal');
const form = document.getElementById('film-form');
const btnCancel = document.getElementById('btn-cancel');
const modalTitle = document.getElementById('modal-title');

let editingFilmId = null;

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadFilms();
    setupEventListeners();
});

// ========== CHARGEMENT ET AFFICHAGE ==========
function loadFilms() {
    const films = CinemaData.getAllFilms();
    displayFilms(films);
}

function displayFilms(films) {
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (films.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="empty-message">Aucun film trouvé</td></tr>';
        return;
    }

    films.forEach(film => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.genre}</td>
            <td>${film.duration} min</td>
            <td>${film.rating}</td>
            <td>${film.synopsis ? film.synopsis.substring(0, 30) + '...' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editFilm(${film.id})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteFilm(${film.id})">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ========== MODALE - OUVERTURE/FERMETURE ==========
function openModal() {
    if (!modal) return;
    editingFilmId = null;
    modalTitle.textContent = 'Nouveau film';
    if (form) form.reset();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    editingFilmId = null;
    if (form) form.reset();
}

// ========== ÉDITION ==========
function editFilm(id) {
    const film = CinemaData.getFilmById(id);
    if (!film) return;

    editingFilmId = id;
    document.getElementById('film-id').value = id;
    document.getElementById('title').value = film.title;
    document.getElementById('genre').value = film.genre;
    document.getElementById('duration').value = film.duration;
    document.getElementById('rating').value = film.rating;
    document.getElementById('poster').value = film.poster || '';
    document.getElementById('synopsis').value = film.synopsis || '';

    modalTitle.textContent = 'Modifier le film';
    openModal();
}

function deleteFilm(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
        CinemaData.deleteFilm(id);
        loadFilms();
    }
}

// ========== FILTRAGE ==========
function filterFilms() {
    const films = CinemaData.getAllFilms();
    const query = searchInput.value.trim().toLowerCase();
    const genreFilter = filterGenre.value;
    const ratingFilter = filterRating.value;

    const filtered = films.filter(film => {
        const matchesSearch = query === '' || 
                            film.title.toLowerCase().includes(query) || 
                            film.genre.toLowerCase().includes(query) ||
                            (film.synopsis && film.synopsis.toLowerCase().includes(query));
        const matchesGenre = genreFilter === '' || film.genre === genreFilter;
        const matchesRating = ratingFilter === '' || film.rating === ratingFilter;
        
        return matchesSearch && matchesGenre && matchesRating;
    });

    displayFilms(filtered);
}

// ========== SOUMISSION FORMULAIRE ==========
function handleFormSubmit(e) {
    e.preventDefault();

    const filmData = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        duration: parseInt(document.getElementById('duration').value),
        rating: document.getElementById('rating').value,
        poster: document.getElementById('poster').value || 'https://via.placeholder.com/150x225',
        synopsis: document.getElementById('synopsis').value
    };

    if (editingFilmId) {
        CinemaData.updateFilm(editingFilmId, filmData);
    } else {
        CinemaData.addFilm(filmData);
    }

    closeModal();
    loadFilms();
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    if (btnAddFilm) {
        btnAddFilm.addEventListener('click', openModal);
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
        searchInput.addEventListener('input', filterFilms);
    }

    if (filterGenre) {
        filterGenre.addEventListener('change', filterFilms);
    }

    if (filterRating) {
        filterRating.addEventListener('change', filterFilms);
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}
