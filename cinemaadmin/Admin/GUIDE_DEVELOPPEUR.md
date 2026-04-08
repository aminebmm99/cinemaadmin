# 👨‍💻 Cinema Manager - Guide Développeur

## 📚 Documentation Technique

### Architecture du Projet

```
Admin/
├── html/                    # Fichiers HTML
├── css/                     # Feuilles de style
│   └── global.css          # Styles réutilisables
└── js/
    ├── data.js             # Couche de données (abstraction)
    ├── films.js            # Logique Films
    ├── seances.js          # Logique Séances
    ├── reservations.js     # Logique Réservations
    ├── suivi.js            # Logique Dashboard
    ├── login.js            # Authentification
    ├── menu.js             # Navigation
    ├── help.js             # Système d'aide
    └── test.js             # Outils de test
```

---

## 🔧 Module de Données (data.js)

Le module `data.js` fournit une abstraction complète pour les données.

### Structure

```javascript
CinemaData {
  films: Array         // Tous les films
  seances: Array       // Toutes les séances
  reservations: Array  // Toutes les réservations

  // Méthodes publiques
  init()               // Initialisation
  loadFromStorage()    // Charger depuis localStorage
  saveToStorage()      // Sauvegarder dans localStorage
}
```

### Ajouter une Nouvelle Fonctionnalité de Données

```javascript
// 1. Ajouter l'entité dans data.js
const CinemaData = {
  entities: [],

  // 2. Implémenter les méthodes CRUD
  addEntity(entity) {
    const newEntity = {
      id: Math.max(...this.entities.map((e) => e.id), 0) + 1,
      ...entity,
    };
    this.entities.push(newEntity);
    this.saveToStorage();
    return newEntity;
  },

  // 3. Mettre à jour saveToStorage()
  saveToStorage() {
    localStorage.setItem("cinema_films", JSON.stringify(this.films));
    localStorage.setItem("cinema_seances", JSON.stringify(this.seances));
    localStorage.setItem(
      "cinema_reservations",
      JSON.stringify(this.reservations),
    );
    localStorage.setItem("cinema_entities", JSON.stringify(this.entities));
  },
};
```

---

## 🎨 Système de Design CSS

### Variables CSS Globales (global.css)

```css
:root {
  --primary-color: #3b82f6; /* Bleu */
  --success-color: #10b981; /* Vert */
  --danger-color: #ef4444; /* Rouge */
  --warning-color: #f59e0b; /* Amber */

  --bg-primary: #0f172a; /* Fond sombre */
  --bg-secondary: #f1f5f9; /* Fond clair */
  --text-primary: #0f172a; /* Texte principal */
}
```

### Utiliser les Styles

```html
<!-- Boutons -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-danger btn-sm">Small</button>

<!-- Badges -->
<span class="badge badge-success">Success</span>

<!-- Formulaires -->
<div class="form-group">
  <label>Label</label>
  <input type="text" />
</div>

<!-- Grille flexible -->
<div class="form-row">
  <div class="form-group">...</div>
  <div class="form-group">...</div>
</div>
```

---

## 🚀 Ajouter une Nouvelle Page

### 1. Créer le fichier HTML

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="../css/global.css" />
    <link rel="stylesheet" href="../css/seances.css" />
    <link rel="stylesheet" href="../css/ma-page.css" />
  </head>
  <body>
    <div class="layout">
      <main class="main-content">
        <!-- Contenu -->
      </main>
    </div>

    <script src="../js/data.js"></script>
    <script src="../js/ma-page.js"></script>
  </body>
</html>
```

### 2. Créer le fichier JavaScript

```javascript
// html/ma-page.html → js/ma-page.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialisation
  loadData();
  setupEventListeners();
});

function loadData() {
  // Charger depuis CinemaData
  const data = CinemaData.getAllFilms(); // ou autre
  displayData(data);
}

function setupEventListeners() {
  // Événements
}
```

### 3. Ajouter à la navigation (menu.html)

```html
<a href="ma-page.html" target="core">Ma Page</a>
```

---

## 🔄 Pattern de Développement

### Chargement des Données

```javascript
function loadData() {
  const data = CinemaData.getAllFilms();
  displayData(data);
}
```

### Affichage des Données

```javascript
function displayData(items) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // Effacer

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <button onclick="edit(${item.id})">Modifier</button>
        <button onclick="delete(${item.id})">Supprimer</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
```

### Gestion des Modales

```javascript
function openModal() {
  const modal = document.getElementById("my-modal");
  modal.classList.add("show");
}

function closeModal() {
  const modal = document.getElementById("my-modal");
  modal.classList.remove("show");
}

// Événements
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
```

### Formulaires

```javascript
function handleFormSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
  };

  CinemaData.addEntity(formData);
  closeModal();
  loadData(); // Rafraîchir
}
```

---

## 🧪 Tests et Debug

### Utiliser le Module test.js

```javascript
// Dans la console (F12)
TEST.checkData(); // Vérifier l'état
TEST.showStats(); // Statistiques
TEST.listFilms(); // Lister les films
TEST.addTestFilm(); // Ajouter un film de test
TEST.exportData(); // Exporter en JSON
```

### Logging Utile

```javascript
console.log("État:", CinemaData.films);
console.log("Statistiques:", CinemaData.getStatistics());
console.error("Erreur:", error);
```

---

## 📦 Améliorations Futures

### Court Terme

- [ ] Validation plus rigoureuse
- [ ] Messages d'erreur améliorés
- [ ] Confirmation avant suppression
- [ ] Undo/Redo actions
- [ ] Pagination des tables

### Moyen Terme

- [ ] Backend API (Node.js/Express)
- [ ] Base de données (MongoDB)
- [ ] Authentification JWT
- [ ] Gestion des utilisateurs
- [ ] Permissions par rôle

### Long Terme

- [ ] Interface Client
- [ ] Paiement en ligne
- [ ] Notifications email
- [ ] Rapports PDF
- [ ] Analytics
- [ ] Intégration calendrier

---

## 🔐 Sécurité

### Points à Améliorer

1. **Authentification**

```javascript
// ❌ ACTUELLEMENT (démo)
if(username=="admin" && password=="admin") { ... }

// ✅ À FAIRE
// - Hacher les mots de passe
// - JWT tokens
// - Sessions sécurisées
```

2. **Validation**

```javascript
// Valider TOUS les inputs
if (!email.includes("@")) {
  alert("Email invalide");
  return;
}
```

3. **Contrôle d'Accès**

```javascript
// Vérifier les permissions
if (!user.canEdit("films")) {
  alert("Accès refusé");
  return;
}
```

---

## 🎓 Bonnes Pratiques

### Nommage

```javascript
// ✅ BON
function addFilm(filmData) {}
const filmList = [];
const isValidEmail = true;

// ❌ MAUVAIS
function af(d) {}
const list = [];
const valid = true;
```

### Commentaires

```javascript
// ✅ Commenter le POURQUOI pas le QUOI
// Recalculer le total car on ajoute une réservation
const newTotal = calcTotal(reservation);

// ❌ Trop de détail
// Ajouter une réservation et calculer le total
```

### Fonctions

```javascript
// ✅ Court et lisible
function loadData() {
  const items = CinemaData.getAll();
  display(items);
}

// ✅ Responsabilité unique
function validate(item) {}
function save(item) {}
function display(items) {}
```

### Gestion des Erreurs

```javascript
// ✅ Gérer les cas d'erreur
const result = CinemaData.addReservation(data);
if (result.error) {
  console.error("Erreur:", result.error);
  showAlert(result.error);
  return;
}
```

---

## 📚 Ressources

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## 🤝 Contribution

Pour contribuer:

1. Fork le projet
2. Créer une branche (`feature/nouvelle-feature`)
3. Commit les changements
4. Push vers la branche
5. Créer une Pull Request

---

## 📝 License

Propriétaire - Cinema Manager © 2025

---

**Dernière mise à jour**: Avril 2025
