import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
    username: vine.string().trim().minLength(3),
    
    // Vérifie que l'email est valide ET qu'il n'existe pas déjà dans la table 'users'
    email: vine.string().email().unique(async (db, value) => {
      const user = await db.from('users').where('email', value).first()
      return !user
    }),

    // Le mot de passe doit faire 8 caractères min et être confirmé
    password: vine.string().minLength(8).confirmed()
  })
)