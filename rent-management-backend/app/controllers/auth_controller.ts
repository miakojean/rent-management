import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import logger from '@adonisjs/core/services/logger'

export default class AuthController {
  
    async register({ request, response }: HttpContext) {
        try {
            // 1. Validation (Si ça échoue, ça part direct au catch ou à l'exception handler)
            const payload = await request.validateUsing(registerValidator)

            // 2. Création (On le met DANS le try pour catcher les erreurs DB)
            const user = await User.create(payload)

            // 3. Réponse de succès
            return response.created({
                message: 'Compte créé avec succès',
                user: user
            })

        } catch (error) {
            // On log l'erreur pour le debug en console
            logger.error({ err: error }, 'Erreur lors de la création du compte')

            // Important : On répond au client, sinon la requête reste "pendue"
            return response.internalServerError({
                message: 'Une erreur est survenue lors de l\'inscription',
                // En dev, tu peux ajouter error.message pour aider, mais pas en prod !
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    }
}