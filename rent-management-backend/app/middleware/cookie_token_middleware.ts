import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CookieTokenMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const token = request.cookie('auth_token')

    if (token) {
      // On injecte le token dans le header Authorization
      request.request.headers['authorization'] = `Bearer ${token}`
    }

    await next()
  }
}