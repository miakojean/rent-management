import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import type { JwtGuard } from '@maximemrf/adonisjs-jwt/types'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    try {
      const tokenFromCookie = ctx.request.cookie('token')
      const authHeader = ctx.request.header('authorization')
      const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined
      console.log('[AuthMiddleware] Token lu:', {
        fromCookie: tokenFromCookie ? `${tokenFromCookie.slice(0, 30)}...` : null,
        fromHeader: tokenFromHeader ? `${tokenFromHeader.slice(0, 30)}...` : null,
      })

      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })

      const token = ctx.request.header('authorization')?.split(' ')[1]

      if (token) {
        const guard = ctx.auth.use('jwt') as unknown as JwtGuard<any>
        const decoded = await guard.verify(token)

        if (decoded.iss !== 'rent-management-backend') {
          return ctx.response.unauthorized({
            message: 'Token invalide : origine non reconnue',
          })
        }
      }

      return next()
    } catch (error) {
      const isJwtError =
        error?.code === 'E_INVALID_JWT_TOKEN' ||
        error?.code === 'E_JWT_TOKEN_EXPIRED' ||
        error?.message?.includes('jwt')

      if (isJwtError) {
        return ctx.response.unauthorized({
          message: 'Token invalide ou expiré',
        })
      }

      if (ctx.request.accepts(['html', 'json']) === 'html') {
        return ctx.response.redirect(this.redirectTo)
      }

      return ctx.response.unauthorized({
        message: 'Non authentifié',
      })
    }
  }
}