/**
 * Module de gestion des données du Cinema Manager
 * Simule une base de données locale avec localStorage
 */

const CinemaData = {
  // ========== FILMS ==========
  films: [
    { id: 1, title: "Inception", genre: "Sci-Fi", duration: 148, rating: "PG-13", poster: "https://via.placeholder.com/150x225", synopsis: "Un voleur qui vole les secrets corporatifs via une technologie qui partage les rêves." },
    { id: 2, title: "Interstellar", genre: "Sci-Fi", duration: 169, rating: "PG-13", poster: "https://via.placeholder.com/150x225", synopsis: "Un groupe d'explorateurs voyage à travers un trou de ver près de Saturne." },
    { id: 3, title: "Dune", genre: "Sci-Fi", duration: 156, rating: "PG-13", poster: "https://via.placeholder.com/150x225", synopsis: "Un jeune homme se rend sur la planète la plus dangereuse de l'univers." },
    { id: 4, title: "Avatar: La Voie de l'eau", genre: "Sci-Fi", duration: 192, rating: "PG-13", poster: "https://via.placeholder.com/150x225", synopsis: "Le retour sur Pandora avec une nouvelle aventure spectaculaire." }
  ],

  // ========== SÉANCES ==========
  seances: [
    { id: 1, filmId: 1, salle: "Salle 1", date: "2025-04-15", heure: "14:00", placesTotal: 100, placesDisponibles: 45, prix: 12.5, statut: "Disponible" },
    { id: 2, filmId: 1, salle: "Salle 2", date: "2025-04-15", heure: "18:00", placesTotal: 80, placesDisponibles: 0, prix: 12.5, statut: "Complet" },
    { id: 3, filmId: 2, salle: "Salle IMAX", date: "2025-04-15", heure: "20:00", placesTotal: 120, placesDisponibles: 88, prix: 15.0, statut: "Disponible" },
    { id: 4, filmId: 3, salle: "Salle 3", date: "2025-04-16", heure: "16:00", placesTotal: 100, placesDisponibles: 60, prix: 12.5, statut: "Disponible" },
    { id: 5, filmId: 4, salle: "Salle 1", date: "2025-04-16", heure: "19:30", placesTotal: 100, placesDisponibles: 30, prix: 13.0, statut: "Disponible" }
  ],

  // ========== RÉSERVATIONS ==========
  reservations: [
    { id: 1, code: "RES001", nom: "Ahmed Ben", email: "ahmed@example.com", seanceId: 1, tickets: 2, total: 25.0, statut: "Confirmée", dateReservation: "2025-04-08" },
    { id: 2, code: "RES002", nom: "Fatima Ounissi", email: "fatima@example.com", seanceId: 1, tickets: 1, total: 12.5, statut: "Confirmée", dateReservation: "2025-04-08" },
    { id: 3, code: "RES003", nom: "Mohamed Karim", email: "karim@example.com", seanceId: 3, tickets: 3, total: 45.0, statut: "Attente", dateReservation: "2025-04-08" },
    { id: 4, code: "RES004", nom: "Leila Hamza", email: "leila@example.com", seanceId: 4, tickets: 2, total: 25.0, statut: "Confirmée", dateReservation: "2025-04-07" }
  ],

  // ========== INITIALISATION ==========
  init() {
    this.loadFromStorage();
  },

  loadFromStorage() {
    const films = localStorage.getItem('cinema_films');
    const seances = localStorage.getItem('cinema_seances');
    const reservations = localStorage.getItem('cinema_reservations');

    if (films) this.films = JSON.parse(films);
    if (seances) this.seances = JSON.parse(seances);
    if (reservations) this.reservations = JSON.parse(reservations);

    this.saveToStorage();
  },

  saveToStorage() {
    localStorage.setItem('cinema_films', JSON.stringify(this.films));
    localStorage.setItem('cinema_seances', JSON.stringify(this.seances));
    localStorage.setItem('cinema_reservations', JSON.stringify(this.reservations));
  },

  // ========== FILMS METHODS ==========
  getAllFilms() {
    return this.films;
  },

  getFilmById(id) {
    return this.films.find(f => f.id === id);
  },

  addFilm(film) {
    const newFilm = {
      id: Math.max(...this.films.map(f => f.id), 0) + 1,
      ...film,
      dateAjout: new Date().toISOString()
    };
    this.films.push(newFilm);
    this.saveToStorage();
    return newFilm;
  },

  updateFilm(id, filmData) {
    const index = this.films.findIndex(f => f.id === id);
    if (index !== -1) {
      this.films[index] = { ...this.films[index], ...filmData };
      this.saveToStorage();
      return this.films[index];
    }
    return null;
  },

  deleteFilm(id) {
    const index = this.films.findIndex(f => f.id === id);
    if (index !== -1) {
      this.films.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  },

  // ========== SÉANCES METHODS ==========
  getAllSeances() {
    return this.seances.map(s => ({
      ...s,
      filmTitle: this.getFilmById(s.filmId)?.title || "Film inconnu"
    }));
  },

  getSeanceById(id) {
    const seance = this.seances.find(s => s.id === id);
    if (seance) {
      return {
        ...seance,
        filmTitle: this.getFilmById(seance.filmId)?.title || "Film inconnu"
      };
    }
    return null;
  },

  getSeancesByFilmId(filmId) {
    return this.seances.filter(s => s.filmId === filmId);
  },

  getSeancesByDate(date) {
    return this.seances.filter(s => s.date === date);
  },

  addSeance(seance) {
    const newSeance = {
      id: Math.max(...this.seances.map(s => s.id), 0) + 1,
      ...seance,
      placesDisponibles: seance.placesTotal
    };
    this.seances.push(newSeance);
    this.saveToStorage();
    return newSeance;
  },

  updateSeance(id, seanceData) {
    const index = this.seances.findIndex(s => s.id === id);
    if (index !== -1) {
      this.seances[index] = { ...this.seances[index], ...seanceData };
      this.saveToStorage();
      return this.seances[index];
    }
    return null;
  },

  deleteSeance(id) {
    const index = this.seances.findIndex(s => s.id === id);
    if (index !== -1) {
      this.seances.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  },

  // ========== RÉSERVATIONS METHODS ==========
  getAllReservations() {
    return this.reservations.map(r => ({
      ...r,
      seanceDetails: this.getSeanceById(r.seanceId)
    }));
  },

  getReservationById(id) {
    const res = this.reservations.find(r => r.id === id);
    if (res) {
      return {
        ...res,
        seanceDetails: this.getSeanceById(res.seanceId)
      };
    }
    return null;
  },

  getReservationByCode(code) {
    return this.reservations.find(r => r.code === code);
  },

  getReservationsBySeanceId(seanceId) {
    return this.reservations.filter(r => r.seanceId === seanceId);
  },

  generateReservationCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `RES-${timestamp}-${random}`;
  },

  addReservation(reservation) {
    const seance = this.getSeanceById(reservation.seanceId);
    if (!seance || seance.placesDisponibles < reservation.tickets) {
      return { error: "Pas assez de places disponibles" };
    }

    const newReservation = {
      id: Math.max(...this.reservations.map(r => r.id), 0) + 1,
      code: this.generateReservationCode(),
      ...reservation,
      dateReservation: new Date().toISOString().split('T')[0]
    };

    this.reservations.push(newReservation);

    // Mettre à jour les places disponibles
    const seanceIndex = this.seances.findIndex(s => s.id === reservation.seanceId);
    if (seanceIndex !== -1) {
      this.seances[seanceIndex].placesDisponibles -= reservation.tickets;
      if (this.seances[seanceIndex].placesDisponibles === 0) {
        this.seances[seanceIndex].statut = "Complet";
      }
    }

    this.saveToStorage();
    return newReservation;
  },

  updateReservation(id, reservationData) {
    const index = this.reservations.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reservations[index] = { ...this.reservations[index], ...reservationData };
      this.saveToStorage();
      return this.reservations[index];
    }
    return null;
  },

  deleteReservation(id) {
    const reservation = this.reservations[this.reservations.findIndex(r => r.id === id)];
    if (reservation) {
      // Restaurer les places
      const seanceIndex = this.seances.findIndex(s => s.id === reservation.seanceId);
      if (seanceIndex !== -1) {
        this.seances[seanceIndex].placesDisponibles += reservation.tickets;
        if (this.seances[seanceIndex].statut === "Complet") {
          this.seances[seanceIndex].statut = "Disponible";
        }
      }

      this.reservations.splice(this.reservations.findIndex(r => r.id === id), 1);
      this.saveToStorage();
      return true;
    }
    return false;
  },

  // ========== STATISTIQUES ==========
  getStatistics() {
    return {
      totalFilms: this.films.length,
      totalSeances: this.seances.length,
      totalReservations: this.reservations.length,
      confirmees: this.reservations.filter(r => r.statut === "Confirmée").length,
      attente: this.reservations.filter(r => r.statut === "Attente").length,
      annulees: this.reservations.filter(r => r.statut === "Annulée").length,
      revenueTotal: this.reservations
        .filter(r => r.statut === "Confirmée")
        .reduce((sum, r) => sum + r.total, 0),
      seancesAujourdhui: this.seances.filter(s => s.date === this.getTodayDate()).length,
      placesTotales: this.seances.reduce((sum, s) => sum + s.placesTotal, 0),
      placesDisponibles: this.seances.reduce((sum, s) => sum + s.placesDisponibles, 0)
    };
  },

  getTodayDate() {
    return new Date().toISOString().split('T')[0];
  },

  getDernierReservations(limit = 5) {
    return this.reservations
      .slice()
      .reverse()
      .slice(0, limit)
      .map(r => ({
        ...r,
        seanceDetails: this.getSeanceById(r.seanceId)
      }));
  }
};

// Initialiser les données au chargement
CinemaData.init();
