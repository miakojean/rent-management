import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth'
import HttpExceptionHandler from '#exceptions/handler'

export default class AuthController {
  
    async register({ request, response }: HttpContext) {
        // 1. Validation des données
        // Si la validation échoue, Adonis renvoie automatiquement une erreur 422
        const payload = await request.validateUsing(registerValidator)

        // 2. Création de l'utilisateur
        // Grâce au modèle, le mot de passe sera hashé automatiquement (voir votre User.ts)
        const user = await User.create(payload)

        // 3. Réponse (201 Created)
        // On peut aussi générer un token ici si vous voulez connecter l'utilisateur directement
        return response.created({
            message: 'Compte créé avec succès',
            user: user
        })
    }


}