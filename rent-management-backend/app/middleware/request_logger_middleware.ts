import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequestLoggerMiddleware {
  async handle({ request, response, logger }: HttpContext, next: NextFn) {
    const start = Date.now()
    const method = request.method()
    const url = request.url(true)

    let error: any = null

    try {
      await next()
    } catch (err) {
      error = err
      throw err // on relance pour que le gestionnaire d'exceptions fasse son travail
    } finally {
      const status = response.getStatus()
      const duration = Date.now() - start
      const statusEmoji = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢'

      // Construction du message de base
      let logMessage = `${statusEmoji} ${method.padEnd(6)} ${url} → ${status} (${duration}ms)`

      // Si une exception a été levée, on ajoute ses infos
      if (error) {
        logMessage += ` | Error: ${error.message}`
      }

      // Si la réponse contient un JSON d'erreur (souvent pour les 4xx/5xx)
      if (status >= 400 && response.lazyBody && response.lazyBody.content) {
        const body = response.lazyBody.content
        // Si le corps est un objet et contient un champ "message" ou "error"
        if (typeof body === 'object' && (body.message || body.error)) {
          const errorMsg = body.message || body.error
          logMessage += ` | Response error: ${errorMsg}`
        }
      }

      // Choix du niveau de log selon le statut
      if (status >= 500) {
        logger.error(logMessage)
      } else if (status >= 400) {
        logger.warn(logMessage)
      } else {
        logger.info(logMessage)
      }
    }
  }
}