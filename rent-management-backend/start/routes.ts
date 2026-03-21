/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import User from '#models/user'
import { middleware } from './kernel.js'

const DocsController = () => import('#controllers/docs_controller')
const AuthController = ()=>import('#controllers/auth_controller')
const PropertyController = ()=>import('#controllers/properties_controller')
const OccupantsController = ()=>import('#controllers/occupants_controller')
const LocationUnitiesController = ()=>import('#controllers/location_unities_controller')
const BailsController = ()=>import('#controllers/bails_controller')
const RentPaymentsController = ()=>import('#controllers/rent_payments_controller')


// Documentation OpenAPI / Swagger (spec générée par swagger-jsdoc, UI servie ici)
router.get('/api-docs/spec', [DocsController, 'spec'])
router.get('/api-docs', [DocsController, 'ui'])

/* 
  Authentication routes group
*/

router.group(() => {
  
  // Route d'inscription : POST /api/auth/register
  router.post('register', [AuthController, 'register'])

  // Route de connexion : POST /api/auth/login
  router.post('login', [AuthController, 'login'])

  // Pour l'authentificatio de token
  router.post('/users/:id/tokens', async ({params}) => {
    const user = await User.findOrFail(params.id)
    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  })

  // Route pour la déconnexion
  router.post('logout', [AuthController, 'logout'])

  // Route pour récupérer le profil de l'utilisateur connecté
  router.get('profile', [AuthController, 'getProfile']).use(middleware.auth({ guards: ['api'] }))

}).prefix('rent-manager/auth') // Préfixe pour organiser vos URL

// About the rent management
router.group(()=>{

  // The dashboard index
  router.get('/dashboard',()=>{ 
    return {
      dashboard: 'Bienvenue au pays mon mon fils'
    }
  })

  // Properties CRUD (protégé : uniquement les propriétés de l'utilisateur connecté)
  router.get('properties', [PropertyController, 'index'])
  router.get('properties/:id', [PropertyController, 'show'])
  router.post('properties', [PropertyController, 'store'])
  router.put('properties/:id', [PropertyController, 'update'])
  router.delete('properties/:id', [PropertyController, 'destroy'])

  // Occupants CRUD
  router.get('occupants', [OccupantsController, 'index'])
  router.get('occupants/:id', [OccupantsController, 'show'])
  router.post('occupants', [OccupantsController, 'store'])
  router.put('occupants/:id', [OccupantsController, 'update'])
  router.delete('occupants/:id', [OccupantsController, 'destroy'])

  // Location unities CRUD
  router.get('location-unities', [LocationUnitiesController, 'index'])
  router.get('location-unities/:id', [LocationUnitiesController, 'show'])
  router.post('location-unities', [LocationUnitiesController, 'store'])
  router.put('location-unities/:id', [LocationUnitiesController, 'update'])
  router.delete('location-unities/:id', [LocationUnitiesController, 'destroy'])

  // Bails CRUD
  router.get('bails', [BailsController, 'index'])
  router.get('bails/:id', [BailsController, 'show'])
  router.post('bails', [BailsController, 'store'])
  router.put('bails/:id', [BailsController, 'update'])
  router.delete('bails/:id', [BailsController, 'destroy'])

  // Rent payments CRUD
  router.get('rent-payments', [RentPaymentsController, 'index'])
  router.get('rent-payments/:id', [RentPaymentsController, 'show'])
  router.post('rent-payments', [RentPaymentsController, 'store'])
  router.put('rent-payments/:id', [RentPaymentsController, 'update'])
  router.delete('rent-payments/:id', [RentPaymentsController, 'destroy'])
}).prefix('rent-management').use([
  middleware.auth({ guards: ['api'] }),
  middleware.activeUser(),
])