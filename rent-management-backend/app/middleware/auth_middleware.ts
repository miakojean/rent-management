import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    // 1. Récupérer le token depuis le cookie (nommé 'auth_token' dans ton login)
    const tokenFromCookie = ctx.request.cookie('auth_token')
    
    // 2. Si on a un cookie et pas de header, on remplit le header pour Adonis
    if (tokenFromCookie && !ctx.request.header('authorization')) {
      ctx.request.headers().authorization = `Bearer ${tokenFromCookie}`
    }

    try {
      // 3. Authentification automatique via Adonis
      await ctx.auth.authenticateUsing(options.guards)
      
      return next()
    } catch (error) {
      // 4. Gestion propre de l'échec (évite les boucles infinies)
      if (ctx.request.accepts(['json', 'html']) === 'html') {
        return ctx.response.redirect(this.redirectTo)
      }

      return ctx.response.unauthorized({
        message: 'Session expirée ou invalide',
        code: 'E_UNAUTHORIZED'
      })
    }
  }
}