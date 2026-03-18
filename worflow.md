How to make our request workflow. 

For the request we define CRUD (create, read, update, delete)

let's for the first one:

### post request.

- 1 We have to ensure that data is valid according our validator module
- 2 If data is valid we store the object in the database and we send a succes status
- 3 if data is not valid we send an error message and bad status request.

### Le samedi 01 mars 2026

Features à implémenter:

Backend:
-   Création de compte (Jean Yves) (Done)
-   Authentification de compte avec jwt (access_token, refresh_tokens, cookies) (Jean Yves ) (En attente du crud des entités pour le test des fonctionnalités avec authentification) (Done)
Complètement géré avec le jeudi 12 mars 2026;
-   Figma (Jean Yves, Yvan)
-   Gestion des controlleurs (Rokib) (Done)

### Le samedi 07 mars 2026

Format de reponse 

https://docs.adonisjs.com/guides/basics/response 
```json
{
    "status":null,
    "message":"",
    "data": {},
    "items": [] 
}

```

On va partir sur uuid pour les id

### le samedi 14 mars 2026

Pour les items, on va faire faire une sorte de tableau puis les options seront mis en dernière position.

- Tester le crud et mise à jour des controlleurs; (A revoir)
- Implementation de middleware; (A revoir)
- Tester les requêtes avec authentification; (A revoir)
- Migrations sur postgresql (Done)

### Le mercredi 19 mars 2026

Retravailler sur les points à revoir.
- Bosser sur le refresh token de façon rigoureuse
- Gérer les points à revoir.

### Notre backend ne vérifie pas le token renseigné.

Comment gérer ce problème?
- Commencer par vérifier l'origine du token à travers un signature par exemple.

## V2 de notre app

- On va créer un exécutable pour l'application
- Développer une legal feature pour les procédures judiciaires.