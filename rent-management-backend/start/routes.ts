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
      message: error.message
    }
  }
})

router.get('users/:id', async ({params})=>{
  try{
    const user = await User.find(params.id)
    return {
      'message': 'Utilisateur récupéré avec success',
      'user':user
    }
  } catch (error) {
    return  {
      error: 'Une erreur a été rencontrée lors de la recup',
      message: error.message
    }
  }
})

