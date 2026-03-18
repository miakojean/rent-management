import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { UserType } from '#models/user'

/**
 * Vérifie que l'utilisateur authentifié possède l'un des rôles autorisés.
 * À utiliser APRÈS le middleware auth.
 *
 * Usage dans les routes :
 *   .use(middleware.role(['admin']))
 *   .use(middleware.role(['admin', 'gestionnaire']))
 */
export default class RoleMiddleware {
  async handle(
    { auth, response }: HttpContext,
    next: NextFn,
    options: { roles: UserType[] }
  ) {
    const user = auth.user

    if (!user) {
      return response.unauthorized({
        status: 'error',
        message: 'Vous devez être connecté pour accéder à cette ressource.',
      })
    }

    if (!options.roles.includes(user.type)) {
      return response.forbidden({
        status: 'error',
        message: `Accès refusé. Rôles autorisés : ${options.roles.join(', ')}.`,
      })
    }

    return next()
  }
}
