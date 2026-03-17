import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { JwtGuardUser, BaseJwtContent } from '@maximemrf/adonisjs-jwt/types'
import User from '#models/user'
import env from '#start/env'

interface JwtContent extends BaseJwtContent {
  email: string
}

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    jwt: jwtGuard({
      tokenExpiresIn: '1d',
      useCookies: true,
      secret: env.get('JWT_SECRET'),
      
      // ✅ Provider principal avec tokensUserProvider
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('#models/user'),
      }),
      
      refreshTokenUserProvider: tokensUserProvider({
        tokens: 'refreshTokens',
        model: () => import('#models/user'),
      }),
      
      refreshTokenExpiresIn: '7d',
      useCookiesForRefreshToken: true,
      
      cookie: {
        httpOnly: true,
        secure: false,
      },
      
      refreshTokenAbilities: ['refresh_token'],
      
      content: <T>(user: JwtGuardUser<T>): JwtContent => {
        return {
          userId: user.getId(),
          email: (user.getOriginal() as User).email,
        }
      }
    })
  },
})

export default authConfig