/*
 * Documentation OpenAPI (Swagger) alignée sur les contrôleurs et validateurs.
 * Les schémas de requête correspondent aux validateurs Vine ; les réponses aux contrôleurs.
 */

/**
 * @openapi
 * /:
 *   get:
 *     summary: Hello world
 *     description: Route de test
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hello:
 *                   type: string
 *                   example: world
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Liste des utilisateurs
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items: { type: object }
 */

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Détail d'un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: { type: object }
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-manager/auth/register:
 *   post:
 *     summary: Inscription
 *     description: Crée un compte. Retourne l'utilisateur sérialisé (sans mot de passe).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Dupont
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 pattern: "^[a-zA-Z0-9]+$"
 *                 example: jdupont
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *               passwordConfirmation:
 *                 type: string
 *                 format: password
 *                 description: Doit être identique à password
 *               type:
 *                 type: string
 *                 enum: [admin, proprietaire, gestionnaire]
 *                 description: Optionnel, défaut selon logique métier
 *               phoneNumber:
 *                 type: string
 *                 pattern: "^\\+?\\d[\\d\\s()-]{8,18}$"
 *                 example: "+225 07 00 00 00 00"
 *               address:
 *                 type: string
 *                 maxLength: 255
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Compte créé avec succès }
 *                 user: { type: object }
 *       422:
 *         description: Données invalides (validation Vine)
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-manager/auth/login:
 *   post:
 *     summary: Connexion
 *     description: Retourne message, user (sérialisé). Le JWT est géré par le guard (cookie/header selon config).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jean@example.com
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Connexion réussie }
 *                 user: { type: object }
 *       401:
 *         description: Identifiants incorrects
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       422:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-manager/auth/refresh-token:
 *   post:
 *     summary: Rafraîchir le token
 *     description: Génère un nouveau token (et refresh token). Nécessite un token valide ou refresh token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nouveau token retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Objet token retourné par le guard JWT
 *       401:
 *         description: Non authentifié ou refresh invalide
 */

/**
 * @openapi
 * /rent-manager/auth/logout:
 *   post:
 *     summary: Déconnexion
 *     description: Révoque le token JWT courant.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnecté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Logged out successfully }
 *       401:
 *         description: Non authentifié
 */

/**
 * @openapi
 * /rent-management/dashboard:
 *   get:
 *     summary: Tableau de bord
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboard: { type: string }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/properties:
 *   get:
 *     summary: Liste des biens (de l'utilisateur connecté)
 *     description: Pagination via query params. Retourne status, data (liste paginée avec owner et locationUnities pour show).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Liste des propriétés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { type: object, description: Objet paginé (data, meta) }
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   post:
 *     summary: Créer un bien
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, address, city, country]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Appartement centre-ville
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [villa, cour commune, immeuble, autre]
 *               address:
 *                 type: string
 *                 example: 12 rue de la Paix
 *               city:
 *                 type: string
 *                 example: Abidjan
 *               country:
 *                 type: string
 *                 example: Côte d'Ivoire
 *     responses:
 *       201:
 *         description: Propriété créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string, example: Propriété créée avec succès }
 *                 data:
 *                   type: object
 *                   properties:
 *                     property: { type: object }
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/properties/{id}:
 *   get:
 *     summary: Détail d'un bien
 *     description: Uniquement si le bien appartient à l'utilisateur connecté. Inclut owner et locationUnities.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { type: object }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         description: Propriété non trouvée
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   put:
 *     summary: Modifier un bien
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, minLength: 3 }
 *               description: { type: string }
 *               type: { type: string, enum: [villa, cour commune, immeuble, autre] }
 *               address: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       200:
 *         description: Propriété mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     property: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   delete:
 *     summary: Supprimer un bien
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Propriété supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *       401:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/occupants:
 *   get:
 *     summary: Liste des occupants
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste paginée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { type: object }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   post:
 *     summary: Créer un occupant
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName: { type: string, minLength: 2, example: Marie }
 *               lastName: { type: string, minLength: 2, example: Martin }
 *               email: { type: string, format: email }
 *               phoneNumber: { type: string }
 *               nationality: { type: string }
 *               imgDocument: { type: string }
 *     responses:
 *       201:
 *         description: Occupant créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     occupant: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/occupants/{id}:
 *   get:
 *     summary: Détail d'un occupant (avec locationUnities et bails)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   put:
 *     summary: Modifier un occupant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string, minLength: 2 }
 *               lastName: { type: string, minLength: 2 }
 *               email: { type: string, format: email }
 *               phoneNumber: { type: string }
 *               nationality: { type: string }
 *               imgDocument: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     occupant: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   delete:
 *     summary: Supprimer un occupant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/location-unities:
 *   get:
 *     summary: Liste des unités de location (avec property et occupant)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   post:
 *     summary: Créer une unité de location
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [propertyId, doorNumber, pricePerMonth]
 *             properties:
 *               propertyId: { type: string, format: uuid }
 *               occupantId: { type: string, format: uuid, description: Optionnel }
 *               doorNumber: { type: string, example: A1 }
 *               pricePerMonth: { type: number, minimum: 0.01 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     locationUnity: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/location-unities/{id}:
 *   get:
 *     summary: Détail d'une unité (property, occupant, bails)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   put:
 *     summary: Modifier une unité de location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId: { type: string, format: uuid }
 *               occupantId: { type: string, format: uuid, nullable: true }
 *               doorNumber: { type: string }
 *               pricePerMonth: { type: number, minimum: 0.01 }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     locationUnity: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   delete:
 *     summary: Supprimer une unité de location
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/bails:
 *   get:
 *     summary: Liste des baux (locationUnity, occupant)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   post:
 *     summary: Créer un bail
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [locationUnityId, occupantId, startDate, pricePerMonth, description, securityDeposit]
 *             properties:
 *               locationUnityId: { type: string, format: uuid }
 *               occupantId: { type: string, format: uuid }
 *               startDate: { type: string, format: date, example: "2025-01-01" }
 *               pricePerMonth: { type: number, minimum: 0.01 }
 *               description: { type: number }
 *               securityDeposit: { type: number, minimum: 0 }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     bail: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/bails/{id}:
 *   get:
 *     summary: Détail d'un bail (locationUnity, occupant, rentPayments)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   put:
 *     summary: Modifier un bail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationUnityId: { type: string, format: uuid }
 *               occupantId: { type: string, format: uuid }
 *               startDate: { type: string, format: date }
 *               pricePerMonth: { type: number, minimum: 0.01 }
 *               description: { type: number }
 *               securityDeposit: { type: number, minimum: 0 }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     bail: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   delete:
 *     summary: Supprimer un bail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/rent-payments:
 *   get:
 *     summary: Liste des paiements de loyer (avec bail)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   post:
 *     summary: Enregistrer un paiement de loyer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bailId, paymentDate, amountReceived]
 *             properties:
 *               bailId: { type: string, format: uuid }
 *               paymentDate: { type: string, format: date, example: "2025-03-15" }
 *               amountReceived: { type: number, minimum: 0.01 }
 *               description: { type: string }
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     rentPayment: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       500:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */

/**
 * @openapi
 * /rent-management/rent-payments/{id}:
 *   get:
 *     summary: Détail d'un paiement (avec bail)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 data: { type: object }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   put:
 *     summary: Modifier un paiement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bailId: { type: string, format: uuid }
 *               paymentDate: { type: string, format: date }
 *               amountReceived: { type: number, minimum: 0.01 }
 *               description: { type: string }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     rentPayment: { type: object }
 *       400:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 *   delete:
 *     summary: Supprimer un paiement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string }
 *                 message: { type: string }
 *       404:
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ApiError' }
 */
