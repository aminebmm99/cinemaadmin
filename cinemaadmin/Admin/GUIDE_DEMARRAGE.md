# 🎬 Cinema Manager - Guide de Démarrage Rapide

## ⚡ 5 Minutes pour Commencer

### 1️⃣ Ouverture de l'Application

```
1. Ouvrir le fichier: Admin/html/login.html
2. Dans un navigateur web moderne (Chrome, Firefox, Safari, Edge)
```

### 2️⃣ Connexion Administrateur

```
Username: admin
Password: admin
```

### 3️⃣ Accès au Tableau de Bord

Une fois connecté, vous verrez:

- 📊 Vue d'ensemble des statistiques
- 📽️ Nombre de films
- 📅 Séances planifiées
- 🎫 Réservations confirmées
- 💰 Revenu total

---

## 🎯 Opérations Principales

### 📽️ Ajouter un Film

```
1. Cliquer sur "Films" dans le menu gauche
2. Cliquer sur "+ Nouveau film"
3. Remplir:
   - Titre (obligatoire)
   - Genre
   - Durée en minutes
   - Classification (G, PG, PG-13, R, NC-17)
   - Synopsis (description)
4. Cliquer "Enregistrer"
```

### 📅 Créer une Séance

```
1. Cliquer sur "Séances"
2. Cliquer sur "+ Nouvelle séance"
3. Sélectionner:
   - Film
   - Salle (1, 2, 3, ou IMAX)
   - Date et Heure
   - Nombre de places
   - Prix du ticket
   - Statut
4. Cliquer "Enregistrer"
```

### 🎫 Ajouter une Réservation

```
1. Cliquer sur "Réservations"
2. Cliquer sur "+ Nouvelle réservation"
3. Remplir:
   - Nom du client
   - Email
   - Sélectionner une séance
   - Nombre de tickets
4. Total s'auto-calcule
5. Cliquer "Enregistrer"
```

### 🔍 Filtrer/Rechercher

```
Pour Films:
- Rechercher par titre ou genre
- Filtrer par classification

Pour Séances:
- Rechercher par film ou salle
- Filtrer par statut et date

Pour Réservations:
- Rechercher par code, nom, email
- Filtrer par statut et date
```

---

## 📊 Comprendre le Tableau de Bord

| Carte           | Signification                         |
| --------------- | ------------------------------------- |
| 📽️ Films        | Nombre total de films dans le système |
| 📅 Séances      | Séances planifiées pour aujourd'hui   |
| 🎫 Réservations | Réservations confirmées (semaine)     |
| 💰 Places       | Places libres disponibles au total    |

---

## 🔧 Données Par Défaut

L'application contient déjà:

- **4 films**: Inception, Interstellar, Dune, Avatar
- **5 séances**: Exemples de planification
- **4 réservations**: Exemplaires confirmées

### ✅ Testez Immédiatement

1. Connectez-vous
2. Allez au Tableau de bord
3. Cliquez sur "Films" pour voir les films
4. Cliquez sur "Séances" pour voir les horaires
5. Cliquez sur "Réservations" pour voir les bookings

---

## 💡 Astuces Utiles

### Modification d'un Élément

```
Pour Films/Séances/Réservations:
1. Cliquer sur le bouton "Modifier"
2. Changer les informations
3. Cliquer "Enregistrer"
```

### Suppression d'un Élément

```
1. Cliquer sur le bouton "Supprimer"
2. Confirmer la suppression
3. Élément supprimé définitivement
```

### Modification du Statut d'une Séance

```
Statuts disponibles:
✅ Disponible - Places libres
🔴 Complet - Toutes les places réservées
❌ Annulé - Séance annulée
```

### Modification d'une Réservation

```
Statuts disponibles:
✅ Confirmée - Réservation active
⏳ Attente - En cours de confirmation
❌ Annulée - Réservation annulée
```

---

## 🐛 Résolution de Problèmes

### Les données ont disparu

```
Les données sont stockées dans le navigateur (localStorage).
Si vidé: Vider le cache → Rafraîchir → Données réinitialisées
```

### Je ne peux pas me connecter

```
Vérifier:
1. Username: admin
2. Password: admin
3. Navigateur autorisé (pas de restrictions)
```

### Un film ne s'ajoute pas

```
Vérifier:
- Titre doit être rempli
- Genre doit être sélectionné
- Durée doit être un nombre
- Classification doit être sélectionnée
```

### Une séance ne se crée pas

```
Vérifier:
- Film sélectionné
- Salle sélectionnée
- Date et heure valides
- Nombre de places > 0
- Prix positif ou zéro
```

---

## 🔐 Sécurité

⚠️ **Important**: Cette version est une démo. Pour la production:

- Implémenter une vraie authentification
- Ajouter une base de données
- Chiffrer les données sensibles
- Implémenter les contrôles d'accès

---

## 📱 Compatibilité

✅ **Fonctionne sur**:

- Desktop (Windows, Mac, Linux)
- Tablette (iPad, Android)
- Mobile (iPhone, Android)

⚠️ **Navigateurs requis**:

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 🎓 Étapes Suivantes

Après le démarrage:

1. [ ] Explorez le Tableau de Bord
2. [ ] Ajoutez un film de test
3. [ ] Créez une séance
4. [ ] Effectuez une réservation
5. [ ] Consultez les statistiques

---

## 🆘 Support

Pour l'aide:

1. Consultez le README.md pour documentation complète
2. Ouvrez la console (F12) pour les logs
3. Tapez `TEST.checkData()` pour vérifier l'état

---

**Bon début ! 🚀**

Pour plus de détails, consultez le fichier [README.md](./README.md)
