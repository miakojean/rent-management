import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Logue chaque requête HTTP entrante avec : méthode, URL, status et durée.
 * Enregistré dans le stack serveur global (toutes les requêtes).
 *
 * Exemple de log :
 *   POST /rent-manager/auth/login → 200 (45ms)
 *   GET  /rent-management/properties → 401 (3ms)
 */
export default class RequestLoggerMiddleware {
  async handle({ request, response, logger }: HttpContext, next: NextFn) {
    const start = Date.now()
    const method = request.method()
    const url = request.url(true)

    await next()

    const status = response.getStatus()
    const duration = Date.now() - start
    const statusEmoji = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢'

    logger.info(`${statusEmoji} ${method.padEnd(6)} ${url} → ${status} (${duration}ms)`)
  }
}
