import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator, messagesProvider } from '#validators/auth'

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
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // Vérification des identifiants
    const user = await User.verifyCredentials(email, password)

    // Génération du token JWT
    const token = await auth.use('jwt').generate(user)
    console.log('[AuthController.login] Token généré:', {
      type: token.type,
      token: token.token,
      expiresIn: token.expiresIn,
      refreshToken: token.refreshToken ? `${token.refreshToken.slice(0, 20)}...` : undefined,
    })

    return response.ok({
      message: 'Connexion réussie',
      user: user.serialize()
    })
  }

  /**
   * Rafraîchissement du token
   */
  async refreshToken({ auth, response }: HttpContext) {
    // La méthode generateWithRefreshToken gère souvent la vérification du refresh token actuel
    const token = await auth.use('jwt').generateWithRefreshToken()
    return response.ok(token)
  }

  /**
   * Déconnexion
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('jwt').revoke()
    return response.ok({ message: 'Logged out successfully' })
  }

  async getProfile({auth, response}: HttpContext) {
    const user = auth.user
    if (!user) {
      return response.unauthorized({ message: 'Unauthorized' })
    }
    return response.ok({ user: user.serialize() })
  }
}