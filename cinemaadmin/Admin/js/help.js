/**
 * Guide Utilisateur - Cinema Manager Admin
 * Aide et documentation pour les administrateurs
 */

// Raccourcis clavier
const SHORTCUTS = {
    'Ctrl + N': 'Ajouter un nouvel élément',
    'Ctrl + E': 'Modifier l\'élément sélectionné',
    'Ctrl + D': 'Supprimer l\'élément sélectionné',
    'Escape': 'Fermer la modale',
    'Ctrl + F': 'Rechercher'
};

// Textes d'aide
const HELP_TEXTS = {
    'films': `
        📽️ GESTION DES FILMS
        
        ✅ Opérations disponibles:
        • Ajouter un nouveau film
        • Modifier les informations du film
        • Supprimer un film
        • Filtrer par titre, genre ou classification
        
        📋 Champs obligatoires:
        • Titre du film
        • Genre
        • Durée (en minutes)
        • Classification
        
        💡 Conseils:
        • Les films supprimés n'apparaîtront plus dans les séances
        • Utilisez des titres explicites pour une meilleure recherche
        • L'URL de l'affiche doit être valide (format JPEG ou PNG)
    `,
    
    'seances': `
        📅 GESTION DES SÉANCES
        
        ✅ Opérations disponibles:
        • Créer une nouvelle séance
        • Modifier date, heure, places ou prix
        • Voir la disponibilité en temps réel
        • Changer le statut (Disponible/Complet/Annulé)
        
        📋 Champs obligatoires:
        • Film
        • Salle
        • Date
        • Heure
        • Nombre total de places
        • Prix du ticket
        
        💡 Conseils:
        • Les places se décrémentent automatiquement avec les réservations
        • Une séance devient "Complet" quand toutes les places sont réservées
        • Les séances passées peuvent être conservées pour historique
    `,
    
    'reservations': `
        🎫 GESTION DES RÉSERVATIONS
        
        ✅ Opérations disponibles:
        • Créer une nouvelle réservation
        • Modifier le statut (Confirmée/Attente/Annulée)
        • Consulter le détail des réservations
        • Suivre les revenus
        
        📋 Champs obligatoires:
        • Nom client
        • Email
        • Séance
        • Nombre de tickets
        
        💡 Conseils:
        • Le total s'auto-calcule (prix × tickets)
        • Annuler une réservation restaure les places
        • Les codes de réservation sont générés automatiquement
        • Filtrez par date pour les rapports journaliers
    `,
    
    'dashboard': `
        📊 TABLEAU DE BORD
        
        ✅ Informations affichées:
        • Nombre total de films
        • Séances planifiées aujourd'hui
        • Réservations confirmées
        • Places disponibles
        • Revenu total généré
        • Statut des réservations
        • Dernières réservations
        
        💡 Utilisation:
        • Page d'accueil après connexion
        • Vue d'ensemble pour décisions rapides
        • Se met à jour toutes les 30 secondes
        • Cliquez sur les sections pour voir les détails
    `
};

// FAQ
const FAQ = [
    {
        question: "Comment réinitialiser les données?",
        answer: "Ouvrez la console (F12), puis tapez: localStorage.clear() et rafraîchissez la page."
    },
    {
        question: "Comment exporter les données?",
        answer: "Les données sont en localStorage. Copiez depuis localStorage ou développer un export JSON."
    },
    {
        question: "Puis-je avoir plusieurs administrateurs?",
        answer: "Actuellement non. À développer: système d'utilisateurs avec rôles."
    },
    {
        question: "Comment modifier le mot de passe admin?",
        answer: "À développer. Actuellement: admin/admin (voir login.js)"
    },
    {
        question: "Les données sont-elles sauvegardées?",
        answer: "Oui, dans le localStorage du navigateur. Elles persistent entre les sessions."
    },
    {
        question: "Comment ajouter plus de salles?",
        answer: "Modifier la liste dans le select 'salle-select' dans seances.html"
    },
    {
        question: "Puis-je imprimer les réservations?",
        answer: "Oui, utilisez Ctrl+P pour imprimer la page"
    },
    {
        question: "Comment archiver une réservation?",
        answer: "Changez le statut en 'Annulée' ou supprimez-la (voir détail pour autres options)"
    }
];

// Fonction pour afficher l'aide
function showHelp(section) {
    const helpText = HELP_TEXTS[section];
    if (helpText) {
        console.log(helpText);
        alert(helpText);
    }
}

// Fonction pour afficher la FAQ
function showFAQ() {
    let faqText = "❓ QUESTIONS FRÉQUENTES\n\n";
    FAQ.forEach((item, index) => {
        faqText += `${index + 1}. Q: ${item.question}\n`;
        faqText += `   A: ${item.answer}\n\n`;
    });
    console.log(faqText);
    alert(faqText);
}

// Export pour utilisation global
window.Help = {
    show: showHelp,
    shortcuts: SHORTCUTS,
    faq: showFAQ
};

// Imprimer l'info au chargement
console.log(`
╔════════════════════════════════════════╗
║     Cinema Manager - Admin Guide       ║
║                                        ║
║  Commandes disponibles:                ║
║  - Help.show('films')                  ║
║  - Help.show('seances')                ║
║  - Help.show('reservations')           ║
║  - Help.show('dashboard')              ║
║  - Help.faq()                          ║
║                                        ║
╚════════════════════════════════════════╝
`);
