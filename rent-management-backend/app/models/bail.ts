import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import LocationUnity from '#models/location_unity'
import Occupant from '#models/occupant'
import RentPayment from '#models/rent_payment'
import crypto from 'node:crypto'

export default class Bail extends BaseModel {
  static table = 'bails'

  // Clé primaire UUID (auto-générée avant création)
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  // Génère l'UUID avant l'insertion
  @beforeCreate()
  public static async createUUID(bail: Bail) {
    if (!bail.id) {
      bail.id = crypto.randomUUID()
    }
  }

  @column()
  declare locationUnityId: string

  @column()
  declare occupantId: string

  @column.date()
  declare startDate: DateTime

  @column()
  declare pricePerMonth: number

  @column()
  declare description: number

  @column()
  declare securityDeposit: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---
  @belongsTo(() => LocationUnity)
  declare locationUnity: BelongsTo<typeof LocationUnity>

  @belongsTo(() => Occupant)
  declare occupant: BelongsTo<typeof Occupant>

  @hasMany(() => RentPayment)
  declare rentPayments: HasMany<typeof RentPayment>
}
