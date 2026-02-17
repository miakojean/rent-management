import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'


export default class SessionController {
    async store({ request, auth, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        const user = await User.verifyCredentials(email, password)

        return await auth.use('api').createToken(user)
    }

    async destroy({ request, auth, response }: HttpContext) {
        await auth.use('api').invalidateToken()
    }
}
