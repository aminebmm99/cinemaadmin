# 🎬 Cinema Manager - Admin Panel

## 📋 Description

Panel d'administration complet pour la gestion d'un cinéma permettant de gérer films, séances et réservations.

## ✨ Fonctionnalités Principales

### 📊 Tableau de Bord (Suivi)

- Vue d'ensemble des statistiques clés
- Nombre total de films et séances
- Réservations confirmées et revenus
- Dernières réservations
- Actualisable en temps réel

### 🎬 Gestion des Films

- Ajouter, modifier, supprimer des films
- Filtrer par titre, genre, et classification
- Gérer titre, genre, durée, classification, synopsis et affiche

### 📅 Gestion des Séances

- Créer et gérer les séances de films
- Assigner films aux salles
- Définir date, heure, places et prix
- Suivre la disponibilité des places
- Modifier le statut (Disponible, Complet, Annulé)

### 🎫 Gestion des Réservations

- Consulter toutes les réservations
- Modifier le statut des réservations (Confirmée, Attente, Annulée)
- Suivre les revenus générés
- Filtrer par client, film, ou date

## 🚀 Démarrage Rapide

### Installation

1. Ouvrir `html/login.html` dans un navigateur
2. Se connecter avec:
   - **Username**: `admin`
   - **Password**: `admin`

### Structure des Fichiers

```
Admin/
├── html/
│   ├── login.html          # Page de connexion
│   ├── main.html           # Layout principal
│   ├── menu.html           # Menu de navigation
│   ├── suivi.html          # Tableau de bord
│   ├── films.html          # Gestion des films
│   ├── seances.html        # Gestion des séances
│   └── reservations.html   # Gestion des réservations
├── css/
│   ├── global.css          # Styles globaux réutilisables
│   ├── main.css
│   ├── login.css
│   ├── menu.css
│   ├── suivi.css
│   ├── seances.css
│   ├── films.css
│   └── reservations.css
└── js/
    ├── data.js             # Module de gestion des données
    ├── login.js
    ├── menu.js
    ├── films.js
    ├── seances.js
    ├── reservations.js
    └── suivi.js
```

## 📊 Gestion des Données

### Stockage

Les données sont stockées dans `localStorage`:

- ✅ Aucune base de données requise
- ✅ Données persistantes
- ⚠️ Données perdues lors du vidage du cache

### Données Exemple Pré-chargées

- **Films**: Inception, Interstellar, Dune, Avatar
- **Séances**: 5 séances planifiées
- **Réservations**: 4 réservations exemple

## 🔧 API de Données (`data.js`)

### Films

```javascript
CinemaData.getAllFilms(); // Récupérer tous les films
CinemaData.getFilmById(id); // Récupérer un film
CinemaData.addFilm(film); // Ajouter un film
CinemaData.updateFilm(id, film); // Modifier un film
CinemaData.deleteFilm(id); // Supprimer un film
```

### Séances

```javascript
CinemaData.getAllSeances(); // Récupérer toutes les séances
CinemaData.getSeanceById(id); // Récupérer une séance
CinemaData.getSeancesByFilmId(id); // Séances d'un film
CinemaData.getSeancesByDate(date); // Séances d'une date
CinemaData.addSeance(seance); // Ajouter une séance
CinemaData.updateSeance(id, data); // Modifier une séance
CinemaData.deleteSeance(id); // Supprimer une séance
```

### Réservations

```javascript
CinemaData.getAllReservations(); // Tous les réservations
CinemaData.getReservationById(id); // Une réservation
CinemaData.getReservationByCode(code); // Chercher par code
CinemaData.addReservation(reservation); // Ajouter réservation
CinemaData.updateReservation(id, data); // Modifier réservation
CinemaData.deleteReservation(id); // Supprimer réservation
```

### Statistiques

```javascript
CinemaData.getStatistics(); // Toutes les statistiques
CinemaData.getDernierReservations(5); // Dernières réservations
```

## 🎨 Système de Design

### Couleurs

- **Primaire**: `#3b82f6` (Bleu)
- **Succès**: `#10b981` (Vert)
- **Danger**: `#ef4444` (Rouge)
- **Warning**: `#f59e0b` (Amber)

### Composants Réutilisables

#### Boutons

```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger btn-sm">Danger Small</button>
```

#### Badges

```html
<span class="badge badge-success">Confirmée</span>
<span class="badge badge-warning">Attente</span>
<span class="badge badge-danger">Annulée</span>
```

#### Formulaires

```html
<div class="form-group">
  <label>Titre</label>
  <input type="text" required />
</div>
```

## 📱 Responsive Design

- ✅ Mobile-first
- ✅ Tablette
- ✅ Desktop

## 🔐 Sécurité

**Note**: Cet exemple utilise une authentification simple côté client. Pour la production, implémenter:

- [ ] Backend API sécurisée
- [ ] JWT tokens
- [ ] Password hashing
- [ ] Autorisation par rôle

## 📈 Statistiques Disponibles

- Total des films
- Séances planifiées aujourd'hui
- Réservations confirmées
- Places disponibles total
- Revenu total généré
- Répartition des réservations

## 🐛 À Implémenter

- [ ] Authentification sécurisée (Backend)
- [ ] Base de données (MongoDB/PostgreSQL)
- [ ] API REST
- [ ] Pagination des tables
- [ ] Export CSV/PDF
- [ ] Notifications temps réel
- [ ] Gestion multi-utilisateurs
- [ ] Audit trail complète
- [ ] Undo/Redo actions
- [ ] Backup automatique

## 💡 Utilisation Type

### Ajouter un Film

1. Cliquer "Films" → "+ Nouveau film"
2. Remplir titre, genre, durée, classification
3. Cliquer "Enregistrer"

### Créer une Séance

1. Cliquer "Séances" → "+ Nouvelle séance"
2. Sélectionner film et salle
3. Définir date, heure, places
4. Cliquer "Enregistrer"

### Ajouter une Réservation

1. Cliquer "Réservations" → "+ Nouvelle réservation"
2. Remplir données client
3. Sélectionner séance
4. Nombre de tickets s'auto-calcule
5. Cliquer "Enregistrer"

## 📞 Support

Pour les questions ou bugs: contactez l'équipe dev

---

**Version**: 1.0.0  
**Mise à jour**: Avril 2025
