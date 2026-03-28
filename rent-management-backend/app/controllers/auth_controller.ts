import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator, messagesProvider, loginMessage } from '#validators/auth'

export default class AuthController {
  
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register({ request, response }: HttpContext) {
    // 1. Validation (Si ça échoue, Adonis s'occupe de la réponse 422)
    const payload = await request.validateUsing(
      registerValidator,
      {messagesProvider}
    )

    // 2. Création (On laisse l'Exception Handler global gérer les erreurs 500)
    const user = await User.create(payload)

    return response.created({
      message: 'success',
      user: user.serialize()
    })
  }

  /**
   * Connexion et génération du token
   */
  async login({ request, response }: HttpContext) { // On récupère response ici
    
    const { email, password } = await request.validateUsing(loginValidator)

    // Vérification des identifiants
    const user = await User.verifyCredentials(email, password)

    // Création du token
    const token = await User.accessTokens.create(user)  
    
    // Utilise directement 'response' (sans le préfixe ctx.)
    response.cookie('auth_token', token.value!.release(), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // ← sans le * 1000 ✅
    })

    return { 
      message: 'Connexion réussie',
      'user': user
    }
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response }: HttpContext) {
    try {
      // On essaie de supprimer le token en BDD si possible
      if (await auth.check()) {
        const user = auth.user!
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      }
    } catch {
      // Si auth.check() échoue, on ignore l'erreur
    }

    // ON FORCE LA SUPPRESSION DU COOKIE
    response.clearCookie('auth_token') 

    return response.ok({ message: 'Déconnecté avec succès' })
  }

  async getProfile({ auth, response }: HttpContext) {
    // auth.user est garanti d'exister grâce au middleware !
    return response.ok({ user: auth.user!.serialize() })
  }
}