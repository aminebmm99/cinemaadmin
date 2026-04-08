# Cinema Manager

Application Web pour gérer un cinéma, avec deux types d’utilisateurs : **Admin** et **User**.

---

## 1️ Présentation du Projet

**Titre :** Cinema Manager  
**Objectif :** Permettre aux utilisateurs de réserver des tickets et aux administrateurs de gérer les films et les séances.  

---

## 2️ Architecture Générale

##  Utilisateur ( Client )
- Consulter les films disponibles
- Voir les séances disponibles (date et heure)
- Réserver des tickets
- Recevoir confirmation de réservation

###  Administrateur (Admin)
- Ajouter, modifier et supprimer des films
- Gérer les séances
- Voir le nombre de tickets vendus
- Consulter les réservations

---

## 3️ Structure des Pages

## Côté User
- `index.php` : Liste des films avec image, titre, description, bouton "Voir Séances"
- `seances.php` : Liste des séances d’un film
- `reservation.php` : Formulaire de réservation
- `confirmation.php` : Confirmation de la réservation

## Côté Admin
- `admin/login.php` : Connexion administrateur
- `admin/dashboard.php` : Tableau de bord avec statistiques
- `admin/films.php` : Liste des films avec actions Ajouter/Modifier/Supprimer
- `admin/add_film.php` : Formulaire pour ajouter un film
- `admin/seances.php` : Gestion des séances
- `admin/reservations.php` : Liste des réservations et tickets vendus

---



## 4 Fonctionnement Logique

1. L’utilisateur choisit un film
2. Choisit une séance
3. Indique le nombre de tickets
4. Le système vérifie la disponibilité
5. La réservation est enregistrée et le nombre de places disponible est mis à jour







