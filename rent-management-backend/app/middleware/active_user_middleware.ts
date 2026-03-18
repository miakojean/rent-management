import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Bloque l'accès si le compte de l'utilisateur authentifié est désactivé (isActive = false).
 * À utiliser APRÈS le middleware auth.
 *
 * Usage dans les routes :
 *   .use(middleware.activeUser())
 */
export default class ActiveUserMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        status: 'error',
        message: 'Vous devez être connecté.',
      })
    }

    if (!user.isActive) {
      return response.forbidden({
        status: 'error',
        message: 'Votre compte est désactivé. Contactez l\'administrateur.',
      })
    }

    return next()
  }
}
