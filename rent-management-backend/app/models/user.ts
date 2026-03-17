import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, computed } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'node:crypto'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

// ==================== TYPES D'UTILISATEURS ====================
export const UserTypes = {
  ADMIN: 'admin',
  PROPRIETAIRE: 'proprietaire',
  GESTIONNAIRE: 'gestionnaire', // si tu as des agences/gestionnaires
} as const

export type UserType = typeof UserTypes[keyof typeof UserTypes]

// ============================================================

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @column()
  declare lastName: string

  /** Nom complet calculé (très pratique dans les vues) */
  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  @column()
  declare email: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  /** Type d'utilisateur → essentiel pour la gestion locative */
  @column()
  declare type: UserType

  /** Téléphone (très important en Côte d'Ivoire) */
  @column()
  declare phoneNumber: string | null

  @column()
  declare address: string | null

  @column()
  declare isActive: boolean

  /** Photo de profil (optionnel mais sympa) */
  // @column()
  // declare avatarUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Tokens d'accès (configuration officielle AdonisJS)
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '1 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  static refreshTokens = DbAccessTokensProvider.forModel(User, {
    prefix: 'rt_',
    table: 'jwt_refresh_tokens',
    type: 'jwt_refresh_token',
    tokenSecretLength: 40,
  })
}