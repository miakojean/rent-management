import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'


export default class SessionController {
    async store({ request, auth, response }: HttpContext) {

        try {
            const { email, password } = request.only(['email', 'password'])
            const user = await User.verifyCredentials(email, password)
            logger.info({email},"tentative de connexion")
            return await auth.use('api').createToken(user)

        } catch(err) {
            logger.info("Un probleme est intervenu", err)
        }
    }

    async destroy({ request, auth, response }: HttpContext) {
        await auth.use('api').invalidateToken()
    }
}
