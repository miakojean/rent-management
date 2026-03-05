import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
// Ajout de l'import pour sessionUserProvider
import { sessionUserProvider } from '@adonisjs/auth/session'
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { jwtGuard } from '@maximemrf/adonisjs-jwt/jwt_config'
import { JwtGuardUser, BaseJwtContent } from '@maximemrf/adonisjs-jwt/types'
import User from '#models/user'
import env from '#start/env'

interface JwtContent extends BaseJwtContent {
  // Correction : "string" en minuscule
  email: string
}

const authConfig = defineConfig({
  default: 'jwt',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('#models/user')
      }),
    }),
    // add the jwt guard
    jwt: jwtGuard({
      tokenName:'user-token',
      // tokenExpiresIn can be a string or a number
      tokenExpiresIn: '1d',
      // Use cookies for the authentication
      useCookies:true,
      // secret is the secret used to sign the token, it can be optional, by default it uses the application key
      // you can use a env variable like JWT_SECRET or set it directly with a string
      // if you don't have specific needs, please discard this option
      secret: env.get('JWT_SECRET'),
      
      // sessionUserProvider est maintenant correctement importé
      provider: sessionUserProvider({
        model: () => import('#models/user'),
      }),
      
      // if you want to use refresh tokens, you have to set the refreshTokenUserProvider
      refreshTokenUserProvider: tokensUserProvider({
        tokens: 'refreshTokens',
        model: () => import('#models/user'),
      }),
      // optionally set the expiry for the refresh token
      refreshTokenExpiresIn: '7d',
      // ability to separate cookie usage for refresh token
      useCookiesForRefreshToken: true,
      // ability to configure the cookies options
      cookie: {
        httpOnly: true,
        secure: true,
      },
      // limit the abilities of the refresh token
      refreshTokenAbilities: ['refresh_token'],
      // content is a function that takes the user and returns the content of the token, it can be optional, by default it returns only the user id
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

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}