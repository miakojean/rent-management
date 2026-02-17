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


const AuthController = ()=>import('#controllers/auth_controller')
const SessionController = ()=>import('#controllers/session_controller')


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

router.group(() => {
  
  // Route d'inscription : POST /api/auth/register
  router.post('register', [AuthController, 'register'])

  // create a router for generating a token
  router.post('/:id/tokens', async({params})=>{
    const user = await User.findOrFail(params.id)
    const token = await User.accessTokens.create(user, ['server:create', 'server:read'])

    return{
      type:'bearer',
      value: token.value!.release(),
    }
  })

  router.post('login', [SessionController, 'store'])

}).prefix('rent-manager/auth') // Préfixe pour organiser vos URL