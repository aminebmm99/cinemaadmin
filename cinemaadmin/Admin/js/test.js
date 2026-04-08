/**
 * GUIDE DE TEST ET DEBUG - Cinema Manager
 * Commandes utiles pour tester l'application
 */

console.log(`
╔════════════════════════════════════════════════════════════╗
║           Cinema Manager - Guide de Test                  ║
║                                                            ║
║  Ouvrez la console (F12) pour exécuter les tests          ║
╚════════════════════════════════════════════════════════════╝
`);

// ========== TESTS DE BASE ==========
const TEST = {
    
    // Vérifier que les données sont chargées
    checkData: function() {
        console.log('📊 État des données:');
        console.log('Films:', CinemaData.getAllFilms().length);
        console.log('Séances:', CinemaData.getAllSeances().length);
        console.log('Réservations:', CinemaData.getAllReservations().length);
    },

    // Tester l'ajout d'un film
    addTestFilm: function() {
        const newFilm = {
            title: 'Test Film ' + Date.now(),
            genre: 'Action',
            duration: 120,
            rating: 'PG-13',
            synopsis: 'Film de test'
        };
        const result = CinemaData.addFilm(newFilm);
        console.log('✅ Film ajouté:', result);
        return result.id;
    },

    // Tester l'ajout d'une séance
    addTestSeance: function() {
        const filmId = CinemaData.getAllFilms()[0]?.id;
        if (!filmId) {
            console.error('❌ Aucun film disponible');
            return;
        }
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const newSeance = {
            filmId: filmId,
            salle: 'Salle 1',
            date: tomorrow.toISOString().split('T')[0],
            heure: '18:00',
            placesTotal: 100,
            prix: 12.5,
            statut: 'Disponible'
        };
        const result = CinemaData.addSeance(newSeance);
        console.log('✅ Séance ajoutée:', result);
        return result.id;
    },

    // Tester l'ajout d'une réservation
    addTestReservation: function() {
        const seanceId = CinemaData.getAllSeances()[0]?.id;
        if (!seanceId) {
            console.error('❌ Aucune séance disponible');
            return;
        }
        const newRes = {
            nom: 'Test User ' + Date.now(),
            email: 'test@example.com',
            seanceId: seanceId,
            tickets: 2,
            total: 25.0,
            statut: 'Confirmée'
        };
        const result = CinemaData.addReservation(newRes);
        console.log('✅ Réservation ajoutée:', result);
        return result.id;
    },

    // Afficher les statistiques
    showStats: function() {
        const stats = CinemaData.getStatistics();
        console.table({
            'Films': stats.totalFilms,
            'Séances': stats.totalSeances,
            'Réservations': stats.totalReservations,
            'Confirmées': stats.confirmees,
            'En attente': stats.attente,
            'Annulées': stats.annulees,
            'Revenu Total (TND)': stats.revenueTotal.toFixed(2),
            'Places Disponibles': stats.placesDisponibles,
            'Séances Aujourd\'hui': stats.seancesAujourdhui
        });
    },

    // Vider toutes les données
    clearAll: function() {
        if (confirm('⚠️  Êtes-vous sûr? Cela supprimera TOUTES les données!')) {
            localStorage.clear();
            location.reload();
        }
    },

    // Restaurer les données par défaut
    resetToDefault: function() {
        if (confirm('⚠️  Réinitialiser les données par défaut?')) {
            localStorage.clear();
            location.reload();
        }
    },

    // Tester le calcul de revenue
    testRevenue: function() {
        const reservations = CinemaData.getAllReservations();
        let total = 0;
        reservations.forEach(r => {
            if (r.statut === 'Confirmée') {
                total += r.total;
            }
        });
        console.log(`💰 Revenu total des réservations confirmées: ${total.toFixed(2)} TND`);
    },

    // Afficher tous les films
    listFilms: function() {
        const films = CinemaData.getAllFilms();
        console.table(films);
    },

    // Afficher toutes les séances
    listSeances: function() {
        const seances = CinemaData.getAllSeances();
        console.table(seances);
    },

    // Afficher toutes les réservations
    listReservations: function() {
        const reservations = CinemaData.getAllReservations();
        console.table(reservations);
    },

    // Chercher une réservation par code
    findReservation: function(code) {
        const res = CinemaData.getReservationByCode(code);
        if (res) {
            console.log('✅ Réservation trouvée:', res);
        } else {
            console.log('❌ Réservation non trouvée');
        }
    },

    // Tester la validation des places
    testPlaceValidation: function() {
        const seance = CinemaData.getAllSeances()[0];
        if (!seance) {
            console.error('❌ Aucune séance');
            return;
        }
        
        console.log(`Places disponibles: ${seance.placesDisponibles}/${seance.placesTotal}`);
        
        // Tenter une réservation trop grande
        const res = CinemaData.addReservation({
            nom: 'Test',
            email: 'test@test.com',
            seanceId: seance.id,
            tickets: seance.placesDisponibles + 10,
            total: 100,
            statut: 'Confirmée'
        });
        
        if (res.error) {
            console.log('✅ Validation correcte:', res.error);
        } else {
            console.log('❌ Validation échouée');
        }
    },

    // Exporter les données en JSON
    exportData: function() {
        const data = {
            films: CinemaData.films,
            seances: CinemaData.seances,
            reservations: CinemaData.reservations,
            exportedAt: new Date().toISOString()
        };
        console.log('📥 Données exportées (copier le JSON ci-dessous):');
        console.log(JSON.stringify(data, null, 2));
    },

    // Importer des données
    importData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.films) CinemaData.films = data.films;
            if (data.seances) CinemaData.seances = data.seances;
            if (data.reservations) CinemaData.reservations = data.reservations;
            CinemaData.saveToStorage();
            console.log('✅ Données importées avec succès');
            location.reload();
        } catch (e) {
            console.error('❌ Erreur d\'import:', e);
        }
    }
};

// ========== COMMANDES PRATIQUES ==========
const COMMANDS = {
    help: `
🔍 COMMANDES DISPONIBLES:

📊 TEST.checkData()           - Vérifier l'état des données
📊 TEST.showStats()          - Afficher les statistiques
📋 TEST.listFilms()          - Lister tous les films
📋 TEST.listSeances()        - Lister toutes les séances
📋 TEST.listReservations()   - Lister toutes les réservations

➕ TEST.addTestFilm()        - Ajouter un film de test
➕ TEST.addTestSeance()      - Ajouter une séance de test
➕ TEST.addTestReservation() - Ajouter une réservation de test

🔍 TEST.findReservation('CODE') - Chercher une réservation
✅ TEST.testPlaceValidation()  - Tester la validation des places
💰 TEST.testRevenue()         - Tester le calcul des revenus

📥 TEST.exportData()         - Exporter les données
📤 TEST.importData(json)     - Importer les données

🗑️  TEST.clearAll()          - Supprimer TOUTES les données
🔄 TEST.resetToDefault()     - Réinitialiser les données
    `,

    shortcuts: `
⌨️  RACCOURCIS:
F12  - Ouvrir la console
Ctrl+N - Ajouter un nouvel élément
Ctrl+E - Modifier
Ctrl+D - Supprimer
Escape - Fermer la modale
    `
};

// Exporter l'objet TEST pour utilisation globale
window.TEST = TEST;
window.COMMANDS = COMMANDS;

// Afficher les commandes disponibles
console.log(COMMANDS.help);
console.log('\n💡 Tapez TEST.checkData() pour commencer\n');
