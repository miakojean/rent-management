## 1. Présentation du Projet

L'objectif est de créer une plateforme permettant aux agences ou aux particuliers de gérer des biens immobiliers, des locataires, des contrats et des paiements.

### Public cible

* **Administrateurs :** Gestion de l'agence et des agents.
* **Propriétaires/Agents :** Gestion des annonces, des baux et suivi des loyers.
* **Locataires :** Consultation des documents et paiement en ligne.

---

## 2. Architecture Technique

L'application fonctionnera sur un modèle **Découplé (Headless)**.

* **Frontend :** Nuxt 3, Tailwind CSS (Design), Pinia (State management).
* **Backend :** Django 5, Django REST Framework (API), PostgreSQL.
* **Authentification :** JWT (JSON Web Tokens) ou cookies sécurisés via Dj-Rest-Auth.
* **Stockage fichiers :** AWS S3 ou Cloudinary (pour les photos des biens).

---

## 3. Spécifications Fonctionnelles

### A. Gestion des Utilisateurs (Auth)

* Inscription / Connexion / Récupération de mot de passe.
* Profils avec rôles (Admin, Agent, Locataire).
* Espace "Mon Compte" pour modifier les informations personnelles.

### B. Gestion Immobilière (Cœur de l'app)

* **Tableau de bord :** Vue d'ensemble (biens vacants, revenus du mois, alertes impayés).
* **Gestion des Biens :** Ajout, modification, suppression (Photos, adresse, type, prix, surface, équipements).
* **Gestion des Locataires :** Dossier locataire, historique, contact.

### C. Gestion Locative

* **Contrats de bail :** Génération de contrats (PDF) et suivi des dates de fin.
* **Gestion des Loyers :** Génération automatique des quittances, suivi des paiements (Payé, En attente, Retard).
* **Maintenance :** Système de tickets pour les réparations (le locataire signale, l'agent suit).

---

## 4. Structure de la Base de Données (Backend)

Voici les entités principales à prévoir dans vos modèles Django :

| Entité | Champs principaux |
| --- | --- |
| **Property** | Titre, Description, Type (Appart/Maison), Prix, Statut (Libre/Loué) |
| **User/Profile** | Nom, Email, Rôle, Téléphone |
| **Lease (Bail)** | Date début, Date fin, Montant loyer, Caution |
| **Payment** | Date, Montant, Méthode, Statut |
| **Document** | Type (Quittance, Contrat), Fichier PDF |

---

## 5. Roadmap de Développement

### Phase 1 : Fondations (Backend)

1. Configuration de Django et de la base de données.
2. Création du modèle User personnalisé.
3. Mise en place des API pour les Biens (CRUD - Create, Read, Update, Delete).

### Phase 2 : Interface (Frontend)

1. Installation de Nuxt 3 et Tailwind CSS.
2. Création des pages d'authentification.
3. Développement du Dashboard et de la liste des biens (consommation de l'API).

### Phase 3 : Fonctionnalités Avancées

1. Système d'upload d'images.
2. Génération de PDF (Quittances).
3. Filtres de recherche avancés.

---

## 6. Prochaines étapes suggérées

Pour commencer concrètement, nous pourrions approfondir un point précis.

**Souhaitez-vous que je vous aide à concevoir le schéma détaillé des modèles Django (le code `models.py`) ou que je vous propose une structure de dossiers pour votre projet Nuxt ?**