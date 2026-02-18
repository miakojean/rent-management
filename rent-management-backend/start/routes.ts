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


const AuthController = ()=>import('#controllers/auth_controller')
const SessionController = ()=>import('#controllers/session_controller')
const PropertyController = ()=>import('#controllers/properties_controller')


router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('users', async ()=>{
  try{
    const users = await User.all()
    return {
      users: users
    }
  } catch (error) {
    return{
      error:'Une erreur a été rencontrée lors de la réccupération',
    }
  }
})

// routes.ts
router.get('users/:id', async ({ params }) => {
  try {
    const user = await User.find(params.id)
    
    if (!user) {
      return {
        error: 'Utilisateur non trouvé'
      }
    }
    
    // Sérialisation manuelle pour contrôler l'affichage
    return {
      message: 'Utilisateur récupéré avec succès',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
        // password est intentionnellement omis
      }
    }
  } catch (error) {
    return {
      error: 'Une erreur a été rencontrée lors de la récup',
    }
  }
})

// Authentication routes

router.group(() => {
  
  // Route d'inscription : POST /api/auth/register
  router.post('register', [AuthController, 'register'])

  router.post('login', [SessionController, 'store'])

}).prefix('rent-manager/auth') // Préfixe pour organiser vos URL

// About the rent management
router.group(()=>{

  // The dashboard index
  router.get('/dashboard',()=>{
    return {
      dashboard: 'Bienvenue au pays mon mon fils'
    }
  })

  // Create a new property
  router.post('properties', [PropertyController, 'store'])

}).prefix('rent-management').use(middleware.auth(
  {guards: ['api']}
))