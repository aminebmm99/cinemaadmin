# 📊 STRUCTURE COMPLÈTE DU PROJET

## Vue d'ensemble

```
CinemaManager/
└── Admin/
    ├── README.md                           # Documentation principale
    ├── GUIDE_DEMARRAGE.md                  # Guide utilisateur rapide
    ├── GUIDE_DEVELOPPEUR.md                # Guide pour développeurs
    │
    ├── html/                               # Fichiers HTML
    │   ├── login.html                      # 🔐 Page de connexion
    │   ├── main.html                       # 📄 Layout principal (iframes)
    │   ├── menu.html                       # 🗂️  Menu de navigation
    │   ├── suivi.html                      # 📊 Tableau de bord
    │   ├── films.html                      # 🎬 Gestion des films
    │   ├── seances.html                    # 📅 Gestion des séances
    │   └── reservations.html               # 🎫 Gestion des réservations
    │
    ├── css/                                # Feuilles de style
    │   ├── global.css                      # 🎨 Styles globaux et composants
    │   ├── main.css                        # Layout principal
    │   ├── login.css                       # Styles login
    │   ├── menu.css                        # Styles menu
    │   ├── suivi.css                       # Styles tableau de bord
    │   ├── seances.css                     # Styles tables/formulaires
    │   ├── films.css                       # Styles spécifiques films
    │   ├── reservations.css                # Styles spécifiques réservations
    │   └── ajoutFilmForm.css               # (Ancien, à nettoyer)
    │
    └── js/                                 # Logique JavaScript
        ├── data.js                         # 💾 Gestion complète des données
        ├── login.js                        # Logique authentification
        ├── menu.js                        # Logique navigation
        ├── suivi.js                        # Logique tableau de bord
        ├── films.js                        # Logique films (CRUD)
        ├── seances.js                      # Logique séances (CRUD)
        ├── reservations.js                 # Logique réservations (CRUD)
        ├── help.js                         # Système d'aide intégré
        └── test.js                         # Outils de test et debug
```

---

## 📄 Description des Fichiers

### HTML - Interface Utilisateur

#### `login.html`

- **Objectif**: Authentification administrateur
- **Éléments**: Formulaire username/password
- **Script**: `login.js`

#### `main.html`

- **Objectif**: Layout avec deux iframes (menu + contenu)
- **Éléments**:
  - iframe gauche (15%) → menu.html
  - iframe droite (85%) → pages dynamiques
- **Style**: `main.css`

#### `menu.html`

- **Objectif**: Navigation principale
- **Éléments**:
  - Logo "Cinema Manager"
  - Liens: Suivi, Films, Séances, Réservations
  - Bouton déconnexion
- **Script**: `menu.js`

#### `suivi.html`

- **Objectif**: Tableau de bord (dashboard)
- **Éléments**:
  - 4 cartes statistiques
  - Revenu total et statuts
  - Tableau des dernières réservations
- **Script**: `suivi.js`

#### `films.html`

- **Objectif**: Gestion des films (CRUD)
- **Éléments**:
  - Barre de filtrage (titre, genre, classification)
  - Tableau avec actions
  - Modale d'ajout/modification
- **Script**: `films.js`

#### `seances.html`

- **Objectif**: Gestion des séances (CRUD)
- **Éléments**:
  - Barre de filtrage (film, salle, date, statut)
  - Tableau avec affichage places/statut
  - Modale d'ajout/modification
- **Script**: `seances.js`

#### `reservations.html`

- **Objectif**: Gestion des réservations (CRUD)
- **Éléments**:
  - Barre de filtrage (code, nom, film, date)
  - Tableau avec statuts
  - Modale d'ajout/modification
- **Script**: `reservations.js`

---

### CSS - Styling

#### `global.css` ⭐ **FICHIER CLÉS**

- **Contenu**: Styles réutilisables globaux
- **Inclut**:
  - Variables CSS (--primary-color, etc.)
  - Composants: `.btn`, `.badge`, `.modal`, `.form-group`
  - Utilitaires: `.text-center`, `.mt-4`, etc.
- **À utiliser dans tous les HTML**

#### `main.css`

- Layout principal avec flex
- Styles des iframes

#### `login.css`

- Gradient background
- Styling formulaire login
- Animations

#### `menu.css`

- Sidebar navigation
- Bouton logout
- Styles actifs

#### `suivi.css`

- Grid pour les cartes
- Styles dashboard
- Tables de données

#### `seances.css` & `films.css` & `reservations.css`

- Styles tables
- Formulaires modales
- Responsive design

---

### JavaScript - Logique

#### `data.js` ⭐ **FICHIER CLÉS**

**Abstraction complète des données - ALL-IN-ONE**

Structure:

```javascript
CinemaData {
  // Données
  films[]
  seances[]
  reservations[]

  // Méthodes FILMS
  getAllFilms()
  getFilmById(id)
  addFilm()
  updateFilm()
  deleteFilm()

  // Méthodes SEANCES
  getAllSeances()
  getSeanceById(id)
  getSeancesByFilmId()
  getSeancesByDate()
  addSeance()
  updateSeance()
  deleteSeance()

  // Méthodes RESERVATIONS
  getAllReservations()
  getReservationById(id)
  getReservationByCode()
  getReservationsBySeanceId()
  addReservation()
  updateReservation()
  deleteReservation()

  // Statistiques
  getStatistics()
  getDernierReservations()

  // Storage
  init()
  loadFromStorage()
  saveToStorage()
}
```

Avantages:

- Centralisation des données
- Persistance localStorage
- Validation intégrée
- Calculs automatiques

#### `login.js`

- Validation credentials
- Redirection après connexion

#### `menu.js`

- Gestion des actifs
- Fonction logout

#### `suivi.js`

- Chargement dashboard
- Affichage statistiques
- Actualisation 30s

#### `films.js`

- Affichage films
- Filtrage multi-critères
- Formulaire CRUD modal
- Gestion des genres

#### `seances.js`

- Affichage séances
- Filtrage (film, date, statut)
- Formulaire séances
- Calculation places

#### `reservations.js`

- Affichage réservations
- Filtrage avancé
- Formulaire réservations
- Auto-calcul total
- Gestion places

#### `help.js`

- Système d'aide intégré
- Raccourcis clavier
- FAQ

#### `test.js`

- Commandes de test
- Export/import données
- Logs informatifs
- Outils debug

---

## 🔄 Flux de Données

```
localStorage
    ↑
    ↓ (load/save)
data.js (CinemaData)
    ↑
    ↓ (get/add/update/delete)
films.js / seances.js / reservations.js
    ↑
    ↓ (display/render)
DOM (HTML)
    ↓
User Interaction
    ↑
```

---

## 📱 Pages et Navigation

```
login.html
    ↓
main.html (iframes)
    ├─ menu.html (left)
    │   ├─ → suivi.html
    │   ├─ → films.html
    │   ├─ → seances.html
    │   └─ → reservations.html
    │
    └─ Content iframe (right)
        ├─ suivi.html (default)
        ├─ films.html
        ├─ seances.html
        └─ reservations.html
```

---

## 🎯 Fonctionnalités par Page

### Suivi (Tableau de Bord)

- [x] Afficher statistiques
- [x] Compteurs films/séances
- [x] Réservations confirmées
- [x] Places disponibles
- [x] Revenu total
- [x] Dernières réservations

### Films

- [x] Lister tous les films
- [x] Ajouter film
- [x] Modifier film
- [x] Supprimer film
- [x] Filtrer par titre
- [x] Filtrer par genre
- [x] Filtrer par classification

### Séances

- [x] Lister séances
- [x] Ajouter séance
- [x] Modifier séance
- [x] Supprimer séance
- [x] Afficher disponibilité
- [x] Filtrer par film
- [x] Filtrer par date
- [x] Filtrer par statut

### Réservations

- [x] Lister réservations
- [x] Ajouter réservation
- [x] Modifier réservation
- [x] Supprimer réservation
- [x] Auto-calc total
- [x] Filtrer par code
- [x] Filtrer par nom
- [x] Filtrer par date

---

## 💾 Modèles de Données

### Film

```javascript
{
  id: 1,
  title: "Inception",
  genre: "Sci-Fi",
  duration: 148,
  rating: "PG-13",
  poster: "url...",
  synopsis: "...",
  dateAjout: "2025-04-08"
}
```

### Séance

```javascript
{
  id: 1,
  filmId: 1,
  salle: "Salle 1",
  date: "2025-04-15",
  heure: "14:00",
  placesTotal: 100,
  placesDisponibles: 45,
  prix: 12.5,
  statut: "Disponible"
}
```

### Réservation

```javascript
{
  id: 1,
  code: "RES-ABC-123",
  nom: "Ahmed Ben",
  email: "ahmed@example.com",
  seanceId: 1,
  tickets: 2,
  total: 25.0,
  statut: "Confirmée",
  dateReservation: "2025-04-08"
}
```

---

## 🔑 Points Clés d'Implémentation

1. **Centralisation données** → `data.js`
2. **localStorage** → Persistance
3. **Modales** → Formulaires add/edit
4. **Filtrage** → Recherche multi-champs
5. **Validation** → Avant CRUD
6. **Affichage dynamique** → JS/DOM
7. **Responsive** → CSS modern
8. **Tests intégrés** → `test.js`

---

## 🚀 Déploiement

Pour mettre en ligne:

```bash
# 1. Copier le dossier Admin
# 2. Servir les fichiers via HTTP (pas de file://)
# 3. Configurer domaine/SSL
# 4. Implémenter backend API
```

---

## 🔄 Mise à Jour

Pour mettre à jour:

1. Modifier fichiers source
2. Tester dans navigateur
3. localStorage auto-sauvegarde
4. Rafraîchir F5 pour recharger

---

**Dernière révision**: Avril 2025
